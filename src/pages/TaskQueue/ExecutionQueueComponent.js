import React, { Component } from 'react';
import { connect } from '@/utils/RmsDva';
import { Button, Divider, Tooltip } from 'antd';
import { DeleteOutlined, RedoOutlined } from '@ant-design/icons';
import { formatMessage, dealResponse, dateFormat, isStrictNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { fetchExecutingTaskList, deleteExecutionQTasks } from '@/services/api';
import TableWidthPages from '@/components/TableWidthPages';
import RmsConfirm from '@/components/RmsConfirm';
import ExecutionQueueSearch from './ExecutionQueueSearch';
import TablePageWrapper from '@/components/TablePageWrapper';
import { AGVType } from '@/config/config';
import Dictionary from '@/utils/Dictionary';
import commonStyles from '@/common.module.less';
import styles from './taskQueue.module.less';

const { red, green } = Dictionary('color');

@connect(({ global }) => ({
  allTaskTypes: global.allTaskTypes,
}))
class ExecutionQueueComponent extends Component {
  state = {
    dataSource: [],
    selectedRow: [],
    selectedRowKeys: [],

    loading: false,
    deleteLoading: false,

    pageHeight: 0,
  };

  columns = [
    {
      title: <FormattedMessage id="app.task.id" />,
      dataIndex: 'taskId',
      width: 150,
      align: 'center',
      render: (text) => {
        return (
          <Tooltip title={text}>
            <span
              className={commonStyles.textLinks}
              onClick={() => {
                this.checkTaskDetail(text, AGVType.Tote);
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
      dataIndex: 'agvTaskType',
      align: 'center',
      width: 150,
      render: (text) => {
        const { allTaskTypes, agvType } = this.props;
        return allTaskTypes?.[agvType]?.[text] || text;
      },
    },
    {
      title: <FormattedMessage id="app.executionQ.isReleased" />,
      dataIndex: 'isReleased',
      align: 'center',
      width: 150,
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
      title: <FormattedMessage id="app.agv" />,
      dataIndex: 'appointedAGVId',
      align: 'center',
      width: 100,
      render: (text) => {
        return <span className={commonStyles.textLinks}>{text}</span>;
      },
    },
    {
      title: <FormattedMessage id="app.executionQ.target" />,
      dataIndex: 'appointedTargetCellId',
      align: 'center',
      width: 100,
    },
    {
      title: <FormattedMessage id="app.executionQ.chargerHardwareId" />,
      dataIndex: 'chargerHardwareId',
      align: 'center',
      width: 120,
    },
    {
      title: <FormattedMessage id="app.executionQ.chargerDirection" />,
      dataIndex: 'chargerDirection',
      align: 'center',
      width: 100,
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
      width: 100,
    },
    {
      title: <FormattedMessage id="app.executionQ.createTime" />,
      dataIndex: 'createTimeMilliseconds',
      align: 'center',
      width: 200,
      sorter: (a, b) => a.createTimeMilliseconds - b.createTimeMilliseconds,
      render: (text) => {
        if (!text) {
          return <FormattedMessage id="app.executionQ.notAvailable" />;
        }
        return (
          <span style={{ width: '100%' }}>{dateFormat(text).format('YYYY-MM-DD HH:mm:ss')}</span>
        );
      },
    },
    {
      title: <FormattedMessage id="app.executionQ.lastExecutedTimestamp" />,
      dataIndex: 'lastExecutedTimestamp',
      align: 'center',
      width: 200,
      sorter: (a, b) => a.lastExecutedTimestamp - b.lastExecutedTimestamp,
      render: (text) => {
        if (!text) {
          return <FormattedMessage id="app.executionQ.notAvailable" />;
        }
        return (
          <span style={{ width: '100%' }}>{dateFormat(text).format('YYYY-MM-DD HH:mm:ss')}</span>
        );
      },
    },
  ];

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    const { agvType } = this.props;
    this.setState({ loading: true });
    const response = await fetchExecutingTaskList(agvType);
    if (!dealResponse(response)) {
      this.setState({ dataSource: response });
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

    RmsConfirm({
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

  filterTableList = (filterValue = {}) => {
    const { dataSource } = this.state;
    const currentFilterValue = {};
    if (!isStrictNull(filterValue.taskId)) {
      currentFilterValue.taskId = filterValue.taskId;
    }
    if (!isStrictNull(filterValue.agvId)) {
      currentFilterValue.appointedAGVId = filterValue.agvId;
    }
    if (Object.keys(currentFilterValue).length === 0) {
      return dataSource;
    }

    let currentSources = [];
    if (!isStrictNull(filterValue.agvTaskType)) {
      const filterType = filterValue.agvTaskType;
      currentSources = dataSource.filter(({ type }) => filterType.includes(type));
    }
    Object.values(currentFilterValue).map((value) => {
      currentSources.push(...this.filterValues(dataSource, value));
    });
    return currentSources;
  };

  filterValues = (dataSource, value) => {
    return dataSource.filter((item) => item[value]?.includes(value));
  };

  render() {
    const { loading, deleteLoading, selectedRowKeys } = this.state;
    const { deleteFlag, allTaskTypes, agvType } = this.props;
    return (
      <TablePageWrapper>
        <div className={styles.taskSearchDivider}>
          <ExecutionQueueSearch
            allTaskTypes={allTaskTypes?.[agvType] || {}}
            search={this.filterTableList}
          />
          <Divider/>
          {deleteFlag ? (
            <Button
              danger
              loading={deleteLoading}
              onClick={this.deleteQueueTasks}
              disabled={selectedRowKeys.length === 0}
            >
              <DeleteOutlined /> <FormattedMessage id="app.button.delete" />
            </Button>
          ) : null}
          <Button type="primary" ghost onClick={this.getData} style={{ marginLeft: 10 }}>
            <RedoOutlined /> <FormattedMessage id="app.button.refresh" />
          </Button>
        </div>
        <TableWidthPages
          loading={loading}
          columns={this.columns}
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
