import React from 'react';
import { Row, Col, Button, Input, Card, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import BatterStrategy from './BatterStrategy/BatterStrategy';
import styles from './chargingStrategy.module.less';

const PanelHeight = 300; // 表单行的高度
const ChargingStrategyForm = (props) => {
  const { type, data, onChangeStrategy, openIdle } = props;

  function handleChanged(value, key) {
    let newData = { ...data };
    newData[key] = value;

    onChangeStrategy(newData, type);
  }

  return (
    <>
      <div>
        {/* 标准 */}
        <div className={styles.content}>
          {/* 第一行 */}
          <Card
            title={formatMessage({ id: 'app.chargeStrategy.normalCharge' })}
            bordered={false}
            extra={
              type === 'IdleHours' && (
                <Button
                  style={{ marginLeft: 15 }}
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
                        value: data?.vehicleChargingBatteryMinValue || 0,
                        onChange: (v) => {
                          handleChanged(v, 'vehicleChargingBatteryMinValue');
                        },
                      }}
                      voltage={{
                        title: formatMessage({ id: 'app.chargeStrategy.startingVoltage' }),
                        tip: formatMessage({
                          id: 'app.chargeStrategy.startingVoltageTip',
                        }),
                        value: data ? parseFloat(data.vehicleChargingVoltageMinValue / 1) : 35,
                        onChange: (v) => {
                          const curentData = parseInt(v * 1);
                          handleChanged(curentData, 'vehicleChargingVoltageMinValue');
                        },
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
                        value: data?.vehicleChargingBatteryMaxValue || 0,
                        onChange: (v) => {
                          handleChanged(v, 'vehicleChargingBatteryMaxValue');
                        },
                      }}
                      voltage={{
                        title: formatMessage({ id: 'app.chargeStrategy.terminationVoltage' }),
                        tip: formatMessage({
                          id: 'app.chargeStrategy.terminationVoltageTip',
                        }),
                        value: data ? parseFloat(data.vehicleChargingVoltageMaxValue / 1) : 35,
                        onChange: (v) => {
                          const value = parseInt(v * 1);
                          handleChanged(value, 'vehicleChargingVoltageMaxValue');
                        },
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
                        value: data?.vehicleChargingBatteryRunnableValue || 0,
                        onChange: (v) => {
                          handleChanged(v, 'vehicleChargingBatteryRunnableValue');
                        },
                      }}
                    />
                  </Col>
                  {type !== 'IdleHours' && (
                    <Col span={12}>
                      {/* 低电量报警 */}
                      <BatterStrategy
                        electricity={{
                          title: formatMessage({ id: 'app.chargeStrategy.lowPowerWarning' }),
                          tip: formatMessage({
                            id: 'app.chargeStrategy.lowPowerWarningTip',
                          }),
                          value: data?.vehicleChargingBatteryWarningValue || 0,
                          onChange: (v) => {
                            handleChanged(v, 'vehicleChargingBatteryWarningValue');
                          },
                        }}
                      />
                    </Col>
                  )}
                </Row>
              </div>
            </div>
          </Card>

          {/* 第二行 */}
          {type === 'Normal' && (
            <>
              <div style={{ display: 'flex' }}>
                <div className={styles.panelCardNoBoder} style={{ marginRight: 5 }}>
                  <Card
                    title={formatMessage({ id: 'app.chargeStrategy.fullCharge' })}
                    bordered={false}
                  >
                    <Row gutter={30} style={{ width: '100%', height: PanelHeight }}>
                      <Col span={12}>
                        {/* 满充电量 && 满充电压 */}
                        <BatterStrategy
                          electricity={{
                            title: formatMessage({ id: 'app.chargeStrategy.fullChargePower' }),
                            tip: formatMessage({
                              id: 'app.chargeStrategy.fullChargePowerTip',
                            }),
                            value: data?.vehicleFullChargingBatteryMaxValue || 0,
                            onChange: (v) => {
                              handleChanged(v, 'vehicleFullChargingBatteryMaxValue');
                            },
                          }}
                          voltage={{
                            title: formatMessage({ id: 'app.chargeStrategy.fullChargeVoltage' }),
                            tip: formatMessage({
                              id: 'app.chargeStrategy.fullChargeVoltageTip',
                            }),
                            value: data
                              ? parseFloat(data.vehicleFullChargingVoltageMaxValue / 1)
                              : 35,
                            onChange: (v) => {
                              const value = parseInt(v * 1);
                              handleChanged(value, 'vehicleFullChargingVoltageMaxValue');
                            },
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
                            value={data?.vehicleFullChargingDuration}
                            style={{ marginTop: 5 }}
                            addonAfter={formatMessage({ id: 'app.time.day' })}
                            onChange={(ev) => {
                              handleChanged(ev.target.value, 'vehicleFullChargingDuration');
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
                            value={data?.vehicleNormalChargingMaxTimes}
                            addonAfter={formatMessage({ id: 'app.common.times' })}
                            onChange={(ev) => {
                              handleChanged(ev.target.value, 'vehicleNormalChargingMaxTimes');
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
                            value: data?.vehicleTaskAcceptableBatteryMinValue || 0,
                            onChange: (v) => {
                              handleChanged(v, 'vehicleTaskAcceptableBatteryMinValue');
                            },
                          }}
                          voltage={{
                            title: formatMessage({ id: 'app.chargeStrategy.minimumVoltage' }),
                            tip: formatMessage({
                              id: 'app.chargeStrategy.minimumVoltageTip',
                            }),
                            value: data
                              ? parseFloat(data.vehicleTaskAcceptableVoltageMinValue / 1)
                              : 35,
                            onChange: (v) => {
                              const value = parseInt(v * 1);
                              handleChanged(value, 'vehicleTaskAcceptableVoltageMinValue');
                            },
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
                            value={data?.vehicleMinChargingTime}
                            style={{ marginTop: 5 }}
                            addonAfter={formatMessage({ id: 'app.time.seconds' })}
                            onChange={(ev) => {
                              handleChanged(ev.target.value, 'vehicleMinChargingTime');
                            }}
                          />
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </div>
              </div>

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
                            value: data?.vehicleCancelChargerAndReceiveTaskBattery || 0,
                            onChange: (v) => {
                              handleChanged(v, 'vehicleCancelChargerAndReceiveTaskBattery');
                            },
                          }}
                        />
                      </Col>
                      <Col span={12} />
                    </Row>
                  </Card>
                </div>
                <div className={styles.panelCardNoBoder} style={{ marginLeft: 5 }} />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
export default ChargingStrategyForm;
