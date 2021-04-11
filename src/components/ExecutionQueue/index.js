import React, { Component } from 'react';
import { Form, Table, Row, Button, Input, Modal } from 'antd';
import { formatMessage, FormattedMessage } from '@/utils/Lang';
import { DeleteOutlined, RedoOutlined } from '@ant-design/icons';
import { fetchExecutingTaskList } from '@/services/api';
import { connect } from '@/utils/dva';
import { getContentHeight } from '@/utils/utils';
import { debounce } from 'lodash';
import commonStyles from '@/common.module.less';

const { confirm } = Modal;

const TableToolHeight = 56;
@connect()
class ExecutionQueue extends Component {
  state = {
    dataSource: [],
    selectedRow: [],
    selectedRowKeys: [],

    filterValue: '',
    loading: false,
    pageHeight: getContentHeight(),
  };

  componentDidMount() {
    this.observeContentsSizeChange();
    this.getData();
  }

  componentWillUnmount() {
    this.resizeObserver.disconnect();
  }

  getData = async () => {
    const { nameSpace } = this.props;
    const sectionId = window.localStorage.getItem('sectionId');
    this.setState({ loading: true });
    const response = await fetchExecutingTaskList(nameSpace, sectionId);
    const dataSource = response.map((item) => ({ key: item.taskId, ...item }));
    this.setState({ dataSource, loading: false });
  };

  observeContentsSizeChange = () => {
    const _this = this;
    this.resizeObserver = new ResizeObserver(
      debounce((entries) => {
        const { contentRect } = entries[0];
        const height = contentRect?.height ?? getContentHeight();
        _this.setState({ pageHeight: height });
      }, 200),
    );
    this.resizeObserver.observe(document.getElementById('layoutContent'));
  };

  onSelectChange = (selectedRowKeys, selectedRow) => {
    this.setState({ selectedRowKeys, selectedRow });
  };

  filterTableList = () => {
    const { dataSource, filterValue } = this.state;
    const { filter } = this.props;
    if (filter && typeof filter === 'function') {
      return filter(dataSource, filterValue);
    }
    return dataSource;
  };

  deleteQueueTasks = () => {
    const _this = this;
    confirm({
      title: formatMessage({ id: 'app.executionQ.deleteTaskSure' }),
      onOk: () => {
        //
      },
    });
  };

  render() {
    const { loading, selectedRowKeys, pageHeight } = this.state;
    const { dispatch, getColumn } = this.props;
    return (
      <div style={{ height: pageHeight }} className={commonStyles.pageWrapper}>
        <Row>
          <Row>
            <Button
              style={{ marginRight: 20 }}
              icon={<DeleteOutlined />}
              onClick={this.deleteQueueTasks}
              disabled={selectedRowKeys.length === 0}
            >
              <FormattedMessage id="app.button.delete" />
            </Button>
            <Form.Item label={formatMessage({ id: 'app.executionQ.retrieval' })}>
              <Input />
            </Form.Item>
          </Row>
          <Row style={{ flex: 1, justifyContent: 'flex-end' }} type="flex">
            <Button type="primary" onClick={this.getData}>
              <RedoOutlined />
              <FormattedMessage id="app.button.refresh" />
            </Button>
          </Row>
        </Row>
        <div
          style={{ height: pageHeight - TableToolHeight - 48 }}
          className={commonStyles.tableWrapper}
        >
          <Table
            loading={loading}
            columns={getColumn(dispatch)}
            dataSource={this.filterTableList()}
            scroll={{ x: 2450, y: 500 }}
            pagination={false}
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
export default ExecutionQueue;
