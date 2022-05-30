import React, { memo } from 'react';
import { Row, Col, Tag, Popover, Button } from 'antd';
import { ToolOutlined } from '@ant-design/icons';
import { formatMessage, getSuffix, isNull, renderBattery } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { getDirectionLocale, getAgvStatusTag, convertToUserTimezone } from '@/utils/util';
import Dictionary from '@/utils/Dictionary';
import LabelComponent from '@/components/LabelComponent.js';
import styles from './index.module.less';
import { hasPermission } from '@/utils/Permission';
import { connect } from '@/utils/RmsDva';

const { red, green, yellow } = Dictionary('color');

const RealTimeTab = (props) => {
  const { data, allTaskTypes } = props;

  function renderAGVDirection(value, format) {
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
    if (data.agvInfo) {
      return convertToUserTimezone(data.agvInfo.createDate).format('YYYY-MM-DD HH:mm:ss');
    }
  }

  function renderMaintenanceState() {
    if (data.agvWorkStatusDTO) {
      if (data.agvWorkStatusDTO.disabled) {
        return (
          <Tag color="red">
            <ToolOutlined />
            <span style={{ marginLeft: 3 }}>
              {formatMessage({ id: 'app.agv.underMaintenance' })}
            </span>
          </Tag>
        );
      } else {
        return <Tag color="green">{formatMessage({ id: 'app.agv.normal' })}</Tag>;
      }
    }
  }

  function renderManualMode() {
    return data?.agv?.manualMode ? (
      <FormattedMessage id="app.common.true" />
    ) : (
      <FormattedMessage id="app.common.false" />
    );
  }

  function renderAgvStatus() {
    if (data.agvWorkStatusDTO) {
      const { agvStatus } = data.agvWorkStatusDTO;
      return getAgvStatusTag(agvStatus);
    }
  }

  function renderVoltage() {
    const batteryVoltage = data.agvInfo.batteryVoltage;
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
    const { redisAGV } = data;
    const lockedPodId = redisAGV.lockedPodId;
    return (
      <span>
        <span>{lockedPodId}</span>
        {hasPermission('/car/activityLogging/taskData/unbindAbovePod') && (
          <Button
            danger
            size="small"
            style={{ marginLeft: 10 }}
            onClick={() => {
              unbindPod(redisAGV.sectionId, redisAGV.robotId);
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
        <LabelComponent label={formatMessage({ id: 'app.agv.id' })}>
          {data?.agv?.agvId}
        </LabelComponent>

        {/************ IP ************/}
        <LabelComponent label={'ip'}>{data?.agv?.ip}</LabelComponent>

        {/************ 端口号 ************/}
        <LabelComponent label={formatMessage({ id: 'app.agv.port' })}>
          {data?.agv?.port}
        </LabelComponent>

        {/************ 小车类型 ************/}
        <LabelComponent label={formatMessage({ id: 'app.agvType' })}>
          {data?.agv?.agvType}
        </LabelComponent>

        {/* 是否是模拟车 */}
        <LabelComponent label={formatMessage({ id: 'app.agvType' })}>
          {data?.agv?.isSimulator ? (
            <FormattedMessage id="app.common.true" />
          ) : (
            <FormattedMessage id="app.common.false" />
          )}
        </LabelComponent>

        {/************ 服务器标识 ************/}
        <LabelComponent label={formatMessage({ id: 'app.agv.serverIdentity' })}>
          {data?.agvInfo?.clusterIndex}
        </LabelComponent>

        {/************ 所在位置 ************/}
        <LabelComponent label={formatMessage({ id: 'app.agv.currentSpotId' })}>
          {data?.agvInfo?.currentCellId}
        </LabelComponent>

        {/************ 加入时间 ************/}
        <LabelComponent label={formatMessage({ id: 'app.agv.addingTime' })}>
          {renderAddingTime()}
        </LabelComponent>

        {/************ 小车状态 ************/}
        <LabelComponent label={formatMessage({ id: 'app.agvStatus' })}>
          {renderAgvStatus()}
        </LabelComponent>

        {/************ 维护状态 ************/}
        <LabelComponent label={formatMessage({ id: 'app.agv.maintenanceState' })}>
          {renderMaintenanceState()}
        </LabelComponent>

        {/************ 手动模式 ************/}
        <LabelComponent label={formatMessage({ id: 'app.agv.manualMode' })}>
          {renderManualMode()}
        </LabelComponent>

        {/************ 任务类型 ************/}
        <LabelComponent label={<FormattedMessage id="app.task.type" />}></LabelComponent>
      </Col>

      {/* 右侧 */}
      <Col span={12}>
        {/************ 电压 ************/}
        <LabelComponent label={formatMessage({ id: 'app.agv.batteryVoltage' })}>
          {data?.agvInfo?.batteryVoltage && renderVoltage()}
        </LabelComponent>

        {/************ 电量 ************/}
        <LabelComponent label={formatMessage({ id: 'app.agv.battery' })}>
          {data?.battery?.battery && renderBattery(data.battery.battery)}
        </LabelComponent>

        {/************ 当前速度 ************/}
        <LabelComponent label={formatMessage({ id: 'app.agv.speed' })}>
          {data?.agvInfo?.speed}
        </LabelComponent>

        {/************ 手动模式 ************/}
        <LabelComponent label={formatMessage({ id: 'app.agv.manualMode' })}>
          {renderManualMode()}
        </LabelComponent>

        {/************ 任务ID ************/}
        <LabelComponent label={<FormattedMessage id="app.task.id" />}>
          {data.redisAGV && data.redisAGV.currentTaskId ? (
            <Popover content={data.redisAGV.currentTaskId} trigger="hover">
              <span style={{ cursor: 'pointer', color: 'blue' }}>
                {'*' +
                  data.redisAGV.currentTaskId.substr(data.redisAGV.currentTaskId.length - 6, 6)}
              </span>
            </Popover>
          ) : null}
        </LabelComponent>

        {/************ 车头朝向 ************/}
        <LabelComponent label={<FormattedMessage id="app.agv.currentDirection" />}>
          {renderAGVDirection(data?.agvInfo?.direction, getDirectionLocale)}
        </LabelComponent>

        <LabelComponent label={<FormattedMessage id="app.activity.upliftPodId" />}>
          {data?.redisAGV?.upliftPodId != null
            ? formatMessage({
                id: Dictionary('podDirection', data.redisAGV.upliftPodId),
              })
            : null}
        </LabelComponent>

        <LabelComponent label={<FormattedMessage id="app.activity.upliftPodDirection" />}>
          {data?.redisAGV?.upliftPodDirection != null
            ? formatMessage({
                id: Dictionary('agvDirection', data.redisAGV.upliftPodDirection),
              })
            : null}
        </LabelComponent>

        {/************ 绑定充电桩 ************/}
        <LabelComponent label={<FormattedMessage id="app.agv.lockedCharger" />}>
          {data.redisAGV && data.redisAGV.lockedChargerId ? (
            <span>
              <span
                style={{
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
              >
                {data.redisAGV.lockedChargerId}
              </span>
            </span>
          ) : null}
        </LabelComponent>

        {/************ 锁定目标点 ************/}
        <LabelComponent label={<FormattedMessage id="app.activity.lockedTargetSpots" />}>
          {data?.redisAGV?.lockedTargetCells && data?.redisAGV?.lockedTargetCells.length > 0 ? (
            <span>{renderArray(data.redisAGV.lockedTargetCells)}</span>
          ) : null}
        </LabelComponent>

        {/************ 临时不可走点 ************/}
        <LabelComponent label={<FormattedMessage id="app.activity.lockedTemporarySpots" />}>
          {data?.redisAGV?.lockedTemporaryCells && data.redisAGV.lockedTemporaryCells.length > 0 ? (
            <span>
              <span>{renderArray(data.redisAGV.lockedTemporaryCells)}</span>
              <Button danger size="small" style={styles.suffixStyle}>
                <FormattedMessage id="app.button.unbind" />
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
}))(memo(RealTimeTab));
