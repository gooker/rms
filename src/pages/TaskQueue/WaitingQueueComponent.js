import React, { Component } from 'react';
import { connect } from '@/utils/RcsDva';
import { Badge, Row, Button, message, Tooltip } from 'antd';
import { DeleteOutlined, RedoOutlined, OrderedListOutlined } from '@ant-design/icons';
import { dateFormat, formatMessage } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';
import {
  fetchTaskQueueList,
  deleteTaskQueueItems,
  fetchAgvOverallStatus,
  fetchUpdateTaskPriority,
} from '@/services/api';
import TableWidthPages from '@/components/TableWidthPages';
import { dealResponse } from '@/utils/utils';
import { AgvStateColor } from '@/config/consts';
import UpdateTaskPriority from './components/UpdateTaskPriority';
import TablePageWrapper from '@/components/TablePageWrapper';
import RmsConfirm from '@/components/RmsConfirm';
import taskQueueStyles from './taskQueue.module.less';
import commonStyles from '@/common.module.less';
import { AGVType } from '@/config/config';
import Dictionary from '@/utils/Dictionary';

const { red, green } = Dictionary('color');

@connect(({ global }) => ({
  allTaskTypes: global.allTaskTypes,
}))
class WaitingQueueComponent extends Component {
  state = {
    dataSource: [],
    selectedRow: [],
    selectedRowKeys: [],

    agvOverallStatus: {},

    loading: false,
    deleteLoading: false,
    priorityVisible: false,
  };

