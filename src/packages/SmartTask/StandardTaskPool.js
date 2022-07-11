import React from 'react';
import { Badge, Button, Divider, message, Row, Tooltip } from 'antd';
import { DeleteOutlined, OrderedListOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import Dictionary from '@/utils/Dictionary';
import { VehicleType } from '@/config/config';
import { TaskStateBageType, VehicleStateColor } from '@/config/consts';
import { convertToUserTimezone, dealResponse, formatMessage, isStrictNull } from '@/utils/util';
import { fetchExecutingTasks, fetchPipeLineTasks } from '@/services/taskService';
import { deleteTaskQueueItems, fetchUpdateTaskPriority } from '@/services/commonService';
import RmsConfirm from '@/components/RmsConfirm';
import TableWithPages from '@/components/TableWithPages';
import TablePageWrapper from '@/components/TablePageWrapper';
import FormattedMessage from '@/components/FormattedMessage';
import UpdateTaskPriority from './components/UpdateTaskPriority';
import taskQueueStyles from '@/packages/SmartTask/task.module.less';
import commonStyles from '@/common.module.less';
import StandardTaskPoolSearch from '@/packages/SmartTask/components/StandardTaskPoolSearch';

const { red, green } = Dictionary('color');

@connect(({ global }) => ({
  allTaskTypes: global.allTaskTypes,
}))
class StandardTaskPool extends React.Component {
  state = {
    dataSource: [],
    vehicleOverallStatus: {},

    selectedRow: [],
    selectedRowKeys: [],

    loading: false,
    deleteLoading: false,
    priorityVisible: false,
  };

  columns = [
    {
      title: <FormattedMessage id="app.task.id" />,
      dataIndex: 'taskId',
      align: 'center',
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
      title: <FormattedMessage id='app.task.type' />,
      dataIndex: 'vehicleTaskType',
      align: 'center',
      render: (text) => {
        const { allTaskTypes } = this.props;
        return allTaskTypes?.[VehicleType.LatentLifting]?.[text] || text;
      },
    },
    {
      title: <FormattedMessage id='vehicle.id' />,
      dataIndex: 'appointedVehicleId',
      align: 'center',
    },
    {
      title: <FormattedMessage id='app.vehicleType' />,
      dataIndex: 'vehicleType',
      align: 'center',
    },
    {
      title: <FormattedMessage id='app.common.targetCell' />,
      dataIndex: 'targetCellId',
      align: 'center',
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
      title: <FormattedMessage id='app.common.priority' />,
      dataIndex: 'jobPriority',
      align: 'center',
    },
    {
      title: <FormattedMessage id='app.task.state' />,
      dataIndex: 'taskStatus',
      align: 'center',
      render: (text) => {
        if (!isStrictNull(text)) {
          return (
            <Badge
              status={TaskStateBageType[text]}
              text={formatMessage({ id: `app.task.state.${text}` })}
            />
          );
        }
      },
    },
    {
      title: <FormattedMessage id='app.common.creationTime' />,
      dataIndex: 'createTimeMilliseconds',
      align: 'center',
      render: (text) => {
        if (!isStrictNull(text)) {
          return <span>{convertToUserTimezone(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
        }
      },
    },
    {
      title: <FormattedMessage id='app.taskQueue.reason' />,
      dataIndex: 'prepareFailedReason',
      align: 'center',
    },
  ];

  expandColumns = [
    {
      title: <FormattedMessage id='app.executionQ.isReleased' />,
      dataIndex: 'isReleased',
      align: 'center',
      render: (text) => {
        if (text) {
          return (
            <span style={{ color: green }}>
              <FormattedMessage id='app.executionQ.released' />
            </span>
          );
        } else {
          return (
            <span style={{ color: red }}>
              <FormattedMessage id='app.executionQ.unreleased' />
            </span>
          );
        }
      },
    },
    {
      title: <FormattedMessage id='app.executionQ.chargerHardwareId' />,
      dataIndex: 'chargerHardwareId',
      align: 'center',
    },
    {
      title: <FormattedMessage id='app.executionQ.chargerDirection' />,
      dataIndex: 'chargerDirection',
      align: 'center',
      render: (text) => {
        if (text != null) {
          return formatMessage({ id: Dictionary('chargerDirection', text) });
        } else {
          return null;
        }
      },
    },
    {
      title: <FormattedMessage id='app.executionQ.chargerSpotId' />,
      dataIndex: 'chargerCellId',
      align: 'center',
    },
    {
      title: <FormattedMessage id='app.taskQueue.lastExecutedTimestamp' />,
      dataIndex: 'lastExecutedTimestamp',
      align: 'center',
      render: (text) => {
        if (!text) {
          return '--';
        }
        return <span>{convertToUserTimezone(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
      },
    },
    {
      title: <FormattedMessage id='app.taskQueue.triedTimes' />,
      dataIndex: 'triedTimes',
      align: 'center',
    },
  ];

  componentDidMount() {
    this.filterTableList();
  }

  getCombinedDatasource = async () => {
    const [waiting, executing] = await Promise.all([
      fetchPipeLineTasks(),
      fetchExecutingTasks(),
      // fetchVehicleOverallStatus(),
    ]);
    let dataSource = [];
    if (!dealResponse(waiting)) {
      const data = waiting.map((item) => ({
        ...item,
        appointedVehicleId: item.currentVehicleId,
      }));
      dataSource = dataSource.concat(data);
    }
    if (!dealResponse(executing)) {
      const data = executing.map((item) => ({
        ...item,
        appointedVehicleId: item.currentVehicleId,
      }));
      dataSource = dataSource.concat(data);
    }
    return dataSource;
  };

  filterTableList = async (filterValue = {}) => {
    this.setState({ loading: true });
    let dataSource = await this.getCombinedDatasource();
    const { vehicleType, vehicleId, taskId, vehicleTaskType, taskStatus } = filterValue;
    if (!isStrictNull(vehicleType)) {
      dataSource = dataSource.filter((item) => item.vehicleType === vehicleType);
    }
    if (Array.isArray(vehicleId)) {
      dataSource = dataSource.filter((item) => vehicleId.includes(item.vehicle.id));
    }
    if (!isStrictNull(taskId)) {
      dataSource = dataSource.filter((item) => item.taskId === taskId);
    }
    if (Array.isArray(vehicleTaskType)) {
      dataSource = dataSource.filter((item) => vehicleTaskType.includes(item.vehicleTaskType));
    }
    if (!isStrictNull(taskStatus)) {
      dataSource = dataSource.filter((item) => item.taskStatus === taskStatus);
    }
    this.setState({ dataSource, loading: false });
  };

  deleteQueueTasks = () => {
    const _this = this;
    const { selectedRowKeys, dataSource } = this.state;
    const { vehicleType } = this.props;
    const sectionId = window.localStorage.getItem('sectionId');
    const requestParam = { sectionId, taskIdList: selectedRowKeys };

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
          const newDataSource = dataSource.filter((item) => !selectedRowKeys.includes(item.taskId));
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
    const { selectedRowKeys, priorityValue } = this.state;
    const response = await fetchUpdateTaskPriority(vehicleType, {
      taskIdList: selectedRowKeys,
      value: priorityValue,
      sectionId: window.localStorage.getItem('sectionId'),
    });

    if (dealResponse(response)) {
      message.error(formatMessage({ id: 'app.taskQueue.updateTaskPriority.failed' }));
    } else {
      message.success(formatMessage({ id: 'app.taskQueue.updateTaskPriority' }));
      this.setState({ visibleForPriority: false, selectedRowKeys: [], selectedKeys: [] }, () => {
        this.filterTableList();
      });
    }
  };

  render() {
    const { dataSource, deleteLoading, selectedRowKeys, vehicleOverallStatus } = this.state;
    const { allTaskTypes } = this.props;
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
          <StandardTaskPoolSearch allTaskTypes={allTaskTypes || {}} search={this.filterTableList} />
          <Divider style={{ margin: '0 0 24px 0' }} />
          <Row className={commonStyles.tableToolLeft}>
            <Button
              danger
              loading={deleteLoading}
              onClick={this.deleteQueueTasks}
              disabled={selectedRowKeys.length === 0}
            >
              <DeleteOutlined /> <FormattedMessage id='app.button.delete' />
            </Button>
            <Button
              disabled={selectedRowKeys.length === 0}
              onClick={() => {
                this.switchTaskPriorityModal(true);
              }}
            >
              <OrderedListOutlined /> <FormattedMessage id='app.taskQueue.reorderPriority' />
            </Button>
          </Row>
        </div>
        <TableWithPages
          loading={this.state.loading}
          columns={this.columns}
          expandColumns={this.expandColumns}
          dataSource={dataSource}
          rowKey={({ taskId }) => taskId}
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

export default StandardTaskPool;
