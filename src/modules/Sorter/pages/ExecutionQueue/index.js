import React from 'react';
import { Tooltip } from 'antd';
import ExecutionQueueComponent from '@/components/ExecutionQueue';
import { formatMessage } from '@/utils/Lang';
import dictionary from '@/utils/Dictionary';
import { dateFormat } from '@/utils/utils';
import commonStyles from '@/common.module.less';
import Config from '@/config/config';

const { red, green } = dictionary('color', 'all');

const NameSpace = Config.nameSpace.Sorter;
const TaskAgvType = Config.AGVType.Sorter;

export default class ExecutionQueue extends React.Component {
  getColumn = (dispatch) => {
    return [
      {
        title: formatMessage({ id: 'app.task.id' }),
        dataIndex: 'taskId',
        width: 150,
        align: 'center',
        render: (text) => {
          return (
            <Tooltip title={text}>
              <span
                className={commonStyles.textLinks}
                onClick={() => {
                  dispatch({
                    type: 'task/fetchTaskDetailByTaskId',
                    payload: {
                      taskId: text,
                      taskAgvType: TaskAgvType,
                      nameSpace: NameSpace,
                    },
                  });
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
      },
      {
        title: formatMessage({ id: 'app.executionQ.isReleased' }),
        dataIndex: 'isReleased',
        align: 'center',
        width: 150,
        render: (text) => {
          if (text) {
            return (
              <span style={{ color: green }}>
                {formatMessage({ id: 'app.executionQ.released' })}
              </span>
            );
          } else {
            return (
              <span style={{ color: red }}>
                {formatMessage({ id: 'app.executionQ.unreleased' })}
              </span>
            );
          }
        },
      },
      {
        title: formatMessage({ id: 'app.agv' }),
        dataIndex: 'currentRobotId',
        align: 'center',
        width: 100,
        render: (text) => {
          return <span className={commonStyles.textLinks}>{text}</span>;
        },
      },
      {
        title: formatMessage({ id: 'app.executionQ.target' }),
        dataIndex: 'targetCellId',
        align: 'center',
        width: 100,
      },
      {
        title: formatMessage({ id: 'app.executionQ.chargerHardwareId' }),
        dataIndex: 'chargerHardwareId',
        align: 'center',
        width: 120,
      },
      {
        title: formatMessage({ id: 'app.executionQ.chargerDirection' }),
        dataIndex: 'chargerDirection',
        align: 'center',
        width: 100,
        render: (text) => {
          if (text != null) {
            return formatMessage({ id: dictionary('chargerDirection', text) });
          } else {
            return null;
          }
        },
      },
      {
        title: formatMessage({ id: 'app.executionQ.chargerCellId' }),
        dataIndex: 'chargerCellId',
        align: 'center',
        width: 100,
      },
      {
        title: formatMessage({ id: 'app.executionQ.createTime' }),
        dataIndex: 'createTimeMilliseconds',
        align: 'center',
        width: 200,
        sorter: (a, b) => a.createTimeMilliseconds - b.createTimeMilliseconds,
        render: (text) => {
          if (!text) {
            return <span>{formatMessage({ id: 'app.executionQ.notAvailable' })}</span>;
          }
          return (
            <span style={{ width: '100%' }}>{dateFormat(text).format('YYYY-MM-DD HH:mm:ss')}</span>
          );
        },
      },
      {
        title: formatMessage({ id: 'app.executionQ.lastExecutedTimestamp' }),
        dataIndex: 'lastExecutedTimestamp',
        align: 'center',
        width: 200,
        sorter: (a, b) => a.lastExecutedTimestamp - b.lastExecutedTimestamp,
        render: (text) => {
          if (!text) {
            return <span>{formatMessage({ id: 'app.executionQ.notAvailable' })}</span>;
          }
          return (
            <span style={{ width: '100%' }}>{dateFormat(text).format('YYYY-MM-DD HH:mm:ss')}</span>
          );
        },
      },
      {
        title: formatMessage({ id: 'app.executionQ.triedTimes' }),
        dataIndex: 'triedTimes',
        align: 'center',
        width: 100,
      },
      {
        title: formatMessage({ id: 'app.executionQ.executeMax' }),
        dataIndex: 'executeMaxTry',
        align: 'center',
        width: 100,
      },
      {
        title: formatMessage({ id: 'app.executionQ.delayMS' }),
        dataIndex: 'delayMS',
        align: 'center',
        width: 100,
      },
      {
        title: formatMessage({ id: 'app.executionQ.currentStep' }),
        dataIndex: 'currentStepId',
        align: 'center',
        width: 100,
      },
      {
        title: formatMessage({ id: 'app.executionQ.executionState' }),
        dataIndex: 'isExecuted',
        align: 'center',
        width: 200,
        render: (text) => {
          if (text) {
            return <span>{formatMessage({ id: 'app.executionQ.executed' })}</span>;
          } else {
            return <span>{formatMessage({ id: 'app.executionQ.unexecuted' })}</span>;
          }
        },
      },
    ];
  };

  filterDataSource = (dataSource = [], filterValue) => {
    return dataSource.filter((item) => {
      const targetCellId = `${item.targetCellId}`;
      return (
        item.taskId?.includes(filterValue) ||
        item.currentRobotId?.includes(filterValue) ||
        targetCellId?.includes(filterValue)
      );
    });
  };

  render() {
    return (
      <ExecutionQueueComponent
        getColumn={this.getColumn} // 提供表格列数据
        nameSpace={NameSpace} // 标记当前页面的车型
        filter={this.filterDataSource} // 数据筛选逻辑
        delete={true} // 标记该页面是否允许执行删除操作
      />
    );
  }
}
