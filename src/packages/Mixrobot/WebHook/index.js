import React, { memo, useState, useEffect } from 'react';
import { Button, message, Row, Col } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import { getAllWebHookTypes, getAllWebHooks, saveWebHook, deleteWebHooks } from '@/services/api';
import { dealResponse, formatMessage } from '@/utils/utils';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWidthPages from '@/components/TableWidthPages';
import RcsConfirm from '@/components/RcsConfirm';
import commonStyles from '@/common.module.less';
import WebHookFormModal from './WebHookFormModal';

const key = 'action_hint';

/**
 * Web Hook每个类型只能配置一个URL，所以需要做
 */
const WebHook = () => {
  const [loading, setLoading] = useState(false);
  const [webHooks, setWebHooks] = useState([]);
  const [webHooksType, setWebHooksType] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(refresh, []);

  function refresh() {
    setLoading(true);
    Promise.all([getAllWebHookTypes(), getAllWebHooks()]).then(([allWebHookTypes, allWebHooks]) => {
      if (dealResponse(allWebHookTypes) || dealResponse(allWebHooks)) {
        message.error(formatMessage({ id: 'app.message.fetchDataFailed' }));
      } else {
        setWebHooks(allWebHooks);
        setWebHooksType(allWebHookTypes);
      }
      setLoading(false);
    });
  }

  function addWebHook() {
    setModalVisible(true);
  }

  function editRow(row) {
    setEditingRow(row);
    addWebHook();
  }

  function submit(webhook) {
    message.loading({ content: 'Loading...', key });
    let requestBody = { ...webhook };
    if (editingRow) {
      requestBody = { ...editingRow, ...webhook };
    }
    saveWebHook(requestBody).then((response) => {
      if (dealResponse(response)) {
        message.error({
          content: formatMessage({ id: 'app.message.operateFailed' }),
          key,
          duration: 5,
        });
      } else {
        message.success({
          content: formatMessage({ id: 'app.message.operateSuccess' }),
          key,
          duration: 2,
        });
        refresh();
        setEditingRow(null);
        setModalVisible(false);
      }
    });
  }

  function deleteWebhook() {
    RcsConfirm({
      content: formatMessage({ id: 'app.message.batchDelete.confirm' }),
      onOk() {
        message.loading({ content: 'Loading...', key });
        deleteWebHooks(selectedRowKeys).then((response) => {
          if (dealResponse(response)) {
            message.error({
              content: formatMessage({ id: 'app.message.operateFailed' }),
              key,
              duration: 5,
            });
          } else {
            message.success({
              content: formatMessage({ id: 'app.message.operateSuccess' }),
              key,
              duration: 2,
            });
            setSelectedRowKeys([]);
            refresh();
          }
        });
      },
    });
  }

  const tableColumn = [
    {
      title: <FormattedMessage id="app.common.name" />,
      dataIndex: 'name',
      align: 'center',
      fixed: 'left',
    },
    {
      title: <FormattedMessage id="app.common.type" />,
      dataIndex: 'webHookType',
      align: 'center',
      render: (text) => `${webHooksType[text]} [${text}]`,
    },
    { title: 'URL', dataIndex: 'url', align: 'center' },
    { title: 'Token', dataIndex: 'token', align: 'center' },
    { title: <FormattedMessage id="app.common.timeout" />, dataIndex: 'timeOut', align: 'center' },
    {
      title: <FormattedMessage id="webHook.retryTimes" />,
      dataIndex: 'tryCount',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.common.creator" />,
      align: 'center',
      dataIndex: 'createdByUser',
    },
    {
      title: <FormattedMessage id="app.common.updater" />,
      dataIndex: 'updatedByUser',
      align: 'center',
    },
    { title: <FormattedMessage id="app.common.description" />, dataIndex: 'desc', align: 'center' },
    {
      title: <FormattedMessage id="app.common.edit" />,
      align: 'center',
      fixed: 'right',
      render: (text, record) => (
        <EditOutlined
          style={{ color: '#1890FF', fontSize: 18 }}
          onClick={() => {
            editRow(record);
          }}
        />
      ),
    },
  ];

  function onSelectChange(_selectedRowKeys) {
    setSelectedRowKeys(_selectedRowKeys);
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <TablePageWrapper>
      <Row style={{ display: 'flex', padding: '0 0 20px 0' }}>
        <Col flex="auto" className={commonStyles.tableToolLeft}>
          <Button type="primary" onClick={addWebHook}>
            <FormattedMessage id="app.button.add" />
          </Button>
          <Button danger onClick={deleteWebhook} disabled={selectedRowKeys.length === 0}>
            <FormattedMessage id="app.button.delete" />
          </Button>
          <Button onClick={refresh}>
            <FormattedMessage id="app.button.refresh" />
          </Button>
        </Col>
      </Row>
      <TableWidthPages
        bordered
        loading={loading}
        rowSelection={rowSelection}
        dataSource={webHooks}
        columns={tableColumn}
        pagination={null}
        rowKey={(record) => record.id}
        scroll={{ x: 'max-content' }}
      />

      <WebHookFormModal
        data={editingRow}
        visible={modalVisible}
        onSubmit={submit}
        onClose={() => {
          setModalVisible(false);
        }}
        options={Object.entries(webHooksType).map(([type, label]) => ({
          type,
          label,
        }))}
      />
    </TablePageWrapper>
  );
};
export default memo(WebHook);
