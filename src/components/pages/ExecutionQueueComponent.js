import React, { Component } from 'react';
import { connect } from '@/utils/dva';
import { Form, Table, Row, Button, Input, Modal } from 'antd';
import { DeleteOutlined, RedoOutlined } from '@ant-design/icons';
import { formatMessage, FormattedMessage } from '@/utils/Lang';
import { fetchExecutingTaskList, deleteExecutionQTasks } from '@/services/api';
import { dealResponse } from '@/utils/utils';
import TablePageHOC from '@/components/TablePageHOC';
import commonStyles from '@/common.module.less';

const { confirm } = Modal;

@connect()
class ExecutionQueueComponent extends Component {
  state = {
    filterValue: '',

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
    const { nameSpace } = this.props;
    const sectionId = window.localStorage.getItem('sectionId');
    this.setState({ loading: true });
    const response = await fetchExecutingTaskList(nameSpace, sectionId);
    if (!dealResponse(response)) {
      const dataSource = response.map((item) => ({ key: item.taskId, ...item }));
      this.setState({ dataSource, loading: false });
    }
  };

  deleteQueueTasks = () => {
    const _this = this;
    const { selectedRow, dataSource } = this.state;
    const { nameSpace } = this.props;
    const sectionId = window.localStorage.getItem('sectionId');
    const taskIdList = selectedRow.map((record) => record.taskId);
    const requestParam = { sectionId, taskIdList };

    confirm({
      title: formatMessage({ id: 'app.executionQ.deleteTaskSure' }),
      onOk: async () => {
        _this.setState({ deleteLoading: true });
        const response = await deleteExecutionQTasks(nameSpace, requestParam);
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

  checkTaskDetail = (taskId, taskAgvType, nameSpace) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'task/fetchTaskDetailByTaskId',
      payload: { taskId, taskAgvType, nameSpace },
    });
  };

  filterTableList = () => {
    const { dataSource, filterValue } = this.state;
    const { filter } = this.props;
    if (filterValue && filter && typeof filter === 'function') {
      return filter(dataSource, filterValue);
    }
    return dataSource;
  };

  render() {
    const { loading, deleteLoading, selectedRowKeys, filterValue } = this.state;
    const { getColumn, pageHeight } = this.props;
    return (
      <div className={commonStyles.pageWrapper} style={{ height: pageHeight }}>
        <Row>
          <Row>
            <Button
              loading={deleteLoading}
              style={{ marginRight: 20 }}
              icon={<DeleteOutlined />}
              onClick={this.deleteQueueTasks}
              disabled={selectedRowKeys.length === 0}
            >
              {' '}
              <FormattedMessage id="app.button.delete" />
            </Button>
            <Form.Item label={formatMessage({ id: 'app.executionQ.retrieval' })}>
              <Input
                value={filterValue}
                onChange={(event) => {
                  this.setState({ filterValue: event.target.value });
                }}
              />
            </Form.Item>
          </Row>
          <Row style={{ flex: 1, justifyContent: 'flex-end' }} type="flex">
            <Button type="primary" onClick={this.getData}>
              <RedoOutlined />
              <FormattedMessage id="app.button.refresh" />
            </Button>
          </Row>
        </Row>
        <div className={commonStyles.tableWrapper}>
          <Table
            loading={loading}
            columns={getColumn(this.checkTaskDetail)}
            dataSource={this.filterTableList()}
            scroll={{ x: 'max-content' }}
            pagination={{
              responsive: true,
              defaultPageSize: 20,
              showTotal: (total) =>
                formatMessage({ id: 'app.common.tableRecord' }, { count: total }),
            }}
            rowSelection={{
              selectedRowKeys,
              onChange: this.onSelectChange,
            }}
          />
        </div>
      </div>
    );
  }
}
export default TablePageHOC(ExecutionQueueComponent);
