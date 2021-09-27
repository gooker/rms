import React from 'react';
import { Tooltip, Button, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import TaskQueueComponent from '@/components/pages/TaskQueue/TaskQueueComponent';
import Dictionary from '@/utils/Dictionary';
import { dateFormat, formatMessage } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';
import { hasPermisson } from '@/utils/Permisson';
import { AGVType } from '@/config/config';
import commonStyles from '@/common.module.less';

const { red, green } = Dictionary('color');

export default class TaskQueue extends React.PureComponent {
  searchInput = React.createRef();

  getColumn = (checkDetail) => {
    return [
      {
        title: <FormattedMessage id="app.task.id" />,
        dataIndex: 'taskId',
        align: 'center',
        width: 200,
        ...this.getColumnSearchProps('taskId', (value, record) =>
          record['taskId'].toString().toLowerCase().includes(value.toLowerCase()),
        ),
        render: (text) => {
          return (
            <Tooltip title={text}>
              <span
                className={commonStyles.textLinks}
                onClick={() => {
                  checkDetail(text, AGVType.Sorter);
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
        dataIndex: 'type',
        align: 'center',
        width: 150,
        render: (text) => {
          return <span>{formatMessage({ id: Dictionary('agvTaskType', text) })}</span>;
        },
        // onFilter: (value, record) => record.agvTaskType.includes(value),
      },
      {
        title: <FormattedMessage id="app.taskQueue.appointedTarget" />,
        dataIndex: 'appointedTargetCellId',
        align: 'center',
        width: 150,
        ...this.getColumnSearchProps('appointedTargetCellId'),
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
        title: <FormattedMessage id="app.taskQueue.appointedAgv" />,
        dataIndex: 'appointedAGVId',
        align: 'center',
        width: 150,
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
        title: <FormattedMessage id="app.taskQueue.priority" />,
        dataIndex: 'priority',
        align: 'center',
        width: 150,
        sorter: (a, b) => a.priority - b.priority,
        ...this.getColumnSearchProps('priority'),
        render: (text) => <span>{text}</span>,
      },
      {
        title: <FormattedMessage id="app.taskQueue.createTime" />,
        dataIndex: 'createTimeMilliseconds',
        align: 'center',
        width: 200,
        sorter: (a, b) => a.createTimeMilliseconds - b.createTimeMilliseconds,
        render: (text) => {
          if (!text) {
            return <FormattedMessage id="app.taskQueue.notAvailable" />;
          }
          return <span>{dateFormat(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
        },
      },
      {
        title: <FormattedMessage id="app.taskQueue.lastExecutedTimestamp" />,
        dataIndex: 'lastExecutedTimestamp',
        align: 'center',
        width: 150,
        sorter: (a, b) => a.lastExecutedTimestamp - b.lastExecutedTimestamp,
        render: (text) => {
          if (!text) {
            return <FormattedMessage id="app.taskQueue.notAvailable" />;
          }
          return <span>{dateFormat(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
        },
      },
      {
        title: <FormattedMessage id="app.taskQueue.triedTimes" />,
        dataIndex: 'triedTimes',
        align: 'center',
        width: 150,
        sorter: (a, b) => a.triedTimes - b.triedTimes,
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

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  render() {
    const deleteFlag = hasPermisson('/tote/center/taskQueue/delete') ? true : false;
    const priority = hasPermisson('/tote/center/taskQueue/updatePipLine') ? true : false;
    return (
      <TaskQueueComponent
        getColumn={this.getColumn} // 提供表格列数据
        agvType={AGVType.Tote} // 标记当前页面的车型
        deleteFlag={deleteFlag} // 标记该页面是否允许执行删除操作
        priority={priority} // 标记该页面是否允许执行调整优先级操作
      />
    );
  }
}
