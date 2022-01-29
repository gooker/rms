import React, { memo, useEffect, useState } from 'react';
import { Button, Divider, Form, Input, Modal } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import TableWidthPages from '@/components/TableWidthPages';
import TablePageWrapper from '@/components/TablePageWrapper';
import FormattedMessage from '@/components/FormattedMessage';
import { dealResponse, formatMessage, GMT2UserTimeZone } from '@/utils/util';
import { deleteReportGroup, fetchReportGroupList, saveReportGroup } from '@/services/api';
import RmsConfirm from '@/components/RmsConfirm';
import commonStyle from '@/common.module.less';

const ReportGroupList = (props) => {
  const { agvType, gotoDetail } = props;

  const [formRef] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [creationLoading, setCreationLoading] = useState(false);
  const [reportGroup, setReportGroup] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const columns = [
    {
      title: formatMessage({ id: 'app.reportCenter.reportGroupName' }),
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.common.creator' }),
      dataIndex: 'createdByUser',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.common.creationTime' }),
      dataIndex: 'createTime',
      align: 'center',
      render: (text) => GMT2UserTimeZone(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: formatMessage({ id: 'app.common.updater' }),
      dataIndex: 'updatedByUser',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.common.updateTime' }),
      dataIndex: 'updateTime',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.common.operation' }),
      align: 'center',
      width: 200,
      render: (text, record) => (
        <>
          <Button
            type={'link'}
            onClick={() => {
              gotoDetail(record);
            }}
          >
            <FormattedMessage id={'app.button.check'} />
          </Button>
          <Divider type={'vertical'} />
          <Button
            type={'link'}
            onClick={() => {
              deleteGroup(record.id);
            }}
          >
            <FormattedMessage id={'app.button.delete'} />
          </Button>
        </>
      ),
    },
  ];

  useEffect(() => {
    fetchList();
  }, []);

  async function fetchList() {
    setLoading(true);
    const response = await fetchReportGroupList(agvType);
    if (
      !dealResponse(response, false, null, formatMessage({ id: 'app.message.fetchDataFailed' }))
    ) {
      setReportGroup(response);
    }
    setLoading(false);
  }

  function addGroup() {
    setCreationLoading(true);
    formRef.validateFields().then(async (values) => {
      const response = await saveReportGroup(agvType, values);
      if (!dealResponse(response, true)) {
        setModalVisible(false);
        fetchList();
      }
      setCreationLoading(false);
    });
  }

  function deleteGroup(groupId) {
    RmsConfirm({
      content: formatMessage({ id: 'app.message.delete.confirm' }),
      onOk: async () => {
        const response = await deleteReportGroup(agvType, groupId);
        if (!dealResponse(response, true)) {
          fetchList();
        }
      },
    });
  }

  return (
    <TablePageWrapper>
      <div className={commonStyle.tableToolLeft}>
        <Button
          type={'primary'}
          onClick={() => {
            setModalVisible(true);
          }}
        >
          <PlusOutlined /> <FormattedMessage id={'app.button.add'} />
        </Button>
        <Button onClick={fetchList}>
          <ReloadOutlined /> <FormattedMessage id={'app.button.refresh'} />
        </Button>
      </div>
      <TableWidthPages
        bordered
        loading={loading}
        columns={columns}
        dataSource={reportGroup}
        rowKey={({ id }) => id}
      />

      {/* 添加报表组 */}
      <Modal
        destroyOnClose
        width={480}
        title={`${formatMessage({ id: 'app.button.add' })}${formatMessage({
          id: 'app.reportCenter.reportGroup',
        })}`}
        visible={modalVisible}
        okButtonProps={{ loading: creationLoading, disabled: creationLoading }}
        onCancel={() => {
          setModalVisible(false);
        }}
        onOk={addGroup}
      >
        <Form form={formRef}>
          <Form.Item
            name={'name'}
            label={formatMessage({ id: 'app.reportCenter.reportGroupName' })}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </TablePageWrapper>
  );
};
export default memo(ReportGroupList);
