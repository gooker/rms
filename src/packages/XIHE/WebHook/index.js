import React, { memo, useState, useEffect } from 'react';
import { Button, Modal } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import { getAllWebHookTypes, getAllWebHooks, deleteWebHooks, getAllQueues } from '@/services/api';
import { dealResponse, formatMessage, isNull, isStrictNull } from '@/utils/util';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWidthPages from '@/components/TableWithPages';
import RcsConfirm from '@/components/RmsConfirm';
import commonStyles from '@/common.module.less';
import WebHookFormModal from './WebHookFormModal';
import useTablePageLoading from '@/RmsHooks/UseTablePageLoading';

const WebHook = () => {
  const { loading, setLoading, deleteLoading, setDeleteLoading } = useTablePageLoading();

  const [webHooks, setWebHooks] = useState([]); // 已创建的Hook
  const [webHooksType, setWebHooksType] = useState([]); // Hook类型
  const [mqQueue, setMqQueue] = useState([]); // MQ Queue

  const [modalVisible, setModalVisible] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(refresh, []);

  function refresh() {
    setLoading(true);
    Promise.all([getAllWebHooks(), getAllWebHookTypes(), getAllQueues()])
      .then(([allWebHooks, allWebHookTypes, allMqQueue]) => {
        if (!dealResponse([allWebHookTypes, allWebHooks, allMqQueue])) {
          setWebHooks(allWebHooks);
          setWebHooksType(allWebHookTypes);
          setMqQueue(allMqQueue);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function refreshTable() {
    const response = await getAllWebHooks();
    if (!dealResponse(response)) {
      setWebHooks(response);
    }
  }

  function addWebHook() {
    setEditingRow(null);
    setModalVisible(true);
  }

  function editRow(row) {
    setEditingRow(row);
    setModalVisible(true);
  }

  function deleteWebhook() {
    RcsConfirm({
      content: formatMessage({ id: 'app.message.batchDelete.confirm' }),
      okButtonProps: { loading: deleteLoading, disabled: deleteLoading },
      onOk() {
        setDeleteLoading(true);
        deleteWebHooks(selectedRowKeys).then((response) => {
          if (!dealResponse(response, true)) {
            setSelectedRowKeys([]);
            refreshTable();
          }
          setDeleteLoading(false);
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
    { title: <FormattedMessage id="app.common.description" />, dataIndex: 'desc', align: 'center' },
    {
      title: <FormattedMessage id="app.button.edit" />,
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

  const expandColumns = [
    { title: <FormattedMessage id="app.common.timeout" />, dataIndex: 'timeOut' },
    {
      title: <FormattedMessage id="webHook.retryTimes" />,
      dataIndex: 'tryCount',
    },
    {
      title: <FormattedMessage id="app.common.creator" />,
      dataIndex: 'createdByUser',
    },
    {
      title: <FormattedMessage id="app.common.updater" />,
      dataIndex: 'updatedByUser',
    },
    {
      title: <FormattedMessage id="app.request.headers" />,
      dataIndex: 'headers',
      render: (text) => {
        if (isStrictNull(text)) return '{}';
        const content = JSON.stringify(text);
        return content || '';
      },
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const title = `${formatMessage({
    id: isNull(editingRow) ? 'app.button.add' : 'app.button.update',
  })}`;

  return (
    <TablePageWrapper>
      <div className={commonStyles.tableToolLeft}>
        <Button type="primary" onClick={addWebHook}>
          <PlusOutlined /> <FormattedMessage id="app.button.add" />
        </Button>
        <Button danger onClick={deleteWebhook} disabled={selectedRowKeys.length === 0}>
          <DeleteOutlined /> <FormattedMessage id="app.button.delete" />
        </Button>
        <Button onClick={refresh}>
          <ReloadOutlined /> <FormattedMessage id="app.button.refresh" />
        </Button>
      </div>
      <TableWidthPages
        bordered
        loading={loading}
        rowSelection={rowSelection}
        dataSource={webHooks}
        columns={tableColumn}
        expandColumns={expandColumns}
        rowKey={(record) => record.id}
      />

      <Modal
        destroyOnClose
        title={title}
        width={600}
        visible={modalVisible}
        closable={false}
        footer={false}
      >
        <WebHookFormModal
          editing={editingRow}
          mqQueue={mqQueue}
          webHooksType={webHooksType}
          onClose={(refresh = true) => {
            setModalVisible(false);
            refresh && refreshTable();
          }}
        />
      </Modal>
    </TablePageWrapper>
  );
};
export default memo(WebHook);
