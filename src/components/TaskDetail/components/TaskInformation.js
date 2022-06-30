import React, { createRef, PureComponent } from 'react';
import { Badge, Button, Card, Col, Divider, Empty, Input, Modal, Row } from 'antd';
import { VehicleType } from '@/config/config';
import { connect } from '@/utils/RmsDva';
import Dictionary from '@/utils/Dictionary';
import { convertToUserTimezone, formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import ToteVehicleWorkBinInfoMap from './ToteVehicleWorkBinInfoMap';
import styles from '@/common.module.less';

const colProps = { lg: 8, sm: 12 };
const { red } = Dictionary('color');
const taskStatusMap = ['warning', 'processing', 'success', 'error', 'default'];
const DescriptionItem = ({ title, content }) => (
  <div className={styles.descriptionItem}>
    <p className={styles.itemTitle}>{title}:</p>
    {content}
  </div>
);

@connect(({ global, task }) => ({
  allTaskTypes: global.allTaskTypes,
  detailInfo: task.detailInfo?.vehicleTask,
  chargeRecord: task.detailInfo?.chargeRecord,
}))
class TaskInformation extends PureComponent {
  toteHoldingInput = createRef();

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

  // 重发任务
  restartTask = (sectionId, taskId) => {
    const { dispatch } = this.props;
    Modal.confirm({
      title: (
        <span>
          {formatMessage({ id: 'app.taskDetail.makeSure' })}
          <span style={{ color: 'red', margin: '0px 10px' }}>
            {formatMessage({ id: 'app.taskDetail.retransmission' })}
          </span>
          {formatMessage({ id: 'app.task' })}
        </span>
      ),
      content: (
        <div>
          <span>{formatMessage({ id: 'app.task.id' })}:</span>
          <span style={{ marginRight: 10 }}>{taskId}</span>
        </div>
      ),
      onOk() {
        dispatch({
          type: 'task/fetchRestartTask',
          payload: { vehicleType: VehicleType.Sorter, sectionId, taskId },
        });
      },
      okText: formatMessage({ id: 'app.button.confirm' }),
      cancelText: formatMessage({ id: 'app.button.cancel' }),
    });
  };

  // 恢复任务
  restoreTask = (sectionId, taskId) => {
    const { dispatch } = this.props;
    Modal.confirm({
      title: (
        <span>
          {formatMessage({ id: 'app.taskDetail.makeSure' })}
          <span style={{ color: 'red', margin: '0px 10px' }}>
            {formatMessage({ id: 'app.taskDetail.restore' })}
          </span>
          {formatMessage({ id: 'app.task' })}
        </span>
      ),
      content: (
        <div>
          <span>{formatMessage({ id: 'app.task.id' })}:</span>
          <span style={{ marginRight: 10 }}>{taskId}</span>
        </div>
      ),
      onOk() {
        dispatch({
          type: 'task/fetchRestoreTask',
          payload: { vehicleType: VehicleType.Sorter, sectionId, taskId },
        });
      },
      okText: formatMessage({ id: 'app.button.confirm' }),
      cancelText: formatMessage({ id: 'app.button.cancel' }),
    });
  };

  // 重做任务
  forceResetTask = (sectionId, taskId) => {
    const { dispatch } = this.props;
    Modal.confirm({
      title: (
        <span>
          {formatMessage({ id: 'app.taskDetail.makeSure' })}
          <span
            style={{
              color: 'red',
              margin: '0px 10px',
            }}
          >
            {formatMessage({ id: 'app.taskDetail.reset' })}
          </span>
          {formatMessage({ id: 'app.task' })}
        </span>
      ),
      content: (
        <div>
          <div>
            <span>{formatMessage({ id: 'app.task.id' })}:</span>
            <span style={{ marginRight: 10 }}>{taskId}</span>
          </div>
          <div>
            <span style={{ marginTop: 10, color: red }}>
              {formatMessage({ id: 'app.taskDetail.makeSureVehicleNotLoadedPodBeforeRedoing' })}
            </span>
          </div>
        </div>
      ),
      onOk() {
        dispatch({
          type: 'task/fetchResetTask',
          payload: { vehicleType: VehicleType.Sorter, sectionId, taskId },
        });
      },
      okText: formatMessage({ id: 'app.button.confirm' }),
      cancelText: formatMessage({ id: 'app.button.cancel' }),
    });
  };

  // 取消任务
  cancelTask = (taskId) => {
    const { dispatch } = this.props;
    Modal.confirm({
      title: (
        <span>
          {formatMessage({ id: 'app.taskDetail.makeSure' })}
          <span style={{ color: 'red', margin: '0px 10px' }}>
            {formatMessage({ id: 'app.button.cancel' })}
          </span>
          {formatMessage({ id: 'app.task' })}
        </span>
      ),
      content: (
        <div>
          <span>{formatMessage({ id: 'app.task.id' })}:</span>
          <span style={{ marginRight: 10 }}>{taskId}</span>
        </div>
      ),
      onOk() {
        dispatch({
          type: 'task/fetchCancelTask',
          payload: { taskIdList: [taskId] },
        });
      },
      okText: formatMessage({ id: 'app.button.confirm' }),
      cancelText: formatMessage({ id: 'app.button.cancel' }),
    });
  };

  // 确认抱夹信息
  confirmToteHolding = () => {
    const { detailInfo, dispatch } = this.props;
    const holdingTote = this.toteHoldingInput.current.state.value;
    Modal.confirm({
      title: formatMessage({ id: 'app.taskDetail.confirmToteHolding' }),
      content: <span style={{ fontSize: '15px', color: 'red' }}>{holdingTote}</span>,
      onOk() {
        dispatch({
          type: 'task/fetchConfirmToteHolding',
          payload: { taskId: detailInfo.taskId, holdingTote },
        });
      },
      okText: formatMessage({ id: 'app.button.confirm' }),
      cancelText: formatMessage({ id: 'app.button.cancel' }),
    });
  };

  render() {
    const { detailInfo, chargeRecord, allTaskTypes } = this.props;
    if (!detailInfo) return <Empty />;

    const { taskStatus } = detailInfo;
    const cardExtra = (
      <div>
        {['Cancel', 'Finished'].includes(taskStatus) && (
          <Button
            style={{ marginLeft: 15 }}
            disabled={detailInfo.sectionId == null || detailInfo.taskId == null}
            onClick={() => {
              this.forceResetTask(detailInfo.sectionId, detailInfo.taskId);
            }}
          >
            <FormattedMessage id="app.taskDetail.reset" />
          </Button>
        )}

        {taskStatus === 'Error' && (
          <Button
            style={{ marginLeft: 15 }}
            disabled={detailInfo.sectionId == null || detailInfo.taskId == null}
            onClick={() => {
              this.restoreTask(detailInfo.sectionId, detailInfo.taskId);
            }}
          >
            <FormattedMessage id="app.taskDetail.restore" />
          </Button>
        )}

        {taskStatus === 'Executing' && (
          <Button
            style={{ marginLeft: 15 }}
            disabled={detailInfo.sectionId == null || detailInfo.taskId == null}
            onClick={() => {
              this.restartTask(detailInfo.sectionId, detailInfo.taskId);
            }}
          >
            <FormattedMessage id="app.taskDetail.restart" />
          </Button>
        )}

        {['New', 'Executing', 'Error'].includes(taskStatus) && (
          <Button
            disabled={detailInfo.sectionId == null || detailInfo.taskId == null}
            style={{ marginLeft: 15 }}
            onClick={() => {
              this.cancelTask(detailInfo.taskId);
            }}
          >
            <FormattedMessage id="app.button.cancel" />
          </Button>
        )}
      </div>
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
                    content={detailInfo.taskId}
                  />
                </Col>
                <Col {...colProps}>
                  <DescriptionItem
                    title={<FormattedMessage id="app.common.creationTime" />}
                    content={convertToUserTimezone(detailInfo.createTime).format(
                      'YYYY-MM-DD HH:mm:ss',
                    )}
                  />
                </Col>
                <Col {...colProps}>
                  <DescriptionItem
                    title={<FormattedMessage id="app.taskDetail.createUser" />}
                    content={detailInfo.createdByUser}
                  />
                </Col>
                <Col {...colProps}>
                  <DescriptionItem
                    title={<FormattedMessage id="app.common.updateTime" />}
                    content={convertToUserTimezone(detailInfo.updateTime).format(
                      'YYYY-MM-DD HH:mm:ss',
                    )}
                  />
                </Col>
                <Col {...colProps}>
                  <DescriptionItem
                    title={<FormattedMessage id="app.common.updater" />}
                    content={detailInfo.updatedByUser}
                  />
                </Col>
                <Col {...colProps}>
                  <DescriptionItem
                    title={<FormattedMessage id="app.form.sectionId" />}
                    content={detailInfo.sectionId}
                  />
                </Col>
                <Col {...colProps}>
                  <DescriptionItem
                    title={<FormattedMessage id="app.task.type" />}
                    content={
                      allTaskTypes?.[detailInfo.vehicleTaskType] || detailInfo.vehicleTaskType
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
                    title={<FormattedMessage id="app.common.targetCell" />}
                    content={detailInfo.targetCellId}
                  />
                </Col>
                <Col {...colProps}>
                  <DescriptionItem
                    title={<FormattedMessage id="vehicle.id" />}
                    content={detailInfo.currentVehicleId}
                  />
                </Col>
                <Col {...colProps}>
                  <DescriptionItem
                    title={<FormattedMessage id="app.vehicleType" />}
                    content={detailInfo.vehicleType}
                  />
                </Col>
                <Col {...colProps}>
                  <DescriptionItem
                    title={<FormattedMessage id='resource.load' />}
                    content={detailInfo.loads?.join()}
                  />
                </Col>
                <Col {...colProps}>
                  <DescriptionItem
                    title={<FormattedMessage id='resource.load.direction' />}
                    content={detailInfo.loadAngle}
                  />
                </Col>
              </Row>
            )}

            {/** ******************************* Vehicle实时料仓 *********************************** */}
            {(detailInfo.toteVehicleWorkBinInfoMap || detailInfo.toteVehicleTaskActionDTOS) && (
              <div>
                <Divider orientation="left">
                  {formatMessage({ id: 'app.taskDetail.realTime' })}
                </Divider>
                <ToteVehicleWorkBinInfoMap {...detailInfo} />
              </div>
            )}

            {/** ******************************* 料箱确认抱夹信息 *********************************** */}
            {detailInfo.toteHoldingCode && (
              <div>
                <Divider orientation="left">
                  {formatMessage({ id: 'app.taskDetail.confirmHugTote' })}
                </Divider>
                <div style={{ display: 'flex', width: '30%' }}>
                  <Input defaultValue={detailInfo.toteHoldingCode} ref={this.toteHoldingInput} />
                  <Button
                    type="primary"
                    style={{ marginLeft: 10 }}
                    onClick={this.confirmToteHolding}
                  >
                    <FormattedMessage id="app.button.confirm" />
                  </Button>
                </div>
              </div>
            )}

            {/** ******************************* 工作站任务 *********************************** */}
            {detailInfo.type === 'SUPER_CARRY_POD_TO_CELL' && (
              <>
                <Divider orientation="left">
                  <FormattedMessage id="app.taskDetail.superCarryPodToSpot" />
                </Divider>
                <Row>
                  <Col {...colProps}>
                    <DescriptionItem
                      title={<FormattedMessage id="app.taskDetail.targetSpotDirection" />}
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
                      title={<FormattedMessage id="app.taskDetail.targetStopSpotId" />}
                      content={detailInfo.targetCellId}
                    />
                  </Col>
                  <Col {...colProps}>
                    <DescriptionItem
                      title={<FormattedMessage id="app.pod.direction" />}
                      content={formatMessage({
                        id: Dictionary('podDirection', [detailInfo.podAngle]),
                        defaultValue: detailInfo.podAngle,
                      })}
                    />
                  </Col>
                  <Col {...colProps}>
                    <DescriptionItem
                      title={<FormattedMessage id="app.taskDetail.isReleased" />}
                      content={
                        detailInfo.isReleased != null
                          ? detailInfo.isReleased
                            ? `${formatMessage({ id: 'app.common.true' })}`
                            : `${formatMessage({ id: 'app.common.false' })}`
                          : null
                      }
                    />
                  </Col>
                </Row>
              </>
            )}

            {/** ******************************* 工作站任务 *********************************** */}
            {detailInfo.type === 'CARRY_POD_TO_STATION' && (
              <>
                <Divider orientation="left">
                  <FormattedMessage id="app.taskDetail.workStationTask" />
                </Divider>
                <Row>
                  <Col {...colProps}>
                    <DescriptionItem
                      title={<FormattedMessage id="app.taskDetail.targetSpotDirection" />}
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
                      title={<FormattedMessage id="app.taskDetail.workStationStopSpotId" />}
                      content={detailInfo.workStationStopCellId}
                    />
                  </Col>
                  <Col {...colProps}>
                    <DescriptionItem
                      title={<FormattedMessage id="app.pod.direction" />}
                      content={formatMessage({
                        id: Dictionary('podDirection', [detailInfo.podAngle]),
                        defaultValue: detailInfo.podAngle,
                      })}
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

            {/** ******************************* 充电记录 *********************************** */}
            {chargeRecord && (
              <div>
                <Divider orientation="left">
                  <FormattedMessage id="app.taskDetail.chargingRecord" />
                </Divider>

                <Col>
                  <DescriptionItem
                    title={<FormattedMessage id="app.taskDetail.chargerId" />}
                    content={detailInfo.chargerId}
                  />
                </Col>
                <Row>
                  <Col {...colProps}>
                    <DescriptionItem
                      title={<FormattedMessage id="app.taskDetail.startTime" />}
                      content={convertToUserTimezone(chargeRecord.startChargingTime).format(
                        'YYYY-MM-DD HH:mm:ss',
                      )}
                    />
                  </Col>
                  <Col {...colProps}>
                    <DescriptionItem
                      title={<FormattedMessage id="app.taskDetail.endTime" />}
                      content={convertToUserTimezone(chargeRecord.stopChargingTime).format(
                        'YYYY-MM-DD HH:mm:ss',
                      )}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col {...colProps}>
                    <DescriptionItem
                      title={<FormattedMessage id="app.taskDetail.startingPower" />}
                      content={`${chargeRecord.startChargingBattery}%`}
                    />
                  </Col>
                  <Col {...colProps}>
                    <DescriptionItem
                      title={<FormattedMessage id="app.taskDetail.endPower" />}
                      content={`${chargeRecord.finishChargingBattery}%`}
                    />
                  </Col>
                </Row>
              </div>
            )}

            {/** ******************************* 叉车搬运货物到目标点 *********************************** */}
            {detailInfo.type === 'FORK_POD_TO_TARGET' && (
              <Row>
                <Col>
                  <DescriptionItem
                    title={<FormattedMessage id="app.taskDetail.forkSourceStorageCode" />}
                    content={detailInfo.forkPodParam.sourceStorageCode}
                  />
                </Col>
                <Col>
                  <DescriptionItem
                    title={<FormattedMessage id="app.taskDetail.forkTargetStorageCode" />}
                    content={detailInfo.forkPodParam.targetStorageCode}
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
export default TaskInformation;
