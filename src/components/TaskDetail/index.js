import React, { PureComponent } from 'react';
import { connect } from '@/utils/RmsDva';
import { Card, Empty, Modal, Spin, Tabs } from 'antd';
import { adjustTaskDetailModalWidth, formatMessage } from '@/utils/util';
import TaskInformation from './components/TaskInformation';
import VehicleTaskSteps from './components/VehicleTaskSteps';
import TaskRecordOrAlarm from './components/TaskRecordOrAlarm';

@connect(({ task }) => ({ task }))
class TaskDetail extends PureComponent {
  resetTaskDetailModal = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'task/fetchResetTaskDetailModal' });
  };

  render() {
    const {
      task: { loadingTaskDetail, taskDetailVisible, detailInfo, taskRecord, taskAlarm },
    } = this.props;
    return (
      <Modal
        destroyOnClose
        style={{ top: 30 }}
        width={adjustTaskDetailModalWidth()}
        onCancel={this.resetTaskDetailModal}
        visible={taskDetailVisible}
        bodyStyle={{ maxHeight: '95vh', overflow: 'auto' }}
        footer={null}
      >
        <Spin spinning={loadingTaskDetail}>
          <Tabs defaultActiveKey="a">
            {/********* 任务详情 ******** */}
            <Tabs.TabPane tab={formatMessage({ id: 'app.task.detail' })} key="a">
              <TaskInformation />
            </Tabs.TabPane>

            {/******* 任务路径 ******** */}
            <Tabs.TabPane tab={formatMessage({ id: 'app.task.path' })} key="b">
              {detailInfo?.vehicleTask ? (
                <Card bordered={false}>
                  <VehicleTaskSteps />
                </Card>
              ) : (
                <Empty />
              )}
            </Tabs.TabPane>

            {/********* 任务记录 *********/}
            {/*{window.localStorage.getItem('dev') === 'true' && (*/}
            {/*  <Tabs.TabPane key="c" tab={formatMessage({ id: 'app.task.record' })}>*/}
            {/*    {Array.isArray(detailInfo?.taskDetail?.vehicleStepTaskHistorys) ? (*/}
            {/*      <Card bordered={false}>*/}
            {/*        <VehicleTaskHistory taskDetail={detailInfo.taskDetail} />*/}
            {/*      </Card>*/}
            {/*    ) : (*/}
            {/*      <Empty />*/}
            {/*    )}*/}
            {/*  </Tabs.TabPane>*/}
            {/*)}*/}

            {/********* 任务日志 *********/}
            <Tabs.TabPane tab={formatMessage({ id: 'app.task.log' })} key="d">
              {taskRecord.length > 0 ? (
                <Card bordered={false}>
                  <TaskRecordOrAlarm />
                </Card>
              ) : (
                <Empty />
              )}
            </Tabs.TabPane>

            {/********* 任务告警 *********/}
            <Tabs.TabPane tab={formatMessage({ id: 'app.taskAlarm' })} key="e">
              {taskAlarm.length > 0 ? (
                <Card bordered={false}>
                  <TaskRecordOrAlarm />
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
