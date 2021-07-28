import React, { memo, useState, useEffect } from 'react';
import { Tabs, Spin, Modal } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import ChargingStrategyForm from './ChargingStrategyForm';
import IdleChargingStrategy from './IdleChargingStrategy';
import { getCurrentChargerType, getChargeStrategy } from '@/services/api';
import { formatMessage, FormattedMessage } from '@/utils/Lang';
import { hasPermission } from '@/utils/Permission';
import commonStyles from '@/common.module.less';
import styles from './chargingStrategy.module.less';
import { dealResponse } from '@/utils/utils';

const { TabPane } = Tabs;

const ChargingStrategyComponent = (prop) => {
  const { agvType } = prop;

  const [spinning, setSpinning] = useState(false);
  const [idleChargingStrategyVisible, setIdleChargingStrategyVisible] = useState(false);
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
        getCurrentChargerType(agvType),
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

  async function switchTab(key) {
    setActiveKey(key);
    const currentStrategy = await getChargeStrategy(agvType, key);
    if (!dealResponse(currentStrategy)) {
      setChargeStrategy(currentStrategy);
    }
  }

  return (
    <div className={classnames(commonStyles.globalPageStyle, styles.chargerStrategy)}>
      <Tabs
        animated
        activeKey={activeKey}
        tabBarExtraContent={renderTabToolBar()}
        onChange={switchTab}
      >
        <TabPane key="Normal" tab={formatMessage({ id: 'app.chargeStrategy.normal' })}>
          <ChargingStrategyForm type="Normal" agvType={agvType} data={chargeStrategy} />
        </TabPane>
        {hasPermission('/system/chargerManageMents/idle') ? (
          <TabPane tab={formatMessage({ id: 'app.chargeStrategy.idleHours' })} key="IdleHours">
            <ChargingStrategyForm
              type="IdleHours"
              agvType={agvType}
              data={chargeStrategy}
              openIdle={setIdleChargingStrategyVisible}
            />
          </TabPane>
        ) : null}
      </Tabs>

      {/* 闲时策略 */}
      <Modal
        width={800}
        footer={null}
        destroyOnClose
        visible={idleChargingStrategyVisible}
        onCancel={() => {
          setIdleChargingStrategyVisible(false);
        }}
      >
        <IdleChargingStrategy
          agvType={agvType}
          onCancel={() => {
            setIdleChargingStrategyVisible(false);
          }}
        />
      </Modal>
    </div>
  );
};
export default memo(ChargingStrategyComponent);
