import React, { memo, useEffect, useState } from 'react';
import { find } from 'lodash';
import { Button, Input, Form, message, Modal, Table, Tag } from 'antd';
import { BellOutlined, ReloadOutlined, DisconnectOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';
import { BroadCastPattern, BroadCastTiming, BroadCastType, ContentType } from './enum';
import { dealResponse, isNull, formatMessage } from '@/utils/util';
import LocaleKeys from '@/locales/LocaleKeys';
import {
  deleteChannelSubscription,
  fetchBroadCastChannel,
  fetchChannelSubscription,
  saveChannelSubscription,
} from '@/services/api';
import TablePageWrapper from '@/components/TablePageWrapper';
import commonStyles from '@/common.module.less';
import TableWithPages from '@/components/TableWithPages';

const ChannelSubscription = (props) => {
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [subscribeConfirm, setSubscribeConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [subscribed, setSubscribed] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [email, setEmail] = useState(props.email);

  const subscribedChannelIds = subscribed.map(({ broadCastId }) => broadCastId);
  // 只需要邮件渠道的频道 && 添加"订阅状态"属性
  const riceDataSource = dataSource
    .filter((item) => item.isSubscribe)
    .map((item) => ({
      ...item,
      subscribeState: subscribedChannelIds.includes(item.id),
    }));

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    setSelectedRowKeys([]);
    setLoading(true);
    const [_dataSource, _subscribed] = await Promise.all([
      fetchBroadCastChannel(),
      fetchChannelSubscription(props.userId),
    ]);

    if (!dealResponse(_dataSource)) {
      setDataSource(_dataSource);
    } else {
      message.error(formatMessage({ id: 'app.notification.fetchChannelFail' }));
    }

    if (!dealResponse(_subscribed)) {
      setSubscribed(_subscribed);
    } else {
      message.error(formatMessage({ id: 'app.subscription.fetchSubscriptionFail' }));
    }
    setLoading(false);
  }

  function unSubscribe() {
    Modal.confirm({
      title: formatMessage({ id: 'app.request.systemHint' }),
      content: formatMessage({ id: 'app.subscription.unSubscribe.confirm' }),
      onOk: async () => {
        const subscribedId = selectedRowKeys
          .map((broadCastId) => {
            const subscribedRecord = find(subscribed, { broadCastId });
            if (subscribedRecord) {
              return subscribedRecord.id;
            } else {
              return null;
            }
          })
          .filter(Boolean);
        const response = await deleteChannelSubscription(subscribedId);
        if (!dealResponse(response)) {
          message.success(formatMessage({ id: 'app.message.operateSuccess' }));
          getData();
        } else {
          message.error(formatMessage({ id: 'app.taskTrigger.operate.failed' }));
        }
      },
    });
  }

  function judgeSubscribeBtnDisable() {
    if (selectedRowKeys.length === 0) {
      return true;
    } else {
      const rows = riceDataSource
        .filter((item) => selectedRowKeys.includes(item.id))
        .map(({ subscribeState }) => subscribeState);
      return rows.includes(true);
    }
  }

  function judgeUnsubscribeBtnDisable() {
    if (selectedRowKeys.length === 0) {
      return true;
    } else {
      const rows = riceDataSource
        .filter((item) => selectedRowKeys.includes(item.id))
        .map(({ subscribeState }) => subscribeState);
      return rows.includes(false);
    }
  }

  const columns = [
    {
      title: formatMessage({ id: 'app.common.name' }),
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.notification.broadCastPattern' }),
      dataIndex: 'broadCastPattern',
      align: 'center',
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
      title: formatMessage({ id: 'app.notification.contentType' }),
      dataIndex: 'contentType',
      align: 'center',
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
      title: formatMessage({ id: 'app.notification.broadCastTiming' }),
      dataIndex: 'broadCastTiming',
      align: 'center',
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
      render: (text, record) => {
        if (record.broadCastTiming === 'Delay') {
          return `${text}s`;
        } else {
          return '-';
        }
      },
    },
    {
      title: formatMessage({ id: 'app.notification.cycle' }),
      dataIndex: 'cycle',
      align: 'center',
      render: (text) => `${text}s`,
    },
    {
      title: formatMessage({ id: 'translator.languageManage.language' }),
      dataIndex: 'languageType',
      align: 'center',
      render: (text) => LocaleKeys[text] || '??',
    },
    {
      title: formatMessage({ id: 'app.common.status' }),
      dataIndex: 'isOpen',
      align: 'center',
      render: (text) => (
        <Tag color={text ? 'success' : 'error'}>
          <FormattedMessage id={text ? 'app.chargeManger.enable' : 'app.chargeManger.disabled'} />
        </Tag>
      ),
    },
    {
      title: formatMessage({ id: 'app.subscription.subscribeState' }),
      dataIndex: 'subscribeState',
      align: 'center',
      render: (text) => {
        if (text) {
          return (
            <span style={{ color: '#1890FF', fontWeight: 600 }}>
              <FormattedMessage id={'app.subscription.subscribed'} />
            </span>
          );
        } else {
          return (
            <span style={{ color: '#FF4D4F', fontWeight: 600 }}>
              <FormattedMessage id={'app.subscription.unSubscribed'} />
            </span>
          );
        }
      },
    },
  ];

  return (
    <TablePageWrapper>
      <div className={commonStyles.tableToolLeft}>
        <Button
          type={'primary'}
          onClick={() => {
            setSubscribeConfirm(true);
          }}
          disabled={judgeSubscribeBtnDisable()}
        >
          <BellOutlined /> <FormattedMessage id={'app.subscription.subscribe'} />
        </Button>
        <Button onClick={unSubscribe} disabled={judgeUnsubscribeBtnDisable()}>
          <DisconnectOutlined /> <FormattedMessage id={'app.subscription.unSubscribe'} />
        </Button>
        <Button onClick={getData}>
          <ReloadOutlined /> <FormattedMessage id={'app.button.refresh'} />
        </Button>
      </div>
      <TableWithPages
        bordered
        loading={loading}
        columns={columns}
        dataSource={riceDataSource}
        rowKey={(record) => record.id}
        scroll={{ x: 'max-content' }}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
      />
      <Modal
        destroyOnClose
        style={{ top: 30 }}
        visible={subscribeConfirm}
        title={formatMessage({ id: 'app.subscription.subscribeChannel' })}
        onCancel={() => {
          setSubscribeConfirm(false);
        }}
        onOk={async () => {
          setSubscribeLoading(true);
          const requestParam = {
            userId: props.userId,
            channelIds: selectedRowKeys,
            userMail: email,
          };
          const response = await saveChannelSubscription(requestParam);
          if (!dealResponse(response)) {
            message.success(formatMessage({ id: 'app.message.operateSuccess' }));
            getData();
            setSubscribeConfirm(false);
          } else {
            message.error(formatMessage({ id: 'app.message.operateFailed' }));
          }
          setSubscribeLoading(false);
        }}
        okButtonProps={{
          disabled: subscribeLoading,
          loading: subscribeLoading,
        }}
      >
        <Form.Item label={formatMessage({ id: 'app.subscription.email' })}>
          <Input
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            style={{ width: 350 }}
          />
        </Form.Item>
      </Modal>
    </TablePageWrapper>
  );
};
export default connect(({ user }) => ({
  email: user?.currentUser?.email,
  userId: user?.currentUser?.id,
}))(memo(ChannelSubscription));
