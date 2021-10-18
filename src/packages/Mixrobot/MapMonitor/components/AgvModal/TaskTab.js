import React, { memo, useEffect, useState } from 'react';
import { connect } from '@/utils/dva';
import { Button, Form, Row, Col, Tooltip, Popconfirm, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import intl from 'react-intl-universal';
import FormattedMessage from '@/components/FormattedMessage';
import { Permission } from '@/utils/Permission';
import { fetchCancelTask, fetchRestartTask } from './AgvModalApi';
import { fetchAgvInfoByAgvId } from './AgvModalApi';
import { dealResponse } from '@/utils/utils';
import { ApiNameSpace } from '@/config/config';

const FormItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};
const FormItemLayoutNoLabel = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 21, offset: 3 },
    md: { offset: 5 },
  },
};

const TaskTab = (props) => {
  const { agv, sectionId, dispatch } = props;
  const { agvId, agvType } = JSON.parse(agv);

  const [loading, setLoading] = useState(true);
  const [currentTask, setCurrentTask] = useState({});

  useEffect(() => {
    fetchData();
  }, [agv]);

  async function fetchData() {
    setLoading(true);
    const response = await fetchAgvInfoByAgvId({ sectionId, agvId }, ApiNameSpace[agvType]);
    if (dealResponse(response)) {
      setCurrentTask({});
    } else {
      const { redisAGV } = response;
      setCurrentTask(redisAGV);
    }
    setLoading(false);
  }

  function checkTaskDetail() {
    dispatch({
      type: 'task/fetchOpenTaskInfo',
      payload: {
        robotType: agvType,
        taskId: currentTask.currentTaskId,
      },
    });
  }

  // 重发任务
  function reStart() {
    const params = { sectionId, taskId: currentTask.currentTaskId };
    const response = fetchRestartTask(params, ApiNameSpace[agvType]);
    if (dealResponse(response)) {
      message.error(intl.formatMessage({ id: 'app.monitor.modal.AGV.tip.restartTaskFail' }));
    } else {
      message.success(intl.formatMessage({ id: 'app.monitor.modal.AGV.tip.restartTaskSuccess' }));
      fetchData();
    }
  }

  // 取消任务
  async function cancelTask() {
    const params = { sectionId, taskId: currentTask.currentTaskId };
    const response = await fetchCancelTask(params, ApiNameSpace[agvType]);
    if (response === null) {
      message.success(intl.formatMessage({ id: 'app.monitor.modal.AGV.tip.cancelTaskSuccess' }));
      fetchData();
    } else message.error(intl.formatMessage({ id: 'app.monitor.modal.AGV.tip.cancelTaskFail' }));
  }

  if (currentTask.currentTaskId) {
    return (
      <Form>
        <Form.Item
          {...FormItemLayout}
          label={intl.formatMessage({ id: 'app.monitor.modal.AGV.label.currentTask' })}
        >
          <span
            style={{
              cursor: 'pointer',
              color: 'rgb(24, 144, 255)',
              textDecoration: 'underline',
              fontSize: '1.3vh',
              fontWeight: 500,
            }}
            onClick={checkTaskDetail}
          >
            {currentTask.currentTaskId}
          </span>
        </Form.Item>
        <Form.Item
          {...FormItemLayout}
          label={intl.formatMessage({ id: 'app.monitor.modal.AGV.label.taskType' })}
        >
          <span style={{ fontSize: '1.3vh', color: 'rgb(24, 144, 255)' }}>
            <FormattedMessage id={`app.activity.${currentTask.currentTaskType}`} />
          </span>
        </Form.Item>
        <Permission
          id={['/map/monitor/agvModal/task/restart', '/map/monitor/agvModal/task/cancel']}
          type="or"
        >
          <Form.Item {...FormItemLayoutNoLabel}>
            <Row type="flex" gutter={8}>
              <Col>
                <Permission id="/map/monitor/agvModal/task/restart">
                  <Popconfirm
                    title={intl.formatMessage({
                      id: 'app.monitor.modal.AGV.tip.confirmRestartTask',
                    })}
                    onConfirm={reStart}
                    okText={intl.formatMessage({ id: 'app.monitor.action.confirm' })}
                    cancelText={intl.formatMessage({ id: 'app.monitor.action.return' })}
                  >
                    <Button>
                      <FormattedMessage id="app.monitor.action.restart" />
                    </Button>
                  </Popconfirm>
                </Permission>
              </Col>
              <Col>
                <Permission id="/map/monitor/agvModal/task/cancel">
                  <Popconfirm
                    title={intl.formatMessage({
                      id: 'app.monitor.modal.AGV.tip.confirmCancelTask',
                    })}
                    onConfirm={cancelTask}
                    okText={intl.formatMessage({ id: 'app.monitor.action.confirm' })}
                    cancelText={intl.formatMessage({ id: 'app.monitor.action.return' })}
                  >
                    <Button>
                      <FormattedMessage id="app.monitor.action.cancel" />
                    </Button>
                  </Popconfirm>
                </Permission>
              </Col>
              <Col>
                <Tooltip
                  placement="bottomRight"
                  title={
                    <>
                      <div>
                        <Permission id="/map/monitor/agvModal/task/restart">
                          <FormattedMessage id="app.activity.detailActionTip2" />
                        </Permission>
                      </div>
                      <div>
                        <Permission id="/map/monitor/agvModal/task/cancel">
                          <FormattedMessage id="app.monitor.modal.AGV.tip.cancelTaskTip" />
                        </Permission>
                      </div>
                    </>
                  }
                >
                  <QuestionCircleOutlined
                    style={{ fontSize: 17, marginLeft: 10, cursor: 'pointer', color: '#8f969c' }}
                  />
                </Tooltip>
              </Col>
            </Row>
          </Form.Item>
        </Permission>
      </Form>
    );
  }
  if (loading) {
    return <FormattedMessage id="app.monitor.modal.AGV.tip.loading" />;
  }
  return <FormattedMessage id="app.monitor.modal.AGV.tip.noTask" />;
};
export default connect()(memo(TaskTab));
