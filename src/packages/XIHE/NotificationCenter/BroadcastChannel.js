import React, { memo, useEffect, useState } from 'react';
import { Table, Switch, Button, Modal, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import find from 'lodash/find';
import BroadcastChannelForm from './components/BroadcastChannelForm';
import FormattedMessage from '@/components/FormattedMessage';
import { dateFormat, dealResponse, isNull, formatMessage } from '@/utils/utils';
import {
  deleteBroadCastChannels,
  fetchBroadCastChannel,
  saveBroadCastChannel,
} from '@/services/api';
import { BroadCastType, BroadCastPattern, ContentType, BroadCastTiming } from './enum';
import LocaleKeys from '@/locales/LocaleKeys';
import RmsConfirm from '@/components/RmsConfirm';
import styles from './BroadcastChannel.module.less';

const BroadcastChannel = () => {
  const [loading, setLoading] = useState(false);
  const [creationLoading, setCreationLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    setLoading(true);
    const response = await fetchBroadCastChannel();
    if (!dealResponse(response)) {
      setDataSource(response);
    } else {
      message.error(formatMessage({ id: 'app.notification.fetchChannelFail' }));
    }
    setLoading(false);
  }

  async function createChannel(values) {
    setCreationLoading(true);
    let requestParams = { ...values };
    if (!isNull(editing)) {
      requestParams = { ...editing, ...requestParams };
    }
    const response = await saveBroadCastChannel(requestParams);
    if (!dealResponse(response)) {
      message.success(formatMessage({ id: 'app.message.operateSuccess' }));
      getData();
      setModalVisible(false);
    }
    setCreationLoading(false);
  }

  function updateChannelState(record, state) {
    const requestParam = { ...record, isOpen: state };
    createChannel(requestParam);
  }

  function editRecord(record) {
    setEditing(record);
    setModalVisible(true);
  }

  function deleteChannel() {
    RmsConfirm({
      content: formatMessage({ id: 'app.message.batchDelete.confirm' }),
      onOk: async () => {
        const response = await deleteBroadCastChannels(selectedRowKeys);
        if (!dealResponse(response)) {
          message.success(formatMessage({ id: 'app.message.operateSuccess' }));
          getData();
          setSelectedRowKeys([]);
        }
      },
    });
  }

  function updateIsSubscribe(record, state) {
    const requestParam = { ...record, isSubscribe: state };
    createChannel(requestParam);
  }

  const columns = [
    {
      title: formatMessage({ id: 'app.common.name' }),
      dataIndex: 'name',
      align: 'center',
      width: 150,
    },
    {
      title: formatMessage({ id: 'app.notification.broadCastPattern' }),
      dataIndex: 'broadCastPattern',
      align: 'center',
      width: 100,
      render: (text) => {
        const enumItem = find(BroadCastPattern, { key: text });
        if (!isNull(enumItem)) {
          return formatMessage({ id: enumItem.label });
        } else {
          return '??';
        }
      },
    },
    {
      title: formatMessage({ id: 'app.notification.broadCastType' }),
      dataIndex: 'broadCastType',
      align: 'center',
      width: 100,
      render: (text) => {
        const enumItem = find(BroadCastType, { key: text });
        if (!isNull(enumItem)) {
          return formatMessage({ id: enumItem.label });
        } else {
          return '??';
        }
      },
    },
    {
      title: formatMessage({ id: 'app.notification.broadCastTiming' }),
      dataIndex: 'broadCastTiming',
      align: 'center',
      width: 100,
      render: (text) => {
        const enumItem = find(BroadCastTiming, { key: text });
        if (!isNull(enumItem)) {
          return formatMessage({ id: enumItem.label });
        } else {
          return '??';
        }
      },
    },
    {
      title: formatMessage({ id: 'app.notification.broadCastTiming.delayLabel' }),
      dataIndex: 'timeOut',
      align: 'center',
      width: 100,
      render: (text, record) => {
        if (record.broadCastTiming === 'Delay') {
          return `${text}s`;
        } else {
          return '-';
        }
      },
    },
    {
      title: formatMessage({ id: 'app.notification.contentType' }),
      dataIndex: 'contentType',
      align: 'center',
      width: 150,
      render: (text) => {
        const enumItem = find(ContentType, { key: text });
        if (!isNull(enumItem)) {
          return formatMessage({ id: enumItem.label });
        } else {
          return '??';
        }
      },
    },
    {
      title: formatMessage({ id: 'app.notification.cycle' }),
      dataIndex: 'cycle',
      align: 'center',
      width: 150,
      render: (text, record) => {
        if (record.broadCastType === 'TimeOut') {
          return '-';
        } else {
          return `${text}s`;
        }
      },
    },
    {
      title: 'Web Hook',
      dataIndex: 'webhook',
      align: 'center',
      width: 150,
      render: (text) => text || '-',
    },
    {
      title: 'Sign',
      dataIndex: 'sign',
      align: 'center',
      width: 150,
      render: (text) => text || '-',
    },
    {
      title: formatMessage({ id: 'translator.languageManage.language' }),
      dataIndex: 'languageType',
      align: 'center',
      width: 150,
      render: (text) => LocaleKeys[text] || '??',
    },
    {
      title: formatMessage({ id: 'app.common.creationTime' }),
      dataIndex: 'createTime',
      render: (text) => dateFormat(text).format('YYYY-MM-DD HH:mm:ss'),
      align: 'center',
      width: 150,
    },
    {
      title: formatMessage({ id: 'app.common.updateTime' }),
      dataIndex: 'updateTime',
      render: (text) => dateFormat(text).format('YYYY-MM-DD HH:mm:ss'),
      align: 'center',
      width: 150,
    },
    {
      title: formatMessage({ id: 'app.notification.subscribable' }),
      dataIndex: 'isSubscribe',
      align: 'center',
      fixed: 'right',
      width: 100,
      render: (text, record) => (
        <Switch
          checked={text}
          onChange={(checked) => {
            updateIsSubscribe(record, checked);
          }}
          checkedChildren={formatMessage({ id: 'app.common.yes' })}
          unCheckedChildren={formatMessage({ id: 'app.common.no' })}
        />
      ),
    },
    {
      title: formatMessage({ id: 'app.common.status' }),
      dataIndex: 'isOpen',
      align: 'center',
      fixed: 'right',
      width: 100,
      render: (text, record) => (
        <Switch
          checked={text}
          onChange={(checked) => {
            updateChannelState(record, checked);
          }}
          checkedChildren={formatMessage({ id: 'app.chargeManger.enable' })}
          unCheckedChildren={formatMessage({ id: 'app.chargeManger.disabled' })}
        />
      ),
    },
    {
      title: formatMessage({ id: 'app.common.operation' }),
      align: 'center',
      fixed: 'right',
      width: 100,
      render: (text, record) => (
        <EditOutlined
          onClick={() => {
            editRecord(record);
          }}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <div className={styles.broadcastChannel}>
        <Button
          type={'primary'}
          onClick={() => {
            setEditing(null);
            setModalVisible(true);
          }}
        >
          <PlusOutlined /> <FormattedMessage id={'app.button.add'} />
        </Button>
        <Button danger disabled={selectedRowKeys.length === 0} onClick={deleteChannel}>
          <DeleteOutlined /> <FormattedMessage id={'app.button.delete'} />
        </Button>
        <Button onClick={getData}>
          <ReloadOutlined /> <FormattedMessage id={'app.button.refresh'} />
        </Button>
      </div>
      <Table
        bordered
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        rowKey={(record) => record.id}
        scroll={{ x: 'max-content' }}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
      />

      <Modal
        destroyOnClose
        title={`${formatMessage({
          id: isNull(editing) ? 'app.button.add' : 'app.button.update',
        })}${formatMessage({ id: 'app.notification.broadCastChannel' })}`}
        visible={modalVisible}
        footer={null}
        width={600}
        style={{ top: 40 }}
        maskClosable={false}
        onCancel={() => {
          setModalVisible(false);
        }}
      >
        <BroadcastChannelForm data={editing} onSubmit={createChannel} loading={creationLoading} />
      </Modal>
    </div>
  );
};
export default memo(BroadcastChannel);
