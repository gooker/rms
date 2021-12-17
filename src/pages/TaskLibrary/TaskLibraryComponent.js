import React, { Component } from 'react';
import { connect } from '@/utils/dva';
import { Button, message, Table, Divider } from 'antd';
import { formatMessage, dealResponse } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';
import { fetchAgvTaskList, fetchBatchCancelTask, fetchAgvList } from '@/services/api';
import TablePageWrapper from '@/components/TablePageWrapper';
import RcsConfirm from '@/components/RcsConfirm';
import TaskSearch from './TaskSearch';
import commonStyles from '@/common.module.less';

@connect()
class TaskLibraryComponent extends Component {
  state = {
    formValues: {}, // 保存查询表单的值

    loading: false,

    selectedRows: [],
    selectedRowKeys: [],

    agvList: [],
    dataSource: [],
    page: { currentPage: 1, size: 10, totalElements: 0 },
  };

  componentDidMount() {
    this.getData();
    this.getAgvList();
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
    const { agvType } = this.props;

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
    const response = await fetchAgvTaskList(agvType, params);
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

  getAgvList = async () => {
    const { agvType } = this.props;
    const response = await fetchAgvList(agvType);
    if (dealResponse(response)) {
      message.error(formatMessage({ id: 'app.agv.getListFail' }));
    } else {
      this.setState({ agvList: response });
    }
  };

  //任务详情
  checkDetail = (taskId, taskAgvType) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'task/fetchTaskDetailByTaskId',
      payload: { taskId, taskAgvType },
    });
  };

  openCancelTaskConfirm = () => {
    RcsConfirm({
      content: formatMessage({ id: 'app.taskAction.cancel.confirm' }),
      onOk: this.cancelTask,
    });
  };

  cancelTask = async () => {
    const { selectedRows } = this.state;
    const { agvType } = this.props;

    const requestBody = {
      sectionId: window.localStorage.getItem('sectionId'),
      taskIds: selectedRows.map((record) => record.taskId),
    };
    const response = await fetchBatchCancelTask(agvType, requestBody);
    if (!dealResponse(response)) {
      message.success(formatMessage({ id: 'app.taskAction.cancel.success' }));
      this.setState({ selectedRowKeys: [], selectedRows: [] }, this.getData);
    }
  };

  rowSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  };

  render() {
    const { loading, selectedRowKeys, agvList, dataSource, page } = this.state;
    const { cancel, getColumn } = this.props;
    return (
      <TablePageWrapper>
        <TaskSearch search={this.getData} agvList={agvList.map(({ robotId }) => robotId)} />
        <div>
          <Divider className={commonStyles.divider} />
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
            columns={getColumn(this.checkDetail)}
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
