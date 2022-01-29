import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Input, Card, Tooltip, message } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { getDefaultChargingStrategy, saveChargeStrategy } from '@/services/api';
import { formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import BatterStrategy from './BatterStrategy/BatterStrategy';
import { hasPermission, Permission } from '@/utils/Permission';
import styles from './chargingStrategy.module.less';
import { dealResponse } from '@/utils/util';

const PanelHeight = 400; // 表单行的高度
const ChargingStrategyForm = (props) => {
  const { agvType, type, data, openIdle } = props;

  const [strategyId, setStrategyId] = useState(null);
  const [robotChargingBatteryMinValue, setChargingBatteryMinValue] = useState(0); //起始电量
  const [robotChargingVoltageMinValue, setChargingVoltageMinValue] = useState(35); // 起始电压
  const [robotChargingBatteryMaxValue, setChargingBatteryMaxValue] = useState(0); //终止电量
  const [robotChargingVoltageMaxValue, setChargingVoltageMaxValue] = useState(35); //终止电压
  const [robotFullChargingBatteryMaxValue, setFullChargingBatteryMaxValue] = useState(0); //满充电量
  const [robotFullChargingVoltageMaxValue, setFullChargingVoltageMaxValue] = useState(35); //满充电压
  const [robotTaskAcceptableBatteryMinValue, setTaskAcceptableBatteryMinValue] = useState(0); //最低电量
  const [robotTaskAcceptableVoltageMinValue, setTaskAcceptableVoltageMinValue] = useState(35); //最低电压
  const [robotChargingBatteryWarningValue, setChargingBatteryWarningValue] = useState(0); //低电量报警
  const [robotChargingBatteryRunnableValue, setChargingBatteryRunnableValue] = useState(0); //可换充电量
  const [robotFullChargingDuration, setFullChargingDuration] = useState(null); //两次满充时间间隔
  const [robotNormalChargingMaxTimes, setNormalChargingMaxTimes] = useState(null); //普通充电最大连续次数
  const [agvMinChargingTime, setMinChargingTime] = useState(null); //最短充电时间
  const [robotCancelChargerAndReceiveTaskBattery, setCancelChargerAndReceiveTaskBattery] =
    useState(null); //最短充电时间

  useEffect(() => {
    refreshState(data);
  }, [data]);

  // 默认配置
  async function configDefaultValue() {
    const response = await getDefaultChargingStrategy(agvType);
    if (!dealResponse(response)) {
      response.id = strategyId;
      refreshState(response);
    } else {
      message.error(formatMessage({ id: 'app.chargeStrategy.defaultConfig.fetch.fail' }));
    }
  }

  // 锂电池推荐配置
  function configRecommendValue() {
    setChargingVoltageMinValue(46.5); // 起始电压
    setFullChargingVoltageMaxValue(53.5); // 满充电压
    setFullChargingBatteryMaxValue(99); // 满充电量
  }

  function refreshState(data) {
    setStrategyId(data?.id || null);
    setChargingBatteryMinValue(data?.robotChargingBatteryMinValue || 0);
    setChargingVoltageMinValue(data ? parseFloat(data.robotChargingVoltageMinValue / 1000) : 35);
    setChargingBatteryMaxValue(data?.robotChargingBatteryMaxValue || 0);
    setChargingVoltageMaxValue(data ? parseFloat(data.robotChargingVoltageMaxValue / 1000) : 35);
    setFullChargingBatteryMaxValue(data?.robotFullChargingBatteryMaxValue || 0);
    setFullChargingVoltageMaxValue(
      data ? parseFloat(data.robotFullChargingVoltageMaxValue / 1000) : 35,
    );
    setTaskAcceptableBatteryMinValue(data?.robotTaskAcceptableBatteryMinValue || 0);
    setTaskAcceptableVoltageMinValue(
      data ? parseFloat(data.robotTaskAcceptableVoltageMinValue / 1000) : 35,
    );
    setChargingBatteryWarningValue(data?.robotChargingBatteryWarningValue || 0);
    setChargingBatteryRunnableValue(data?.robotChargingBatteryRunnableValue);
    setFullChargingDuration(data?.robotFullChargingDuration);
    setNormalChargingMaxTimes(data?.robotNormalChargingMaxTimes);
    setMinChargingTime(data?.agvMinChargingTime);
    setCancelChargerAndReceiveTaskBattery(data?.robotCancelChargerAndReceiveTaskBattery || 0);
  }

  async function saveChargerStrategy() {
    const sectionId = window.localStorage.getItem('sectionId');
    const params = {
      type,
      sectionId,
      id: strategyId,
      agvMinChargingTime,
      robotFullChargingDuration,
      robotNormalChargingMaxTimes,
      robotChargingBatteryMinValue,
      robotChargingBatteryMaxValue,
      robotChargingBatteryWarningValue,
      robotFullChargingBatteryMaxValue,
      robotChargingBatteryRunnableValue,
      robotTaskAcceptableBatteryMinValue,
      robotCancelChargerAndReceiveTaskBattery,
      robotChargingVoltageMinValue: parseInt(robotChargingVoltageMinValue * 1000),
      robotChargingVoltageMaxValue: parseInt(robotChargingVoltageMaxValue * 1000),
      robotFullChargingVoltageMaxValue: parseInt(robotFullChargingVoltageMaxValue * 1000),
      robotTaskAcceptableVoltageMinValue: parseInt(robotTaskAcceptableVoltageMinValue * 1000),
    };

    const response = await saveChargeStrategy(agvType, params);
    if (dealResponse(response)) {
      message.error(formatMessage({ id: 'app.chargeStrategy.save.failed' }));
    } else {
      message.success(formatMessage({ id: 'app.chargeStrategy.save.success' }));
    }
  }

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
                openIdle(true);
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
                    value: robotChargingBatteryMinValue,
                    onChange: setChargingBatteryMinValue,
                  }}
                  voltage={{
                    title: formatMessage({ id: 'app.chargeStrategy.startingVoltage' }),
                    tip: formatMessage({
                      id: 'app.chargeStrategy.startingVoltageTip',
                    }),
                    value: robotChargingVoltageMinValue,
                    onChange: setChargingVoltageMinValue,
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
                    value: robotChargingBatteryMaxValue,
                    onChange: setChargingBatteryMaxValue,
                  }}
                  voltage={{
                    title: formatMessage({ id: 'app.chargeStrategy.terminationVoltage' }),
                    tip: formatMessage({
                      id: 'app.chargeStrategy.terminationVoltageTip',
                    }),
                    value: robotChargingVoltageMaxValue,
                    onChange: setChargingVoltageMaxValue,
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
                    title: formatMessage({
                      id: 'app.chargeStrategy.replaceablePower',
                    }),
                    tip: formatMessage({
                      id: 'app.chargeStrategy.replaceablePowerTip',
                    }),
                    value: robotChargingBatteryRunnableValue,
                    onChange: setChargingBatteryRunnableValue,
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
                      value: robotChargingBatteryWarningValue,
                      onChange: setChargingBatteryWarningValue,
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
                      value: robotFullChargingBatteryMaxValue,
                      onChange: setFullChargingBatteryMaxValue,
                    }}
                    voltage={{
                      title: formatMessage({ id: 'app.chargeStrategy.fullChargeVoltage' }),
                      tip: formatMessage({
                        id: 'app.chargeStrategy.fullChargeVoltageTip',
                      }),
                      value: robotFullChargingVoltageMaxValue,
                      onChange: setFullChargingVoltageMaxValue,
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
                      value={robotFullChargingDuration}
                      style={{ marginTop: 5 }}
                      addonAfter={formatMessage({ id: 'app.time.day' })}
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
                      value={robotNormalChargingMaxTimes}
                      addonAfter={formatMessage({ id: 'app.common.times' })}
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
                      value: robotTaskAcceptableBatteryMinValue,
                      onChange: setTaskAcceptableBatteryMinValue,
                    }}
                    voltage={{
                      title: formatMessage({ id: 'app.chargeStrategy.minimumVoltage' }),
                      tip: formatMessage({
                        id: 'app.chargeStrategy.minimumVoltageTip',
                      }),
                      value: robotTaskAcceptableVoltageMinValue,
                      onChange: setTaskAcceptableVoltageMinValue,
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
                      value={agvMinChargingTime}
                      style={{ marginTop: 5 }}
                      addonAfter={formatMessage({ id: 'app.time.seconds' })}
                      onChange={(ev) => {
                        setMinChargingTime(ev.target.value);
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
              title={formatMessage({
                id: 'app.chargeStrategy.cancelChargeAndReceiveTask',
              })}
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
                      value: robotCancelChargerAndReceiveTaskBattery,
                      onChange: setCancelChargerAndReceiveTaskBattery,
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
export default ChargingStrategyForm;
