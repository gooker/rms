import React, { memo, useState, useEffect } from 'react';
import { Tabs, Spin } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import ChargingStrategyForm from './ChargingStrategyForm';
import { getIdleHoursBySectionId, getChargeStrategy } from '@/services/api';
import { hasPermission } from '@/utils/Permission';
import { formatMessage, FormattedMessage } from '@/utils/Lang';
import commonStyles from '@/common.module.less';
import styles from './chargingStrategy.module.less';

const { TabPane } = Tabs;

const ChargingStrategyComponent = (prop) => {
  const { agvType } = prop;

  const [spinning, setSpinning] = useState(false);
  const [status, setStatus] = useState(false);
  const [activeKey, setActiveKey] = useState('Normal');
  const [chargeStrategy, setChargeStrategy] = useState(null);

  useEffect(() => {
    getCurrentStatus();
    getChargingStrategy();
  }, []);

  async function getCurrentStatus() {
    setSpinning(true);
    const response = await getIdleHoursBySectionId(agvType);
    setStatus(response === 'Normal');
    setSpinning(false);
  }

  async function getChargingStrategy() {
    setSpinning(true);
    const response = await getChargeStrategy(agvType, activeKey);
    setChargeStrategy(response);
    setSpinning(false);
  }

  function renderTabToolBar() {
    return (
      <div className={styles.tabToolBar} onClick={getCurrentStatus}>
        {spinning ? <Spin /> : <RedoOutlined />}
        <span>
          <FormattedMessage id="app.chargeManger.currentStatus" />:
        </span>
        <span style={{ marginLeft: 5, zoom: 1.5 }}>
          {status ? (
            <FormattedMessage id="app.chargeManger.normal" />
          ) : (
            <FormattedMessage id="app.chargeManger.idleHours" />
          )}
        </span>
      </div>
    );
  }

  return (
    <div className={commonStyles.globalPageStyle}>
      <Tabs
        activeKey={activeKey}
        tabBarExtraContent={renderTabToolBar()}
        onChange={(key) => {
          setActiveKey(key);
        }}
      >
        <TabPane key="Normal" tab={formatMessage({ id: 'app.chargeManger.normal' })}>
          <ChargingStrategyForm />
        </TabPane>
        {hasPermission('/system/chargerManageMents/idle') ? (
          <TabPane key="Idlehours" tab={formatMessage({ id: 'app.chargeManger.idleHours' })}>
            <span>222</span>
          </TabPane>
        ) : null}
      </Tabs>
    </div>
  );
};
export default memo(ChargingStrategyComponent);
