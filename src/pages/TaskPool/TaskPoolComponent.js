import React, { Component } from 'react';
import { connect } from '@/utils/RmsDva';
import { Button, Divider, message, Table } from 'antd';
import { dealResponse, formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { cancelTotePoolTask, fetchAllVehicleList, fetchPoolTasks } from '@/services/commonService';
import TablePageWrapper from '@/components/TablePageWrapper';
import RmsConfirm from '@/components/RmsConfirm';
import TaskPoolSearch from './TaskPoolSearch';
import styles from '../../packages/SmartTask/task.module.less';

@connect()
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

  componentDidMount() {
    this.getData();
    this.getVehicleList();
  }

  getData = async (values = {}) => {
    const { vehicleType } = this.props;
    const {
      page: { currentPage, size },
    } = this.state;

    this.setState({ loading: true, selectedRows: [], selectedRowKeys: [] });

    let requestValues;
    if (values) {
      requestValues = { ...values };
      this.setState({ formValues: values });
    } else {
      requestValues = { ...this.state.formValues };
    }

    const sectionId = window.localStorage.getItem('sectionId');
    const params = { sectionId, current: currentPage, size, ...requestValues };
    const response = await fetchPoolTasks(vehicleType, params);
    if (!dealResponse(response)) {
      const { list, page } = response;
      this.setState({ dataSource: list, page });
    }
    this.setState({ loading: false });
  };

  handleTableChange = (pagination) => {
    const page = { ...this.state.page, currentPage: pagination.current, size: pagination.pageSize };
    this.setState({ page }, () => {
      this.getData();
    });
  };

  // 小车id
  getVehicleList = async () => {
    const response = await fetchAllVehicleList();
    if (dealResponse(response)) {
      message.error(formatMessage({ id: 'app.message.fetchVehicleListFail' }));
    } else {
      this.setState({ vehicleList: response });
    }
  };

  //任务详情
  checkDetail = (taskId, vehicleType) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'task/fetchTaskDetailByTaskId',
      payload: { taskId, vehicleType },
    });
  };

  cancelTaskConfirm = () => {
    RmsConfirm({
      content: formatMessage({ id: 'app.taskAction.cancel.confirm' }),
      onOk: this.cancelTask,
    });
  };

  // 取消任务-可批量
  cancelTask = async () => {
    const { selectedRowKeys } = this.state;
    const { vehicleType } = this.props;
    const response = await cancelTotePoolTask(vehicleType, [...selectedRowKeys]);
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
    const { cancel, getColumn } = this.props;
    return (
      <TablePageWrapper>
        <div className={styles.taskSearchDivider}>
          <TaskPoolSearch
            search={this.getData}
            vehicleList={vehicleList.map(({ vehicleId }) => vehicleId)}
          />
          <Divider />
          {cancel && (
            <Button disabled={selectedRowKeys.length === 0} onClick={this.cancelTaskConfirm}>
              <FormattedMessage id={'app.taskDetail.cancelTask'} />
            </Button>
          )}
        </div>
        <Table
          loading={loading}
          scroll={{ x: 'max-content' }}
          rowKey={(record) => {
            return record.id;
          }}
          dataSource={dataSource}
          columns={getColumn(this.checkDetail)}
          rowSelection={{ selectedRowKeys, onChange: this.rowSelectChange }}
          pagination={{
            current: page.currentPage,
            pageSize: page.size,
            total: page.totalElements || 0,
            showTotal: (total) => formatMessage({ id: 'app.common.tableRecord' }, { count: total }),
          }}
          onChange={this.handleTableChange}
        />
      </TablePageWrapper>
    );
  }
}
export default TaskLibraryComponent;
