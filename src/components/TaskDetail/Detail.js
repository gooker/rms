import React, { PureComponent } from 'react';
import { Col, Card, Modal, Spin, Empty, Tabs } from 'antd';
import { connect } from '@/utils/dva';
import { formatMessage } from '@/utils/Lang';
import AgvTaskSteps from './components/AgvTaskSteps';
import AgvTaskHistory from './components/AgvTaskHistorys';
import DetailInfo from './components/DetailInfo';
import TaskDetail from './TaskDetail';
import { adjustModalWidth } from '@/utils/utils';
import Dictionary from '@/utils/Dictionary';
import { hasPermission } from '@/utils/Permission';

const { red } = Dictionary('color');
const { confirm } = Modal;

@connect(({ task }) => ({ task }))
class Detail extends PureComponent {
  state = {
    allErrorDefinitions: {},
  };

  componentDidMount() {
    // TODO:获取当前车类型的所有错误定义数据
  }

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
          {formatMessage({ id: 'app.taskDetail.task' })}
        </span>
      ),
      content: (
        <div>
          <span>{formatMessage({ id: 'app.taskDetail.taskId' })}:</span>
          <span style={{ marginRight: 10 }}>{taskId}</span>
        </div>
      ),
      onOk() {
        dispatch({ type: 'task/fetchRestartTask', payload: { sectionId, taskId } });
      },
      okText: formatMessage({ id: 'app.taskDetail.sure' }),
      cancelText: formatMessage({ id: 'app.taskDetail.cancel' }),
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
          {formatMessage({ id: 'app.taskDetail.task' })}
        </span>
      ),
      content: (
        <div>
          <span>{formatMessage({ id: 'app.taskDetail.taskId' })}:</span>
          <span style={{ marginRight: 10 }}>{taskId}</span>
        </div>
      ),
      onOk() {
        dispatch({ type: 'task/fetchRestoreTask', payload: { sectionId, taskId } });
      },
      okText: formatMessage({ id: 'app.taskDetail.sure' }),
      cancelText: formatMessage({ id: 'app.taskDetail.cancel' }),
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
            {formatMessage({ id: 'app.taskDetail.redo' })}
          </span>
          {formatMessage({ id: 'app.taskDetail.task' })}
        </span>
      ),
      content: (
        <div>
          <div>
            <span>{formatMessage({ id: 'app.taskDetail.taskId' })}:</span>
            <span style={{ marginRight: 10 }}>{taskId}</span>
          </div>
          <div>
            <span
              style={{
                marginTop: 10,
                color: red,
              }}
            >
              {formatMessage({ id: 'app.taskDetail.makeSureRobotNotLoadedPodBeforeRedoing' })}
            </span>
          </div>
        </div>
      ),
      onOk() {
        dispatch({ type: 'task/fetchResetTask', payload: { sectionId, taskId } });
      },
      okText: formatMessage({ id: 'app.taskDetail.sure' }),
      cancelText: formatMessage({ id: 'app.taskDetail.cancel' }),
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
            {formatMessage({ id: 'app.taskDetail.cancel' })}
          </span>
          {formatMessage({ id: 'app.taskDetail.task' })}
        </span>
      ),
      content: (
        <div>
          <span>{formatMessage({ id: 'app.taskDetail.taskId' })}:</span>
          <span style={{ marginRight: 10 }}>{taskId}</span>
        </div>
      ),
      onOk() {
        dispatch({ type: 'task/fetchCancelTask', payload: { sectionId, taskId } });
      },
      okText: formatMessage({ id: 'app.taskDetail.sure' }),
      cancelText: formatMessage({ id: 'app.taskDetail.cancel' }),
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
      okText: formatMessage({ id: 'app.taskDetail.sure' }),
      cancelText: formatMessage({ id: 'app.taskDetail.cancel' }),
    });
  };

  resetTaskDetailModal = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'task/fetchResetTaskDetailModal' });
  };

  render() {
    const { allErrorDefinitions } = this.state;
    const {
      task: { loadingTaskDetail, taskDetailVisible, taskAgvType, detailInfo, singleErrorTask },
    } = this.props;
    return (
      <DetailInfo
        propsWidth={adjustModalWidth()}
        visibleDetail={taskDetailVisible}
        onClose={this.resetTaskDetailModal}
      >
        {detailInfo && (
          <Spin spinning={loadingTaskDetail}>
            <Tabs defaultActiveKey="a">
              {/** ******* 任务详情 ******** */}
              {!hasPermission('/map/monitor/taskDetail/taskDetail') && (
                <Tabs.TabPane tab={formatMessage({ id: 'app.task.detail' })} key="a">
                  <TaskDetail
                    currentType={taskAgvType}
                    errorTaskList={singleErrorTask}
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
              )}

              {/** ******* 任务路径 ******** */}
              {!hasPermission('/map/monitor/taskDetail/taskPath') && (
                <Tabs.TabPane tab={formatMessage({ id: 'app.task.path' })} key="b">
                  {detailInfo.taskDetail && detailInfo.taskDetail.agvStepTasks ? (
                    <AgvTaskSteps
                      robotType={taskAgvType}
                      step={detailInfo.taskDetail.agvStepTasks}
                    />
                  ) : (
                    <Empty />
                  )}
                </Tabs.TabPane>
              )}

              {/** ******* 历史任务 ******** */}
              {!hasPermission('/map/monitor/taskDetail/historyRecord') && (
                <Tabs.TabPane key="c" tab={formatMessage({ id: 'app.task.record' })}>
                  <Col span={24}>
                    {detailInfo.taskDetail && detailInfo.taskDetail.agvStepTaskHistorys ? (
                      <Card bordered={false}>
                        <AgvTaskHistory
                          robotType={taskAgvType}
                          step={detailInfo.taskDetail.agvStepTaskHistorys}
                        />
                      </Card>
                    ) : (
                      <Empty />
                    )}
                  </Col>
                </Tabs.TabPane>
              )}
            </Tabs>
          </Spin>
        )}
      </DetailInfo>
    );
  }
}

export default Detail;
