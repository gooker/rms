import React, { memo, useEffect, useState } from 'react';
import { Button, Card, Empty, message, Modal, Row, Spin } from 'antd';
import { PlusOutlined, RollbackOutlined } from '@ant-design/icons';
import { find } from 'lodash';
import FormattedMessage from '@/components/FormattedMessage';
import ReportCreationModal from './ReportCreationModal';
import Reports from './Reports';
import {
  countDay,
  dealResponse,
  formatMessage,
  isNull,
  transformReportDetail,
} from '@/utils/utils';
import {
  fetchDimensionDictionary,
  fetchReportDetailByUrl,
  fetchReportGroupDataById,
  fetchReportSourceURL,
  saveReportGroup,
} from '@/services/api';
import RcsConfirm from '@/components/RcsConfirm';
import commonStyle from '@/common.module.less';

const ReportGroupDetail = (props) => {
  const { agvType, gotoList, data } = props;

  const [loading, setLoading] = useState(false);
  const [creationLoading, setCreationLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  /**
   * 数据源
   * [{id: 1, name: 'AGV错误数据', url: '/latent-lifting/reportForm/getAgvErrorFormData'}]
   */
  const [sourceURL, setSourceURL] = useState([]);

  /**
   * 各个数据源的维度
   * {'/latent-lifting/reportForm/getAgvErrorFormData': [{…}, {…}, {…}, {…}]}
   */
  const [dimensionDictionary, setDimensionDictionary] = useState({});

  const [groupDetails, setGroupDetails] = useState([]); // 报表组报表原始数据
  const [groupReports, setGroupReports] = useState([]); // 报表组报表详细详情

  useEffect(() => {
    init();
  }, []);

  async function init() {
    setLoading(true);
    const promises = [
      fetchDimensionDictionary(agvType),
      fetchReportGroupDataById(agvType, { id: data.id }),
      fetchReportSourceURL(agvType),
    ];

    try {
      const [res1, res2, res3] = await Promise.all(promises);
      if (!dealResponse(res1) && !dealResponse(res2) && !dealResponse(res3)) {
        setDimensionDictionary(res1);
        setSourceURL(res3);

        const _groupDetail = res2.details || [];
        setGroupDetails(_groupDetail);

        if (_groupDetail.length > 0) {
          // 获取报表组中所有报表数据
          const promises = [];
          const _groupReports = [];
          _groupDetail.forEach((reportDetail) => {
            promises.push(fetchReportDetailByUrl(countDay(reportDetail)));
          });

          const groupReportResponse = await Promise.all(promises);
          _groupDetail.forEach((reportDetail, index) => {
            const response = groupReportResponse[index];
            if (!dealResponse(response)) {
              let extra = {};
              const dimension = res1[reportDetail.url];
              if (dimension !== undefined) {
                for (let index = 0; index < dimension.length; index++) {
                  const obj = dimension[index];
                  extra[obj.value] = obj.name;
                }
              }
              _groupReports.push({
                data: response,
                description: transformReportDetail(reportDetail),
                extra: extra,
                uniqueKey: index,
              });
            } else {
              console.log(`第${index + 1}个报表数据获取失败`);
            }
          });
          setGroupReports(_groupReports);
        }
      } else {
        throw new Error();
      }
    } catch (e) {
      message.error(formatMessage({ id: 'app.message.initFail' }));
    }
    setLoading(false);
  }

  function onRemove(record) {
    RcsConfirm({
      content: formatMessage({ id: 'app.message.delete.confirm' }),
      onOk: async () => {
        // 调用接口删除远程数据
        const formTemplate = {
          id: data.id,
          name: data.name,
          details: groupDetails
            .filter((item, index) => {
              if (index === record.uniqueKey) {
                return item;
              } else {
                return null;
              }
            })
            .filter(Boolean),
        };
        const response = await saveReportGroup(agvType, formTemplate);
        if (
          !dealResponse(
            response,
            true,
            formatMessage({ id: 'app.message.operateSuccess' }),
            formatMessage({ id: 'app.message.operateFailed' }),
          )
        ) {
          // 删除 state 数据源
          const _groupReports = groupReports.filter((item) => item.uniqueKey !== record.uniqueKey);
          setGroupReports(_groupReports);
        }
      },
    });
  }

  async function filterDateOnChange({ origin, value }) {
    setLoading(true);
    // 先更新报表原始数据
    const _groupDetails = groupDetails.map((item, index) => {
      if (index === origin.uniqueKey) {
        if (value.type === 'filter') {
          return { ...item, filters: value.data };
        } else {
          return { ...item, startDate: value[0].format(), endDate: value[1].format() };
        }
      } else {
        return item;
      }
    });
    setGroupDetails(_groupDetails);

    // 获取最新报表数据
    const groupDetailItem = _groupDetails[origin.uniqueKey];
    const response = await fetchReportDetailByUrl(countDay(groupDetailItem));
    if (!dealResponse(response)) {
      let extra = {};
      const dimension = dimensionDictionary[groupDetailItem.url];
      if (dimension !== undefined) {
        for (let index = 0; index < dimension.length; index++) {
          const obj = dimension[index];
          extra[obj.value] = obj.name;
        }
      }

      // 更新指定图表数据
      const specificReportData = {
        data: response,
        description: transformReportDetail(groupDetailItem),
        extra: extra,
        uniqueKey: origin.uniqueKey,
      };
      const _groupReports = [...groupReports];
      _groupReports.splice(origin.uniqueKey, 1, specificReportData);
      setGroupReports(_groupReports);
    } else {
      message.error(
        `${formatMessage(
          { id: 'app.message.fetchFailTemplate' },
          { type: formatMessage({ id: 'app.reportCenter.report' }) },
        )}`,
      );
    }
    setLoading(false);
  }

  async function createReport(formValues) {
    setCreationLoading(true);
    let _formValues = { ...formValues };
    _formValues.url = find(sourceURL, { id: _formValues.data }).url;
    _formValues.sectionId = window.localStorage.getItem('sectionId');
    _formValues = countDay(_formValues);
    delete _formValues.date;

    const reportDetail = await fetchReportDetailByUrl(_formValues);
    if (
      !dealResponse(
        reportDetail,
        false,
        null,
        formatMessage(
          { id: 'app.message.fetchFailTemplate' },
          { type: formatMessage({ id: 'app.reportCenter.report' }) },
        ),
      )
    ) {
      if (reportDetail.length > 0) {
        // 实时更新当前视图
        const extra = {};
        const dir = dimensionDictionary[_formValues.url];
        if (!isNull(dir)) {
          for (let index = 0; index < dir.length; index++) {
            const obj = dir[index];
            extra[obj.value] = obj.name;
          }
        }
        const groupReportsItem = {
          data: reportDetail,
          description: transformReportDetail(_formValues),
          uniqueKey: reportDetail.length,
          extra: extra,
        };
        setGroupReports([...groupReports, groupReportsItem]);

        // 调用接口保存更新
        const requestParam = {
          id: data.id,
          name: data.name,
          details: [_formValues, ...groupDetails] || [],
        };
        const response = await saveReportGroup(agvType, requestParam);
        if (!dealResponse(response, true)) {
          setModalVisible(false);
        }
      } else {
        message.warn(formatMessage({ id: 'app.message.fetchDataEmpty' }));
      }
    }
    setCreationLoading(false);
  }

  return (
    <>
      <Card
        style={{ height: '100%' }}
        title={data.name}
        extra={
          <div className={commonStyle.tableToolLeft}>
            <Button
              type={'primary'}
              onClick={() => {
                setModalVisible(true);
              }}
            >
              <PlusOutlined /> <FormattedMessage id={'app.reportCenter.addReport'} />
            </Button>
            <Button onClick={gotoList}>
              <RollbackOutlined /> <FormattedMessage id={'app.button.return'} />
            </Button>
          </div>
        }
      >
        <Spin spinning={loading}>
          {groupReports.length > 0 ? (
            <Row gutter={20}>
              <Reports
                agvType={agvType}
                deletable={true}
                groupReports={groupReports}
                remove={onRemove}
                filterDateOnChange={filterDateOnChange}
              />
            </Row>
          ) : (
            <Empty style={{ padding: '100px 0' }} />
          )}
        </Spin>
      </Card>

      {/*  创建报表*/}
      <Modal
        destroyOnClose
        width={600}
        visible={modalVisible}
        footer={null}
        maskClosable={false}
        title={formatMessage({ id: 'app.reportCenter.addReport' })}
        onCancel={() => {
          setModalVisible(false);
        }}
      >
        <ReportCreationModal
          creationLoading={creationLoading}
          agvType={agvType}
          source={sourceURL}
          createReport={createReport}
        />
      </Modal>
    </>
  );
};
export default memo(ReportGroupDetail);
