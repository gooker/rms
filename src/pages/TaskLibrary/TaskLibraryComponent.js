import React, { Component } from 'react';
import { connect } from '@/utils/RmsDva';
import { Badge, Button, Divider, message, Table, Tooltip } from 'antd';
import { convertToUserTimezone, dealResponse, formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import {
  fetchAllVehicleList,
  fetchBatchCancelTask,
  fetchVehicleTaskList,
} from '@/services/commonService';
import TablePageWrapper from '@/components/TablePageWrapper';
import RmsConfirm from '@/components/RmsConfirm';
import TaskSearch from '../../packages/SmartTask/components/TaskManagementSearch';
import commonStyles from '@/common.module.less';
import { TaskStateBageType } from '@/config/consts';
import styles from '../../packages/SmartTask/task.module.less';

@connect(({ global }) => ({
  allTaskTypes: global.allTaskTypes,
}))
class TaskLibraryComponent extends Component {
  state = {
    formValues: {}, // 保存查询表单的值

    loading: false,

    selectedRows: [],
    selectedRowKeys: [],

    vehicleList: [],
    dataSource: [],
    page: { currentPage: 1, size: 10, totalElements: 0 },
  };

  columns = [
    {
      title: formatMessage({ id: 'app.task.id' }),
      dataIndex: 'taskId',
      align: 'center',
      width: 100,
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
      title: formatMessage({ id: 'vehicle.id' }),
      dataIndex: 'vehicleId',
      align: 'center',
      width: 100,
    },
    {
      title: <FormattedMessage id="app.task.type" />,
      dataIndex: 'type',
      align: 'center',
      width: 150,
      render: (text) => {
        const { allTaskTypes, vehicleType } = this.props;
        return allTaskTypes?.[vehicleType]?.[text] || text;
      },
    },
    {
      title: formatMessage({ id: 'app.task.state' }),
      dataIndex: 'taskStatus',
      align: 'center',
      width: 120,
      render: (text) => {
        if (text != null) {
          return (
            <Badge
              status={TaskStateBageType[text]}
              text={formatMessage({ id: `app.task.state.${text}` })}
            />
          );
        } else {
          return <FormattedMessage id="app.taskDetail.notAvailable" />;
        }
      },
    },
    {
      title: formatMessage({ id: 'app.common.targetCell' }),
      dataIndex: 'targetCellId',
      align: 'center',
      width: 100,
    },
    {
      title: formatMessage({ id: 'app.taskDetail.createUser' }),
      dataIndex: 'createdByUser',
      align: 'center',
      width: 100,
    },

    {
      title: formatMessage({ id: 'app.common.creationTime' }),
      dataIndex: 'createTime',
      align: 'center',
      width: 150,
      render: (text) => {
        if (!text) {
          return <span>{formatMessage({ id: 'app.taskDetail.notAvailable' })}</span>;
        }
        return <span>{convertToUserTimezone(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
      },
    },
    {
      title: formatMessage({ id: 'app.common.updateTime' }),
      dataIndex: 'updateTime',
      align: 'center',
      width: 150,
      render: (text) => {
        if (!text) {
          return <span>{formatMessage({ id: 'app.taskDetail.notAvailable' })}</span>;
        }
        return <span>{convertToUserTimezone(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
      },
    },
  ];

  componentDidMount() {
    this.getData();
    this.getVehicleList();
  }

  /**
   * 查询方法
   * @param {*} values 查询条件
   * @param {*} firstPage 查询成功后是否跳转到第一页
   */
  getData = async (values, firstPage) => {
    const {
      page: { currentPage, size },
    } = this.state;
    const { vehicleType } = this.props;

    this.setState({ loading: true, selectedRows: [], selectedRowKeys: [] });

    let requestValues;
    if (values) {
      requestValues = { ...values };
      this.setState({ formValues: values });
    } else {
      requestValues = { ...this.state.formValues };
    }

    const sectionId = window.localStorage.getItem('sectionId');
    const params = { sectionId, current: !!firstPage ? 1 : currentPage, size, ...requestValues };
    const response = await fetchVehicleTaskList(vehicleType, params);
    if (!dealResponse(response)) {
      const { list, page } = response;
      this.setState({ dataSource: list, page });
    }
    this.setState({ loading: false });
  };

  handleTableChange = (pagination) => {
    const page = { ...this.state.page, currentPage: pagination.current, size: pagination.pageSize };
    this.setState({ page }, () => {
      this.getData(null, false);
    });
  };

  getVehicleList = async () => {
    const response = await fetchAllVehicleList();
    if (dealResponse(response)) {
      message.error(formatMessage({ id: 'app.message.fetchVehicleListFail' }));
    } else {
      this.setState({ vehicleList: response });
    }
  };

  //任务详情
  checkDetail = (taskId) => {
    const { dispatch, vehicleType } = this.props;
    dispatch({
      type: 'task/fetchTaskDetailByTaskId',
      payload: { taskId, vehicleType },
    });
  };

  openCancelTaskConfirm = () => {
    RmsConfirm({
      content: formatMessage({ id: 'app.taskAction.cancel.confirm' }),
      onOk: this.cancelTask,
    });
  };

  cancelTask = async () => {
    const { selectedRows } = this.state;
    const { vehicleType } = this.props;

    const requestBody = {
      sectionId: window.localStorage.getItem('sectionId'),
      taskIds: selectedRows.map((record) => record.taskId),
    };
    const response = await fetchBatchCancelTask(vehicleType, requestBody);
    if (!dealResponse(response)) {
      message.success(formatMessage({ id: 'app.taskAction.cancel.success' }));
      this.setState({ selectedRowKeys: [], selectedRows: [] }, this.getData);
    }
  };

  rowSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  };

  render() {
    const { loading, selectedRowKeys, vehicleList, dataSource, page } = this.state;
    const { cancel, vehicleType, allTaskTypes } = this.props;
    return (
      <TablePageWrapper>
        <TaskSearch
          search={this.getData}
          vehicleList={vehicleList.map(({ vehicleId }) => vehicleId)}
          allTaskTypes={allTaskTypes?.[vehicleType] || {}}
        />
        <div className={styles.taskSearchDivider}>
          <Divider />
          {cancel && (
            <Button
              disabled={selectedRowKeys.length === 0}
              onClick={this.openCancelTaskConfirm}
              style={{ marginBottom: 10 }}
            >
              <FormattedMessage id={'app.taskDetail.cancelTask'} />
            </Button>
          )}
          <Table
            loading={loading}
            scroll={{ x: 'max-content' }}
            rowKey={(record) => record.taskId}
            dataSource={dataSource}
            columns={this.columns}
            rowSelection={{ selectedRowKeys, onChange: this.rowSelectChange }}
            pagination={{
              current: page.currentPage,
              pageSize: page.size,
              total: page.totalElements || 0,
              showTotal: (total) =>
                formatMessage({ id: 'app.common.tableRecord' }, { count: total }),
            }}
            onChange={this.handleTableChange}
          />
        </div>
      </TablePageWrapper>
    );
  }
}
export default TaskLibraryComponent;
