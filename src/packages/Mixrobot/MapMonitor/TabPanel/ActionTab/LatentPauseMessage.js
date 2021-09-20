import React, { memo } from 'react';
import { fetchResumeTaskRun } from '@/services/map';
import intl from 'react-intl-universal';
import FormattedMessage from '@/components/FormattedMessage';
import { List, Button, Row, Col, Divider } from 'antd';
import DescriptionList from '@/components/DescriptionList';

const { Description } = DescriptionList;

export default memo(function LatentStopMessage(props) {
  const { dispatch, latentStopMessageList, sectionId } = props;
  return (
    <List
      style={{ width: '100%' }}
      itemLayout="horizontal"
      dataSource={latentStopMessageList || []}
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
                    term={intl.formatMessage({ id: 'app.monitorOperation.agvID' })}
                  >
                    {robotId}
                  </Description>
                </Col>
                <Col span={12}>
                  <Description
                    style={{ minHeight: 40 }}
                    term={intl.formatMessage({ id: 'app.monitorOperation.cell' })}
                  >
                    {cellId}
                  </Description>
                </Col>
                <Col span={12}>
                  <Description
                    style={{ minHeight: 40 }}
                    term={intl.formatMessage({ id: 'app.monitorOperation.taskId' })}
                  >
                    {taskId ? taskId.substring(taskId.length - 5, taskId.length) : null}
                  </Description>
                </Col>
                <Col span={12}>
                  <Description
                    style={{ minHeight: 40 }}
                    term={intl.formatMessage({ id: 'app.monitorOperation.taskStep' })}
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
                    sectionId,
                    robotId,
                    taskId,
                    cellId,
                    taskStepId: stepTaskId,
                  };
                  fetchResumeTaskRun(params).then(() => {
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
});
