import React, { Component } from 'react';
import { connect } from '@/utils/dva';
import find from 'lodash/find';
import {
  Row,
  Col,
  Tag,
  Card,
  Menu,
  Spin,
  Empty,
  Button,
  Select,
  message,
  Checkbox,
  Dropdown,
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import TaskTriggerModal from '../components/TaskTriggerModal';
import {
  getAllTaskTriggers,
  saveTaskTrigger,
  deleteTaskTrigger,
  switchTriggerState,
} from '@/services/api';
import { dealResponse,formatMessage } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';
import RmsConfirm from '@/components/RmsConfirm';
import commonStyles from '@/common.module.less';
import styles from '@/common.module.less';
import style from './TaskTrigger.module.less';

const DescriptionItem = ({ title, content }) => (
  <div className={styles.descriptionItem}>
    <Row>
      <span className={style.itemTitle} style={{ width: 90, textAlign: 'end' }}>
        {title}:
      </span>
      <span className={style.textOverflow}>{content}</span>
    </Row>
  </div>
);
@connect(({ taskTriger }) => ({
  customTaskList: taskTriger.customTaskList,
}))
class TaskTrigger extends Component {
  state = {
    loading: false,
    selectSearchItem: null,
    checkedOperateList: [], // 批量操作用到的数据
    updateTrigger: null, // 更新带过去的数据
    taskTriggerList: [], // 所有的任务触发器
    triggerModalVisible: false, // 新增&编辑触发器弹框
  };

  async componentDidMount() {
    const { dispatch } = this.props;
    await dispatch({ type: 'taskTriger/fetchActiveMap' });
    dispatch({ type: 'taskTriger/fetchModelTypes' });
    dispatch({ type: 'taskTriger/fetchCustomTyps' });
    this.initData();
  }

  initData = async (type) => {
    const { dispatch } = this.props;
    this.setState({ loading: true });
    await dispatch({ type: 'taskTriger/fetchCustomTaskList' });
    let taskTriggerList = null;
    if (type) {
      taskTriggerList = await getAllTaskTriggers({ status: type });
    } else {
      taskTriggerList = await getAllTaskTriggers();
    }
    if (!dealResponse(taskTriggerList)) {
      this.setState({ taskTriggerList });
    } else {
      message.error(formatMessage({ id: 'app.taskTrigger.getTaskTriggersFailed' }));
    }
    this.setState({ loading: false });
  };

  // 状态查询
  handleStatusSearch = (value) => {
    this.setState({ selectSearchItem: value }, () => {
      this.initData(value);
    });
  };

  // checkbox
  onCheckChange = (e, data) => {
    const { id } = data;
    const { checked } = e.target;
    const { checkedOperateList } = this.state;
    if (checked) {
      this.setState({ checkedOperateList: [...checkedOperateList, data] });
    } else {
      const currentBatchList = checkedOperateList.filter((item) => item.id !== id);
      this.setState({ checkedOperateList: [...currentBatchList] });
    }
  };

  // checked
  defaultChecked = (id) => {
    const { checkedOperateList } = this.state;
    const selectedTrigerIds = checkedOperateList.map((item) => item.id);
    return selectedTrigerIds.includes(id);
  };

  // 单个 批量 confirm
  confirmModal = (status, isBatch, record) => {
    const _this = this;
    const triggerStatus = (type) => {
      let statusText;
      switch (type) {
        case 'start':
          statusText = formatMessage({ id: 'customTasks.taskTrigger.startTaskTrigger.tip' });
          break;
        case 'pause':
          statusText = formatMessage({ id: 'customTasks.taskTrigger.pauseTaskTrigger.tip' });
          break;
        default:
          statusText = formatMessage({ id: 'customTasks.taskTrigger.endTaskrigger.tip' });
      }
      return statusText;
    };
    RmsConfirm({
      content: triggerStatus(status),
      onOk: () => {
        if (isBatch) {
          // 批量多个状态更改
          _this.batchConfirm(status);
        } else {
          // 单个状态更改
          _this.statusConfirm(record, status);
        }
      },
    });
  };

  // 单个操作
  handleSingleOperate = (record, key) => {
    this.confirmModal(key, false, record);
  };

  // 批量操作
  handleBatchOperate = (event) => {
    const { key } = event;
    this.confirmModal(key, true);
  };

  // 单个状态更改
  statusConfirm = async (record, type) => {
    const responseResult = await switchTriggerState({ [record.id]: type });
    if (!dealResponse(responseResult)) {
      message.success(formatMessage({ id: 'app.message.operateSuccess' }));
      this.setState({ triggerModalVisible: false, updateTrigger: null });
      this.initData();
    } else {
      message.error(formatMessage({ id: 'app.taskTrigger.operate.failed' }));
    }
    this.setState({ checked: [] });
  };

  // 批量多个状态更改
  batchConfirm = async (type) => {
    const { checkedOperateList } = this.state;
    const requestBody = {};
    checkedOperateList.flatMap(({ id }) => {
      requestBody[id] = type;
    });
    const responseResult = await switchTriggerState(requestBody);
    if (!dealResponse(responseResult)) {
      message.success(formatMessage({ id: 'app.message.operateSuccess' }));
      this.setState({ checkedOperateList: [] });
      this.initData();
    } else {
      message.error(formatMessage({ id: 'app.taskTrigger.operate.failed' }));
    }
  };

  // 更新 删除
  handleMenuClick = (e, record) => {
    const _this = this;
    const { taskTriggerList } = this.state;
    const currentTaskTriggerList = [...taskTriggerList];
    const { key } = e;
    // key: 1-更新 2-删除
    if (Number(key) === 1) {
      this.setState({ triggerModalVisible: true, updateTrigger: record });
    } else {
      const newTask = currentTaskTriggerList.filter((item) => item.id !== record.id);
      RmsConfirm({
        content: formatMessage({ id: 'customTasks.taskTrigger.deleteTaskrigger.tip' }),
        onOk: async () => {
          // delete 调接口
          const deleteResult = await deleteTaskTrigger({ id: record.id });
          if (!dealResponse(deleteResult)) {
            message.success(formatMessage({ id: 'app.message.operateSuccess' }));
            _this.setState({
              taskTriggerList: [...newTask],
            });
          }
        },
      });
    }
  };

  // 新增 编辑 弹框保存
  taskTriggerSubmit = async (data) => {
    const { selectSearchItem } = this.state;
    const saveResult = await saveTaskTrigger([data]);
    if (!dealResponse(saveResult)) {
      message.success(formatMessage({ id: 'app.message.operateSuccess' }));
      this.setState({ triggerModalVisible: false, updateTrigger: null });
      if (!data.id) {
        this.setState({ selectSearchItem: null });
        this.initData(selectSearchItem);
      } else {
        this.initData(selectSearchItem);
      }
    } else {
      message.error(formatMessage({ id: 'app.groupManage.saveFailed' }));
    }
  };

  // 开始结束暂停 状态显示
  triggerStatus = (status) => {
    let statusText;
    switch (status) {
      case 'start':
        statusText = formatMessage({ id: 'app.common.status.start' });
        break;
      case 'pause':
        statusText = formatMessage({ id: 'app.common.status.pause' });
        break;
      default:
        statusText = formatMessage({ id: 'app.common.status.end' });
    }
    return statusText;
  };

  renderTrigerTasks = (taskCodes) => {
    const { customTaskList } = this.props;
    return taskCodes.map((code) => {
      const customTask = find(customTaskList, { code });
      return <Tag key={code}>{customTask.name}</Tag>;
    });
  };

  // 渲染card
  renderTaskTriggerList = (record) => {
    // 卡片操作组
    const action = [
      <>
        <div
          className={style.cardAction}
          style={{ display: record.status !== 'start' ? 'inline-block' : 'none' }}
        >
          <Button
            type="link"
            onClick={() => {
              this.handleSingleOperate(record, 'start');
            }}
          >
            {<FormattedMessage id="app.common.status.start" />}
          </Button>
        </div>
        <div
          className={style.cardAction}
          style={{ display: record.status !== 'pause' ? 'inline-block' : 'none' }}
        >
          <Button
            type="link"
            onClick={() => {
              this.handleSingleOperate(record, 'pause');
            }}
          >
            {<FormattedMessage id="app.common.status.pause" />}
          </Button>
        </div>
        <div
          className={style.cardAction}
          style={{ display: record.status !== 'end' ? 'inline-block' : 'none' }}
        >
          <Button
            type="link"
            onClick={() => {
              this.handleSingleOperate(record, 'end');
            }}
          >
            {<FormattedMessage id="app.common.status.end" />}
          </Button>
        </div>
        <Dropdown
          disabled={record.status !== 'end'}
          placement="topRight"
          overlay={
            <Menu onClick={(e) => this.handleMenuClick(e, record)}>
              <Menu.Item key="1">
                <FormattedMessage id="app.button.update" />
              </Menu.Item>
              <Menu.Item key="2">
                <FormattedMessage id="app.button.delete" />
              </Menu.Item>
            </Menu>
          }
        >
          <Button type="text" style={{ width: '33.1%', fontWeight: 700 }}>
            ...
          </Button>
        </Dropdown>
      </>,
    ];

    return (
      <Card
        hoverable
        actions={action}
        title={<div className={style.textOverflow}>{record.name}</div>}
        extra={
          <Checkbox
            checked={this.defaultChecked(record.id)}
            onChange={(e) => this.onCheckChange(e, record)}
          />
        }
      >
        <Row>
          <Col span={24}>
            <DescriptionItem
              title={<FormattedMessage id="app.common.status" />}
              content={this.triggerStatus(record.status)}
            />
          </Col>
          <Col span={24}>
            <DescriptionItem
              title={<FormattedMessage id="app.common.description" />}
              content={<span>{record.describe}</span>}
            />
          </Col>
          <Col span={24}>
            <DescriptionItem
              title={<FormattedMessage id="customTasks.taskTrigger.triggerTasks" />}
              content={this.renderTrigerTasks(record.codes)}
            />
          </Col>
          <Col span={24}>
            <DescriptionItem
              title={<FormattedMessage id="customTasks.taskTrigger.variable" />}
              content={
                record.variable === 'fixed'
                  ? formatMessage({ id: 'customTasks.taskTrigger.fixedVariable' })
                  : formatMessage({ id: 'customTasks.taskTrigger.randomVariable' })
              }
            />
          </Col>
          <Col span={24}>
            <DescriptionItem
              title={`${formatMessage({id:'app.common.timeInterval'})}(s)`}
              content={<span>{record.timeInterval}</span>}
            />
          </Col>
          <Col span={24}>
            <DescriptionItem
              title={<FormattedMessage id="customTasks.taskTrigger.totaTimes" />}
              content={<span>{record.totalCount}</span>}
            />
          </Col>
          <Col span={24}>
            <DescriptionItem
              title={<FormattedMessage id="app.common.endTime" />}
              content={<span>{record.endTime}</span>}
            />
          </Col>
          {/* <Col span={24}>
            <DescriptionItem
              title={<FormattedMessage id="app.taskTrigger.basedOnEvents" />}
              content={<span>{record.basedOnEvents && record.basedOnEvents.toString()}</span>}
            />
          </Col> */}
        </Row>
      </Card>
    );
  };

  render() {
    const {
      loading,
      updateTrigger,
      taskTriggerList,
      selectSearchItem,
      checkedOperateList,
      triggerModalVisible,
    } = this.state;

    return (
      <Spin spinning={loading}>
        <div className={commonStyles.commonPageStyle}>
          {/* 操作栏 */}
          <Row justify="space-between">
            <Col>
              <Button
                type="primary"
                onClick={() => {
                  this.setState({ triggerModalVisible: true, updateTrigger: null });
                }}
              >
                <FormattedMessage id="app.button.add" />
              </Button>
              <Button
                style={{ marginLeft: 13 }}
                onClick={() => {
                  this.setState({ selectSearchItem: null }, () => {
                    this.initData();
                  });
                }}
              >
                <FormattedMessage id="app.button.refresh" />
              </Button>
            </Col>
            <Col>
              <Select
                allowClear
                value={selectSearchItem}
                onChange={this.handleStatusSearch}
                style={{ marginRight: 13, width: 150 }}
                placeholder={formatMessage({ id: 'customTasks.taskTrigger.stateQuery' })}
              >
                <Select.Option value="start">
                  {<FormattedMessage id="app.activity.TaskExecuting" />}
                </Select.Option>
                <Select.Option value="pause">
                  {<FormattedMessage id="customTasks.taskTrigger.paused" />}
                </Select.Option>
                <Select.Option value="end">
                  {<FormattedMessage id="app.common.status.end" />}
                </Select.Option>
              </Select>
              <Dropdown
                disabled={checkedOperateList.length === 0}
                trigger={['click']}
                overlay={
                  <Menu onClick={this.handleBatchOperate}>
                    <Menu.Item key="start">
                      {<FormattedMessage id="app.common.status.start" />}
                    </Menu.Item>
                    <Menu.Item key="pause">
                      {<FormattedMessage id="app.common.status.pause" />}
                    </Menu.Item>
                    <Menu.Item key="end">{<FormattedMessage id="app.common.status.end" />}</Menu.Item>
                  </Menu>
                }
              >
                <Button>
                  <FormattedMessage id="app.common.batchOperate" />{' '}
                  <DownOutlined />
                </Button>
              </Dropdown>
            </Col>
          </Row>
          {/* 列表栏 */}
          <Row style={{ marginTop: 20 }} gutter={[10, 10]}>
            {taskTriggerList && taskTriggerList.length > 0 ? (
              taskTriggerList.map((item, index) => (
                <Col key={index} xs={24} sm={24} md={12} lg={12} xxl={6}>
                  {this.renderTaskTriggerList(item)}
                </Col>
              ))
            ) : (
              <Empty className={style.center} />
            )}
          </Row>

          {/*  新增 & 编辑触发器弹窗 */}
          <TaskTriggerModal
            title={`${
              !updateTrigger
                ? formatMessage({ id: 'app.button.add' })
                : formatMessage({ id: 'app.button.update' })
            }`}
            visible={triggerModalVisible}
            updateItem={updateTrigger}
            onSubmit={this.taskTriggerSubmit}
            onCancel={() => {
              this.setState({ triggerModalVisible: false, updateTrigger: null });
            }}
          />
      </div>
      </Spin>
    );
  }
}
export default TaskTrigger;
