import React, { memo } from 'react';
import { List, Button, Row, Col, Divider } from 'antd';
import { resumeLatentPausedTask } from '@/services/monitor';
import { formatMessage } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';
import DescriptionList from '@/packages/Mixrobot/components/DescriptionList';

const { Description } = DescriptionList;

const LatentStopMessage = (props) => {
  const { dispatch, messageList } = props;
  return (
    <List
      style={{ width: '100%' }}
      itemLayout="horizontal"
      dataSource={messageList || []}
      renderItem={(item) => {
        const { robotId, cellId, stepTaskId, taskId } = item;
        return (
          <Row>
            <Col span={20}>
              <div style={{ width: '100%' }}>
                <Divider orientation="left">
                  <FormattedMessage id="app.monitorOperation.pausedTask" />
                </Divider>
              </div>
              <DescriptionList>
                <Col span={12}>
                  <Description
                    style={{ minHeight: 40 }}
                    term={formatMessage({ id: 'app.monitorOperation.agvID' })}
                  >
                    {robotId}
                  </Description>
                </Col>
                <Col span={12}>
                  <Description
                    style={{ minHeight: 40 }}
                    term={formatMessage({ id: 'app.monitorOperation.cell' })}
                  >
                    {cellId}
                  </Description>
                </Col>
                <Col span={12}>
                  <Description
                    style={{ minHeight: 40 }}
                    term={formatMessage({ id: 'app.monitorOperation.taskId' })}
                  >
                    {taskId ? taskId.substring(taskId.length - 5, taskId.length) : null}
                  </Description>
                </Col>
                <Col span={12}>
                  <Description
                    style={{ minHeight: 40 }}
                    term={formatMessage({ id: 'app.monitorOperation.taskStep' })}
                  >
                    {stepTaskId}
                  </Description>
                </Col>
              </DescriptionList>
            </Col>
            <Col span={4} style={{ textAlign: 'end' }}>
              <Button
                size="small"
                onClick={() => {
                  const params = {
                    sectionId: window.localStorage.getItem('sectionId'),
                    robotId,
                    taskId,
                    cellId,
                    taskStepId: stepTaskId,
                  };
                  resumeLatentPausedTask(params).then(() => {
                    dispatch({ type: 'monitor/fetchLatentSopMessageList' });
                  });
                }}
              >
                <FormattedMessage id="app.monitorOperation.action.resume" />
              </Button>
            </Col>
          </Row>
        );
      }}
    />
  );
};
export default memo(LatentStopMessage);
