import React, { memo, useState, useEffect } from 'react';
import { Tabs, Modal, Button, Row, Input, message, InputNumber } from 'antd';
import ChargingStrategyForm from './ChargingStrategyForm';
import IdleChargingStrategy from './IdleChargingStrategy';
import {
  fetchChargingStrategyById,
  saveChargingStrategy,
  fetchDefaultChargingStrategy,
} from '@/services/resourceService';
import { formatMessage, isStrictNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import styles from './chargingStrategy.module.less';
import { dealResponse, isNull, getRandomString } from '@/utils/util';

const { TabPane } = Tabs;

const ChargingStrategyComponent = (props) => {
  const { title, visible, width = '60%' } = props;
  const { onOk, onCancel, editing } = props;
  const [activeKey, setActiveKey] = useState('Normal'); // Tab
  const [strategyId, setStrategyId] = useState(null); // 充电策略id
  const [idleHoursStrategyId, setIdleHoursStrategyId] = useState(null); // 闲时策略id

  const [name, setName] = useState(null); //名称
  const [priority, setPriority] = useState(null); //优先级
  const [code, setCode] = useState(null); //code
  const [isGlobal, setIsGlobal] = useState(null); //是否全局

  const [chargeStrategy, setChargeStrategy] = useState(null); // 当前策略详情 {code:'xx',name:'vvv',Normal:{},IdleHours:{}}
  const [idleChargingStrategyVisible, setIdleChargingStrategyVisible] = useState(false); // 闲时策略配置弹窗

  useEffect(() => {
    if (visible && !isNull(editing)) {
      refresh();
    } else {
      generateAllData({
        strategyValue: {
          Normal: {},
          IdleHours: {},
        },
      });
    }
  }, [visible]);

  async function refresh() {
    const response = await fetchChargingStrategyById({ Id: editing.id });
    if (!dealResponse(response)) {
      generateAllData(response);
    }
  }

  // 默认配置
  async function configDefaultValue() {
    const response = await fetchDefaultChargingStrategy();
    if (!dealResponse(response)) {
      response.id = strategyId;
      response.name = name;
      response.code = code;
      response.isGlobal = isGlobal;
      generateAllData(response);
    }
  }

  function generateAllData(data) {
    setStrategyId(data?.id || null);
    setIdleHoursStrategyId(data?.idleHoursStrategyId || null);
    setName(data?.name || null);
    setPriority(data?.priority || 5);
    setCode(data?.code || `cStrategy_${getRandomString(8)}`);
    setIsGlobal(data?.isGlobal || false);
    setChargeStrategy(data);
  }

  // 锂电池推荐配置
  function configRecommendValue() {
    const currentData = { ...chargeStrategy };
    currentData.strategyValue.Normal.vehicleChargingVoltageMinValue = parseInt(46.5 * 1); // 起始电压
    currentData.strategyValue.Normal.vehicleFullChargingVoltageMaxValue = parseInt(53.5 * 1); // 满充电压
    currentData.strategyValue.Normal.vehicleFullChargingBatteryMaxValue = 99; // 满充电量

    currentData.strategyValue.IdleHours.vehicleChargingVoltageMinValue = parseInt(46.5 * 1); // 起始电压

    setChargeStrategy(currentData);
  }

  function changeStrategy(currentData, type) {
    let newStrategy =
      isNull(chargeStrategy) || Object.keys(chargeStrategy).length === 0
        ? {
            strategyValue: {
              Normal: {},
              IdleHours: {},
            },
          }
        : { ...chargeStrategy };
    const typeData = newStrategy.strategyValue[type];
    newStrategy.strategyValue[type] = { ...typeData, ...currentData };
    setChargeStrategy(newStrategy);
  }

  async function saveChargerStrategy() {
    if (isStrictNull(name)) {
      message.error(formatMessage({ id: 'app.requestor.form.name.required' }));
      return;
    }
    const normalData = chargeStrategy.strategyValue?.Normal;
    const idlelData = chargeStrategy.strategyValue?.IdleHours;
    const params = {
      name,
      priority: priority ?? 5,
      code,
      isGlobal,
      id: strategyId,
      idleHoursStrategyId,
      strategyValue: {
        Normal: {
          chargingStrategyType: 'Normal',
          ...normalData,
        },
        IdleHours: {
          chargingStrategyType: 'IdleHours',
          ...idlelData,
        },
      },
    };
    const response = await saveChargingStrategy(params);
    if (!dealResponse(response, 1)) {
      onOk();
    }
  }

  async function switchTab(key) {
    setActiveKey(key);
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
      bodyStyle={{ height: '80vh', flex: 1, overflow: 'auto' }}
      footer={[
        <Button key="defaultValue" onClick={configDefaultValue} style={{ marginLeft: '15px' }}>
          <FormattedMessage id="app.chargeStrategy.defaultConfig" />
        </Button>,
        <Button key="recommendValue" onClick={configRecommendValue} style={{ marginLeft: '15px' }}>
          <FormattedMessage id="app.chargeStrategy.recommendedConfigOfLithiumIron" />
        </Button>,
        <Button
          type="primary"
          key="saveValue"
          onClick={saveChargerStrategy}
          style={{ marginLeft: '15px' }}
        >
          <FormattedMessage id="app.button.save" />
        </Button>,
      ]}
    >
      <div className={styles.chargerStrategy}>
        {/* 名称*/}
        <Row style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
            <div>
              <span style={{ color: 'red' }}>*</span> {formatMessage({ id: 'app.common.name' })} :
            </div>
            <div style={{ marginLeft: 15 }}>
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
            <div>{formatMessage({ id: 'app.common.priority' })} :</div>
            <div style={{ marginLeft: 15 }}>
              <InputNumber
                value={priority}
                onChange={(e) => {
                  setPriority(e);
                }}
              />
            </div>
          </div>
        </Row>

        <Tabs animated activeKey={activeKey} onChange={switchTab}>
          <TabPane key="Normal" tab={formatMessage({ id: 'app.chargeStrategy.normal' })}>
            <ChargingStrategyForm
              type="Normal"
              data={chargeStrategy?.strategyValue?.Normal ?? {}}
              onChangeStrategy={changeStrategy}
            />
          </TabPane>
          <TabPane tab={formatMessage({ id: 'app.chargeStrategy.idleHours' })} key="IdleHours">
            <ChargingStrategyForm
              type="IdleHours"
              data={chargeStrategy?.strategyValue?.IdleHours ?? {}}
              onChangeStrategy={changeStrategy}
              openIdle={setIdleChargingStrategyVisible}
            />
          </TabPane>
        </Tabs>

        {/* 闲时策略 */}
        <Modal
          width={800}
          footer={null}
          destroyOnClose
          visible={idleChargingStrategyVisible}
          title={formatMessage({ id: 'app.chargeStrategy.idleHoursRules' })}
          onCancel={cancelIdle}
        >
          <IdleChargingStrategy
            onCancel={cancelIdle}
            onSave={setIdleHoursStrategyId}
            idleHoursStrategyId={idleHoursStrategyId}
            chargeStrategyId={strategyId}
          />
        </Modal>
      </div>
    </Modal>
  );
};
export default memo(ChargingStrategyComponent);
