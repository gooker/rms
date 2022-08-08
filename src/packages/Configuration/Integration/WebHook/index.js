import React, { memo, useEffect, useState } from 'react';
import { Button, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { find, findIndex } from 'lodash';
import FormattedMessage from '@/components/FormattedMessage';
import { deleteWebHooks, getAllWebHooks } from '@/services/commonService';
import { fetchAllRegisterData } from '@/services/XIHEService';
import { dealResponse, formatMessage, isStrictNull } from '@/utils/util';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWithPages from '@/components/TableWithPages';
import RmsConfirm from '@/components/RmsConfirm';
import WebHookFormModal from './WebHookFormModal';
import useTablePageLoading from '@/RmsHooks/UseTablePageLoading';
import commonStyles from '@/common.module.less';
import { connect } from '@/utils/RmsDva';

const WebHook = ({ mqQueue }) => {
  const { loading, setLoading, deleteLoading, setDeleteLoading } = useTablePageLoading();

  const [webHooks, setWebHooks] = useState([]); // 已创建的Hook
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(refresh, []);

  function refresh() {
    setLoading(true);
    Promise.all([getAllWebHooks(), fetchAllRegisterData()])
      .then(([allWebHooks, allTopicData]) => {
        if (!dealResponse([allWebHooks, allTopicData])) {
          const newWebHooks = [...allWebHooks];
          allTopicData?.map((item) => {
            item?.mappingRelation.map(({ id, nameSpace }) => {
              const bindTopic = find(newWebHooks, { id });
              const bindIndex = findIndex(newWebHooks, { id });
              newWebHooks.splice(bindIndex, 1, { ...bindTopic, topicData: { ...item, nameSpace } });
            });
          });
          setWebHooks(newWebHooks);
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
    RmsConfirm({
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
    },
    { title: 'URL', dataIndex: 'url', align: 'center' },
    {
      title: <FormattedMessage id='webHook.subscribe.event' />,
      dataIndex: 'urlMappingRelation',
      align: 'center',
      render: (text) => {
        if (Array.isArray(text)) {
          const names = [];
          text.forEach(({ topic }) => {
            const target = find(mqQueue, { webHookTopic: topic });
            if (target) {
              names.push(
                <Tag key={target.webHookTopic} color='blue'>
                  {target.name}
                </Tag>,
              );
            }
          });
          return names;
        }
        return null;
      },
    },
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
      <TableWithPages
        bordered
        loading={loading}
        rowSelection={rowSelection}
        dataSource={webHooks}
        columns={tableColumn}
        expandColumns={expandColumns}
        rowKey={(record) => record.id}
      />

      <WebHookFormModal
        editing={editingRow}
        mqQueue={mqQueue}
        visible={modalVisible}
        onClose={(refresh = true) => {
          setModalVisible(false);
          refresh && refreshTable();
        }}
      />
    </TablePageWrapper>
  );
};
export default connect(({ global }) => ({
  mqQueue: global.allQueue,
}))(memo(WebHook));
