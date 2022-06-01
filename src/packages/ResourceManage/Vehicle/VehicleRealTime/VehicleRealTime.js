import React, { memo } from 'react';
import { Button, Col, Popover, Row, Tag } from 'antd';
import { ToolOutlined } from '@ant-design/icons';
import {
  convertToUserTimezone,
  formatMessage,
  getDirectionLocale,
  getSuffix,
  getVehicleStatusTag,
  isNull,
  renderBattery,
} from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import Dictionary from '@/utils/Dictionary';
import LabelComponent from '@/components/LabelComponent.js';
import styles from './index.module.less';
import { hasPermission } from '@/utils/Permission';
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

  function renderArray(data) {
    if (!data) {
      return;
    }
    if (data.length > 3) {
      return (
        <span>
          <span className={styles.leftfour}>{data[0]}</span>
          <span className={styles.leftfour}>{data[1]}</span>
          <span className={styles.leftfour}>{data[2]}</span>
          <span className={styles.leftfour}>...</span>
        </span>
      );
    } else if (data.length > 1) {
      return (
        <span>
          <span className={styles.leftfour}>{data[0]}</span>
          <span className={styles.leftfour}>{data[1]}</span>
          <span className={styles.leftfour}>{data[2]}</span>
        </span>
      );
    } else if (data.length === 1) {
      return <span className={styles.leftfour}>{data[0]}</span>;
    } else {
      return null;
    }
  }

  function renderAddingTime() {
    if (data.vehicleInfo) {
      return convertToUserTimezone(data.vehicleInfo.createDate).format('YYYY-MM-DD HH:mm:ss');
    }
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
        return <Tag color="green">{formatMessage({ id: 'app.vehicle.normal' })}</Tag>;
      }
    }
  }

  function renderManualMode() {
    return data?.vehicle?.manualMode ? (
      <FormattedMessage id="app.common.true" />
    ) : (
      <FormattedMessage id="app.common.false" />
    );
  }

  function renderVehicleStatus() {
    if (data.vehicleWorkStatusDTO) {
      const { vehicleStatus } = data.vehicleWorkStatusDTO;
      return getVehicleStatusTag(vehicleStatus);
    }
  }

  function renderVoltage() {
    const batteryVoltage = data.vehicleInfo.batteryVoltage;
    let batteryVoltageColor;
    if (batteryVoltage > 47000) {
      batteryVoltageColor = green;
    } else if (batteryVoltage > 45000) {
      batteryVoltageColor = yellow;
    } else {
      batteryVoltageColor = red;
    }

    return getSuffix(batteryVoltage / 1000, 'V', {
      style: { color: batteryVoltageColor },
    });
  }

  function renderAbovePodContent() {
    const { unbindPod } = props;
    const { redisVehicle } = data;
    const lockedPodId = redisVehicle.lockedPodId;
    return (
      <span>
        <span>{lockedPodId}</span>
        {hasPermission('/car/activityLogging/taskData/unbindAbovePod') && (
          <Button
            danger
            size="small"
            style={{ marginLeft: 10 }}
            onClick={() => {
              unbindPod(redisVehicle.sectionId, redisVehicle.vehicleId);
            }}
          >
            <FormattedMessage id="app.button.unbind" />
          </Button>
        )}
      </span>
    );
  }

  return (
    <Row style={{ width: '100%' }}>
      {/* 左侧 */}
      <Col span={12}>
        {/************ 小车ID ************/}
        <LabelComponent label={formatMessage({ id: 'vehicle.id' })}>
          {data?.vehicle?.vehicleId}
        </LabelComponent>

        {/************ IP ************/}
        <LabelComponent label={'ip'}>{data?.vehicle?.ip}</LabelComponent>

        {/************ 端口号 ************/}
        <LabelComponent label={formatMessage({ id: 'vehicle.port' })}>
          {data?.vehicle?.port}
        </LabelComponent>

        {/************ 小车类型 ************/}
        <LabelComponent label={formatMessage({ id: 'app.vehicleType' })}>
          {data?.vehicle?.vehicleType}
        </LabelComponent>

        {/* 是否是模拟车 */}
        <LabelComponent label={formatMessage({ id: 'app.vehicleType' })}>
          {data?.vehicle?.isSimulator ? (
            <FormattedMessage id="app.common.true" />
          ) : (
            <FormattedMessage id="app.common.false" />
          )}
        </LabelComponent>

        {/************ 服务器标识 ************/}
        <LabelComponent label={formatMessage({ id: 'app.vehicle.serverIdentity' })}>
          {data?.vehicleInfo?.clusterIndex}
        </LabelComponent>

        {/************ 所在位置 ************/}
        <LabelComponent label={formatMessage({ id: 'app.vehicle.currentSpotId' })}>
          {data?.vehicleInfo?.currentCellId}
        </LabelComponent>

        {/************ 加入时间 ************/}
        <LabelComponent label={formatMessage({ id: 'app.vehicle.addingTime' })}>
          {renderAddingTime()}
        </LabelComponent>

        {/************ 小车状态 ************/}
        <LabelComponent label={formatMessage({ id: 'app.vehicleState' })}>
          {renderVehicleStatus()}
        </LabelComponent>

        {/************ 维护状态 ************/}
        <LabelComponent label={formatMessage({ id: 'app.vehicle.maintenanceState' })}>
          {renderMaintenanceState()}
        </LabelComponent>

        {/************ 手动模式 ************/}
        <LabelComponent label={formatMessage({ id: 'app.vehicle.manualMode' })}>
          {renderManualMode()}
        </LabelComponent>

        {/************ 任务类型 ************/}
        <LabelComponent label={<FormattedMessage id="app.task.type" />}></LabelComponent>
      </Col>

      {/* 右侧 */}
      <Col span={12}>
        {/************ 电压 ************/}
        <LabelComponent label={formatMessage({ id: 'app.vehicle.batteryVoltage' })}>
          {data?.vehicleInfo?.batteryVoltage && renderVoltage()}
        </LabelComponent>

        {/************ 电量 ************/}
        <LabelComponent label={formatMessage({ id: 'app.vehicle.battery' })}>
          {data?.battery?.battery && renderBattery(data.battery.battery)}
        </LabelComponent>

        {/************ 当前速度 ************/}
        <LabelComponent label={formatMessage({ id: 'app.vehicle.speed' })}>
          {data?.vehicleInfo?.speed}
        </LabelComponent>

        {/************ 手动模式 ************/}
        <LabelComponent label={formatMessage({ id: 'app.vehicle.manualMode' })}>
          {renderManualMode()}
        </LabelComponent>

        {/************ 任务ID ************/}
        <LabelComponent label={<FormattedMessage id="app.task.id" />}>
          {data.redisVehicle && data.redisVehicle.currentTaskId ? (
            <Popover content={data.redisVehicle.currentTaskId} trigger="hover">
              <span style={{ cursor: 'pointer', color: 'blue' }}>
                {'*' +
                  data.redisVehicle.currentTaskId.substr(
                    data.redisVehicle.currentTaskId.length - 6,
                    6,
                  )}
              </span>
            </Popover>
          ) : null}
        </LabelComponent>

        {/************ 车头朝向 ************/}
        <LabelComponent label={<FormattedMessage id="app.vehicle.currentDirection" />}>
          {renderVehicleDirection(data?.vehicleInfo?.direction, getDirectionLocale)}
        </LabelComponent>

        <LabelComponent label={<FormattedMessage id="app.activity.upliftPodId" />}>
          {data?.redisVehicle?.upliftPodId != null
            ? formatMessage({
                id: Dictionary('podDirection', data.redisVehicle.upliftPodId),
              })
            : null}
        </LabelComponent>

        <LabelComponent label={<FormattedMessage id="app.activity.upliftPodDirection" />}>
          {data?.redisVehicle?.upliftPodDirection != null
            ? formatMessage({
                id: Dictionary('vehicleDirection', data.redisVehicle.upliftPodDirection),
              })
            : null}
        </LabelComponent>

        {/************ 绑定充电桩 ************/}
        <LabelComponent label={<FormattedMessage id="app.vehicle.lockedCharger" />}>
          {data.redisVehicle && data.redisVehicle.lockedChargerId ? (
            <span>
              <span
                style={{
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
              >
                {data.redisVehicle.lockedChargerId}
              </span>
            </span>
          ) : null}
        </LabelComponent>

        {/************ 锁定目标点 ************/}
        <LabelComponent label={<FormattedMessage id='app.activity.lockedTargetSpots' />}>
          {data?.redisVehicle?.lockedTargetCells &&
          data?.redisVehicle?.lockedTargetCells.length > 0 ? (
            <span>{renderArray(data.redisVehicle.lockedTargetCells)}</span>
          ) : null}
        </LabelComponent>

        {/************ 临时不可走点 ************/}
        <LabelComponent label={<FormattedMessage id='app.activity.lockedTemporarySpots' />}>
          {data?.redisVehicle?.lockedTemporaryCells &&
          data.redisVehicle.lockedTemporaryCells.length > 0 ? (
            <span>
              <span>{renderArray(data.redisVehicle.lockedTemporaryCells)}</span>
              <Button danger size='small' style={styles.suffixStyle}>
                <FormattedMessage id='app.button.unbind' />
              </Button>
            </span>
          ) : null}
        </LabelComponent>
      </Col>
    </Row>
  );
};
export default connect(({ global }) => ({
  allTaskTypes: global.allTaskTypes,
}))(memo(VehicleRealTime));
