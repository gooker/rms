import React, { PureComponent, createRef } from 'react';
import { Card, Input, Row, Col, Divider, Button, Tooltip, Badge } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { formatMessage, FormattedMessage } from '@/components/Lang';
import { dateFormat } from '@/utils/utils';
import Dictionary from '@/utils/Dictionary';
import { Permission } from '@/utils/Permission';
import ErrorList from './components/ErrorList';
import ToteAGVWorkBinInfoMap from './components/ToteAGVWorkBinInfoMap';
import { AGVType } from '@/config/config';
import styles from '@/common.module.less';
const colProps = { lg: 8, sm: 12 };
const taskStatusMap = ['warning', 'processing', 'success', 'error', 'default'];
const DescriptionItem = ({ title, content }) => (
  <div className={styles.descriptionItem}>
    <p className={styles.itemTitle}>{title}:</p>
    {content}
  </div>
);
const TooltipRight = ({ content, placement }) => (
  <Tooltip placement={placement || 'topRight'} title={<span>{content}</span>}>
    <QuestionCircleOutlined style={{ fontSize: 17, marginLeft: 10, cursor: 'pointer' }} />
  </Tooltip>
);

class TaskDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.toteHoldingInput = createRef();
  }

  // 渲染任务状态
  renderStatus = (text) => {
    if (text != null && text !== '') {
      const key = Dictionary('taskStatus', text);
      if (text === 'New') {
        return <Badge status={taskStatusMap[0]} text={formatMessage({ id: key })} />;
      }
      if (text === 'Executing') {
        return <Badge status={taskStatusMap[1]} text={formatMessage({ id: key })} />;
      }
      if (text === 'Finished') {
        return <Badge status={taskStatusMap[2]} text={formatMessage({ id: key })} />;
      }
      if (text === 'Error') {
        return <Badge status={taskStatusMap[3]} text={formatMessage({ id: key })} />;
      }
      if (text === 'Cancel') {
        return <Badge status={taskStatusMap[4]} text={formatMessage({ id: key })} />;
      }
    } else {
      return null;
    }
  };

  confirmHolding = () => {
    const { detailInfo, confirmToteHolding } = this.props;
    confirmToteHolding(
      detailInfo.sectionId,
      detailInfo.taskId,
      this.toteHoldingInput.current.state.value,
    );
  };

  render() {
    const {
      cancel,
      detailInfo,
      errorCodes,
      restartTask,
      restoreTask,
      currentType,
      chargeRecord,
      forceStandBy,
      errorTaskList,
    } = this.props;
    if (!detailInfo) return null;
    const { taskStatus } = detailInfo;
    const cardExtra = (
      <span>
        {['Cancel', 'Finished'].includes(taskStatus) && (
          <Permission id="/map/monitor/taskDetail/taskDetail/reset">
            <Button
              style={{ marginLeft: 15 }}
              disabled={detailInfo.sectionId == null || detailInfo.taskId == null}
              onClick={() => {
                forceStandBy(detailInfo.sectionId, detailInfo.taskId);
              }}
            >
              <FormattedMessage id="app.button.reset" />
            </Button>
          </Permission>
        )}

        {taskStatus === 'Error' && (
          <Permission id="/map/monitor/taskDetail/taskDetail/restore">
            <Button
              style={{ marginLeft: 15 }}
              disabled={detailInfo.sectionId == null || detailInfo.taskId == null}
              onClick={() => {
                restoreTask(detailInfo.sectionId, detailInfo.taskId);
              }}
            >
              <FormattedMessage id="app.taskDetail.restore" />
            </Button>
          </Permission>
        )}

        {taskStatus === 'Executing' && (
          <Permission id="/map/monitor/taskDetail/taskDetail/repeat">
            <Button
              style={{ marginLeft: 15 }}
              disabled={detailInfo.sectionId == null || detailInfo.taskId == null}
              onClick={() => {
                restartTask(detailInfo.sectionId, detailInfo.taskId);
              }}
            >
              <FormattedMessage id="app.taskDetail.repeat" />
            </Button>
          </Permission>
        )}

        {['Executing', 'New', 'Error'].includes(taskStatus) && (
          <Permission id="/map/monitor/taskDetail/taskDetail/cancel">
            <Button
              disabled={detailInfo.sectionId == null || detailInfo.taskId == null}
              style={{ marginLeft: 15 }}
              onClick={() => {
                cancel(detailInfo.sectionId, detailInfo.taskId);
              }}
            >
              <FormattedMessage id="app.button.cancel" />
            </Button>
          </Permission>
        )}
        <Permission
          type="or"
          id={[
            '/map/monitor/taskDetail/taskDetail/repeat',
            '/map/monitor/taskDetail/taskDetail/reset',
          ]}
        >
          <span style={{ marginLeft: 15 }}>
            <TooltipRight
              content={
                <div>
                  <div>
                    <Permission id="/map/monitor/taskDetail/taskDetail/reset">
                      {formatMessage({ id: 'app.activity.detailActionTip1' })}
                    </Permission>
                  </div>
                  <div>
                    <Permission id="/map/monitor/taskDetail/taskDetail/repeat">
                      {formatMessage({ id: 'app.activity.detailActionTip2' })}
                    </Permission>
                  </div>
                </div>
              }
              placement="bottomRight"
            />
          </span>
        </Permission>
      </span>
    );
    return (
      <div>
        {detailInfo && (
          <Card title={<FormattedMessage id="app.task.info" />} extra={cardExtra}>
            {/** ******************************* 任务详情 *********************************** */}
            {detailInfo && (
              <Row>
                <Col {...colProps}>
                  <DescriptionItem
                    title={<FormattedMessage id="app.task.id" />}
                    content={<span>{detailInfo.taskId}</span>}
                  />
                </Col>
                <Col {...colProps}>
                  <DescriptionItem
                    title={<FormattedMessage id="app.taskDetail.createTime" />}
                    content={
                      <span>{dateFormat(detailInfo.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                    }
                  />
                </Col>
                <Col {...colProps}>
                  <DescriptionItem
                    title={<FormattedMessage id="app.taskDetail.createUser" />}
                    content={<span>{detailInfo.createdByUser}</span>}
                  />
                </Col>
                <Col {...colProps}>
                  <DescriptionItem
                    title={<FormattedMessage id="app.taskDetail.updateTime" />}
                    content={
                      <span>{dateFormat(detailInfo.updateTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                    }
                  />
                </Col>
                <Col {...colProps}>
                  <DescriptionItem
                    title={<FormattedMessage id="app.taskDetail.updateUser" />}
                    content={<span>{detailInfo.updatedByUser}</span>}
                  />
                </Col>
                <Col {...colProps}>
                  <DescriptionItem
                    title={<FormattedMessage id="app.common.sectionId" />}
                    content={<span>{detailInfo.sectionId}</span>}
                  />
                </Col>
                <Col {...colProps}>
                  <DescriptionItem
                    title={<FormattedMessage id="app.task.type" />}
                    content={
                      <span>
                        {formatMessage({
                          id: Dictionary('agvTaskType', [detailInfo.type]),
                        })}
                      </span>
                    }
                  />
                </Col>
                <Col {...colProps}>
                  <DescriptionItem
                    title={<FormattedMessage id="app.task.state" />}
                    content={this.renderStatus(detailInfo.taskStatus)}
                  />
                </Col>
                <Col {...colProps}>
                  <DescriptionItem
                    title={<FormattedMessage id="app.taskDetail.targetCellId" />}
                    content={<span>{detailInfo.targetCellId}</span>}
                  />
                </Col>
                <Col {...colProps}>
                  <DescriptionItem
                    title={<FormattedMessage id="app.agv.id" />}
                    content={<span>{detailInfo.currentRobotId}</span>}
                  />
                </Col>
                {currentType === AGVType.LatentLifting && (
                  <Col {...colProps}>
                    <DescriptionItem
                      title={<span>{formatMessage({ id: 'app.pod.id' })}</span>}
                      content={<span>{detailInfo.podId}</span>}
                    />
                  </Col>
                )}
              </Row>
            )}

            {/** *******************************AGV实时料仓*********************************** */}
            {(detailInfo.toteAGVWorkBinInfoMap || detailInfo.toteAGVTaskActionDTOS) && (
              <div>
                <Divider orientation="left">
                  {formatMessage({ id: 'app.taskDetail.realTime' })}
                </Divider>
                <ToteAGVWorkBinInfoMap {...detailInfo} />
              </div>
            )}

            {/** *******************************料箱确认抱夹信息*********************************** */}
            {detailInfo.toteHoldingCode && (
              <div>
                <Divider orientation="left">
                  {formatMessage({ id: 'app.taskDetail.confirmHugTote' })}
                </Divider>
                <div style={{ display: 'flex', width: '30%' }}>
                  <Input defaultValue={detailInfo.toteHoldingCode} ref={this.toteHoldingInput} />
                  <Button type="primary" style={{ marginLeft: 10 }} onClick={this.confirmHolding}>
                    <FormattedMessage id="app.taskDetail.sure" />
                  </Button>
                </div>
              </div>
            )}

            {/** *******************************小车错误记录*********************************** */}
            {errorTaskList && errorTaskList.length > 0 && (
              <Permission id="/map/monitor/taskDetail/taskDetail/errorRecord">
                <div>
                  <Divider orientation="left">
                    {formatMessage({ id: 'app.taskDetail.errorRecord' })}
                  </Divider>
                  <ErrorList agvErrorList={errorTaskList} errorCodes={errorCodes} />
                </div>
              </Permission>
            )}

            {/** *******************************工作站任务*********************************** */}
            {detailInfo.type === 'SUPER_CARRY_POD_TO_CELL' && (
              <>
                <Divider orientation="left">
                  <FormattedMessage id="app.taskDetail.superCarryPodToCell" />
                </Divider>
                <Row>
                  <Col {...colProps}>
                    <DescriptionItem
                      title={<FormattedMessage id="app.taskDetail.targetCellDirection" />}
                      content={
                        detailInfo.workStationDirection && (
                          <>
                            {formatMessage({ id: 'app.taskDetail.stopPoints' })}
                            {formatMessage({
                              id: Dictionary('chargerDirection', [detailInfo.workStationDirection]),
                            })}
                          </>
                        )
                      }
                    />
                  </Col>
                  <Col {...colProps}>
                    <DescriptionItem
                      title={<FormattedMessage id="app.taskDetail.targetStopCellId" />}
                      content={<span>{detailInfo.targetCellId}</span>}
                    />
                  </Col>
                  <Col {...colProps}>
                    <DescriptionItem
                      title={<FormattedMessage id="app.pod.direction" />}
                      content={
                        <>
                          {formatMessage({
                            id: Dictionary('podDirection', [detailInfo.podAngle]),
                            defaultValue: detailInfo.podAngle,
                          })}
                        </>
                      }
                    />
                  </Col>
                  <Col {...colProps}>
                    <DescriptionItem
                      title={<FormattedMessage id="app.taskDetail.isReleased" />}
                      content={
                        <>
                          {detailInfo.isReleased != null
                            ? detailInfo.isReleased
                              ? `${formatMessage({ id: 'app.common.true' })}`
                              : `${formatMessage({ id: 'app.common.false' })}`
                            : null}
                        </>
                      }
                    />
                  </Col>
                </Row>
              </>
            )}

            {/** *******************************工作站任务*********************************** */}
            {detailInfo.type === 'CARRY_POD_TO_STATION' && (
              <>
                <Divider orientation="left">
                  <FormattedMessage id="app.taskDetail.workStationTask" />
                </Divider>
                <Row>
                  <Col {...colProps}>
                    <DescriptionItem
                      title={<FormattedMessage id="app.taskDetail.targetCellDirection" />}
                      content={
                        detailInfo.workStationDirection != null ? (
                          <>
                            {formatMessage({ id: 'app.taskDetail.stopPoints' })}
                            {formatMessage({
                              id: Dictionary('chargerDirection', [detailInfo.workStationDirection]),
                            })}
                          </>
                        ) : null
                      }
                    />
                  </Col>
                  <Col {...colProps}>
                    <DescriptionItem
                      title={
                        <>
                          <FormattedMessage id="app.taskDetail.workStationStopCellId" />
                        </>
                      }
                      content={<span>{detailInfo.workStationStopCellId}</span>}
                    />
                  </Col>
                  <Col {...colProps}>
                    <DescriptionItem
                      title={<FormattedMessage id="app.pod.direction" />}
                      content={
                        <>
                          {formatMessage({
                            id: Dictionary('podDirection', [detailInfo.podAngle]),
                            defaultValue: detailInfo.podAngle,
                          })}
                        </>
                      }
                    />
                  </Col>
                  <Col {...colProps}>
                    <Col {...colProps}>
                      <DescriptionItem
                        title={<FormattedMessage id="app.taskDetail.isReleased" />}
                        content={
                          <>
                            {detailInfo.isReleased != null
                              ? detailInfo.isReleased
                                ? `${formatMessage({ id: 'app.common.true' })}`
                                : `${formatMessage({ id: 'app.common.false' })}`
                              : null}
                          </>
                        }
                      />
                    </Col>
                  </Col>
                </Row>
              </>
            )}

            {/** *******************************充电记录*********************************** */}
            {chargeRecord && (
              <div>
                <Divider orientation="left">
                  <FormattedMessage id="app.taskDetail.chargingRecord" />
                </Divider>

                <Col>
                  <DescriptionItem
                    title={<FormattedMessage id="app.taskDetail.chargerId" />}
                    content={<span>{detailInfo.chargerId}</span>}
                  />
                </Col>
                <Row>
                  <Col {...colProps}>
                    <DescriptionItem
                      title={<FormattedMessage id="app.taskDetail.startTime" />}
                      content={
                        <>
                          {dateFormat(chargeRecord.startChargingTime).format('YYYY-MM-DD HH:mm:ss')}
                        </>
                      }
                    />
                  </Col>
                  <Col {...colProps}>
                    <DescriptionItem
                      title={<FormattedMessage id="app.taskDetail.endTime" />}
                      content={
                        <>
                          {dateFormat(chargeRecord.stopChargingTime).format('YYYY-MM-DD HH:mm:ss')}
                        </>
                      }
                    />
                  </Col>
                </Row>
                <Row>
                  <Col {...colProps}>
                    <DescriptionItem
                      title={<FormattedMessage id="app.taskDetail.startingPower" />}
                      content={<span>{chargeRecord.startChargingBattery}%</span>}
                    />
                  </Col>
                  <Col {...colProps}>
                    <DescriptionItem
                      title={<FormattedMessage id="app.taskDetail.endPower" />}
                      content={<span>{chargeRecord.finishChargingBattery}%</span>}
                    />
                  </Col>
                </Row>
              </div>
            )}

            {/** *******************************叉车搬运货物到目标点*********************************** */}
            {detailInfo.type === 'FORK_POD_TO_TARGET' && (
              <Row>
                <Col>
                  <DescriptionItem
                    title={<FormattedMessage id="app.taskDetail.forkSourceStorageCode" />}
                    content={<span>{detailInfo.forkPodParam.sourceStorageCode}</span>}
                  />
                </Col>
                <Col>
                  <DescriptionItem
                    title={<FormattedMessage id="app.taskDetail.forkTargetStorageCode" />}
                    content={<span>{detailInfo.forkPodParam.targetStorageCode}</span>}
                  />
                </Col>
              </Row>
            )}
          </Card>
        )}
      </div>
    );
  }
}
export default TaskDetail;
