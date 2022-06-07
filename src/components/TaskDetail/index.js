import React, { PureComponent } from 'react';
import { connect } from '@/utils/RmsDva';
import { Card, Empty, Modal, Spin, Tabs } from 'antd';
import { VehicleType } from '@/config/config';
import Dictionary from '@/utils/Dictionary';
import { adjustModalWidth, formatMessage } from '@/utils/util';
import TaskInformation from './components/TaskInformation';
import VehicleTaskSteps from './components/VehicleTaskSteps';
import VehicleTaskHistory from './components/VehicleTaskHistorys';
import TaskRecordOrAlarm from './components/TaskRecordOrAlarm';

const { red } = Dictionary('color');
const { confirm } = Modal;

@connect(({ task }) => ({ task }))
class TaskDetail extends PureComponent {
  state = {
    allErrorDefinitions: {},
  };

  // 重发任务
  restartTask = (sectionId, taskId) => {
    const { dispatch } = this.props;
    confirm({
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
    confirm({
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
    confirm({
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
  cancel = (sectionId, taskId) => {
    const { dispatch } = this.props;
    confirm({
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
          payload: { vehicleType: VehicleType.Sorter, sectionId, taskId },
        });
      },
      okText: formatMessage({ id: 'app.button.confirm' }),
      cancelText: formatMessage({ id: 'app.button.cancel' }),
    });
  };

  // 确认抱夹信息
  confirmToteHolding = (sectionId, taskId, holdingTote) => {
    const { dispatch } = this.props;
    confirm({
      title: formatMessage({ id: 'app.taskDetail.confirmToteHolding' }),
      content: <span style={{ fontSize: '15px', color: 'red' }}>{holdingTote}</span>,
      onOk() {
        dispatch({
          type: 'task/fetchConfirmToteHolding',
          payload: { sectionId, taskId, holdingTote },
        });
      },
      okText: formatMessage({ id: 'app.button.confirm' }),
      cancelText: formatMessage({ id: 'app.button.cancel' }),
    });
  };

  resetTaskDetailModal = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'task/fetchResetTaskDetailModal' });
  };

  render() {
    const { allErrorDefinitions } = this.state;
    const {
      task: {
        loadingTaskDetail,
        taskDetailVisible,
        taskVehicleType,
        detailInfo,
        taskRecord,
        taskAlarm,
      },
    } = this.props;
    return (
      <Modal
        style={{ top: 30 }}
        width={adjustModalWidth()}
        onCancel={this.resetTaskDetailModal}
        visible={taskDetailVisible}
        footer={null}
      >
        <Spin spinning={loadingTaskDetail}>
          <Tabs defaultActiveKey="a">
            {/********* 任务详情 ******** */}
            <Tabs.TabPane tab={formatMessage({ id: 'app.task.detail' })} key="a">
              <TaskInformation
                currentType={taskVehicleType}
                errorCodes={allErrorDefinitions}
                detailInfo={detailInfo.taskDetail}
                chargeRecord={detailInfo.chargeRecord}
                cancel={this.cancel}
                restartTask={this.restartTask}
                restoreTask={this.restoreTask}
                forceStandBy={this.forceResetTask}
                confirmToteHolding={this.confirmToteHolding}
              />
            </Tabs.TabPane>

            {/******* 任务路径 ******** */}
            <Tabs.TabPane tab={formatMessage({ id: 'app.task.path' })} key="b">
              {Array.isArray(detailInfo?.taskDetail?.vehicleStepTasks) ? (
                <Card bordered={false}>
                  <VehicleTaskSteps taskDetail={detailInfo.taskDetail} />
                </Card>
              ) : (
                <Empty />
              )}
            </Tabs.TabPane>

            {/********* 任务记录 *********/}
            {window.localStorage.getItem('dev') === 'true' && (
              <Tabs.TabPane key="c" tab={formatMessage({ id: 'app.task.record' })}>
                {Array.isArray(detailInfo?.taskDetail?.vehicleStepTaskHistorys) ? (
                  <Card bordered={false}>
                    <VehicleTaskHistory taskDetail={detailInfo.taskDetail} />
                  </Card>
                ) : (
                  <Empty />
                )}
              </Tabs.TabPane>
            )}

            {/********* 任务日志 *********/}
            <Tabs.TabPane tab={formatMessage({ id: 'app.task.log' })} key="d">
              {taskRecord.length > 0 ? (
                <Card bordered={true}>
                  <TaskRecordOrAlarm taskRecord={taskRecord} />
                </Card>
              ) : (
                <Empty />
              )}
            </Tabs.TabPane>

            {/********* 任务告警 *********/}
            <Tabs.TabPane tab={formatMessage({ id: 'app.taskAlarm' })} key="e">
              {taskAlarm.length > 0 ? (
                <Card bordered={true}>
                  <TaskRecordOrAlarm taskAlarm={taskAlarm} />
                </Card>
              ) : (
                <Empty />
              )}
            </Tabs.TabPane>
          </Tabs>
        </Spin>
      </Modal>
    );
  }
}

export default TaskDetail;
