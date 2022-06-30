import React, { memo } from 'react';
import { Card, Col, Descriptions, Popconfirm, Row, Tag } from 'antd';
import { ToolOutlined } from '@ant-design/icons';
import {
  convertToUserTimezone,
  formatMessage,
  getSuffix,
  getVehicleStatusTag,
  isNull,
  isStrictNull,
} from '@/utils/util';
import { connect } from '@/utils/RmsDva';
import Dictionary from '@/utils/Dictionary';
import FormattedMessage from '@/components/FormattedMessage';

const { red, green, orange, blue } = Dictionary().color;

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

  function renderMaintenanceState(maintain) {
    if (isStrictNull(maintain)) return null;
    if (maintain) {
      return (
        <Row>
          <Col>
            <Tag color={orange} style={{ fontWeight: 700 }}>
              <ToolOutlined /> <FormattedMessage id={'vehicle.maintenanceState.true'} />
            </Tag>
          </Col>
          <Col>
            <Popconfirm title={formatMessage({ id: 'app.message.doubleConfirm' })}>
              <span style={{ color: blue, cursor: 'pointer' }}>
                <FormattedMessage id={'vehicle.maintenanceState.terminate'} />
              </span>
            </Popconfirm>
          </Col>
        </Row>
      );
    } else {
      return (
        <Row>
          <Col>
            <Tag color={green}>
              <FormattedMessage id={'app.common.normal'} />
            </Tag>
          </Col>
          <Col>
            <Popconfirm title={formatMessage({ id: 'vehicle.turnOnMaintain.tip' })}>
              <span style={{ color: blue, cursor: 'pointer' }}>
                <FormattedMessage id={'vehicle.maintenanceState.enter'} />
              </span>
            </Popconfirm>
          </Col>
        </Row>
      );
    }
  }

  function renderManualMode(inManualMod) {
    if (isNull(inManualMod)) return null;
    if (inManualMod) {
      return (
        <Row>
          <Col>
            <Tag>
              <FormattedMessage id={'vehicle.manualMode.true'} />
            </Tag>
          </Col>
          <Col style={{ display: 'flex', alignItems: 'center' }}>
            <Popconfirm title={formatMessage({ id: 'app.message.doubleConfirm' })}>
              <span style={{ color: blue, cursor: 'pointer' }}>
                <FormattedMessage id={'vehicle.manualMode.switchToAuto'} />
              </span>
            </Popconfirm>
          </Col>
        </Row>
      );
    } else {
      return (
        <Row>
          <Col>
            <Tag>
              <FormattedMessage id={'vehicle.manualMode.false'} />
            </Tag>
          </Col>
          <Col style={{ display: 'flex', alignItems: 'center' }}>
            <Popconfirm title={formatMessage({ id: 'app.message.doubleConfirm' })}>
              <span style={{ color: blue, cursor: 'pointer' }}>
                <FormattedMessage id={'vehicle.manualMode.switchToAutoManual'} />
              </span>
            </Popconfirm>
          </Col>
        </Row>
      );
    }
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

  function renderRunningState(state) {
    if (isStrictNull(state)) return null;
    return state;
  }

  function renderVehicleStorageStatue(state) {
    if (isStrictNull(state)) return null;
    return state;
  }

  return (
    <Card title={<FormattedMessage id={'vehicle.realTime'} />}>
      <Descriptions>
        {/************ 当前位置 ************/}
        <Descriptions.Item label={<FormattedMessage id={'vehicle.currentPosition'} />}>
          {data.vehicleInfo?.currentNaviId}
        </Descriptions.Item>

        {/************ 当前坐标 ************/}
        <Descriptions.Item label={<FormattedMessage id={'vehicle.currentCoordinator'} />}>
          {renderCoordinator(data.vehicleInfo?.x, data.vehicleInfo?.y)}
        </Descriptions.Item>

        {/************ 车辆方向 ************/}
        <Descriptions.Item label={<FormattedMessage id={'vehicle.direction'} />}>
          {data.vehicleInfo?.direction && getSuffix(data.vehicleInfo.direction, '°')}
        </Descriptions.Item>

        {/************ 到点时间 ************/}
        {/*<Descriptions.Item label={<FormattedMessage id={'app.arriveTime'} />}>*/}
        {/*  {renderArriveTime(data.vehicleInfo?.arriveTime)}*/}
        {/*</Descriptions.Item>*/}

        {/************ 小车速度 ************/}
        <Descriptions.Item label={<FormattedMessage id={'vehicle.speed'} />}>
          {data.vehicleInfo?.speed}
        </Descriptions.Item>

        {/************ 在线状态 ************/}
        <Descriptions.Item label={<FormattedMessage id={'vehicle.onlineState'} />}>
          {renderOnlineState(data.vehicleWorkStatusDTO?.onlineStatus)}
        </Descriptions.Item>

        {/************ 车辆任务状态 ************/}
        <Descriptions.Item label={<FormattedMessage id={'vehicle.workingState'} />}>
          {renderVehicleWorkingState(
            data.vehicleWorkStatusDTO?.vehicleStatus,
            data.vehicle?.disabled,
          )}
        </Descriptions.Item>

        {/************ 异常状态 ************/}
        <Descriptions.Item label={<FormattedMessage id={'vehicle.abnormalState'} />}>
          {renderAbnormalState()}
        </Descriptions.Item>

        {/************ 行驶状态 ************/}
        <Descriptions.Item label={<FormattedMessage id={'vehicle.runningState'} />}>
          {renderRunningState()}
        </Descriptions.Item>

        {/************ 维护状态 ************/}
        <Descriptions.Item label={<FormattedMessage id={'vehicle.maintenanceState'} />}>
          {renderMaintenanceState(data.vehicle?.maintain)}
        </Descriptions.Item>

        {/************ 手动模式 ************/}
        <Descriptions.Item label={<FormattedMessage id={'vehicle.manualMode'} />}>
          {renderManualMode(data.vehicle?.manualMode)}
        </Descriptions.Item>

        {/************ 车内储位状态 ************/}
        <Descriptions.Item label={<FormattedMessage id={'vehicle.vehicleStorageStatue'} />}>
          {renderVehicleStorageStatue()}
        </Descriptions.Item>

        {/************ 分动作状态 ************/}
        <Descriptions.Item label={<FormattedMessage id={'vehicle.subActionState'} />}>
          {renderSubActionState()}
        </Descriptions.Item>

        {/************ 载具 ************/}
        <Descriptions.Item label={<FormattedMessage id={'resource.load'} />}>
          {data.vehicleInfo?.loads}
        </Descriptions.Item>

        {/************ 载具方向 ************/}
        <Descriptions.Item label={<FormattedMessage id={'resource.load.direction'} />}>
          {data.vehicleInfo?.loadAngle}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};
export default connect(({ global }) => ({
  allTaskTypes: global.allTaskTypes,
}))(memo(VehicleRealTime));
