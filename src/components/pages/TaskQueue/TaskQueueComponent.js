import React, { Component } from 'react';
import { connect } from '@/utils/dva';
import { Table, Badge, Row, Button, Modal, message } from 'antd';
import { DeleteOutlined, RedoOutlined, OrderedListOutlined } from '@ant-design/icons';
import { formatMessage } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';
import {
  fetchTaskQueueList,
  deleteTaskQueueItems,
  fetchAgvOverallStatus,
  fetchUpdateTaskPriority,
} from '@/services/api';
import { dealResponse } from '@/utils/utils';
import UpdateTaskPriority from './components/UpdateTaskPriority/UpdateTaskPriority';
import TablePageWrapper from '@/components/TablePageWrapper';
import taskQueueStyles from './taskQueue.module.less';
import commonStyles from '@/common.module.less';

const { confirm } = Modal;

@connect()
class TaskQueueComponent extends Component {
  state = {
    dataSource: [],
    selectedRow: [],
    selectedRowKeys: [],

    agvOverallStatus: {},

    loading: false,
    deleteLoading: false,
    priorityVisible: false,
  };

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    const { agvType } = this.props;
    const sectionId = window.localStorage.getItem('sectionId');
    this.setState({ loading: true });

    // 先获取等待任务数据
    const taskQueueResponse = await fetchTaskQueueList(agvType, sectionId);
    // 再获取小车状态总览信息
    const agvOverallStatusResponse = await fetchAgvOverallStatus(agvType, sectionId);
    if (!dealResponse(taskQueueResponse) && !dealResponse(agvOverallStatusResponse)) {
      const dataSource = taskQueueResponse.map((record) => {
        const { redisTaskDTO, isLockAGV, isLockPod, isLockTargetCell } = record;
        return {
          key: redisTaskDTO.taskId,
          ...redisTaskDTO,
          isLockAGV,
          isLockPod,
          isLockTargetCell,
        };
      });
      this.setState({ dataSource, loading: false, agvOverallStatus: agvOverallStatusResponse });
    }
  };

  deleteQueueTasks = () => {
    const _this = this;
    const { selectedRow, dataSource } = this.state;
    const { agvType } = this.props;
    const sectionId = window.localStorage.getItem('sectionId');
    const taskIdList = selectedRow.map((record) => record.taskId);
    const requestParam = { sectionId, taskIdList };

    confirm({
      title: formatMessage({ id: 'app.executionQ.deleteTaskSure' }),
      onOk: async () => {
        _this.setState({ deleteLoading: true });
        const response = await deleteTaskQueueItems(agvType, requestParam);
        if (
          !dealResponse(
            response,
            true,
            formatMessage({ id: 'app.executionQ.deleteTaskSuccess' }),
            formatMessage({ id: 'app.executionQ.deleteTaskFail' }),
          )
        ) {
          // 这里不重复请求后台，手动对原数据进行处理
          const newDataSource = dataSource.filter((item) => !taskIdList.includes(item.taskId));
          _this.setState({
            deleteLoading: false,
            dataSource: newDataSource,
            selectedRow: [],
            selectedRowKeys: [],
          });
        }
      },
    });
  };

  onSelectChange = (selectedRowKeys, selectedRow) => {
    this.setState({ selectedRowKeys, selectedRow });
  };

  checkDetail = (taskId, taskAgvType, agvType) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'task/fetchTaskDetailByTaskId',
      payload: { taskId, taskAgvType, agvType },
    });
  };

  switchTaskPriorityModal = (priorityVisible) => {
    this.setState({ priorityVisible });
  };

  submitTaskPriority = async () => {
    const { agvType } = this.props;
    const { selectedRow, priorityValue } = this.state;
    const taskIdList = selectedRow.map((record) => record.taskId);

    const response = await fetchUpdateTaskPriority(agvType, {
      taskIdList,
      value: priorityValue,
      sectionId: window.localStorage.getItem('sectionId'),
    });

    if (dealResponse(response)) {
      message.error(formatMessage({ id: 'app.taskQueue.updateTaskPriority.failed' }));
    } else {
      message.success(formatMessage({ id: 'app.taskQueue.updateTaskPriority' }));
      this.setState(
        { visibleForPriority: false, selectedRowKeys: [], selectedKeys: [] },
        this.getData,
      );
    }
  };

  render() {
    const { loading, dataSource, deleteLoading, selectedRowKeys, agvOverallStatus } = this.state;
    const { getColumn } = this.props;
    return (
      <TablePageWrapper>
        <div>
          <Row className={taskQueueStyles.agvStatusBadgeContainer}>
            <Badge
              showZero
              style={{ background: '#7ac143' }}
              count={agvOverallStatus.availableAgvNumber || 0}
            >
              <span className={taskQueueStyles.agvStatusBadge} style={{ background: '#7ac143' }}>
                <FormattedMessage id={'app.agvState.available'} />
              </span>
            </Badge>
            <Badge
              showZero
              style={{ background: '#0092FF' }}
              count={agvOverallStatus.standByAgvNumber || 0}
            >
              <span className={taskQueueStyles.agvStatusBadge} style={{ background: '#0092FF' }}>
                <FormattedMessage id={'app.agvState.StandBy'} />
              </span>
            </Badge>
            <Badge
              showZero
              style={{ background: '#2F8949' }}
              count={agvOverallStatus.workAgvNumber || 0}
            >
              <span className={taskQueueStyles.agvStatusBadge} style={{ background: '#2F8949' }}>
                <FormattedMessage id={'app.agvState.Working'} />
              </span>
            </Badge>
            <Badge
              showZero
              style={{ background: '#eba954' }}
              count={agvOverallStatus.chargerAgvNumber || 0}
            >
              <span className={taskQueueStyles.agvStatusBadge} style={{ background: '#eba954' }}>
                <FormattedMessage id={'app.agvState.Charging'} />
              </span>
            </Badge>
            <Badge
              showZero
              style={{ background: '#fe5000' }}
              count={agvOverallStatus.lowerBatteryAgvNumber || 0}
            >
              <span className={taskQueueStyles.agvStatusBadge} style={{ background: '#fe5000' }}>
                <FormattedMessage id={'app.battery.low'} />
              </span>
            </Badge>
            <Badge
              showZero
              style={{ background: '#9E9E9E' }}
              count={agvOverallStatus.offlineAgvNumber || 0}
            >
              <span className={taskQueueStyles.agvStatusBadge} style={{ background: '#9E9E9E' }}>
                <FormattedMessage id={'app.agvState.Offline'} />
              </span>
            </Badge>
          </Row>
          <Row>
            <Row className={commonStyles.tableToolLeft}>
              <Button
                loading={deleteLoading}
                onClick={this.deleteQueueTasks}
                disabled={selectedRowKeys.length === 0}
              >
                <DeleteOutlined /> <FormattedMessage id="app.button.delete" />
              </Button>
              <Button
                disabled={selectedRowKeys.length === 0}
                onClick={() => {
                  this.switchTaskPriorityModal(true);
                }}
              >
                <OrderedListOutlined /> <FormattedMessage id="app.taskQueue.renice" />
              </Button>
            </Row>
            <Row style={{ flex: 1, justifyContent: 'flex-end' }} type="flex">
              <Button type="primary" onClick={this.getData}>
                <RedoOutlined />
                <FormattedMessage id="app.button.refresh" />
              </Button>
            </Row>
          </Row>
        </div>
        <Table
          loading={loading}
          columns={getColumn(this.checkDetail)}
          dataSource={dataSource}
          scroll={{ x: 'max-content' }}
          pagination={{
            responsive: true,
            defaultPageSize: 20,
            showTotal: (total) => formatMessage({ id: 'app.common.tableRecord' }, { count: total }),
          }}
          rowSelection={{
            selectedRowKeys,
            onChange: this.onSelectChange,
          }}
        />

        {/*************************调整优先级****************************/}
        <UpdateTaskPriority
          visible={this.state.priorityVisible}
          selectedRow={this.state.selectedRow}
          onSubmit={this.submitTaskPriority}
          close={() => {
            this.switchTaskPriorityModal(false);
          }}
        />
      </TablePageWrapper>
    );
  }
}
export default TaskQueueComponent;
