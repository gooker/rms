import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Input, Card, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { formatMessage, FormattedMessage } from '@/utils/Lang';
import BatterStrategy from './BatterStrategy/BatterStrategy';
import { hasPermission, Permission } from '@/utils/Permission';
import styles from './chargingStrategy.module.less';

const PanelHeight = 400; // 表单行的高度
const ChargingStrategyForm = (props) => {
  const { type, data } = props;

  const [paramsId, setParamsId] = useState(null);
  const [startBattery, setStartBattery] = useState(0); //起始电量
  const [startVoltage, setStartVoltage] = useState(35); // 起始电压
  const [endBattery, setEndBattery] = useState(0); //终止电量
  const [endVoltage, setEndVoltage] = useState(35); //终止电压
  const [fullBattery, setFullBattery] = useState(0); //满充电量
  const [fullVoltage, setFullVoltage] = useState(35); //满充电压
  const [lowestBattery, setLowestBattery] = useState(0); //最低电量
  const [lowestVoltage, setLowestVoltage] = useState(35); //最低电压
  const [lowBatteryWarning, setLowBatteryWarning] = useState(0); //低电量报警
  const [replaceablePower, setReplaceablePower] = useState(0); //可换充电量
  const [fullChargingDuration, setFullChargingDuration] = useState(null); //两次满充时间间隔
  const [normalChargingMaxTimes, setNormalChargingMaxTimes] = useState(null); //普通充电最大连续次数
  const [minChargeTime, setMinChargeTime] = useState(null); //最短充电时间
  const [cancelChargeAndReceiveTask, setCancelChargeAndReceiveTask] = useState(null); //最短充电时间

  useEffect(() => {
    setParamsId(data?.id || null);
    setStartBattery(data?.robotChargingBatteryMinValue || 0);
    setStartVoltage(data ? parseFloat(data.robotChargingVoltageMinValue / 1000) : 35);
    setEndBattery(data?.robotChargingBatteryMaxValue || 0);
    setEndVoltage(data ? parseFloat(data.robotChargingVoltageMaxValue / 1000) : 35);
    setFullBattery(data?.robotFullChargingBatteryMaxValue || 0);
    setFullVoltage(data ? parseFloat(data.robotFullChargingVoltageMaxValue / 1000) : 35);
    setLowestBattery(data?.robotTaskAcceptableBatteryMinValue || 0);
    setLowestVoltage(data ? parseFloat(data.robotTaskAcceptableVoltageMinValue / 1000) : 35);
    setLowBatteryWarning(data?.robotChargingBatteryWarningValue || 0);
    setReplaceablePower(data?.robotChargingBatteryRunnableValue);
    setFullChargingDuration(data?.robotFullChargingDuration);
    setNormalChargingMaxTimes(data?.robotNormalChargingMaxTimes);
    setMinChargeTime(data?.agvMinChargingTime);
    setCancelChargeAndReceiveTask(data?.robotCancelChargerAndReceiveTaskBattery || 0);
  }, [data]);

  function configDefaultValue() {}

  function configRecommendValue() {}

  function saveChargerStrategy() {}

  return (
    <div>
      {/* 第一行 */}
      <Card
        title={formatMessage({ id: 'app.chargeStrategy.normalCharge' })}
        bordered={false}
        extra={
          type !== 'Normal' &&
          hasPermission('/system/chargerManageMents/idle/configIdle') && (
            <Button
              onClick={() => {
                const { openFreeRules } = this.props;
                openFreeRules && openFreeRules();
              }}
            >
              <FormattedMessage id="app.chargeStrategy.idleHoursRules" />
            </Button>
          )
        }
      >
        <div style={{ height: PanelHeight, display: 'flex' }}>
          <div className={styles.panelCard} style={{ marginRight: 5 }}>
            <Row gutter={30} style={{ width: '100%', height: '100%' }}>
              {/* 起始电量 && 起始电压 */}
              <Col span={12}>
                <BatterStrategy
                  electricity={{
                    title: formatMessage({ id: 'app.chargeStrategy.initialPower' }),
                    tip: formatMessage({
                      id: 'app.chargeStrategy.initialPowerTip',
                    }),
                    value: startBattery,
                    onChange: setStartBattery,
                  }}
                  voltage={{
                    title: formatMessage({ id: 'app.chargeStrategy.startingVoltage' }),
                    tip: formatMessage({
                      id: 'app.chargeStrategy.startingVoltageTip',
                    }),
                    value: startVoltage,
                    onChange: setStartVoltage,
                  }}
                />
              </Col>
              {/* 终止电量 && 终止电压 */}
              <Col span={12}>
                <BatterStrategy
                  electricity={{
                    title: formatMessage({ id: 'app.chargeStrategy.terminationOfPower' }),
                    tip: formatMessage({
                      id: 'app.chargeStrategy.terminationOfPowerTip',
                    }),
                    value: endBattery,
                    onChange: setEndBattery,
                  }}
                  voltage={{
                    title: formatMessage({ id: 'app.chargeStrategy.terminationVoltage' }),
                    tip: formatMessage({
                      id: 'app.chargeStrategy.terminationVoltageTip',
                    }),
                    value: endVoltage,
                    onChange: setEndVoltage,
                  }}
                />
              </Col>
            </Row>
          </div>
          <div className={styles.panelCard} style={{ marginLeft: 5 }}>
            <Row gutter={30} style={{ width: '100%', height: '100%' }}>
              <Col span={12}>
                {/* 可换充电量 */}
                <BatterStrategy
                  electricity={{
                    title: formatMessage({ id: 'app.chargeStrategy.replaceablePower' }),
                    tip: formatMessage({
                      id: 'app.chargeStrategy.replaceablePowerTip',
                    }),
                    value: replaceablePower,
                    onChange: setReplaceablePower,
                  }}
                />
              </Col>
              <Col span={12}>
                {/* 低电量报警 */}
                {type === 'Normal' ? (
                  <BatterStrategy
                    electricity={{
                      title: formatMessage({ id: 'app.chargeStrategy.lowPowerWarning' }),
                      tip: formatMessage({
                        id: 'app.chargeStrategy.lowPowerWarningTip',
                      }),
                      value: lowBatteryWarning,
                      onChange: setLowBatteryWarning,
                    }}
                  />
                ) : null}
              </Col>
            </Row>
          </div>
        </div>
      </Card>

      {/* 第二行 */}
      {type === 'Normal' ? (
        <div style={{ display: 'flex' }}>
          <div className={styles.panelCardNoBoder} style={{ marginRight: 5 }}>
            <Card title={formatMessage({ id: 'app.chargeStrategy.fullCharge' })} bordered={false}>
              <Row gutter={30} style={{ width: '100%', height: PanelHeight }}>
                <Col span={12}>
                  {/* 满充电量 && 满充电压 */}
                  <BatterStrategy
                    electricity={{
                      title: formatMessage({ id: 'app.chargeStrategy.fullChargePower' }),
                      tip: formatMessage({
                        id: 'app.chargeStrategy.fullChargePowerTip',
                      }),
                      value: fullBattery,
                      onChange: setFullBattery,
                    }}
                    voltage={{
                      title: formatMessage({ id: 'app.chargeStrategy.fullChargeVoltage' }),
                      tip: formatMessage({
                        id: 'app.chargeStrategy.fullChargeVoltageTip',
                      }),
                      value: fullVoltage,
                      onChange: setFullVoltage,
                    }}
                  />
                </Col>
                <Col span={12}>
                  {/* 两次满充时间间隔 */}
                  <div className={styles.strategyInput}>
                    <Tooltip
                      placement="top"
                      title={formatMessage({
                        id: 'app.chargeStrategy.intervalBetween2FullChargesTip',
                      })}
                    >
                      <FormattedMessage id="app.chargeStrategy.intervalBetween2FullCharges" />{' '}
                      <InfoCircleOutlined />
                    </Tooltip>
                    <Input
                      value={fullChargingDuration}
                      style={{ marginTop: 5 }}
                      addonAfter={formatMessage({ id: 'app.common.day' })}
                      onChange={(ev) => {
                        setFullChargingDuration(ev.target.value);
                      }}
                    />
                  </div>
                  {/* 普通充电最大连续次数 */}
                  <div className={styles.strategyInput} style={{ marginTop: 20 }}>
                    <Tooltip
                      placement="top"
                      title={formatMessage({
                        id: 'app.chargeStrategy.maximumConsecutiveTimesOfNormalChargingTip',
                      })}
                    >
                      <FormattedMessage id="app.chargeStrategy.maximumConsecutiveTimesOfNormalCharging" />{' '}
                      <InfoCircleOutlined />
                    </Tooltip>
                    <Input
                      style={{ marginTop: 5 }}
                      value={normalChargingMaxTimes}
                      addonAfter={formatMessage({ id: 'app.common.day' })}
                      onChange={(ev) => {
                        setNormalChargingMaxTimes(ev.target.value);
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </Card>
          </div>
          <div className={styles.panelCardNoBoder} style={{ marginLeft: 5 }}>
            <Card
              title={formatMessage({ id: 'app.chargeStrategy.receiveTaskEnabled' })}
              bordered={false}
            >
              <Row gutter={30} style={{ width: '100%', height: PanelHeight }}>
                <Col span={12}>
                  {/* 最低电量 && 最低电压 */}
                  <BatterStrategy
                    electricity={{
                      title: formatMessage({ id: 'app.chargeStrategy.minimumPower' }),
                      tip: formatMessage({
                        id: 'app.chargeStrategy.minimumPowerTip',
                      }),
                      value: lowestBattery,
                      onChange: setLowestBattery,
                    }}
                    voltage={{
                      title: formatMessage({ id: 'app.chargeStrategy.minimumVoltage' }),
                      tip: formatMessage({
                        id: 'app.chargeStrategy.minimumVoltageTip',
                      }),
                      value: lowestVoltage,
                      onChange: setLowestVoltage,
                    }}
                  />
                </Col>
                <Col span={12}>
                  {/* 最短充电时间 */}
                  <div className={styles.strategyInput}>
                    <Tooltip
                      placement="top"
                      title={formatMessage({
                        id: 'app.chargeStrategy.minimumChargingTimeTip',
                      })}
                    >
                      <FormattedMessage id="app.chargeStrategy.minimumChargingTime" />{' '}
                      <InfoCircleOutlined />
                    </Tooltip>
                    <Input
                      value={minChargeTime}
                      style={{ marginTop: 5 }}
                      addonAfter={formatMessage({ id: 'app.common.day' })}
                      onChange={(ev) => {
                        setMinChargeTime(ev.target.value);
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </Card>
          </div>
        </div>
      ) : null}

      {/* 第三行 */}
      {type === 'Normal' ? (
        <div style={{ display: 'flex' }}>
          <div className={styles.panelCardNoBoder} style={{ marginRight: 5 }}>
            <Card
              title={formatMessage({ id: 'app.chargeStrategy.cancelChargeAndReceiveTask' })}
              bordered={false}
            >
              <Row gutter={30} style={{ width: '100%', height: PanelHeight }}>
                <Col span={12}>
                  <BatterStrategy
                    electricity={{
                      title: formatMessage({ id: 'app.chargeStrategy.minimumPower' }),
                      tip: formatMessage({
                        id: 'app.chargeStrategy.cancelChargerAndReceiveTaskTip',
                      }),
                      value: cancelChargeAndReceiveTask,
                      onChange: setCancelChargeAndReceiveTask,
                    }}
                  />
                </Col>
                <Col span={12} />
              </Row>
            </Card>
          </div>
          <div className={styles.panelCardNoBoder} style={{ marginLeft: 5 }} />
        </div>
      ) : null}

      {/* 底部工具栏 */}
      <div className={styles.footer}>
        {/* 默认配置 */}
        <Permission id="/system/chargerManageMents/submit">
          <Button onClick={configDefaultValue} style={{ marginLeft: '15px' }}>
            <FormattedMessage id="app.chargeStrategy.defaultConfig" />
          </Button>
        </Permission>

        {/* 推荐配置 */}
        <Permission id="/system/chargerManageMents/submit">
          <Button onClick={configRecommendValue} style={{ marginLeft: '15px' }}>
            <FormattedMessage id="app.chargeStrategy.recommendedConfigOfLithiumIron" />
          </Button>
        </Permission>

        {/* 保存配置 */}
        <Permission id="/system/chargerManageMents/submit">
          <Button type="primary" onClick={saveChargerStrategy} style={{ marginLeft: '15px' }}>
            <FormattedMessage id="app.button.save" />
          </Button>
        </Permission>
      </div>
    </div>
  );
};
//充电策略
export default ChargingStrategyForm;
