import React, { PureComponent } from 'react';
import { Divider, Form, Steps, Tooltip } from 'antd';
import { ClockCircleOutlined, FrownOutlined, LoadingOutlined, MehOutlined, SmileOutlined } from '@ant-design/icons';
import { formatMessage } from '@/utils/util';
import RenderVehicleTaskActions from './VehicleTaskSteps/RenderVehicleTaskActions';

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

class VehicleTaskHistory extends PureComponent {
  renderTaskStep = (subTask) => {
    const { taskDetail } = this.props;
    const { translateMap } = taskDetail;
    return (
      <Form style={{ width: '100%', marginBottom: 20 }} layout={'vertical'}>
        <Form.Item label={formatMessage({ id: 'app.taskDetail.taskSteps' })}>
          <RenderVehicleTaskActions subTask={subTask} translation={translateMap} />
        </Form.Item>
      </Form>
    );
  };

  renderSteps = () => {
    const { taskDetail } = this.props;
    const { vehicleStepTasks } = taskDetail;
    if (Array.isArray(vehicleStepTasks)) {
      return vehicleStepTasks.map((taskStep, key) => (
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
export default VehicleTaskHistory;
