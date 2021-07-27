import React, { memo, useState, useEffect } from 'react';
import { Tabs, Spin } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import ChargingStrategyForm from './ChargingStrategyForm';
import { fetchGetCurrentChargerType, getChargeStrategy } from '@/services/api';
import { formatMessage, FormattedMessage } from '@/utils/Lang';
import { hasPermission } from '@/utils/Permission';
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
    refresh();
  }, []);

  async function refresh() {
    setSpinning(true);
    try {
      const [currentStatus, currentStrategy] = await Promise.all([
        fetchGetCurrentChargerType(agvType),
        getChargeStrategy(agvType, activeKey),
      ]);
      setStatus(currentStatus === 'Normal');
      setChargeStrategy(currentStrategy);
    } catch (error) {
      //
    }
    setSpinning(false);
  }

  function renderTabToolBar() {
    return (
      <div className={styles.tabToolBar} onClick={refresh}>
        {spinning ? <Spin /> : <RedoOutlined />}
        <span>
          <FormattedMessage id="app.chargeStrategy.currentStatus" />:
        </span>
        <span style={{ marginLeft: 5, zoom: 1.5, color: '#2FC25B' }}>
          {status ? (
            <FormattedMessage id="app.chargeStrategy.normal" />
          ) : (
            <FormattedMessage id="app.chargeStrategy.idleHours" />
          )}
        </span>
      </div>
    );
  }

  return (
    <div className={classnames(commonStyles.globalPageStyle, styles.chargerStrategy)}>
      <Tabs
        animated
        activeKey={activeKey}
        tabBarExtraContent={renderTabToolBar()}
        onChange={(key) => {
          setActiveKey(key);
        }}
      >
        <TabPane key="Normal" tab={formatMessage({ id: 'app.chargeStrategy.normal' })}>
          <ChargingStrategyForm type="Normal" data={chargeStrategy} />
        </TabPane>
        {hasPermission('/system/chargerManageMents/idle') ? (
          <TabPane tab={formatMessage({ id: 'app.chargeStrategy.idleHours' })} key="Idlehours">
            <ChargingStrategyForm type="IdleHours" data={chargeStrategy} />
          </TabPane>
        ) : null}
      </Tabs>
    </div>
  );
};
export default memo(ChargingStrategyComponent);
