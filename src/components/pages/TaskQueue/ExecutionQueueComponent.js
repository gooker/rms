import React, { Component } from 'react';
import { connect } from '@/utils/dva';
import { Button, Divider } from 'antd';
import { DeleteOutlined, RedoOutlined } from '@ant-design/icons';
import { formatMessage, dealResponse } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';
import { fetchExecutingTaskList, deleteExecutionQTasks } from '@/services/api';
import TablewidthPages from '@/components/TablewidthPages';
import RcsConfirm from '@/components/RcsConfirm';
import ExecutionQueueSearch from './ExecutionQueueSearch';
import TablePageWrapper from '@/components/TablePageWrapper';
import commonStyles from '@/common.module.less';

@connect()
class ExecutionQueueComponent extends Component {
  state = {
    dataSource: [],
    selectedRow: [],
    selectedRowKeys: [],

    loading: false,
    deleteLoading: false,

    pageHeight: 0,
  };

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    const { agvType } = this.props;
    const sectionId = window.localStorage.getItem('sectionId');
    this.setState({ loading: true });
    let response = await fetchExecutingTaskList(agvType, sectionId);
    if (!dealResponse(response)) {
      const dataSource = response.map((item) => ({ key: item.taskId, ...item }));
      this.setState({ dataSource });
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

    RcsConfirm({
      content: formatMessage({ id: 'app.executionQ.deleteTaskSure' }),
      onOk: async () => {
        _this.setState({ deleteLoading: true });
        const response = await deleteExecutionQTasks(agvType, requestParam);
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

  checkTaskDetail = (taskId) => {
    const { dispatch, agvType } = this.props;
    dispatch({
      type: 'task/fetchTaskDetailByTaskId',
      payload: { taskId, taskAgvType: agvType },
    });
  };

  filterTableList = (filterValue) => {
    const { dataSource } = this.state;
    const { filter } = this.props;
    if (filterValue && filter && typeof filter === 'function') {
      return filter(dataSource, filterValue);
    }
    return dataSource;
  };

  render() {
    const { loading, deleteLoading, selectedRowKeys } = this.state;
    const { getColumn, deleteFlag } = this.props;
    return (
      <TablePageWrapper>
        <div>
          <ExecutionQueueSearch search={this.filterTableList} />
          <Divider className={commonStyles.divider} />
          {deleteFlag ? (
            <Button
              danger
              loading={deleteLoading}
              icon={<DeleteOutlined />}
              onClick={this.deleteQueueTasks}
              disabled={selectedRowKeys.length === 0}
            >
              <FormattedMessage id="app.button.delete" />
            </Button>
          ) : null}
          <Button type="primary" ghost onClick={this.getData} className={commonStyles.ml10}>
            <RedoOutlined />
            <FormattedMessage id="app.button.refresh" />
          </Button>
        </div>
        <TablewidthPages
          loading={loading}
          columns={getColumn(this.checkTaskDetail)}
          dataSource={this.filterTableList()}
          rowKey={(record) => record.taskId}
          rowSelection={{
            selectedRowKeys,
            onChange: this.onSelectChange,
          }}
        />
      </TablePageWrapper>
    );
  }
}
export default ExecutionQueueComponent;
