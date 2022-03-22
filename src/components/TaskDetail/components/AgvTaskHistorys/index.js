import React, { PureComponent } from 'react';
import { Steps, Form, Divider, Row, Tooltip } from 'antd';
import {
  MehOutlined,
  LoadingOutlined,
  SmileOutlined,
  FrownOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { formatMessage } from '@/utils/util';
import RenderAgvTaskActions from '../AgvTaskSteps/RenderAgvTaskActions';
import intl from 'react-intl-universal';

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

class AgvTaskHistory extends PureComponent {
  renderTaskStep = (subTask) => {
    const { taskDetail } = this.props;
    const { translateMap } = taskDetail;
    return (
      <Form style={{ width: '100%', marginBottom: 20 }} layout={'vertical'}>
        <Form.Item label={intl.formatMessage({ id: 'app.taskDetail.taskSteps' })}>
          <RenderAgvTaskActions subTask={subTask} translation={translateMap} />
        </Form.Item>
      </Form>
    );
  };

  renderSteps = () => {
    const { taskDetail } = this.props;
    const { agvStepTasks } = taskDetail;
    if (Array.isArray(agvStepTasks)) {
      return agvStepTasks.map((taskStep, key) => (
        <Step
          key={key}
          title={
            <Divider style={{ lineHeight: 0 }} orientation="left">
              {taskStep.stepTaskType}
            </Divider>
          }
          status={TaskStatus[taskStep.stepTaskStatus]} // 决定任务步骤进度
          icon={
            <Tooltip placement="bottom" title={taskStep.stepTaskStatus}>
              {TaskStatusIcon[taskStep.stepTaskStatus]}
            </Tooltip>
          }
          description={
            <div style={{ width: '100%', marginBottom: 20 }}>{this.renderTaskStep(taskStep)}</div>
          }
        />
      ));
    }
    return [];
  };

  render() {
    return <Steps direction="vertical">{this.renderSteps()}</Steps>;
  }
}
export default AgvTaskHistory;
