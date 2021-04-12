import React, { PureComponent } from 'react';
import { Steps, Form, Divider, Row } from 'antd';
import {
  MehOutlined,
  LoadingOutlined,
  SmileOutlined,
  FrownOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { formatMessage } from '@/utils/Lang';
import RenderAgvTaskActions from '../AgvTaskSteps/RenderAgvTaskActions';

const Step = Steps.Step;
const taskStatus = {
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
  renderDescription = (records) => {
    return (
      <Form style={{ width: '100%', marginBottom: 20 }} layout={'vertical'}>
        <Form.Item label={formatMessage({ id: 'app.task.step' })}>
          <Row>
            {<RenderAgvTaskActions taskActions={records} currentType={this.props.currentType} />}
          </Row>
        </Form.Item>
      </Form>
    );
  };

  renderSteps = () => {
    const result = [];
    const { step = [] } = this.props;
    step.forEach((record, key) => {
      result.push(
        <Step
          key={key}
          title={
            <Divider style={{ lineHeight: 0 }} orientation="left">
              {record.stepTaskType}
            </Divider>
          }
          status={taskStatus[record.stepTaskStatus]}
          icon={TaskStatusIcon[record.stepTaskStatus]}
          description={this.renderDescription(record.taskActions)}
        />,
      );
    });
    return result;
  };

  render() {
    return <Steps direction="vertical">{this.renderSteps()}</Steps>;
  }
}
// 历史任务组件
export default AgvTaskHistory;
