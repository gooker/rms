import React, { Component } from 'react';
import { connect } from '@/utils/RmsDva';
import { Button, Divider, Tooltip } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { convertToUserTimezone, dealResponse, formatMessage, isStrictNull } from '@/utils/util';
import ExecutionQueueSearch from './components/ExecutionQueueSearch';
import TablePageWrapper from '@/components/TablePageWrapper';
import FormattedMessage from '@/components/FormattedMessage';
import TableWithPages from '@/components/TableWithPages';
import RmsConfirm from '@/components/RmsConfirm';
import { VehicleType } from '@/config/config';
import Dictionary from '@/utils/Dictionary';
import commonStyles from '@/common.module.less';
import styles from './task.module.less';
import { fetchExecutingTasks } from '@/services/taskService';

const { red, green } = Dictionary('color');

@connect(({ global }) => ({
  allTaskTypes: global.allTaskTypes,
}))
class ExecutingQueue extends Component {
  state = {
    dataSource: [],
    selectedRowKeys: [],
    loading: false,
    deleteLoading: false,
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
                this.checkTaskDetail(text, VehicleType.Tote);
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
      render: (text) => {
        const { allTaskTypes, vehicleType } = this.props;
        return allTaskTypes?.[vehicleType]?.[text] || text;
      },
    },
    {
      title: <FormattedMessage id="app.executionQ.isReleased" />,
      dataIndex: 'isReleased',
      align: 'center',
      render: (text) => {
        if (text) {
          return (
            <span style={{ color: green }}>
              <FormattedMessage id="app.executionQ.released" />
            </span>
          );
        } else {
          return (
            <span style={{ color: red }}>
              <FormattedMessage id="app.executionQ.unreleased" />
            </span>
          );
        }
      },
    },
    {
      title: <FormattedMessage id="app.vehicle" />,
      dataIndex: 'appointedVehicleId',
      align: 'center',
      render: (text) => {
        return <span className={commonStyles.textLinks}>{text}</span>;
      },
    },
    {
      title: <FormattedMessage id="app.form.target" />,
      dataIndex: 'appointedTargetCellId',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.executionQ.chargerHardwareId" />,
      dataIndex: 'chargerHardwareId',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.executionQ.chargerDirection" />,
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
      title: <FormattedMessage id="app.executionQ.chargerSpotId" />,
      dataIndex: 'chargerCellId',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.executionQ.createTime" />,
      dataIndex: 'createTimeMilliseconds',
      align: 'center',
      render: (text) => {
        if (!text) {
          return <FormattedMessage id="app.executionQ.notAvailable" />;
        }
        return (
          <span style={{ width: '100%' }}>
            {convertToUserTimezone(text).format('YYYY-MM-DD HH:mm:ss')}
          </span>
        );
      },
    },
    {
      title: <FormattedMessage id="app.executionQ.lastExecutedTimestamp" />,
      dataIndex: 'lastExecutedTimestamp',
      align: 'center',
      render: (text) => {
        if (!text) {
          return <FormattedMessage id="app.executionQ.notAvailable" />;
        }
        return (
          <span style={{ width: '100%' }}>
            {convertToUserTimezone(text).format('YYYY-MM-DD HH:mm:ss')}
          </span>
        );
      },
    },
  ];

  componentDidMount() {
    this.filterTableList();
  }

  filterTableList = async (filterValue = {}) => {
    this.setState({ loading: true });
    const response = await fetchExecutingTasks();
    if (!dealResponse(response)) {
      const { vehicleType, vehicleId, taskId, vehicleTaskType } = filterValue;
      let dataSource = [];
      if (!isStrictNull(vehicleType)) {
        dataSource = dataSource.filter(
          (item) => item.vehicleStepTaskList[0]?.vehicleType === vehicleType,
        );
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
      this.setState({ dataSource });
    }
    this.setState({ loading: false });
  };

  deleteQueueTasks = () => {
    const _this = this;
    const { selectedRowKeys, dataSource } = this.state;
    RmsConfirm({
      content: formatMessage({ id: 'app.executionQ.deleteTaskSure' }),
      onOk: async () => {
        // _this.setState({ deleteLoading: true });
        // const response = await deleteExecutionQTasks(vehicleType, { taskIdList: selectedRowKeys });
        // if (
        //   !dealResponse(
        //     response,
        //     formatMessage({ id: 'app.executionQ.deleteTaskSuccess' }),
        //     formatMessage({ id: 'app.executionQ.deleteTaskFail' }),
        //   )
        // ) {
        //   // 这里不重复请求后台，手动对原数据进行处理
        //   const newDataSource = dataSource.filter((item) => !taskIdList.includes(item.taskId));
        //   _this.setState({
        //     deleteLoading: false,
        //     dataSource: newDataSource,
        //     selectedRowKeys: [],
        //   });
        // }
      },
    });
  };

  checkTaskDetail = (taskId) => {
    const { dispatch, vehicleType } = this.props;
    dispatch({
      type: 'task/fetchTaskDetailByTaskId',
      payload: { taskId, vehicleType },
    });
  };

  render() {
    const { loading, dataSource, deleteLoading, selectedRowKeys } = this.state;
    const { allTaskTypes } = this.props;
    return (
      <TablePageWrapper>
        <div className={styles.taskSearchDivider}>
          <ExecutionQueueSearch allTaskTypes={allTaskTypes || {}} search={this.filterTableList} />
          <Divider style={{ margin: '0 0 16px 0' }} />
          <Button
            danger
            loading={deleteLoading}
            onClick={this.deleteQueueTasks}
            disabled={selectedRowKeys.length === 0}
          >
            <DeleteOutlined /> <FormattedMessage id="app.button.delete" />
          </Button>
        </div>
        <TableWithPages
          loading={loading}
          columns={this.columns}
          dataSource={dataSource}
          rowKey={(record) => record.taskId}
          rowSelection={{
            selectedRowKeys,
            onChange(selectedRowKeys) {
              this.setState({ selectedRowKeys });
            },
          }}
        />
      </TablePageWrapper>
    );
  }
}

export default ExecutingQueue;
