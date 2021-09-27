import React, { Component } from 'react';
import { connect } from '@/utils/dva';
import { Button, message, Modal, Table, Divider } from 'antd';
import { formatMessage, FormattedMessage } from '@/utils/Lang';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { fetchAgvTaskList, fetchBatchCancelTask, fetchAgvList } from '@/services/api';
import TablePageWrapper from '@/components/TablePageWrapper';
import { dealResponse } from '@/utils/utils';
import TaskSearch from './TaskSearch';
import commonStyles from '@/common.module.less';

@connect()
class TaskLibraryComponent extends Component {
  state = {
    formValues: {}, // 保存查询表单的值

    loading: false,
    cancelLoading: false,

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

  getData = async (values = {}) => {
    const { agvType } = this.props;
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
    const response = await fetchAgvTaskList(agvType, params);
    if (!dealResponse(response)) {
      const { list, page } = response;
      this.setState({ loading: false, dataSource: list, page });
    }
  };

  handleTableChange = (pagination) => {
    const page = { ...this.state.page, currentPage: pagination.current, size: pagination.pageSize };
    this.setState({ page }, () => {
      this.getData();
    });
  };

  getAgvList = async () => {
    const { agvType } = this.props;
    const sectionId = window.localStorage.getItem('sectionId');
    const response = await fetchAgvList(agvType, sectionId);

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
    Modal.confirm({
      title: formatMessage({ id: 'app.common.systemHint' }),
      icon: <ExclamationCircleOutlined />,
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
        <div>
          <TaskSearch search={this.getData} agvList={agvList.map(({ robotId }) => robotId)} />
          <Divider className={commonStyles.divider} />
          {cancel && (
            <Button disabled={selectedRowKeys.length === 0} onClick={this.openCancelTaskConfirm}>
              <FormattedMessage id={'app.taskDetail.cancelTask'} />
            </Button>
          )}
        </div>
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
            showTotal: (total) => formatMessage({ id: 'app.common.tableRecord' }, { count: total }),
          }}
          onChange={this.handleTableChange}
        />
      </TablePageWrapper>
    );
  }
}
export default TaskLibraryComponent;