  columns = [
    {
      title: <FormattedMessage id="app.task.id" />,
      dataIndex: 'taskId',
      align: 'center',
      width: 200,
      render: (text) => {
        return (
          <Tooltip title={text}>
            <span
              className={commonStyles.textLinks}
              onClick={() => {
                this.checkDetail(text);
              }}
            >
              {text ? '*' + text.substr(text.length - 6, 6) : null}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: <FormattedMessage id="app.task.type" />,
      dataIndex: 'agvTaskType',
      align: 'center',
      width: 150,
      render: (text) => {
        const { allTaskTypes } = this.props;
        return allTaskTypes?.[AGVType.LatentLifting]?.[text] || text;
      },
    },
    {
      title: <FormattedMessage id="app.taskQueue.appointedTarget" />,
      dataIndex: 'appointedTargetCellId',
      align: 'center',
      width: 150,
      render: (text, record) => {
        if (record.isLockTargetCell == null) {
          return <span>{text}</span>;
        }
        if (record.isLockTargetCell) {
          return <span style={{ color: green }}>{text}</span>;
        } else {
          return <span style={{ color: red }}>{text}</span>;
        }
      },
    },
    {
      title: <FormattedMessage id="app.taskQueue.appointedAgv" />,
      dataIndex: 'appointedAGVId',
      align: 'center',
      width: 150,
      render: (text, record) => {
        if (record.isLockAGV) {
          return <span style={{ color: green }}>{text}</span>;
        } else {
          return <span style={{ color: red }}>{text}</span>;
        }
      },
    },
    {
      title: <FormattedMessage id="app.taskQueue.priority" />,
      dataIndex: 'priority',
      align: 'center',
      width: 150,
      sorter: (a, b) => a.priority - b.priority,
      render: (text) => <span>{text}</span>,
    },
    {
      title: <FormattedMessage id="app.taskQueue.createTime" />,
      dataIndex: 'createTimeMilliseconds',
      align: 'center',
      width: 200,
      sorter: (a, b) => a.createTimeMilliseconds - b.createTimeMilliseconds,
      render: (text) => {
        if (!text) {
          return <FormattedMessage id="app.taskQueue.notAvailable" />;
        }
        return <span>{dateFormat(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
      },
    },
    {
      title: <FormattedMessage id="app.taskQueue.lastExecutedTimestamp" />,
      dataIndex: 'lastExecutedTimestamp',
      align: 'center',
      width: 150,
      sorter: (a, b) => a.lastExecutedTimestamp - b.lastExecutedTimestamp,
      render: (text) => {
        if (!text) {
          return <FormattedMessage id="app.taskQueue.notAvailable" />;
        }
        return <span>{dateFormat(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
      },
    },
    {
      title: <FormattedMessage id="app.taskQueue.triedTimes" />,
      dataIndex: 'triedTimes',
      align: 'center',
      width: 150,
      sorter: (a, b) => a.triedTimes - b.triedTimes,
    },
  ];

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    const { agvType } = this.props;
    this.setState({ loading: true });

    try {
      const [taskQueueResponse, agvOverallStatusResponse] = await Promise.all([
        fetchTaskQueueList(agvType),
        fetchAgvOverallStatus(agvType),
      ]);
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
    } catch (err) {
      message.error(formatMessage({ id: 'app.message.networkError' }));
    }
    this.setState({ loading: false });
  };

  deleteQueueTasks = () => {
    const _this = this;
    const { selectedRow, dataSource } = this.state;
    const { agvType } = this.props;
    const sectionId = window.localStorage.getItem('sectionId');
    const taskIdList = selectedRow.map((record) => record.taskId);
    const requestParam = { sectionId, taskIdList };

    RmsConfirm({
      content: formatMessage({ id: 'app.executionQ.deleteTaskSure' }),
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

  checkDetail = (taskId) => {
    const { dispatch, AGVType } = this.props;
    dispatch({
      type: 'task/fetchTaskDetailByTaskId',
      payload: { taskId, AGVType },
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
    const { deleteFlag, priority } = this.props;
    return (
      <TablePageWrapper>
        <div>
          <Row className={taskQueueStyles.agvStatusBadgeContainer}>
            <Badge
              showZero
              style={{ background: AgvStateColor.available }}
              count={agvOverallStatus.availableAgvNumber || 0}
            >
              <span
                className={taskQueueStyles.agvStatusBadge}
                style={{ background: AgvStateColor.available }}
              >
                <FormattedMessage id={'app.agvState.available'} />
              </span>
            </Badge>
            <Badge
              showZero
              style={{ background: AgvStateColor.StandBy }}
              count={agvOverallStatus.standByAgvNumber || 0}
            >
              <span
                className={taskQueueStyles.agvStatusBadge}
                style={{ background: AgvStateColor.StandBy }}
              >
                <FormattedMessage id={'app.agvState.StandBy'} />
              </span>
            </Badge>
            <Badge
              showZero
              style={{ background: AgvStateColor.Working }}
              count={agvOverallStatus.workAgvNumber || 0}
            >
              <span
                className={taskQueueStyles.agvStatusBadge}
                style={{ background: AgvStateColor.Working }}
              >
                <FormattedMessage id={'app.agvState.Working'} />
              </span>
            </Badge>
            <Badge
              showZero
              style={{ background: AgvStateColor.Charging }}
              count={agvOverallStatus.chargerAgvNumber || 0}
            >
              <span
                className={taskQueueStyles.agvStatusBadge}
                style={{ background: AgvStateColor.Charging }}
              >
                <FormattedMessage id={'app.agvState.Charging'} />
              </span>
            </Badge>
            <Badge
              showZero
              style={{ background: AgvStateColor.Error }}
              count={agvOverallStatus.lowerBatteryAgvNumber || 0}
            >
              <span
                className={taskQueueStyles.agvStatusBadge}
                style={{ background: AgvStateColor.Error }}
              >
                <FormattedMessage id={'app.battery.low'} />
              </span>
            </Badge>
            <Badge
              showZero
              style={{ background: AgvStateColor.Offline }}
              count={agvOverallStatus.offlineAgvNumber || 0}
            >
              <span
                className={taskQueueStyles.agvStatusBadge}
                style={{ background: AgvStateColor.Offline }}
              >
                <FormattedMessage id={'app.agvState.Offline'} />
              </span>
            </Badge>
          </Row>
          <Row className={commonStyles.tableToolLeft}>
            {deleteFlag ? (
              <Button
                danger
                loading={deleteLoading}
                onClick={this.deleteQueueTasks}
                disabled={selectedRowKeys.length === 0}
              >
                <DeleteOutlined /> <FormattedMessage id="app.button.delete" />
              </Button>
            ) : null}
            {priority ? (
              <Button
                disabled={selectedRowKeys.length === 0}
                onClick={() => {
                  this.switchTaskPriorityModal(true);
                }}
              >
                <OrderedListOutlined /> <FormattedMessage id="app.taskQueue.renice" />
              </Button>
            ) : null}
            <Button onClick={this.getData}>
              <RedoOutlined /> <FormattedMessage id="app.button.refresh" />
            </Button>
          </Row>
        </div>
        <TableWidthPages
          loading={loading}
          columns={this.columns}
          dataSource={dataSource}
          rowKey={(record) => record.taskId}
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
export default WaitingQueueComponent;
