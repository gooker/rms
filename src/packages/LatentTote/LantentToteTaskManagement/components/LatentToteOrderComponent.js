import React, { Component } from 'react';
import { Button, message, Table, Divider, Tooltip, Badge } from 'antd';
import { formatMessage, dealResponse, convertToUserTimezone } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { fetchAgvTaskList, fetchBatchCancelTask, fetchAgvList } from '@/services/api';
import TablePageWrapper from '@/components/TablePageWrapper';
import RmsConfirm from '@/components/RmsConfirm';
import LatentToteOrderSearch from './LatentToteOrderSearch';
import commonStyles from '@/common.module.less';
import { TaskStateBageType } from '@/config/consts';
import styles from '../taskOrder.module.less';

class LatentToteOrderComponent extends Component {
  state = {
    formValues: {}, // 保存查询表单的值

    loading: false,

    selectedRows: [],
    selectedRowKeys: [],

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
      title: formatMessage({ id: 'app.agv.id' }),
      dataIndex: 'robotId',
      align: 'center',
      width: 100,
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
      title: formatMessage({ id: 'app.taskDetail.targetSpotId' }),
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

    const params = { current: !!firstPage ? 1 : currentPage, size, ...requestValues };
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

  //任务详情
  checkDetail = (taskId) => {
    const { dispatch, agvType } = this.props;
    dispatch({
      type: 'task/fetchTaskDetailByTaskId',
      payload: { taskId, agvType },
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
    const { agvType } = this.props;

    const requestBody = {
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
    const { loading, selectedRowKeys, dataSource, page } = this.state;
    return (
      <TablePageWrapper>
        <LatentToteOrderSearch search={this.getData} />
        <div className={styles.taskSearchDivider}>
          <Divider />

          <Button
            disabled={selectedRowKeys.length === 0}
            onClick={this.openCancelTaskConfirm}
            style={{ marginBottom: 10 }}
          >
            <FormattedMessage id={'app.taskDetail.cancelTask'} />
          </Button>
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
export default LatentToteOrderComponent;
