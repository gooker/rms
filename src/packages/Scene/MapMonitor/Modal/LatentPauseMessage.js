import React, { memo } from 'react';
import { Button, Col, Form, List, Row } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { resumeLatentPausedTask } from '@/services/monitor';
import { connect } from '@/utils/RmsDva';
import { formatMessage, getFormLayout, getMapModalPosition } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../monitorLayout.module.less';

const { formItemLayout } = getFormLayout(6, 16);
const LatentPauseMessage = (props) => {
  const { dispatch, latentStopMessageList } = props;

  function close() {
    dispatch({ type: 'monitor/saveCategoryModal', payload: null });
  }

  return (
    <div style={getMapModalPosition(550, 330)} className={styles.monitorModal}>
      <div className={styles.monitorModalHeader}>
        <FormattedMessage id={'monitor.message.latentPauseMessage'} />
        <CloseOutlined onClick={close} style={{ cursor: 'pointer' }} />
      </div>
      <div className={styles.monitorModalBody} style={{ paddingTop: 20 }}>
        <List
          style={{ width: '100%' }}
          itemLayout="horizontal"
          dataSource={latentStopMessageList || []}
          renderItem={(item) => {
            const { vehicleId, cellId, stepTaskId, taskId } = item;
            return (
              <Row>
                <Col span={20}>
                  <Row>
                    <Col span={12}>
                      <Form.Item {...formItemLayout} label={formatMessage({ id: 'app.agv.id' })}>
                        {vehicleId}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item {...formItemLayout} term={formatMessage({ id: 'app.map.cell' })}>
                        {cellId}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item {...formItemLayout} term={formatMessage({ id: 'app.task.id' })}>
                        {taskId ? taskId.substring(taskId.length - 5, taskId.length) : null}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...formItemLayout}
                        term={formatMessage({ id: 'app.taskDetail.taskStep' })}
                      >
                        {stepTaskId}
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                <Col span={4} style={{ textAlign: 'end' }}>
                  <Button
                    size="small"
                    onClick={() => {
                      const params = {
                        vehicleId,
                        taskId,
                        cellId,
                        taskStepId: stepTaskId,
                      };
                      resumeLatentPausedTask(params).then(() => {
                        dispatch({ type: 'monitor/fetchLatentStopMessageList' });
                      });
                    }}
                  >
                    <FormattedMessage id="app.taskDetail.restore" />
                  </Button>
                </Col>
              </Row>
            );
          }}
        />
      </div>
    </div>
  );
};
export default connect(({ monitor }) => ({
  latentStopMessageList: monitor.latentStopMessageList,
}))(memo(LatentPauseMessage));
