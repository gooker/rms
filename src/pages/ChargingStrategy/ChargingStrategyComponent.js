import React, { memo, useState, useEffect } from 'react';
import { Tabs, Modal } from 'antd';
import ChargingStrategyForm from './ChargingStrategyForm';
import IdleChargingStrategy from './IdleChargingStrategy';
import { fetchChargingStrategyById } from '@/services/resourceManageAPI';
import { formatMessage } from '@/utils/util';
import styles from './chargingStrategy.module.less';
import { dealResponse, isNull } from '@/utils/util';

const { TabPane } = Tabs;

const ChargingStrategyComponent = (props) => {
  const { title, visible, width = '60%' } = props;
  const { onOk, onCancel, editing } = props;
  const [activeKey, setActiveKey] = useState('Normal'); // Tab
  const [chargeStrategy, setChargeStrategy] = useState(null); // 当前策略详情 {code:'xx',name:'vvv',Normal:{},IdleHours:{}}
  const [idleChargingStrategyVisible, setIdleChargingStrategyVisible] = useState(false); // 闲时策略配置弹窗

  useEffect(() => {
    if (visible && !isNull(editing)) {
      refresh();
    } else {
      setChargeStrategy(null);
    }
  }, [visible]);

  async function refresh() {
    const currentStrategy = await fetchChargingStrategyById();
    if (!dealResponse(currentStrategy)) {
      setChargeStrategy(currentStrategy);
    }
  }

  function cancelIdle() {
    setIdleChargingStrategyVisible(false);
  }

  return (
    <Modal
      destroyOnClose
      title={title}
      visible={visible}
      width={width}
      maskClosable={false}
      onCancel={onCancel}
      style={{ maxWidth: 1000, top: '5%', position: 'relative' }}
      bodyStyle={{ height: '88vh', flex: 1, overflow: 'auto' }}
      footer={null}
    >
      <div className={styles.chargerStrategy}>
        {/* <TabPane key="Normal" tab={formatMessage({ id: 'app.chargeStrategy.normal' })}> */}
        {/* <ChargingStrategyForm data={chargeStrategy} onSave={onOk} /> */}
        {/* </TabPane> */}
        {/* <TabPane tab={formatMessage({ id: 'app.chargeStrategy.idleHours' })} key="IdleHours"> */}
        <ChargingStrategyForm
          data={chargeStrategy}
          openIdle={setIdleChargingStrategyVisible}
          onSave={onOk}
        />
        {/* </TabPane> */}

        {/* 闲时策略 */}
        <Modal
          width={800}
          footer={null}
          destroyOnClose
          visible={idleChargingStrategyVisible}
          title={formatMessage({ id: 'app.chargeStrategy.idleHoursRules' })}
          onCancel={cancelIdle}
        >
          <IdleChargingStrategy onCancel={cancelIdle} data={chargeStrategy} />
        </Modal>
      </div>
    </Modal>
  );
};
export default memo(ChargingStrategyComponent);
