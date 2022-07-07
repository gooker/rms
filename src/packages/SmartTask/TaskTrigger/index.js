import React, { Component } from 'react';
import { connect } from '@/utils/RmsDva';
import { Button, Card, Checkbox, Col, Dropdown, Empty, Menu, Row, Spin, Tag } from 'antd';
import TaskTriggerModal from './TaskTriggerModal';
import { find } from 'lodash';
import {
  deleteTaskTrigger,
  getAllTaskTriggers,
  saveTaskTrigger,
  switchTriggerState,
} from '@/services/commonService';
import { dealResponse, formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import RmsConfirm from '@/components/RmsConfirm';
import TriggerSearchComponent from './TriggerSearchComponent';
import { triggerStatus } from './triggerUtil';
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
@connect(({ taskTriger, quickTask }) => ({
  customTaskList: taskTriger.customTaskList,
  sharedTasks: quickTask.sharedTasks,
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
    dispatch({ type: 'quickTask/initQuickTaskPage' });
    this.initData();
  }

  initData = async (type) => {
    const { dispatch } = this.props;
    this.setState({ loading: true });
    await dispatch({ type: 'taskTriger/fetchCustomTaskList' });
    let params = {};
    if (type) {
      params = { status: type };
    }
    const taskTriggerList = await getAllTaskTriggers(params);
    if (!dealResponse(taskTriggerList)) {
      this.setState({ taskTriggerList });
    }
    this.setState({ loading: false, checkedOperateList: [] });
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

  // 单个/批量 confirm
  confirmModal = (status, isBatch, record) => {
    const _this = this;
    const content = (type) => {
      let statusText;
      if (type === 'start') {
        statusText = formatMessage({ id: 'taskTrigger.startTaskTrigger.tip' });
      } else if (type === 'pause') {
        statusText = formatMessage({ id: 'taskTrigger.pauseTaskTrigger.tip' });
      } else {
        statusText = formatMessage({ id: 'taskTrigger.endTaskrigger.tip' });
      }
      return statusText;
    };
    RmsConfirm({
      content: content(status),
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
    if (!dealResponse(responseResult, 1)) {
      this.setState({ triggerModalVisible: false, updateTrigger: null });
      this.initData();
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
    if (!dealResponse(responseResult, 1)) {
      this.setState({ checkedOperateList: [] });
      this.initData();
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
        content: formatMessage({ id: 'taskTrigger.deleteTaskrigger.tip' }),
        onOk: async () => {
          const deleteResult = await deleteTaskTrigger({ id: record.id });
          if (!dealResponse(deleteResult, 1)) {
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
    if (!dealResponse(saveResult, 1)) {
      this.setState({ triggerModalVisible: false, updateTrigger: null });
      if (!data?.id) {
        this.setState({ selectSearchItem: null });
        this.initData(selectSearchItem);
      } else {
        this.initData(selectSearchItem);
      }
    }
  };

  renderTrigerTasks = (taskCodes) => {
    const { customTaskList, sharedTasks } = this.props;
    let currentAllTask = [];
    customTaskList?.map(({ id, name }) => {
      currentAllTask.push({ id, name });
    });

    sharedTasks?.map(({ id, name }) => {
      currentAllTask.push({ id, name });
    });
    const paramIds = taskCodes?.map((idcode) => idcode.split('-')[0]);
    return paramIds.map((id) => {
      const customTask = find(currentAllTask, { id });
      return (
        <Tag key={id} color="blue">
          {customTask?.name}
        </Tag>
      );
    });
  };

  onAdd = () => {
    this.setState({ triggerModalVisible: true, updateTrigger: null });
  };

  onSelectedTrigger = (newChecked) => {
    this.setState({ checkedOperateList: newChecked });
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
            {<FormattedMessage id="app.triggerAction.start" />}
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
            {<FormattedMessage id="app.triggerAction.pause" />}
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
            {<FormattedMessage id="app.triggerState.end" />}
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
              content={triggerStatus(record.status)}
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
              title={<FormattedMessage id="taskTrigger.triggerTasks" />}
              content={this.renderTrigerTasks(record.codes)}
            />
          </Col>
          <Col span={24}>
            <DescriptionItem
              title={<FormattedMessage id="taskTrigger.variable" />}
              content={
                record.variable === 'fixed'
                  ? formatMessage({ id: 'taskTrigger.fixedVariable' })
                  : formatMessage({ id: 'taskTrigger.randomVariable' })
              }
            />
          </Col>
          <Col span={24}>
            <DescriptionItem
              title={`${formatMessage({ id: 'app.trigger.timeInterval' })}(s)`}
              content={<span>{record.timeInterval}</span>}
            />
          </Col>
          <Col span={24}>
            <DescriptionItem
              title={<FormattedMessage id="taskTrigger.totaTimes" />}
              content={<span>{record.totalCount}</span>}
            />
          </Col>
          <Col span={24}>
            <DescriptionItem
              title={<FormattedMessage id="app.common.endTime" />}
              content={<span>{record.endTime}</span>}
            />
          </Col>
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
      <div className={commonStyles.commonPageStyle}>
        <Spin spinning={loading}>
          {/* 操作栏 */}
          <TriggerSearchComponent
            checkedList={checkedOperateList}
            dataList={taskTriggerList}
            selectedSearchValue={selectSearchItem}
            onAdd={this.onAdd}
            onRefresh={() => {
              this.setState({ selectSearchItem: null }, () => {
                this.initData();
              });
            }}
            onSelected={this.onSelectedTrigger}
            onStatusChange={this.handleStatusSearch}
            onBatchChange={this.handleBatchOperate}
          />

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
            triggerList={taskTriggerList}
            onCancel={() => {
              this.setState({ triggerModalVisible: false, updateTrigger: null });
            }}
          />
        </Spin>
      </div>
    );
  }
}
export default TaskTrigger;
