import React, { Component } from 'react';
import { Badge, Button, Divider, Tooltip } from 'antd';
import { connect } from '@/utils/RmsDva';
import { TaskStatusColor } from '@/config/consts';
import { fetchTaskRecord } from '@/services/taskService';
import { dealResponse, fastConvertToUserTimezone, formatMessage, isStrictNull, renderLabel } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import TablePageWrapper from '@/components/TablePageWrapper';
import TaskSearch from './components/TaskManagementSearch';
import styles from './task.module.less';
import commonStyles from '@/common.module.less';
import RmsConfirm from '@/components/RmsConfirm';
import { fetchCancelTask } from '@/services/commonService';
import TableWithPages from '@/components/TableWithPages';

@connect(({ global }) => ({
  allTaskTypes: global.allTaskTypes,
}))
class TaskHistory extends Component {
  state = {
    searchParam: {},
    pagination: {
      currentPage: 1,
      size: 10,
      totalElements: 0,
      totalPages: 0,
    },
    loading: false,
    vehicles: [],
    dataSource: [],
    selectedRowKeys: [],
  };

  columns = [
    {
      title: <FormattedMessage id='app.task.id' />,
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
      title: <FormattedMessage id='app.taskDetail.externalCode' />,
      // dataIndex: 'externalCode',
      align: 'center',
    },
    {
      title: <FormattedMessage id='app.task.name' />,
      dataIndex: 'customName',
      align: 'center',
      render: renderLabel,
    },
    {
      title: <FormattedMessage id='app.task.code' />,
      dataIndex: 'customCode',
      align: 'center',
    },
    {
      title: <FormattedMessage id='app.vehicleType' />,
      dataIndex: 'vehicleType',
      align: 'center',
    },
    {
      title: <FormattedMessage id='vehicle.code' />,
      dataIndex: 'currentVehicleId',
      align: 'center',
    },
    {
      title: <FormattedMessage id='resource.load.type' />,
      // dataIndex: 'vehicleType',
      align: 'center',
    },
    {
      title: <FormattedMessage id='resource.load.code' />,
      // dataIndex: 'appointedVehicleId',
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
              status={TaskStatusColor[text]}
              text={formatMessage({ id: `app.task.state.${text}` })}
            />
          );
        }
      },
    },
    {
      title: <FormattedMessage id='app.common.targetCell' />,
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
      title: <FormattedMessage id='app.taskQueue.reason' />,
      dataIndex: 'prepareFailedReason',
      align: 'center',
    },
  ];

  expandColumns = [
    {
      title: <FormattedMessage id='app.common.creator' />,
      dataIndex: 'createdByUser',
      align: 'center',
    },
    {
      title: <FormattedMessage id='app.common.creationTime' />,
      dataIndex: 'createTime',
      align: 'center',
      render: (text) => {
        if (!isStrictNull(text)) {
          return fastConvertToUserTimezone(text);
        }
      },
    },
    {
      title: <FormattedMessage id='app.common.updater' />,
      dataIndex: 'updatedByUser',
      align: 'center',
    },
    {
      title: <FormattedMessage id='app.common.updateTime' />,
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
    this.getTaskRecord();
  }

  getTaskRecord = async (values, jumpToFirstPage) => {
    const {
      searchParam,
      pagination: { currentPage, size },
    } = this.state;
    this.setState({ loading: true, selectedRowKeys: [] });

    let requestValues;
    if (values) {
      requestValues = values;
      this.setState({ searchParam: values });
    } else {
      requestValues = searchParam;
    }
    const params = { current: jumpToFirstPage ? 1 : currentPage, size, ...requestValues };
    const response = await fetchTaskRecord(params);
    if (!dealResponse(response)) {
      const { list, page } = response;
      this.setState({ dataSource: list, pagination: page });
    }
    this.setState({ loading: false });
  };

  handleTableChange = (pagination) => {
    this.setState(
      {
        pagination: {
          ...this.state.pagination,
          currentPage: pagination.current,
          size: pagination.pageSize,
        },
      },
      () => {
        this.getTaskRecord(null, false);
      },
    );
  };

  cancelTask = () => {
    RmsConfirm({
      content: formatMessage({ id: 'app.message.cancelTask.confirm' }),
      onOk: this.cancelTaskConfirm,
    });
  };

  cancelTaskConfirm = async () => {
    const { selectedRowKeys } = this.state;
    const response = await fetchCancelTask({ taskIdList: selectedRowKeys });
    if (!dealResponse(response, 1)) {
      this.setState({ selectedRowKeys: [] }, this.getTaskRecord);
    }
  };

  checkDetail = (taskId) => {
    this.props.dispatch({ type: 'task/fetchTaskDetailByTaskId', payload: { taskId } });
  };

  render() {
    const _this = this;
    const { allTaskTypes } = this.props;
    const { vehicles, selectedRowKeys, loading, dataSource, pagination } = this.state;
    return (
      <TablePageWrapper>
        <TaskSearch
          search={this.getTaskRecord}
          vehicleList={vehicles.map(({ vehicleId }) => vehicleId)}
          allTaskTypes={allTaskTypes ?? {}}
        />
        <div className={styles.taskSearchDivider}>
          <Divider style={{ marginTop: 0 }} />
          <Button
            danger
            onClick={this.cancelTask}
            disabled={selectedRowKeys.length === 0}
            style={{ marginBottom: 10 }}
          >
            <FormattedMessage id={'app.taskDetail.cancelTask'} />
          </Button>
          <TableWithPages
            loading={loading}
            rowKey={({ taskId }) => taskId}
            dataSource={dataSource}
            columns={this.columns}
            expandColumns={this.expandColumns}
            rowSelection={{
              selectedRowKeys,
              onChange(selectedRowKeys) {
                _this.setState({ selectedRowKeys });
              },
            }}
            pagination={{
              showSizeChanger: true,
              current: pagination.currentPage,
              pageSize: pagination.size,
              total: pagination.totalElements || 0,
              showTotal: (total) =>
                formatMessage({ id: 'app.template.tableRecord' }, { count: total }),
            }}
            onChange={this.handleTableChange}
          />
        </div>
      </TablePageWrapper>
    );
  }
}

export default TaskHistory;
