import React from 'react';
import { Row, Col, Tag, Popover, Button } from 'antd';
import { ToolOutlined } from '@ant-design/icons';
import { formatMessage, FormattedMessage } from '@/utils/Lang';
import { getDirectionLocale, renderAgvStatus, dateFormat } from '@/utils/utils';
import Dictionary from '@/utils/Dictionary';
import LabelComponent from '@/components/LabelColComponent.js';
import styles from './index.module.less';

const RealTimeTab = (props) => {
  const { data } = props;

  function renderCompare(origin, compare, format) {
    if (origin == null && compare == null) {
      return null;
    }
    if (origin === compare) {
      return <span> {format == null ? origin : format(origin)}</span>;
    } else {
      let node = null;
      if (origin == null) {
        node = (
          <span className={styles.tableBar} style={{ color: '#ff3b49' }}>
            <span>{format == null ? compare : format(compare)}</span>
            <span style={{ marginLeft: 4 }}>!</span>
          </span>
        );
      } else {
        node = (
          <span className={styles.tableBar}>
            <span style={{ color: '#ff3b49' }}>{format == null ? origin : format(origin)}</span>
            <span style={{ marginLeft: 4 }}>!</span>
          </span>
        );
      }
      return (
        <Popover
          content={
            <Row style={{ width: 200 }}>
              <Col span={12}>
                <LabelComponent label={<span>redis</span>} children={<span>{origin}</span>} />
              </Col>
              <Col span={12}>
                <LabelComponent label={<span>mong</span>} children={<span>{compare}</span>} />
              </Col>
            </Row>
          }
          trigger="hover"
        >
          {node}
        </Popover>
      );
    }
  }

  function renderAbovePodContent(data) {
    return (
      <span>
        <span>{data.lockedPodId}</span>
        {
          <Button
            // onClick={() => {
            //   unbindPod(data.sectionId, data.robotId);
            // }}
            style={styles.suffixStyle}
            size="small"
          >
            <FormattedMessage id="app.activity.unlocked" />
          </Button>
        }
      </span>
    );
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

  function renderAgvDirection() {
    if (data.mongodbAGV) {
      return getDirectionLocale(data.mongodbAGV.currentCellId);
    }
  }

  function renderAddingTime() {
    if (data.mongodbAGV) {
      return dateFormat(data.mongodbAGV.createDate).format('YYYY-MM-DD HH:mm:ss');
    }
  }

  function renderMaintenanceState() {
    if (data.mongodbAGV) {
      if (data.mongodbAGV.disabled) {
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
    if (data.mongodbAGV) {
      return data.mongodbAGV.manualMode ? (
        <FormattedMessage id="app.common.true" />
      ) : (
        <FormattedMessage id="app.common.false" />
      );
    }
  }

  function renderAgvType() {
    if (data.mongodbAGV) {
      if (data.mongodbAGV.isDummy) {
        return formatMessage({ id: 'app.agv.threeGenerationsOfVehicles(Virtual)' });
      } else {
        return formatMessage({ id: `app.agvType.${data.mongodbAGV.robotType}` });
      }
    }
  }

  function _renderAgvStatus() {
    if (data.mongodbAGV) {
      const { agvStatus } = data.mongodbAGV;
      return renderAgvStatus(agvStatus);
    }
  }

  return (
    <Row style={{ width: '100%' }}>
      <Col span={12}>
        {/* 小车ID */}
        <LabelComponent label={formatMessage({ id: 'app.agv.id' })}>
          {data?.mongodbAGV?.robotId}
        </LabelComponent>

        {/* 小车类型 */}
        <LabelComponent label={formatMessage({ id: 'app.agv.type' })}>
          {renderAgvType()}
        </LabelComponent>
        {/* 服务器标识 */}
        <LabelComponent label={formatMessage({ id: 'app.agv.serverIdentity' })}>
          {data?.mongodbAGV?.clusterIndex}
        </LabelComponent>
        {/* IP */}
        <LabelComponent label={formatMessage({ id: 'app.agv.ip' })}>
          {data?.mongodbAGV?.ip}
        </LabelComponent>
        {/* 端口号 */}
        <LabelComponent label={formatMessage({ id: 'app.agv.port' })}>
          {data?.mongodbAGV?.port}
        </LabelComponent>
        {/* 车头方向 所在位置 */}
        <LabelComponent label={formatMessage({ id: 'app.agv.currentCellId' })}>
          {renderAgvDirection()}
        </LabelComponent>
        {/* 加入时间 */}
        <LabelComponent label={formatMessage({ id: 'app.agv.addingTime' })}>
          {renderAddingTime()}
        </LabelComponent>
        {/* 小车状态 */}
        <LabelComponent label={formatMessage({ id: 'app.agv.status' })}>
          {_renderAgvStatus()}
        </LabelComponent>
        {/* 维护状态 */}
        <LabelComponent label={formatMessage({ id: 'app.agv.maintenanceState' })}>
          {renderMaintenanceState()}
        </LabelComponent>
        {/* 手动模式 */}
        <LabelComponent label={formatMessage({ id: 'app.agv.manualMode' })}>
          {renderManualMode()}
        </LabelComponent>

        <LabelComponent label={formatMessage({ id: 'app.agv.battery' })}>
          {data?.mongodbAGV?.battery}
        </LabelComponent>
      </Col>
      <Col span={12}>
        <LabelComponent label={formatMessage({ id: 'app.agv.batteryVoltage' })}>
          {data?.mongodbAGV?.batteryVoltage}
        </LabelComponent>
        {/* 当前速度 */}
        <LabelComponent label={formatMessage({ id: 'app.agv.speed' })}>
          {data?.mongodbAGV?.speed}
        </LabelComponent>
        {/* 手动模式 */}
        <LabelComponent label={formatMessage({ id: 'app.agv.manualMode' })}>
          {renderManualMode()}
        </LabelComponent>

        <LabelComponent
          label={<FormattedMessage id="app.task.type" />}
          children={
            <span>
              {data?.redisAGV?.currentTaskType &&
                formatMessage({
                  id: Dictionary('agvTaskType', data.redisAGV.currentTaskType),
                })}
            </span>
          }
        />

        <LabelComponent
          label={<FormattedMessage id="app.task.id" />}
          children={
            <span>
              {data.redisAGV && data.redisAGV.currentTaskId ? (
                <Popover content={data.redisAGV.currentTaskId} trigger="hover">
                  <span style={{ cursor: 'pointer', color: 'blue' }}>
                    {'*' +
                      data.redisAGV.currentTaskId.substr(data.redisAGV.currentTaskId.length - 6, 6)}
                  </span>
                </Popover>
              ) : (
                ''
              )}
            </span>
          }
        />

        <LabelComponent
          label={<FormattedMessage id="app.agv.currentDirection" />}
          children={renderCompare(
            data.redisAGV && data.redisAGV.currentDirection,
            data.mongodbAGV && data.currentDirection,
            (value) => {
              return formatMessage({
                id: Dictionary('agvDirection', value),
              });
            },
          )}
        />

        <LabelComponent
          label={<FormattedMessage id="app.activity.upliftPodId" />}
          children={
            <span>
              {data?.redisAGV?.upliftPodId != null
                ? formatMessage({
                    id: Dictionary('podDirection', data.redisAGV.upliftPodId),
                  })
                : null}
            </span>
          }
        />

        <LabelComponent
          label={<FormattedMessage id="app.activity.upliftPodDirection" />}
          children={
            <span>
              {data?.redisAGV?.upliftPodDirection != null
                ? formatMessage({
                    id: Dictionary('agvDirection', data.redisAGV.upliftPodDirection),
                  })
                : null}
            </span>
          }
        />
        {/************上方货架************/}

        <LabelComponent
          label={<FormattedMessage id="app.activity.lockedPod" />}
          children={data.redisAGV && data.redisAGV.lockedPodId ? renderAbovePodContent() : null}
        />
        {/************绑定充电桩************/}

        <LabelComponent
          label={<FormattedMessage id="app.agv.lockedCharger" />}
          children={
            data.redisAGV && data.redisAGV.lockedChargerId ? (
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
            ) : null
          }
        />
        {/************临时不可走点************/}

        <LabelComponent
          label={<FormattedMessage id="app.activity.lockedTemporaryCells" />}
          children={
            data?.redisAGV?.lockedTemporaryCells &&
            data.redisAGV.lockedTemporaryCells.length > 0 ? (
              <span>
                <span>{renderArray(data.redisAGV.lockedTemporaryCells)}</span>
                <Button style={styles.suffixStyle} size="small">
                  <FormattedMessage id="app.activity.unlocked" />
                </Button>
              </span>
            ) : null
          }
        />

        {/************锁定目标点************/}

        <LabelComponent
          label={<FormattedMessage id="app.activity.lockedTargetCells" />}
          children={
            data?.redisAGV?.lockedTargetCells && data?.redisAGV?.lockedTargetCells.length > 0 ? (
              <span>{renderArray(data.redisAGV.lockedTargetCells)}</span>
            ) : null
          }
        />
      </Col>
    </Row>
  );
};

export default React.memo(RealTimeTab);
