import React, { memo, useEffect, useState } from 'react';
import { Row, Col, Form, Button, Select } from 'antd';
import { connect } from '@/utils/RmsDva';
import XLSX from 'xlsx';
import { forIn } from 'lodash';
import { getFormModelTypes, fetchActiveMap } from '@/services/api';
import FormattedMessage from '@/components/FormattedMessage';
import { dealResponse, formatMessage, isNull, isStrictNull } from '@/utils/util';
import SelectCarType from './SelectCarType';
import DatePickerSelector from '../../components/DatePickerSelector';

const formLayout = { labelCol: { span: 9 }, wrapperCol: { span: 14 } };
const NoLabelFormLayout = { wrapperCol: { offset: 10, span: 12 } };

const colums = {
  agvId: formatMessage({ id: 'app.agv.id' }),
  period: formatMessage({ id: 'app.time' }),
  robotType: formatMessage({ id: 'app.agv.type' }),
};

const LogSearchForm = (props) => {
  const { search, type, downloadVisible, sourceData, allTaskTypes } = props;

  const [form] = Form.useForm();
  const [optionsData, setOptionsData] = useState([
    {
      code: 'AGV_ID',
      name: <FormattedMessage id="app.customTask.form.SPECIFY_AGV" />,
      value: {},
    },
  ]);

  useEffect(() => {
    async function init() {
      const mapData = await fetchActiveMap();
      if (!dealResponse(mapData) && mapData) {
        const { id } = mapData;
        if (isNull(id)) return;
        const modelTypes = await getFormModelTypes({ mapId: id });
        if (!dealResponse(modelTypes)) {
          const optionsData = [
            {
              code: 'AGV_ID',
              name: <FormattedMessage id="app.customTask.form.SPECIFY_AGV" />,
              value: {},
            },
            {
              code: 'AGV_GROUP',
              name: <FormattedMessage id="app.customTask.form.SPECIFY_GROUP" />,
              value: modelTypes?.AGV_GROUP.options ?? {},
            },
            {
              code: 'AGV_TYPE',
              name: <FormattedMessage id="app.common.type" />,
              value: {
                LatentLifting: formatMessage({ id: 'app.agvType.LatentLifting' }),
                Sorter: formatMessage({ id: 'app.agvType.Sorter' }),
              },
            },
          ];
          setOptionsData(optionsData);
        }
      }
    }
    init();
  }, []);

  function submitSearch() {
    form.validateFields().then((values) => {
      const currentValues = { ...values };
      const { timeRange } = currentValues;
      if (!isNull(timeRange)) {
        currentValues.startTime = timeRange[0].format('YYYY-MM-DD HH:mm:00');
        currentValues.endTime = timeRange[1].format('YYYY-MM-DD HH:mm:00');
      }
      delete currentValues.timeRange;
      search && search(currentValues);
    });
  }

  function generateEveryType(allData, type) {
    const typeResult = [];
    Object.entries(sourceData).forEach(([key, typeData]) => {
      if (!isStrictNull(typeData)) {
        typeData.forEach((record) => {
          let currentTime = {};
          let _record = { ...record };
          currentTime[colums.agvId] = record.agvId;
          currentTime[colums.period] = record.period;
          currentTime[colums.robotType] = record.robotType;
          if (!isNull(type)) {
            _record = { ...record[type] };
          }
          forIn(_record, (value, parameter) => {
            currentTime[parameter] = value;
          });
          typeResult.push(currentTime);
        });
      }
    });
    return typeResult;
  }

  function exportData() {
    const wb = XLSX.utils.book_new(); /*新建book*/
    const statusWs = XLSX.utils.json_to_sheet(generateEveryType(sourceData, 'statusAllTime'));
    const taskWs = XLSX.utils.json_to_sheet(generateEveryType(sourceData, 'taskAllTime'));
    const actionWs = XLSX.utils.json_to_sheet(generateEveryType(sourceData, 'actionLoad'));
    const taskNumWs = XLSX.utils.json_to_sheet(generateEveryType(sourceData, 'taskTimes'));
    const taskDistanceWs = XLSX.utils.json_to_sheet(generateEveryType(sourceData, 'taskDistance'));
    XLSX.utils.book_append_sheet(wb, statusWs, '状态时长');
    XLSX.utils.book_append_sheet(wb, taskWs, '任务时长');
    XLSX.utils.book_append_sheet(wb, actionWs, '动作时长');
    XLSX.utils.book_append_sheet(wb, taskNumWs, '任务次数');
    XLSX.utils.book_append_sheet(wb, taskDistanceWs, '任务距离');
    XLSX.writeFile(wb, `小车负载.xlsx`);
  }

  return (
    <Form form={form}>
      <Row gutter={24}>
        <Form.Item hidden name={'startTime'} />
        <Form.Item hidden name={'endTime'} />
        {/* 日期 */}
        <Col>
          <Form.Item
            label={<FormattedMessage id="app.form.dateRange" />}
            name="timeRange"
            getValueFromEvent={(value) => {
              return value;
            }}
          >
            <DatePickerSelector />
          </Form.Item>
        </Col>

        <Col>
          {/* 分小车 */}
          <Form.Item
            name={'agvSearch'}
            label={<FormattedMessage id="app.agv" />}
            initialValue={{ type: 'AGV_ID', code: [] }}
          >
            <SelectCarType data={optionsData} />
          </Form.Item>
        </Col>
        {type === 'taskload' && (
          <Col>
            <Form.Item
              name={'taskType'}
              label={<FormattedMessage id="app.task.type" />}
              {...formLayout}
            >
              {/* mode="multiple" */}
              <Select allowClear style={{ width: 200 }}>
                {Object.keys(allTaskTypes).map((type) => (
                  <Select.Option key={type} value={type}>
                    {allTaskTypes[type]}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        )}

        <Col offset={1}>
          <Form.Item {...NoLabelFormLayout}>
            <Row justify="end">
              <Button type="primary" onClick={submitSearch}>
                <FormattedMessage id="app.button.search" />
              </Button>
            </Row>
          </Form.Item>
        </Col>
        {downloadVisible && (
          <Col>
            <Form.Item {...NoLabelFormLayout}>
              <Row justify="end">
                <Button onClick={exportData}>
                  <FormattedMessage id="reportCenter.sourceData.download" />
                </Button>
              </Row>
            </Form.Item>
          </Col>
        )}
      </Row>
    </Form>
  );
};
export default connect(({ global }) => ({
  allTaskTypes: global?.allTaskTypes?.LatentLifting || {},
}))(memo(LogSearchForm));
