import React, { memo } from 'react';
import { Col, Form, Row, Tag } from 'antd';
import { ToolOutlined } from '@ant-design/icons';
import {
  formatMessage,
  getDirectionLocale,
  getSuffix,
  getVehicleStatusTag,
  isNull,
  isStrictNull,
  renderBattery,
} from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import Dictionary from '@/utils/Dictionary';
import LabelComponent from '@/components/LabelComponent.js';
import { connect } from '@/utils/RmsDva';

const { red, green, yellow } = Dictionary('color');

const VehicleRealTime = (props) => {
  const { data } = props;

  function renderVehicleDirection(value, format) {
    if (isNull(value)) {
      return null;
    }
    return format(value);
  }
  function renderMaintenanceState() {
    if (data.vehicleWorkStatusDTO) {
      if (data.vehicleWorkStatusDTO.disabled) {
        return (
          <Tag color="red">
            <ToolOutlined />
            <span style={{ marginLeft: 3 }}>
              {formatMessage({ id: 'app.vehicle.underMaintenance' })}
            </span>
          </Tag>
        );
      } else {
        return <Tag color='green'>{formatMessage({ id: 'app.vehicle.normal' })}</Tag>;
      }
    }
  }

  function renderManualMode(value) {
    if (!isStrictNull(value)) {
      return <FormattedMessage id={`app.common.${value}`} />;
    }
    return null;
  }

  function renderVehicleStatus(value) {
    if (!isStrictNull(value)) {
      return getVehicleStatusTag(value);
    }
    return null;
  }

  function renderVoltage(value) {
    if (isStrictNull(value)) return null;
    let batteryVoltageColor;
    if (value > 47000) {
      batteryVoltageColor = green;
    } else if (value > 45000) {
      batteryVoltageColor = yellow;
    } else {
      batteryVoltageColor = red;
    }
    return getSuffix(value / 1000, 'V', {
      style: { color: batteryVoltageColor },
    });
  }

  function renderBatteryTemperature(batteryTemperature) {
    if (isStrictNull(batteryTemperature)) return null;

    let batteryTemperatureOneColor = 'green';
    if (parseInt(batteryTemperature) >= 48) {
      batteryTemperatureOneColor = 'red';
    } else if (parseInt(batteryTemperature) >= 40) {
      batteryTemperatureOneColor = 'yellow';
    }
    return getSuffix(batteryTemperature, '°', {
      style: { color: batteryTemperatureOneColor },
    });
  }

  function renderCoordinator(x, y) {
    if (isStrictNull(x) || isStrictNull(y)) return;
    return `(${x}, ${y})`;
  }

  return (
    <Row>
      {/************ 当前位置 ************/}
      <Col span={6}>
        <Form.Item label={<FormattedMessage id={'vehicle.currentPosition'} />}>
          {data.vehicleInfo?.currentNaviId}
        </Form.Item>
      </Col>

      {/************ 当前坐标 ************/}
      <Col span={6}>
        <Form.Item label={<FormattedMessage id={'vehicle.currentCoordinator'} />}>
          {renderCoordinator(data.vehicleInfo?.x, data.vehicleInfo?.y)}
        </Form.Item>
      </Col>

      {/************ 小车状态 ************/}
      <Col span={6}>
        <Form.Item label={<FormattedMessage id={'app.vehicleState'} />}>
          {renderVehicleStatus(data.vehicleWorkStatusDTO?.vehicleStatus)}
        </Form.Item>
      </Col>

      {/************ 小车网络状态 ************/}
      <Col span={6}>
        <Form.Item label={<FormattedMessage id={'app.onlineState'} />}>
          {renderVehicleStatus(data.vehicleWorkStatusDTO?.onlineStatus)}
        </Form.Item>
      </Col>

      {/************ 维护状态 ************/}
      <Col span={6}>
        <Form.Item label={<FormattedMessage id={'vehicle.maintenanceState'} />}>
          {renderMaintenanceState()}
        </Form.Item>
      </Col>

      {/************ 手动模式 ************/}
      <Col span={6}>
        <Form.Item label={<FormattedMessage id={'vehicle.manualMode'} />}>
          {renderManualMode(data.vehicleWorkStatusDTO?.manualMode)}
        </Form.Item>
      </Col>

      {/************ 电量 ************/}
      <Col span={6}>
        <Form.Item label={<FormattedMessage id={'vehicle.battery'} />}>
          {renderBattery(data.vehicleInfo?.battery)}
        </Form.Item>
      </Col>

      {/************ 电压 ************/}
      <Col span={6}>
        <Form.Item label={<FormattedMessage id={'vehicle.batteryVoltage'} />}>
          {renderVoltage(data.vehicleInfo?.batteryVoltage)}
        </Form.Item>
      </Col>

      {/************ 电池温度 ************/}
      <Col span={6}>
        <Form.Item label={<FormattedMessage id={'vehicle.batteryTemperature'} />}>
          {renderBatteryTemperature(data.vehicleInfo?.batteryTemperature)}
        </Form.Item>
      </Col>

      <Col span={12}>
        {/************ 当前速度 ************/}
        <LabelComponent label={formatMessage({ id: 'app.vehicle.speed' })}>
          {data?.vehicleInfo?.speed}
        </LabelComponent>

        {/************ 车头朝向 ************/}
        <LabelComponent label={<FormattedMessage id='app.vehicle.currentDirection' />}>
          {renderVehicleDirection(data?.vehicleInfo?.direction, getDirectionLocale)}
        </LabelComponent>
      </Col>
    </Row>
  );
};
export default connect(({ global }) => ({
  allTaskTypes: global.allTaskTypes,
}))(memo(VehicleRealTime));
