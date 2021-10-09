import React, { PureComponent } from 'react';
import { Row, Form, Steps, Divider, Tooltip } from 'antd';
import {
  MehOutlined,
  LoadingOutlined,
  SmileOutlined,
  FrownOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { GMT2UserTimeZone, formatMessage } from '@/utils/utils';
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
  renderDescription = (records) => {
    const { robotType } = this.props;
    const { stepTaskStatus } = records;
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
        {records.predictEndTime && (
          <div style={{ color: 'rgba(0, 0, 0, 0.85', marginBottom: 15 }}>{`${formatMessage({
            id: 'app.taskDetail.finishTime',
          })} ${parseInt(records.predictEndTime / 1000, 10)}s`}</div>
        )}

        {/* 操作时间 */}
        <Form.Item label={`${formatMessage({ id: 'app.taskDetail.operatingTime' })}:`}>
          <Steps current={current}>
            <Step
              title={'NEW'}
              status={current === 1 ? 'process' : 'finish'}
              description={
                records.createTime
                  ? GMT2UserTimeZone(records.createTime).format('MM-DD HH:mm:ss')
                  : null
              }
            />
            <Step
              title={'START'}
              status={current === 2 ? 'process' : current === 3 ? 'finish' : 'wait'}
              description={
                records.startTime
                  ? GMT2UserTimeZone(records.startTime).format('MM-DD HH:mm:ss')
                  : null
              }
            />
            <Step
              title={'END'}
              status={current === 3 ? 'finish' : 'wait'}
              description={
                records.endTime ? GMT2UserTimeZone(records.endTime).format('MM-DD HH:mm:ss') : null
              }
            />
          </Steps>
        </Form.Item>

        {/* 任务步骤 */}
        <Form.Item label={`${formatMessage({ id: 'app.task.step' })}:`}>
          <Row>
            <RenderAgvTaskActions currentType={robotType} taskActions={records.taskActions} />
          </Row>
        </Form.Item>
      </Form>
    );
  };

  renderStep = () => {
    const { step = [] } = this.props;
    const result = [];
    step.forEach((record, key) => {
      result.push(
        <Step
          key={key}
          icon={
            <Tooltip placement="bottom" title={record.stepTaskStatus}>
              {TaskStatusIcon[record.stepTaskStatus]}
            </Tooltip>
          }
          title={
            <Divider style={{ lineHeight: 0 }} orientation="left">
              {record.stepTaskType}
            </Divider>
          }
          status={TaskStatus[record.stepTaskStatus]} // 决定任务步骤进度
          description={this.renderDescription(record)}
        />,
      );
    });
    return result;
  };

  render() {
    return <Steps direction="vertical">{this.renderStep()}</Steps>;
  }
}
export default AgvTaskSteps;
