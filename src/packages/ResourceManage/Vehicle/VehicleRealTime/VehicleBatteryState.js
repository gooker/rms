import React, { memo } from 'react';
import { Col, Form, Row } from 'antd';
import { getSuffix, isStrictNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import Battery from '@/components/Battery';
import Dictionary from '@/utils/Dictionary';
import styles from './index.module.less';

const { red, green, orange } = Dictionary().color;

const VehicleBatteryState = (props) => {
  const { data } = props;

  function renderVoltage(value) {
    if (isStrictNull(value)) return null;
    let batteryVoltageColor;
    if (value > 47) {
      batteryVoltageColor = green;
    } else if (value > 45) {
      batteryVoltageColor = orange;
    } else {
      batteryVoltageColor = red;
    }
    return getSuffix(value, 'V', {
      style: { color: batteryVoltageColor },
    });
  }

  function renderBatteryTemperature(batteryTemperature) {
    if (isStrictNull(batteryTemperature)) return null;

    let batteryTemperatureOneColor = green;
    if (parseInt(batteryTemperature) >= 48) {
      batteryTemperatureOneColor = red;
    } else if (parseInt(batteryTemperature) >= 40) {
      batteryTemperatureOneColor = orange;
    }
    return getSuffix(batteryTemperature, '°', {
      style: { color: batteryTemperatureOneColor },
    });
  }

  function renderBatteryCurrent(current) {
    if (isStrictNull(current)) return null;
    return getSuffix(current / 10, 'A');
  }

  function renderBatteryLifePercentage(percentage) {
    if (isStrictNull(percentage)) return null;
    return getSuffix(percentage, '%');
  }

  function renderBatteryCapacity(capacity) {
    if (isStrictNull(capacity)) return null;
    return getSuffix(capacity / 1000, 'AH');
  }

  function renderBatteryType(type) {
    if (isStrictNull(type)) return null;
    return type;
  }

  return (
    <Row gutter={24}>
      <Col>
        <div className={styles.batteryState}>
          <Battery value={data.vehicleInfo?.battery ?? 0} />
        </div>
      </Col>
      <Col flex={1}>
        <Row>
          {/************ 电压 ************/}
          <Col span={6}>
            <Form.Item label={<FormattedMessage id={'vehicle.battery.voltage'} />}>
              {renderVoltage(data.vehicleInfo?.batteryVoltage)}
            </Form.Item>
          </Col>

          {/************ 电池状态 ************/}
          <Col span={6}>
            <Form.Item label={<FormattedMessage id={'vehicle.battery.status'} />}>111</Form.Item>
          </Col>

          {/************ 电池温度 ************/}
          <Col span={6}>
            <Form.Item label={<FormattedMessage id={'vehicle.battery.temperature'} />}>
              {renderBatteryTemperature(data.vehicleInfo?.batteryTemperature)}
            </Form.Item>
          </Col>

          {/************ 电池容量 ************/}
          <Col span={6}>
            <Form.Item label={<FormattedMessage id={'vehicle.battery.capacity'} />}>
              {renderBatteryCapacity()}
            </Form.Item>
          </Col>

          {/************ 电池电流 ************/}
          <Col span={6}>
            <Form.Item label={<FormattedMessage id={'vehicle.battery.current'} />}>
              {renderBatteryCurrent()}
            </Form.Item>
          </Col>

          {/************ 最大充电电流 ************/}
          <Col span={6}>
            <Form.Item label={<FormattedMessage id={'vehicle.battery.maxCurrent'} />}>
              {renderBatteryCurrent()}
            </Form.Item>
          </Col>

          {/************ 电池类型 ************/}
          <Col span={6}>
            <Form.Item label={<FormattedMessage id={'vehicle.battery.type'} />}>
              {renderBatteryType()}
            </Form.Item>
          </Col>

          {/************ 充电曲线 ************/}
          <Col span={6}>
            <Form.Item label={<FormattedMessage id={'vehicle.battery.chargingCurve'} />}>
              TODO: 显示图表
            </Form.Item>
          </Col>

          {/************ 电池寿命百分比 ************/}
          <Col span={6}>
            <Form.Item label={<FormattedMessage id={'vehicle.battery.lifePercentage'} />}>
              {renderBatteryLifePercentage()}
            </Form.Item>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
export default memo(VehicleBatteryState);
