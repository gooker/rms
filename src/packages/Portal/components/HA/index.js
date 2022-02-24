import React, { memo, useEffect, useState } from 'react';
import { Modal, Timeline, Divider, Button } from 'antd';
import { ClockCircleOutlined, SyncOutlined } from '@ant-design/icons';
import * as dayjs from 'dayjs';
import ServerList from './ServerList';
import { getHAChangeHistory, getHAInfo } from '@/services/XIHE';
import { dealResponse, formatMessage } from '@/utils/util';
import styles from './ha.module.less';

const HA = () => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [servers, setServers] = useState([]);
  const [changeTimeline, setChangeTimeline] = useState([]);

  function refreshModalContent() {
    setLoading(true);
    Promise.all([getHAInfo(), getHAChangeHistory()])
      .then(([_servers, changeHistory]) => {
        if (!dealResponse(_servers) && !dealResponse(changeHistory)) {
          const _changeTimeline = changeHistory.map(({ currentUrl, lockTime }) => {
            return {
              serverName: _servers?.filter((item) => item.currentUrl === currentUrl)[0]?.serverName,
              currentUrl,
              time: dayjs(lockTime).format('YYYY-MM-DD HH:mm:ss'),
            };
          });
          setServers(_servers);
          setChangeTimeline(_changeTimeline);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    refreshModalContent();
  }, []);

  return (
    <>
      <div
        className={styles.ha}
        onClick={() => {
          setVisible(true);
        }}
      >
        <span className={styles.haLabel}>{formatMessage({ id: 'app.navBar.haMode' })}</span>
      </div>

      <Modal
        destroyOnClose
        width={700}
        visible={visible}
        closable={false}
        footer={
          <Button
            type="primary"
            onClick={() => {
              setVisible(false);
            }}
          >
            {formatMessage({ id: 'app.navBar.haMode.get' })}
          </Button>
        }
      >
        <div style={{ textAlign: 'end' }}>
          <Button onClick={refreshModalContent}>
            <SyncOutlined spin={loading} /> {formatMessage({ id: 'app.button.refresh' })}
          </Button>
        </div>
        <Divider orientation="left">
          {formatMessage({ id: 'app.navBar.haMode.serverList' })}
        </Divider>
        <ServerList servers={servers} />
        <Divider orientation="left">
          {formatMessage({ id: 'app.navBar.haMode.switchHistory' })}
        </Divider>
        <div style={{ maxHeight: '30vh', overflow: 'auto', paddingTop: 10 }}>
          <Timeline mode="left">
            {changeTimeline.map(({ serverName, currentUrl, time }, index) => (
              <Timeline.Item
                key={index}
                label={time}
                dot={<ClockCircleOutlined style={{ fontSize: '16px' }} />}
              >
                {serverName} {currentUrl}
              </Timeline.Item>
            ))}
          </Timeline>
        </div>
      </Modal>
    </>
  );
};
export default memo(HA);
