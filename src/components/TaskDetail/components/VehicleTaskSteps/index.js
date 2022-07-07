import React, { memo } from 'react';
import { Col, Descriptions, Form, Row, Steps } from 'antd';
import { ClockCircleOutlined, FrownOutlined, LoadingOutlined, MehOutlined, SmileOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { convertToUserTimezone, formatMessage, isNull, isStrictNull } from '@/utils/util';
import RenderVehicleTaskActions from './RenderVehicleTaskActions';
import styles from './index.module.less';
import FormattedMessage from '@/components/FormattedMessage';

const { Step } = Steps;
const TaskStatus = {
  New: 'wait',
  Cancel: 'wait',
  Executing: 'process',
  Finished: 'finish',
  Error: 'error',
};
const TaskStatusIcon = {
  New: <MehOutlined />,
  Executing: <LoadingOutlined />,
  Sending: <LoadingOutlined />,
  Finished: <SmileOutlined />,
  Error: <FrownOutlined />,
  Cancel: <ClockCircleOutlined />,
};

const VehicleTaskSteps = (props) => {
  const { vehicleTask, nowPath } = props;

  function renderSteps() {
    if (Array.isArray(vehicleTask.vehicleStepTaskList)) {
      return vehicleTask.vehicleStepTaskList.map((subTask, index) => (
        <Step
          key={index}
          status={TaskStatus[subTask.taskStatus]}
          icon={TaskStatusIcon[subTask.taskStatus]}
          title={
            <span className={styles.taskStepTitle}>
              {`${subTask.customName} (${subTask.customCode})`}
            </span>
          }
          description={
            <div style={{ width: '100%', marginBottom: 20 }}>{renderTaskStep(subTask, index)}</div>
          }
        />
      ));
    }
    return [];
  }

  function renderTaskStep(subTask, stepIndex) {
    const { taskStatus } = subTask;
    let current = 0;
    if (['New', 'Error'].includes(taskStatus)) {
      current = 1;
    } else if (taskStatus === 'Executing') {
      current = 2;
    } else if (taskStatus === 'Finished') {
      current = 3;
    }

    return (
      <div style={{ marginTop: 20 }}>
        {/* 子任务执行进度 */}
        <Steps current={current} {...(taskStatus === 'Error' ? { status: 'error' } : {})}>
          <Step
            title={'NEW'}
            description={
              subTask.createTime
                ? convertToUserTimezone(subTask.createTime).format('MM-DD HH:mm:ss')
                : null
            }
            icon={current === 0 && <LoadingOutlined />}
          />
          <Step
            title={'START'}
            description={
              subTask.startTime
                ? convertToUserTimezone(subTask.startTime).format('MM-DD HH:mm:ss')
                : null
            }
            icon={current === 1 && <LoadingOutlined />}
          />
          <Step
            title={'END'}
            description={
              subTask.endTime
                ? convertToUserTimezone(subTask.endTime).format('MM-DD HH:mm:ss')
                : null
            }
            icon={current === 2 && <LoadingOutlined />}
          />
        </Steps>

        {/* 子任务详情 */}
        <h4>
          <FormattedMessage id={'app.taskDetail.subTaskDetail'} />:
        </h4>
        <Descriptions bordered>
          <Descriptions.Item label="最后发送时间">
            {subTask.lastSendTime
              ? convertToUserTimezone(subTask.lastSendTime).format('MM-DD HH:mm:ss')
              : null}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {subTask.updateTime
              ? convertToUserTimezone(subTask.updateTime).format('MM-DD HH:mm:ss')
              : null}
          </Descriptions.Item>
          <Descriptions.Item label="路线区">{subTask.routeMap ?? '--'}</Descriptions.Item>
          <Descriptions.Item label="目标点">{subTask.targetCellId}</Descriptions.Item>
          <Descriptions.Item label="目标点方向">
            {!isNull(subTask.targetAngle) && `${subTask.targetAngle}°`}
          </Descriptions.Item>
          {!isStrictNull(subTask.skipReason) && (
            <Descriptions.Item span={3} label="任务跳过原因">
              {subTask.skipReason}
            </Descriptions.Item>
          )}
        </Descriptions>

        {/* 任务步骤 */}
        <h4 style={{ marginTop: 16 }}>
          <FormattedMessage id={'app.task.step'} />:
        </h4>
        <RenderVehicleTaskActions subTask={nowPath?.step === stepIndex ? nowPath : subTask} />
      </div>
    );
  }

  return (
    <div>
      {/* 如果是自定义任务，那么需要显示自定义任务的Code和运单号 */}
      {vehicleTask.vehicleTaskType === 'CUSTOM' && (
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label={formatMessage({ id: 'menu.customTask' })}>
              {`${vehicleTask.customName} (${vehicleTask.customCode})`}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={formatMessage({ id: 'app.taskDetail.externalCode' })}>
              {vehicleTask.customTaskCode}
            </Form.Item>
          </Col>
        </Row>
      )}
      <Steps direction="vertical">{renderSteps()}</Steps>
    </div>
  );
};
export default connect(({ global, task }) => ({
  vehicleTask: task.detailInfo?.vehicleTask ?? {},
  nowPath: task.detailInfo?.nowPath ?? {},
}))(memo(VehicleTaskSteps));
