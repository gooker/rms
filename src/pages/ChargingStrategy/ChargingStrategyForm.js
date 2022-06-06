import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Input, message, Row, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { getDefaultChargingStrategy, saveChargeStrategy } from '@/services/commonService';
import { dealResponse, formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import BatterStrategy from './BatterStrategy/BatterStrategy';
import { Permission } from '@/utils/Permission';
import styles from './chargingStrategy.module.less';

const PanelHeight = 400; // 表单行的高度
const ChargingStrategyForm = (props) => {
  const { vehicleType, type, data, openIdle } = props;

  const [strategyId, setStrategyId] = useState(null);
  const [vehicleChargingBatteryMinValue, setChargingBatteryMinValue] = useState(0); //起始电量
  const [vehicleChargingVoltageMinValue, setChargingVoltageMinValue] = useState(35); // 起始电压
  const [vehicleChargingBatteryMaxValue, setChargingBatteryMaxValue] = useState(0); //终止电量
  const [vehicleChargingVoltageMaxValue, setChargingVoltageMaxValue] = useState(35); //终止电压
  const [vehicleFullChargingBatteryMaxValue, setFullChargingBatteryMaxValue] = useState(0); //满充电量
  const [vehicleFullChargingVoltageMaxValue, setFullChargingVoltageMaxValue] = useState(35); //满充电压
  const [vehicleTaskAcceptableBatteryMinValue, setTaskAcceptableBatteryMinValue] = useState(0); //最低电量
  const [vehicleTaskAcceptableVoltageMinValue, setTaskAcceptableVoltageMinValue] = useState(35); //最低电压
  const [vehicleChargingBatteryWarningValue, setChargingBatteryWarningValue] = useState(0); //低电量报警
  const [vehicleChargingBatteryRunnableValue, setChargingBatteryRunnableValue] = useState(0); //可换充电量
  const [vehicleFullChargingDuration, setFullChargingDuration] = useState(null); //两次满充时间间隔
  const [vehicleNormalChargingMaxTimes, setNormalChargingMaxTimes] = useState(null); //普通充电最大连续次数
  const [vehicleMinChargingTime, setMinChargingTime] = useState(null); //最短充电时间
  const [vehicleCancelChargerAndReceiveTaskBattery, setCancelChargerAndReceiveTaskBattery] =
    useState(null); //最短充电时间

  useEffect(() => {
    refreshState(data);
  }, [data]);

  // 默认配置
  async function configDefaultValue() {
    const response = await getDefaultChargingStrategy(vehicleType);
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
    setChargingBatteryMinValue(data?.vehicleChargingBatteryMinValue || 0);
    setChargingVoltageMinValue(data ? parseFloat(data.vehicleChargingVoltageMinValue / 1000) : 35);
    setChargingBatteryMaxValue(data?.vehicleChargingBatteryMaxValue || 0);
    setChargingVoltageMaxValue(data ? parseFloat(data.vehicleChargingVoltageMaxValue / 1000) : 35);
    setFullChargingBatteryMaxValue(data?.vehicleFullChargingBatteryMaxValue || 0);
    setFullChargingVoltageMaxValue(
      data ? parseFloat(data.vehicleFullChargingVoltageMaxValue / 1000) : 35,
    );
    setTaskAcceptableBatteryMinValue(data?.vehicleTaskAcceptableBatteryMinValue || 0);
    setTaskAcceptableVoltageMinValue(
      data ? parseFloat(data.vehicleTaskAcceptableVoltageMinValue / 1000) : 35,
    );
    setChargingBatteryWarningValue(data?.vehicleChargingBatteryWarningValue || 0);
    setChargingBatteryRunnableValue(data?.vehicleChargingBatteryRunnableValue);
    setFullChargingDuration(data?.vehicleFullChargingDuration);
    setNormalChargingMaxTimes(data?.vehicleNormalChargingMaxTimes);
    setMinChargingTime(data?.vehicleMinChargingTime);
    setCancelChargerAndReceiveTaskBattery(data?.vehicleCancelChargerAndReceiveTaskBattery || 0);
  }

  async function saveChargerStrategy() {
    const sectionId = window.localStorage.getItem('sectionId');
    const params = {
      type,
      sectionId,
      id: strategyId,
      vehicleMinChargingTime,
      vehicleFullChargingDuration,
      vehicleNormalChargingMaxTimes,
      vehicleChargingBatteryMinValue,
      vehicleChargingBatteryMaxValue,
      vehicleChargingBatteryWarningValue,
      vehicleFullChargingBatteryMaxValue,
      vehicleChargingBatteryRunnableValue,
      vehicleTaskAcceptableBatteryMinValue,
      vehicleCancelChargerAndReceiveTaskBattery,
      vehicleChargingVoltageMinValue: parseInt(vehicleChargingVoltageMinValue * 1000),
      vehicleChargingVoltageMaxValue: parseInt(vehicleChargingVoltageMaxValue * 1000),
      vehicleFullChargingVoltageMaxValue: parseInt(vehicleFullChargingVoltageMaxValue * 1000),
      vehicleTaskAcceptableVoltageMinValue: parseInt(vehicleTaskAcceptableVoltageMinValue * 1000),
    };

    const response = await saveChargeStrategy(vehicleType, params);
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
          type !== 'Normal' && (
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
                    value: vehicleChargingBatteryMinValue,
                    onChange: setChargingBatteryMinValue,
                  }}
                  voltage={{
                    title: formatMessage({ id: 'app.chargeStrategy.startingVoltage' }),
                    tip: formatMessage({
                      id: 'app.chargeStrategy.startingVoltageTip',
                    }),
                    value: vehicleChargingVoltageMinValue,
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
                    value: vehicleChargingBatteryMaxValue,
                    onChange: setChargingBatteryMaxValue,
                  }}
                  voltage={{
                    title: formatMessage({ id: 'app.chargeStrategy.terminationVoltage' }),
                    tip: formatMessage({
                      id: 'app.chargeStrategy.terminationVoltageTip',
                    }),
                    value: vehicleChargingVoltageMaxValue,
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
                    value: vehicleChargingBatteryRunnableValue,
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
                      value: vehicleChargingBatteryWarningValue,
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
                      value: vehicleFullChargingBatteryMaxValue,
                      onChange: setFullChargingBatteryMaxValue,
                    }}
                    voltage={{
                      title: formatMessage({ id: 'app.chargeStrategy.fullChargeVoltage' }),
                      tip: formatMessage({
                        id: 'app.chargeStrategy.fullChargeVoltageTip',
                      }),
                      value: vehicleFullChargingVoltageMaxValue,
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
                      value={vehicleFullChargingDuration}
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
                      value={vehicleNormalChargingMaxTimes}
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
                      value: vehicleTaskAcceptableBatteryMinValue,
                      onChange: setTaskAcceptableBatteryMinValue,
                    }}
                    voltage={{
                      title: formatMessage({ id: 'app.chargeStrategy.minimumVoltage' }),
                      tip: formatMessage({
                        id: 'app.chargeStrategy.minimumVoltageTip',
                      }),
                      value: vehicleTaskAcceptableVoltageMinValue,
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
                      value={vehicleMinChargingTime}
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
                      value: vehicleCancelChargerAndReceiveTaskBattery,
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
