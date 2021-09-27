import React from 'react';
import { Tooltip } from 'antd';
import ExecutionQueueComponent from '@/components/pages/TaskQueue/ExecutionQueueComponent';
import Dictionary from '@/utils/Dictionary';
import { dateFormat, formatMessage, isStrictNull } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';
import commonStyles from '@/common.module.less';
import { AGVType } from '@/config/config';

const { red, green } = Dictionary('color');

export default class ExecutionQueue extends React.PureComponent {
  getColumn = (checkTaskDetail) => {
    return [
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
                  checkTaskDetail(text, AGVType.Tote);
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
        render: (text) => <FormattedMessage id={Dictionary('agvTaskType', text)} />,
      },
      {
        title: <FormattedMessage id= 'app.executionQ.isReleased' />,
        dataIndex: 'isReleased',
        align: 'center',
        width: 150,
        render: (text) => {
          if (text) {
            return (
              <span style={{ color: green }}>
                <FormattedMessage id='app.executionQ.released' />
              </span>
            );
          } else {
            return (
              <span style={{ color: red }}>
                <FormattedMessage id='app.executionQ.unreleased' />
              </span>
            );
          }
        },
      },
      {
        title: <FormattedMessage id= 'app.agv' />,
        dataIndex: 'appointedAGVId',
        align: 'center',
        width: 100,
        render: (text) => {
          return <span className={commonStyles.textLinks}>{text}</span>;
        },
      },
      {
        title: <FormattedMessage id= 'app.executionQ.target' />,
        dataIndex: 'appointedTargetCellId',
        align: 'center',
        width: 100,
      },
      {
        title: <FormattedMessage id= 'app.executionQ.chargerHardwareId' />,
        dataIndex: 'chargerHardwareId',
        align: 'center',
        width: 120,
      },
      {
        title: <FormattedMessage id= 'app.executionQ.chargerDirection' />,
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
        title: <FormattedMessage id= 'app.executionQ.chargerSpotId' />,
        dataIndex: 'chargerCellId',
        align: 'center',
        width: 100,
      },
      {
        title: <FormattedMessage id= 'app.executionQ.createTime' />,
        dataIndex: 'createTimeMilliseconds',
        align: 'center',
        width: 200,
        sorter: (a, b) => a.createTimeMilliseconds - b.createTimeMilliseconds,
        render: (text) => {
          if (!text) {
            return <FormattedMessage id= 'app.executionQ.notAvailable' />;
          }
          return (
            <span style={{ width: '100%' }}>{dateFormat(text).format('YYYY-MM-DD HH:mm:ss')}</span>
          );
        },
      },
      {
        title: <FormattedMessage id= 'app.executionQ.lastExecutedTimestamp' />,
        dataIndex: 'lastExecutedTimestamp',
        align: 'center',
        width: 200,
        sorter: (a, b) => a.lastExecutedTimestamp - b.lastExecutedTimestamp,
        render: (text) => {
          if (!text) {
            return <FormattedMessage id='app.executionQ.notAvailable' />;
          }
          return (
            <span style={{ width: '100%' }}>{dateFormat(text).format('YYYY-MM-DD HH:mm:ss')}</span>
          );
        },
      },
    ];
  };

  filterDataSource = (dataSource = [], filterValue) => {
    const currrentFilterValue = {};
    if (!isStrictNull(filterValue.taskId)) {
      currrentFilterValue.taskId = filterValue.taskId;
    }
    if (!isStrictNull(filterValue.agvId)) {
      currrentFilterValue.appointedAGVId = filterValue.agvId;
    }
    if (Object.keys(currrentFilterValue).length === 0) {
      return dataSource;
    }

    let currentSources = [];
    if (!isStrictNull(filterValue.agvTaskType)) {
      const filtertype = filterValue.agvTaskType;
      currentSources = dataSource.filter(({ type }) => filtertype.includes(type));
    }
    Object.values(currrentFilterValue).map((value) => {
      currentSources.push(...this.filterValues(dataSource, value));
    });
    return currentSources;
  };

  filterValues = (dataSource, value) => {
    return dataSource.filter((item) => item[value]?.includes(value));
  };

  render() {
    return (
      <ExecutionQueueComponent
        getColumn={this.getColumn} // 提供表格列数据
        agvType={AGVType.Tote} // 标记当前页面的车型
        filter={this.filterDataSource} // 数据筛选逻辑
        delete={true} // 标记该页面是否允许执行删除操作
      />
    );
  }
}
