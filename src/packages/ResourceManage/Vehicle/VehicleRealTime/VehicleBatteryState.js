import React, { memo } from 'react';
import { Card, Descriptions } from 'antd';
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

  function renderBatteryState(state) {
    if (isStrictNull(state)) return null;
    return state;
  }

  return (
    <Card title={<FormattedMessage id={'vehicle.batteryRealTime'} />}>
      <div style={{ display: 'flex' }}>
        <div className={styles.batteryState}>
          <Battery value={data.vehicleInfo?.battery ?? 0} />
        </div>
        <div style={{ flex: 1 }}>
          <Descriptions>
            {/************ 电压 ************/}
            <Descriptions.Item label={<FormattedMessage id={'vehicle.battery.voltage'} />}>
              {renderVoltage(data.vehicleInfo?.batteryVoltage)}
            </Descriptions.Item>

            {/************ 电池温度 ************/}
            <Descriptions.Item label={<FormattedMessage id={'vehicle.battery.temperature'} />}>
              {renderBatteryTemperature(data.vehicleInfo?.batteryTemperature)}
            </Descriptions.Item>

            {/************ 电池状态 ************/}
            <Descriptions.Item label={<FormattedMessage id={'vehicle.battery.status'} />}>
              {renderBatteryState()}
            </Descriptions.Item>

            {/************ 电池容量 ************/}
            <Descriptions.Item label={<FormattedMessage id={'vehicle.battery.capacity'} />}>
              {renderBatteryCapacity()}
            </Descriptions.Item>

            {/************ 电池电流 ************/}
            <Descriptions.Item label={<FormattedMessage id={'vehicle.battery.current'} />}>
              {renderBatteryCurrent()}
            </Descriptions.Item>

            {/************ 最大充电电流 ************/}
            <Descriptions.Item label={<FormattedMessage id={'vehicle.battery.maxCurrent'} />}>
              {renderBatteryCurrent()}
            </Descriptions.Item>

            {/************ 电池类型 ************/}
            <Descriptions.Item label={<FormattedMessage id={'vehicle.battery.type'} />}>
              {renderBatteryType()}
            </Descriptions.Item>

            {/************ 电池寿命百分比 ************/}
            <Descriptions.Item label={<FormattedMessage id={'vehicle.battery.lifePercentage'} />}>
              {renderBatteryLifePercentage()}
            </Descriptions.Item>

            {/************ 充电曲线 ************/}
            <Descriptions.Item label={<FormattedMessage id={'vehicle.battery.chargingCurve'} />}>
              TODO: 显示图表
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </Card>
  );
};
export default memo(VehicleBatteryState);
