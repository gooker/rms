import React from 'react';
import { Badge, Button, Divider, message, Row, Tooltip } from 'antd';
import { DeleteOutlined, OrderedListOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { TaskStatusColor } from '@/config/consts';
import {
  dealResponse,
  fastConvertToUserTimezone,
  formatMessage,
  isStrictNull,
  renderLabel,
} from '@/utils/util';
import {
  cancelTask,
  fetchExecutingTasks,
  fetchPipeLineTasks,
  updateTaskPriority,
} from '@/services/taskService';
import { fetchVehicleStatusStatistics } from '@/services/commonService';
import RmsConfirm from '@/components/RmsConfirm';
import TableWithPages from '@/components/TableWithPages';
import TablePageWrapper from '@/components/TablePageWrapper';
import FormattedMessage from '@/components/FormattedMessage';
import UpdateTaskPriority from './components/UpdateTaskPriority';
import StandardTaskPoolSearch from './components/StandardTaskPoolSearch';
import commonStyles from '@/common.module.less';
import VehicleStatusOverview from '@/packages/SmartTask/components/UpdateTaskPriority/VehicleStatusOverview';

@connect()
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
      title: <FormattedMessage id="app.taskDetail.externalCode" />,
      // dataIndex: 'externalCode',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.task.name" />,
      dataIndex: 'customName',
      align: 'center',
      render: renderLabel,
    },
    {
      title: <FormattedMessage id="app.task.code" />,
      dataIndex: 'customCode',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.vehicleType" />,
      dataIndex: 'vehicleType',
      align: 'center',
    },
    {
      title: <FormattedMessage id="vehicle.code" />,
      dataIndex: 'currentVehicleId',
      align: 'center',
    },
    {
      title: <FormattedMessage id="resource.load.type" />,
      // dataIndex: 'vehicleType',
      align: 'center',
    },
    {
      title: <FormattedMessage id="resource.load.code" />,
      // dataIndex: 'appointedVehicleId',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.task.state" />,
      dataIndex: 'taskStatus',
      align: 'center',
      render: (text) => {
        if (!isStrictNull(text)) {
          return (
            <Badge
              status={TaskStatusColor[text]}
              text={formatMessage({ id: `app.task.state.${text}` })}
            />
          );
        }
      },
    },
    {
      title: <FormattedMessage id="app.common.priority" />,
      dataIndex: 'jobPriority',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.common.targetCell" />,
      // dataIndex: 'targetCellId',
      align: 'center',
      // render: (text, record) => {
      //   if (record.isLockTargetCell == null) {
      //     return <span>{text}</span>;
      //   }
      //   if (record.isLockTargetCell) {
      //     return <span style={{ color: green }}>{text}</span>;
      //   } else {
      //     return <span style={{ color: red }}>{text}</span>;
      //   }
      // },
    },
    {
      title: <FormattedMessage id="app.taskQueue.reason" />,
      dataIndex: 'prepareFailedReason',
      align: 'center',
    },
  ];

  expandColumns = [
    {
      title: <FormattedMessage id="app.common.creator" />,
      dataIndex: 'createdByUser',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.common.creationTime" />,
      dataIndex: 'createTime',
      align: 'center',
      render: (text) => {
        if (!isStrictNull(text)) {
          return fastConvertToUserTimezone(text);
        }
      },
    },
    {
      title: <FormattedMessage id="app.common.updater" />,
      dataIndex: 'updatedByUser',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.common.updateTime" />,
      dataIndex: 'updateTime',
      align: 'center',
      render: (text) => {
        if (!isStrictNull(text)) {
          return fastConvertToUserTimezone(text);
        }
      },
    },
  ];

  componentDidMount() {
    this.filterTableList();
  }

  filterTableList = async (filterValue = {}) => {
    this.setState({ loading: true });

    // 收集数据
    const [waiting, executing, vehicleOverallStatus] = await Promise.all([
      fetchPipeLineTasks(),
      fetchExecutingTasks(),
      fetchVehicleStatusStatistics(),
    ]);
    let dataSource = [];
    if (!dealResponse(waiting) && Array.isArray(waiting)) {
      dataSource = dataSource.concat(waiting);
    }
    if (!dealResponse(executing) && Array.isArray(executing)) {
      dataSource = dataSource.concat(executing);
    }

    // 数据筛选
    const { taskId, taskName, taskStatus, vehicleType, vehicleCode } = filterValue;
    if (!isStrictNull(taskId)) {
      dataSource = dataSource.filter((item) => item.taskId === taskId);
    }
    if (!isStrictNull(taskStatus)) {
      dataSource = dataSource.filter((item) => taskName === item.customName);
    }
    if (!isStrictNull(taskStatus)) {
      dataSource = dataSource.filter((item) => item.taskStatus === taskStatus);
    }
    if (!isStrictNull(vehicleType)) {
      dataSource = dataSource.filter((item) => item.vehicleType === vehicleType);
    }
    if (Array.isArray(vehicleCode)) {
      dataSource = dataSource.filter((item) => vehicleCode.includes(item.currentVehicleId));
    }
    this.setState({ dataSource, vehicleOverallStatus, loading: false });
  };

  deleteQueueTasks = () => {
    const _this = this;
    const { selectedRowKeys, dataSource } = this.state;
    RmsConfirm({
      content: formatMessage({ id: 'app.message.deleteTaskSure' }),
      onOk: async () => {
        _this.setState({ deleteLoading: true });
        const response = await cancelTask({ taskIdList: selectedRowKeys });
        if (!dealResponse(response, true)) {
          // 这里不重复请求后台，手动对原数据进行处理
          const newDataSource = dataSource.filter((item) => !selectedRowKeys.includes(item.taskId));
          _this.setState({
            dataSource: newDataSource,
            selectedRow: [],
            selectedRowKeys: [],
          });
        }
        _this.setState({ deleteLoading: false });
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
    const response = await updateTaskPriority(vehicleType, {
      taskIdList: selectedRowKeys,
      value: priorityValue,
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
          <VehicleStatusOverview data={vehicleOverallStatus} />
          <StandardTaskPoolSearch allTaskTypes={allTaskTypes || {}} search={this.filterTableList} />
          <Divider style={{ margin: '0 0 24px 0' }} />
          <Row className={commonStyles.tableToolLeft}>
            <Button
              danger
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
              <OrderedListOutlined /> <FormattedMessage id="app.taskQueue.reorderPriority" />
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
