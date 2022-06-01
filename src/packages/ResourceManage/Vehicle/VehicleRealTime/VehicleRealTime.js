import React, { memo } from 'react';
import { Col, Form, Popconfirm, Row, Switch, Tag } from 'antd';
import {
  convertToUserTimezone,
  formatMessage,
  getSuffix,
  getVehicleStatusTag,
  isNull,
  isStrictNull,
} from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { connect } from '@/utils/RmsDva';
import Battery from '@/components/Battery';
import Dictionary from '@/utils/Dictionary';
import styles from './index.module.less';

const { red, green, yellow } = Dictionary('color');

const VehicleRealTime = (props) => {
  const { data } = props;

  function renderVehicleStatus(value, disabled) {
    if (disabled) {
      return (
        <Tag color={red}>
          <FormattedMessage id={'app.common.disabled'} />
        </Tag>
      );
    }
    if (!isStrictNull(value)) {
      return getVehicleStatusTag(value);
    }
    return null;
  }

  function renderMaintenanceState(maintain) {
    if (isStrictNull(maintain)) return null;
    if (maintain) {
      return (
        <Switch
          checked
          onChange={(checked) => {
          }}
          unCheckedChildren={<FormattedMessage id={'app.common.off'} />}
          checkedChildren={<FormattedMessage id={'app.common.on'} />}
        />
      );
    }
    return (
      <Popconfirm title={formatMessage({ id: 'vehicle.turnOnMaintain.tip' })} onConfirm={() => {
      }}>
        <Switch
          checked={false}
          unCheckedChildren={<FormattedMessage id={'app.common.off'} />}
          checkedChildren={<FormattedMessage id={'app.common.on'} />}
        />
      </Popconfirm>
    );
  }

  function renderManualMode(inManualMod) {
    if (isNull(inManualMod)) return null;
    if (inManualMod) {
      return (
        <Switch
          checked
          onChange={(checked) => {
          }}
          unCheckedChildren={<FormattedMessage id={'app.common.off'} />}
          checkedChildren={<FormattedMessage id={'app.common.on'} />}
        />
      );
    }
    return (
      <Popconfirm title={formatMessage({ id: 'app.message.doubleConfirm' })} onConfirm={() => {
      }}>
        <Switch
          checked={false}
          unCheckedChildren={<FormattedMessage id={'app.common.off'} />}
          checkedChildren={<FormattedMessage id={'app.common.on'} />}
        />
      </Popconfirm>
    );
  }

  function renderCoordinator(x, y) {
    if (isStrictNull(x) || isStrictNull(y)) return;
    return `(${x}, ${y})`;
  }

  function renderArriveTime(value) {
    if (isStrictNull(value)) return null;
    return convertToUserTimezone(value).format('YYYY-MM-DD HH:mm:ss');
  }

  function renderVoltage(value) {
    if (isStrictNull(value)) return null;
    let batteryVoltageColor;
    if (value > 47) {
      batteryVoltageColor = green;
    } else if (value > 45) {
      batteryVoltageColor = yellow;
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
      batteryTemperatureOneColor = yellow;
    }
    return getSuffix(batteryTemperature, '°', {
      style: { color: batteryTemperatureOneColor },
    });
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

          {/************ 到点时间 ************/}
          <Col span={6}>
            <Form.Item label={<FormattedMessage id={'app.arriveTime'} />}>
              {renderArriveTime(data.vehicleInfo?.arriveTime)}
            </Form.Item>
          </Col>

          {/************ 小车速度 ************/}
          <Col span={6}>
            <Form.Item label={<FormattedMessage id={'vehicle.speed'} />}>
              {data.vehicleInfo?.speed}
            </Form.Item>
          </Col>

          {/************ 小车状态 ************/}
          <Col span={6}>
            <Form.Item label={<FormattedMessage id={'app.vehicleState'} />}>
              {renderVehicleStatus(
                data.vehicleWorkStatusDTO?.vehicleStatus,
                data.vehicle?.disabled,
              )}
            </Form.Item>
          </Col>

          {/************ 维护状态 ************/}
          <Col span={6}>
            <Form.Item label={<FormattedMessage id={'vehicle.maintenanceState'} />}>
              {renderMaintenanceState(data.vehicle?.maintain)}
            </Form.Item>
          </Col>

          {/************ 手动模式 ************/}
          <Col span={6}>
            <Form.Item label={<FormattedMessage id={'vehicle.manualMode'} />}>
              {renderManualMode(data.vehicle?.manualMode)}
            </Form.Item>
          </Col>

          {/************ 小车网络状态 ************/}
          <Col span={6}>
            <Form.Item label={<FormattedMessage id={'vehicle.onlineState'} />}>
              {data.vehicleWorkStatusDTO?.onlineStatus}
            </Form.Item>
          </Col>

          {/************ 载具 ************/}
          <Col span={6}>
            <Form.Item label={<FormattedMessage id={'object.load'} />}>
              {data.vehicleInfo?.loads}
            </Form.Item>
          </Col>

          {/************ 载具方向 ************/}
          <Col span={6}>
            <Form.Item label={<FormattedMessage id={'object.load.direction'} />}>
              {data.vehicleInfo?.loadAngle}
            </Form.Item>
          </Col>

          {/************ 小车速度 ************/}
          <Col span={6}>
            <Form.Item label={<FormattedMessage id={'vehicle.speed'} />}>
              {data.vehicleInfo?.speed}
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
        </Row>
      </Col>
    </Row>
  );
};
export default connect(({ global }) => ({
  allTaskTypes: global.allTaskTypes,
}))(memo(VehicleRealTime));
