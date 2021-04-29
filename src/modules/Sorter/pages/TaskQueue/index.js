import React from 'react';
import { Tooltip, Popover, Button, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import TaskQueueComponent from '@/components/Container/TaskQueue/TaskQueueComponent';
import { formatMessage, FormattedMessage } from '@/utils/Lang';
import dictionary from '@/utils/Dictionary';
import { dateFormat } from '@/utils/utils';
import commonStyles from '@/common.module.less';
import Config from '@/config/config';

const { red, green } = dictionary('color', 'all');

const NameSpace = Config.nameSpace.Sorter;
const TaskAgvType = Config.AGVType.Sorter;

export default class TaskQueue extends React.PureComponent {
  searchInput = React.createRef();

  getColumn = (checkDetail) => {
    return [
      {
        title: formatMessage({ id: 'app.task.id' }),
        dataIndex: 'taskId',
        width: 120,
        align: 'center',
        ...this.getColumnSearchProps('taskId', (value, record) =>
          record['taskId'].toString().toLowerCase().includes(value.toLowerCase()),
        ),
        render: (text) => {
          return (
            <Tooltip title={text}>
              <span
                className={commonStyles.textLinks}
                onClick={() => {
                  checkDetail(text, TaskAgvType, NameSpace);
                }}
              >
                {text ? '*' + text.substr(text.length - 6, 6) : null}
              </span>
            </Tooltip>
          );
        },
      },
      {
        title: formatMessage({ id: 'app.task.type' }),
        dataIndex: 'agvTaskType',
        align: 'center',
        width: 150,
        render: (text) => <span>{formatMessage({ id: dictionary('agvTaskType', text) })}</span>,
        filters: this.renderFilters(dictionary('agvTaskType', 'all')),
        onFilter: (value, record) => record.agvTaskType.includes(value),
      },
      {
        title: formatMessage({ id: 'app.pod.id' }),
        dataIndex: 'podId',
        align: 'center',
        width: '8%',
        ...this.getColumnSearchProps('podId'),
        render: (text, record) => {
          if (record.isLockPod) {
            return <span style={{ color: green }}>{text}</span>;
          } else {
            return <span style={{ color: red }}>{text}</span>;
          }
        },
      },
      {
        title: formatMessage({ id: 'app.taskQueue.appointedTarget' }),
        dataIndex: 'targetCellId',
        align: 'center',
        width: '8%',
        ...this.getColumnSearchProps('targetCellId'),
        render: (text, record) => {
          if (record.isLockTargetCell == null) {
            return <span>{text}</span>;
          }
          if (record.isLockTargetCell) {
            return <span style={{ color: green }}>{text}</span>;
          } else {
            return <span style={{ color: red }}>{text}</span>;
          }
        },
      },
      {
        title: formatMessage({ id: 'app.taskQueue.appointedAgv' }),
        dataIndex: 'appointedAGVId',
        align: 'center',
        width: '8%',
        ...this.getColumnSearchProps('appointedAGVId'),
        render: (text, record) => {
          if (record.isLockAGV) {
            return <span style={{ color: green }}>{text}</span>;
          } else {
            return <span style={{ color: red }}>{text}</span>;
          }
        },
      },
      {
        title: formatMessage({ id: 'app.taskQueue.priority' }),
        dataIndex: 'jobPriority',
        align: 'center',
        width: '8%',
        sorter: (a, b) => a.jobPriority - b.jobPriority,
        ...this.getColumnSearchProps('jobPriority'),
        render: (text) => <span>{text}</span>,
      },
      {
        title: formatMessage({ id: 'app.taskQueue.createTime' }),
        dataIndex: 'createTimeMilliseconds',
        align: 'center',
        width: '10%',
        sorter: (a, b) => a.createTimeMilliseconds - b.createTimeMilliseconds,
        render: (text) => {
          if (!text) {
            return <span>{formatMessage({ id: 'app.taskQueue.notAvailable' })}</span>;
          }
          return <span>{dateFormat(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
        },
      },
      {
        title: formatMessage({ id: 'app.taskQueue.lastExecutedTimestamp' }),
        dataIndex: 'lastExecutedTimestamp',
        align: 'center',
        width: '10%',
        sorter: (a, b) => a.lastExecutedTimestamp - b.lastExecutedTimestamp,
        render: (text) => {
          if (!text) {
            return <span>{formatMessage({ id: 'app.taskQueue.notAvailable' })}</span>;
          }
          return <span>{dateFormat(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
        },
      },
      {
        title: formatMessage({ id: 'app.taskQueue.triedTimes' }),
        dataIndex: 'triedTimes',
        align: 'center',
        width: '10%',
        sorter: (a, b) => a.triedTimes - b.triedTimes,
      },
      {
        title: formatMessage({ id: 'app.taskDetail.reason' }),
        dataIndex: 'prepareFailedReason',
        align: 'center',
        fixed: 'right',
        width: 250,
        render: (text) => {
          if (text) {
            if (text.length > 18) {
              return (
                <Popover
                  content={<span style={{ display: 'inline-block', width: '300px' }}>{text}</span>}
                  trigger="hover"
                >
                  <span style={{ cursor: 'pointer' }}>{text.substr(0, 18)}...</span>
                </Popover>
              );
            } else {
              return <span>{text}</span>;
            }
          } else {
            return <span>{formatMessage({ id: 'app.taskQueue.notAvailable' })}</span>;
          }
        },
      },
    ];
  };

  getColumnSearchProps = (dataIndex, fun) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={this.searchInput}
          placeholder={dataIndex}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          size="small"
          type="primary"
          style={{ width: 90, marginRight: 8 }}
          onClick={() => this.handleSearch(selectedKeys, confirm)}
        >
          <FormattedMessage id="app.button.search" />
        </Button>
        <Button size="small" style={{ width: 90 }} onClick={() => this.handleReset(clearFilters)}>
          <FormattedMessage id="app.button.reset" />
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: fun
      ? fun
      : (value, record) =>
          record[dataIndex] != null && record[dataIndex].toString() === value.toLowerCase(),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.current.select());
      }
    },
    render: (text) => {
      const { searchText } = this.state;
      return searchText;
    },
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  renderFilters = (data) => {
    let data_ = [];
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const element = data[key];
        data_.push({
          text: formatMessage({ id: element }),
          value: key,
        });
      }
    }
    return data_;
  };

  render() {
    return (
      <TaskQueueComponent
        getColumn={this.getColumn} // 提供表格列数据
        nameSpace={NameSpace} // 标记当前页面的车型
        delete={true} // 标记该页面是否允许执行删除操作
        priority={true} // 标记该页面是否允许执行调整优先级操作
      />
    );
  }
}
