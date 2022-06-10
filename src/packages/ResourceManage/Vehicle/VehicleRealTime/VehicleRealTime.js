import React, { memo } from 'react';
import { Col, Form, Radio, Row, Tag } from 'antd';
import { convertToUserTimezone, getVehicleStatusTag, isNull, isStrictNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { connect } from '@/utils/RmsDva';
import Dictionary from '@/utils/Dictionary';

const { red, green } = Dictionary().color;

const VehicleRealTime = (props) => {
  const { data } = props;

  function renderVehicleWorkingState(value, disabled) {
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

  // vehicle.turnOnMaintain.tip
  function renderMaintenanceState(maintain) {
    if (isStrictNull(maintain)) return null;
    return (
      <Radio.Group defaultValue={maintain} buttonStyle="solid">
        <Radio.Button value={false}>
          <FormattedMessage id={'app.common.normal'} />
        </Radio.Button>
        <Radio.Button value={true}>
          <FormattedMessage id={'vehicle.underMaintenance'} />
        </Radio.Button>
      </Radio.Group>
    );
  }

  function renderManualMode(inManualMod) {
    if (isNull(inManualMod)) return null;
    return (
      <Radio.Group defaultValue={inManualMod} buttonStyle="solid">
        <Radio.Button value={false}>
          <FormattedMessage id={'vehicle.manualMode.false'} />
        </Radio.Button>
        <Radio.Button value={true}>
          <FormattedMessage id={'vehicle.manualMode.true'} />
        </Radio.Button>
      </Radio.Group>
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

  function renderOnlineState(value) {
    if (value) {
      if (value === 'ONLINE') {
        return (
          <Tag color={green}>
            <FormattedMessage id={'vehicle.onlineState.online'} />
          </Tag>
        );
      }
      return (
        <Tag color={red}>
          <FormattedMessage id={'vehicle.onlineState.offline'} />
        </Tag>
      );
    }
    return null;
  }

  /**
   * 错误异常
   * 警告异常
   * 无异常
   */
  function renderAbnormalState(value) {
    const { error, warning } = Dictionary().color;
    if (value) {
      //
    }
    return null;
  }

  /**
   * WAITING - 等待
   * INITIALIZING - 初始中
   * RUNNING - 执行中
   * PAUSED - 暂停
   * FINISHED - 完成
   * FAILED - 失败
   */
  function renderSubActionState(value) {
    if (value) {
      //
    }
    return null;
  }

  return (
    <Row gutter={24}>
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

      {/************ 在线状态 ************/}
      <Col span={6}>
        <Form.Item label={<FormattedMessage id={'vehicle.onlineState'} />}>
          {renderOnlineState(data.vehicleWorkStatusDTO?.onlineStatus)}
        </Form.Item>
      </Col>

      {/************ 车辆任务状态 ************/}
      <Col span={6}>
        <Form.Item label={<FormattedMessage id={'vehicle.workingState'} />}>
          {renderVehicleWorkingState(
            data.vehicleWorkStatusDTO?.vehicleStatus,
            data.vehicle?.disabled,
          )}
        </Form.Item>
      </Col>

      {/************ 异常状态 ************/}
      <Col span={6}>
        <Form.Item label={<FormattedMessage id={'vehicle.abnormalState'} />}>
          {renderAbnormalState()}
        </Form.Item>
      </Col>

      {/************ 行驶状态 ************/}
      <Col span={6}>
        <Form.Item label={<FormattedMessage id={'vehicle.runningState'} />}>111</Form.Item>
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

      {/************ 车内储位状态 ************/}
      <Col span={6}>
        <Form.Item label={<FormattedMessage id={'vehicle.vehicleStorageStatue'} />}>111</Form.Item>
      </Col>

      {/************ 分动作状态 ************/}
      <Col span={6}>
        <Form.Item label={<FormattedMessage id={'vehicle.subActionState'} />}>
          {renderSubActionState()}
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
    </Row>
  );
};
export default connect(({ global }) => ({
  allTaskTypes: global.allTaskTypes,
}))(memo(VehicleRealTime));
