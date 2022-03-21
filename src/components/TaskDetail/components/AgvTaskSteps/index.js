import React, { PureComponent } from 'react';
import { Form, Steps, Divider, Tooltip } from 'antd';
import {
  MehOutlined,
  LoadingOutlined,
  SmileOutlined,
  FrownOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { convertToUserTimezone, formatMessage } from '@/utils/util';
import RenderAgvTaskActions from './RenderAgvTaskActions';

const Step = Steps.Step;
const TaskStatus = {
  New: 'wait',
  Executing: 'process',
  Finished: 'finish',
  Error: 'error',
  Cancel: 'wait',
};
const TaskStatusIcon = {
  New: <MehOutlined />,
  Executing: <LoadingOutlined />,
  Sending: <LoadingOutlined />,
  Finished: <SmileOutlined />,
  Error: <FrownOutlined />,
  Cancel: <ClockCircleOutlined />,
};

class AgvTaskSteps extends PureComponent {
  renderSteps = () => {
    const {
      taskDetail: { agvStepTasks },
    } = this.props;
    if (Array.isArray(agvStepTasks)) {
      return agvStepTasks.map((subTask, key) => (
        <Step
          key={key}
          title={
            <Divider style={{ lineHeight: 0 }} orientation="left">
              {subTask.stepTaskType}
            </Divider>
          }
          status={TaskStatus[subTask.stepTaskStatus]} // 决定任务步骤进度
          icon={
            <Tooltip placement="bottom" title={subTask.stepTaskStatus}>
              {TaskStatusIcon[subTask.stepTaskStatus]}
            </Tooltip>
          }
          description={
            <div style={{ width: '100%', marginBottom: 20 }}>{this.renderTaskStep(subTask)}</div>
          }
        />
      ));
    }
    return [];
  };

  renderTaskStep = (subTask) => {
    const {
      taskDetail: { translateMap },
    } = this.props;
    const { stepTaskStatus } = subTask;
    let current = 0;
    if (stepTaskStatus === 'New') {
      current = 1;
    } else if (stepTaskStatus === 'Executing') {
      current = 2;
    } else if (stepTaskStatus === 'Finished') {
      current = 3;
    } else if (stepTaskStatus === 'Error') {
      current = 1;
    }

    return (
      <Form style={{ marginTop: 20 }} layout={'vertical'}>
        {/* 预计完成时间 */}
        {subTask.predictEndTime && (
          <div style={{ color: 'rgba(0, 0, 0, 0.85', marginBottom: 15 }}>{`${formatMessage({
            id: 'app.taskDetail.finishTime',
          })} ${parseInt(subTask.predictEndTime / 1000, 10)}s`}</div>
        )}

        {/* 操作时间 */}
        <Form.Item label={`${formatMessage({ id: 'app.taskDetail.operatingTime' })}:`}>
          <Steps current={current}>
            <Step
              title={'NEW'}
              status={current === 1 ? 'process' : 'finish'}
              description={
                subTask.createTime
                  ? convertToUserTimezone(subTask.createTime).format('MM-DD HH:mm:ss')
                  : null
              }
            />
            <Step
              title={'START'}
              status={current === 2 ? 'process' : current === 3 ? 'finish' : 'wait'}
              description={
                subTask.startTime
                  ? convertToUserTimezone(subTask.startTime).format('MM-DD HH:mm:ss')
                  : null
              }
            />
            <Step
              title={'END'}
              status={current === 3 ? 'finish' : 'wait'}
              description={
                subTask.endTime
                  ? convertToUserTimezone(subTask.endTime).format('MM-DD HH:mm:ss')
                  : null
              }
            />
          </Steps>
        </Form.Item>

        {/* 任务步骤 */}
        <Form.Item label={`${formatMessage({ id: 'app.taskDetail.taskSteps' })}:`}>
          <RenderAgvTaskActions subTask={subTask} translation={translateMap} />
        </Form.Item>
      </Form>
    );
  };

  render() {
    return <Steps direction="vertical">{this.renderSteps()}</Steps>;
  }
}
export default AgvTaskSteps;
