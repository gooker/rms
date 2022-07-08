import React, { Component } from 'react';
import { connect } from '@/utils/RmsDva';
import { Badge, Button, message, Row, Tooltip } from 'antd';
import { DeleteOutlined, OrderedListOutlined, RedoOutlined } from '@ant-design/icons';
import { convertToUserTimezone, dealResponse, formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import {
  deleteTaskQueueItems,
  fetchTaskQueueList,
  fetchUpdateTaskPriority,
  fetchVehicleOverallStatus,
} from '@/services/commonService';
import TableWithPages from '@/components/TableWithPages';
import { VehicleStateColor } from '@/config/consts';
import UpdateTaskPriority from '../../packages/SmartTask/components/UpdateTaskPriority';
import TablePageWrapper from '@/components/TablePageWrapper';
import RmsConfirm from '@/components/RmsConfirm';
import taskQueueStyles from '../../packages/SmartTask/task.module.less';
import commonStyles from '@/common.module.less';
import { VehicleType } from '@/config/config';
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

    vehicleOverallStatus: {},

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
      dataIndex: 'vehicleTaskType',
      align: 'center',
      width: 150,
      render: (text) => {
        const { allTaskTypes } = this.props;
        return allTaskTypes?.[VehicleType.LatentLifting]?.[text] || text;
      },
    },
    {
      title: <FormattedMessage id='app.common.targetCell' />,
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
      title: <FormattedMessage id='vehicle.id' />,
      dataIndex: 'appointedVehicleId',
      align: 'center',
      width: 150,
      render: (text, record) => {
        if (record.isLockVehicle) {
          return <span style={{ color: green }}>{text}</span>;
        } else {
          return <span style={{ color: red }}>{text}</span>;
        }
      },
    },
    {
      title: <FormattedMessage id="app.common.priority" />,
      dataIndex: 'priority',
      align: 'center',
      width: 150,
      sorter: (a, b) => a.priority - b.priority,
      render: (text) => <span>{text}</span>,
    },
    {
      title: <FormattedMessage id="app.common.creationTime" />,
      dataIndex: 'createTimeMilliseconds',
      align: 'center',
      width: 200,
      sorter: (a, b) => a.createTimeMilliseconds - b.createTimeMilliseconds,
      render: (text) => {
        if (!text) {
          return <FormattedMessage id="app.taskQueue.notAvailable" />;
        }
        return <span>{convertToUserTimezone(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
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
        return <span>{convertToUserTimezone(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
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
    const { vehicleType } = this.props;
    this.setState({ loading: true });

    try {
      const [taskQueueResponse, vehicleOverallStatusResponse] = await Promise.all([
        fetchTaskQueueList(vehicleType),
        fetchVehicleOverallStatus(vehicleType),
      ]);
      if (!dealResponse(taskQueueResponse) && !dealResponse(vehicleOverallStatusResponse)) {
        const dataSource = taskQueueResponse.map((record) => {
          const { redisTaskDTO, isLockVehicle, isLockPod, isLockTargetCell } = record;
          return {
            key: redisTaskDTO.taskId,
            ...redisTaskDTO,
            isLockVehicle,
            isLockPod,
            isLockTargetCell,
          };
        });
        this.setState({
          dataSource,
          loading: false,
          vehicleOverallStatus: vehicleOverallStatusResponse,
        });
      }
    } catch (err) {
      message.error(formatMessage({ id: 'app.message.networkError' }));
    }
    this.setState({ loading: false });
  };

  deleteQueueTasks = () => {
    const _this = this;
    const { selectedRow, dataSource } = this.state;
    const { vehicleType } = this.props;
    const sectionId = window.localStorage.getItem('sectionId');
    const taskIdList = selectedRow.map((record) => record.taskId);
    const requestParam = { sectionId, taskIdList };

    RmsConfirm({
      content: formatMessage({ id: 'app.executionQ.deleteTaskSure' }),
      onOk: async () => {
        _this.setState({ deleteLoading: true });
        const response = await deleteTaskQueueItems(vehicleType, requestParam);
        if (
          !dealResponse(
            response,
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
    const { dispatch, vehicleType } = this.props;
    dispatch({
      type: 'task/fetchTaskDetailByTaskId',
      payload: { taskId, vehicleType },
    });
  };

  switchTaskPriorityModal = (priorityVisible) => {
    this.setState({ priorityVisible });
  };

  submitTaskPriority = async () => {
    const { vehicleType } = this.props;
    const { selectedRow, priorityValue } = this.state;
    const taskIdList = selectedRow.map((record) => record.taskId);

    const response = await fetchUpdateTaskPriority(vehicleType, {
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
    const { loading, dataSource, deleteLoading, selectedRowKeys, vehicleOverallStatus } =
      this.state;
    const { deleteFlag, priority } = this.props;
    return (
      <TablePageWrapper>
        <div>
          <Row className={taskQueueStyles.vehicleStatusBadgeContainer}>
            <Badge
              showZero
              style={{ background: VehicleStateColor.available }}
              count={vehicleOverallStatus.availableVehicleNumber || 0}
            >
              <span
                className={taskQueueStyles.vehicleStatusBadge}
                style={{ background: VehicleStateColor.available }}
              >
                <FormattedMessage id={'app.common.available'} />
              </span>
            </Badge>
            <Badge
              showZero
              style={{ background: VehicleStateColor.StandBy }}
              count={vehicleOverallStatus.standByVehicleNumber || 0}
            >
              <span
                className={taskQueueStyles.vehicleStatusBadge}
                style={{ background: VehicleStateColor.StandBy }}
              >
                <FormattedMessage id={'vehicleState.StandBy'} />
              </span>
            </Badge>
            <Badge
              showZero
              style={{ background: VehicleStateColor.Working }}
              count={vehicleOverallStatus.workVehicleNumber || 0}
            >
              <span
                className={taskQueueStyles.vehicleStatusBadge}
                style={{ background: VehicleStateColor.Working }}
              >
                <FormattedMessage id={'vehicleState.Working'} />
              </span>
            </Badge>
            <Badge
              showZero
              style={{ background: VehicleStateColor.Charging }}
              count={vehicleOverallStatus.chargerVehicleNumber || 0}
            >
              <span
                className={taskQueueStyles.vehicleStatusBadge}
                style={{ background: VehicleStateColor.Charging }}
              >
                <FormattedMessage id={'vehicleState.Charging'} />
              </span>
            </Badge>
            <Badge
              showZero
              style={{ background: VehicleStateColor.Error }}
              count={vehicleOverallStatus.lowerBatteryVehicleNumber || 0}
            >
              <span
                className={taskQueueStyles.vehicleStatusBadge}
                style={{ background: VehicleStateColor.Error }}
              >
                <FormattedMessage id={'vehicle.battery.low'} />
              </span>
            </Badge>
            <Badge
              showZero
              style={{ background: VehicleStateColor.Offline }}
              count={vehicleOverallStatus.offlineVehicleNumber || 0}
            >
              <span
                className={taskQueueStyles.vehicleStatusBadge}
                style={{ background: VehicleStateColor.Offline }}
              >
                <FormattedMessage id={'vehicleState.Offline'} />
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
                <OrderedListOutlined /> <FormattedMessage id="app.taskQueue.reorderPriority" />
              </Button>
            ) : null}
            <Button onClick={this.getData}>
              <RedoOutlined /> <FormattedMessage id="app.button.refresh" />
            </Button>
          </Row>
        </div>
        <TableWithPages
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
