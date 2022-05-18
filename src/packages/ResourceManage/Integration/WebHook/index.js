import React, { memo, useState, useEffect } from 'react';
import { Button, Modal } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SwapOutlined,
  DisconnectOutlined,
} from '@ant-design/icons';
import { find, findIndex } from 'lodash';
import FormattedMessage from '@/components/FormattedMessage';
import { getAllWebHookTypes, getAllWebHooks, deleteWebHooks, getAllQueues } from '@/services/api';
import { registerWebhooksTopic, fetchAllRegisterData, unBoundRegisterTopic } from '@/services/XIHE';
import { dealResponse, formatMessage, isNull, isStrictNull } from '@/utils/util';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWithPages from '@/components/TableWithPages';
import RmsConfirm from '@/components/RmsConfirm';
import commonStyles from '@/common.module.less';
import WebHookFormModal from './WebHookFormModal';
import RegisterTopicModal from './RegisterTopicModal';
import useTablePageLoading from '@/RmsHooks/UseTablePageLoading';

const WebHook = () => {
  const { loading, setLoading, deleteLoading, setDeleteLoading } = useTablePageLoading();

  const [webHooks, setWebHooks] = useState([]); // 已创建的Hook
  const [webHooksType, setWebHooksType] = useState([]); // Hook类型
  const [mqQueue, setMqQueue] = useState([]); // MQ Queue

  const [modalVisible, setModalVisible] = useState(false);
  const [registerVisible, setRegisterVisible] = useState(false);
  const [registerRows, setRegisterRows] = useState([]); // 绑定
  const [unRegisterRows, setUnRegisterRows] = useState([]); // 解除绑定
  const [editingRow, setEditingRow] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(refresh, []);

  // TODO: 获取所有topic绑定的webhook 放到webhook数据里展示
  function refresh() {
    setLoading(true);
    Promise.all([getAllWebHooks(), getAllWebHookTypes(), getAllQueues(), fetchAllRegisterData()])
      .then(([allWebHooks, allWebHookTypes, allMqQueue, allTopicData]) => {
        if (!dealResponse([allWebHookTypes, allWebHooks, allMqQueue, allTopicData])) {
          const newWebHooks = [...allWebHooks];
          allTopicData?.map((item) => {
            item?.mappingRelation.map(({ id, nameSpace }) => {
              const bindTopic = find(newWebHooks, { id });
              const bindIndex = findIndex(newWebHooks, { id });
              newWebHooks.splice(bindIndex, 1, { ...bindTopic, topicData: { ...item, nameSpace } });
            });
          });
          console.log(newWebHooks);
          setWebHooks(newWebHooks);
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

  // 注册
  async function registerTopic(values) {
    const { mappings, ...rest } = values;
    const newsMappings = mappings?.map(({ value }) => value);
    const mappingRelation = [];
    registerRows?.map(({ id }) => {
      mappingRelation.push({ id, nameSpace: newsMappings, type: 'WebHook' });
    });
    const response = await registerWebhooksTopic({ ...rest, mappingRelation });
    if (!dealResponse(response, 1)) {
      refresh();
      setRegisterVisible(false);
      setSelectedRowKeys([]);
      setRegisterRows([]);
      setUnRegisterRows([]);
    }
  }

  // 取消注册
  function cancelRegister() {
    RmsConfirm({
      content: formatMessage({ id: 'app.message.doubleConfirm' }),
      okButtonProps: { loading: deleteLoading, disabled: deleteLoading },
      onOk: async () => {
        setDeleteLoading(true);
        const params = [];
        unRegisterRows.map(({ id, topicData }) => {
          const { topic } = topicData;
          params.push({ topic, registerId: topicData.id, configId: id });
        });
        const response = await unBoundRegisterTopic(params);
        if (!dealResponse(response, true)) {
          setSelectedRowKeys([]);
          setRegisterRows([]);
          setUnRegisterRows([]);
          refreshTable();
        }
        setDeleteLoading(false);
      },
    });
  }

  function getRegisterData(ids) {
    const selectedRows = webHooks.filter(({ id }) => ids.includes(id));
    // 过滤未绑定过的数据
    const unRegisteredData = selectedRows.filter(
      ({ topicData }) => isNull(topicData) || Object.keys(topicData)?.length === 0,
    );

    // 过滤绑定过的数据
    const registeredData = selectedRows.filter(
      ({ topicData }) => !isNull(topicData) && Object.keys(topicData)?.length > 0,
    );

    if (unRegisteredData.length > 0 && registeredData.length > 0) {
      setRegisterRows([]);
      setUnRegisterRows([]);
    } else {
      setRegisterRows(unRegisteredData); // 此时是第一次注册
      // 解除绑定
      setUnRegisterRows(registeredData);
    }
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
    {
      title: <FormattedMessage id="webHook.queue" />,
      dataIndex: 'topic',
      render: (_, record) => {
        return record?.topicData?.topic || '';
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
    getRegisterData(_selectedRowKeys);
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

    {
      title: <FormattedMessage id="webHook.queue.desc" />,
      dataIndex: 'topicDesc',
      render: (_, record) => {
        return record?.topicData?.desc || '';
      },
    },
    {
      title: <FormattedMessage id="webHook.queue.name" />,
      dataIndex: 'topicName',
      render: (_, record) => {
        return record?.topicData?.name || '';
      },
    },
    {
      title: <FormattedMessage id="webHook.queue.subscribe" />,
      dataIndex: 'topicNameSpace',
      render: (_, record) => {
        const { topicData } = record;
        const topicNameSpace =
          find(topicData?.mappingRelation ?? [], { id: record.id })?.nameSpace || [];
        const content = topicNameSpace.join(',');
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
        <Button
          onClick={() => {
            setRegisterVisible(true);
          }}
          disabled={registerRows.length === 0}
        >
          <SwapOutlined /> <FormattedMessage id="app.button.bind" />
        </Button>
        <Button disabled={unRegisterRows.length === 0} onClick={cancelRegister}>
          <DisconnectOutlined /> <FormattedMessage id="app.button.unbind" />
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
          webHooksType={webHooksType}
          onClose={(refresh = true) => {
            setModalVisible(false);
            refresh && refreshTable();
          }}
        />
      </Modal>

      {registerVisible && (
        <RegisterTopicModal
          data={registerRows}
          mqQueue={mqQueue}
          visible={registerVisible}
          onClose={() => {
            setRegisterVisible(false);
          }}
          onSubmit={registerTopic}
        />
      )}
    </TablePageWrapper>
  );
};
export default memo(WebHook);
