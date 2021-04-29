import React from 'react';
import { Badge, Button, Tooltip } from 'antd';
import { InfoOutlined } from '@ant-design/icons';
import { formatMessage, FormattedMessage } from '@/utils/Lang';
import dictionary from '@/utils/Dictionary';
import { dateFormat } from '@/utils/utils';
import Config from '@/config/config';
import TaskLibraryComponent from '@/components/Container/TaskLibrary/TaskLibraryComponent';
import commonStyles from '@/common.module.less';

const taskStatusMap = ['warning', 'processing', 'success', 'error', 'default'];
const NameSpace = Config.nameSpace.Sorter;
const TaskAgvType = Config.AGVType.Sorter;

export default class TaskLibrary extends React.Component {
  getColumn = (checkDetail) => {
    return [
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
        title: formatMessage({ id: 'app.agv.id' }),
        dataIndex: 'robotId',
        align: 'center',
        width: 100,
      },
      {
        title: formatMessage({ id: 'app.task.type' }),
        dataIndex: 'type',
        align: 'center',
        width: 150,
        render: (text) => {
          if (text != null) {
            const key = dictionary('agvTaskType', [text]);
            if (key) {
              return <FormattedMessage id={key} />;
            } else {
              return <span>{key}</span>;
            }
          }
        },
      },
      {
        title: formatMessage({ id: 'app.task.status' }),
        dataIndex: 'taskStatus',
        align: 'center',
        width: 120,
        render: (text) => {
          if (text != null) {
            const key = dictionary('taskStatus', [text]);
            if (text === 'New') {
              return <Badge status={taskStatusMap[0]} text={formatMessage({ id: key })} />;
            } else if (text === 'Executing') {
              return <Badge status={taskStatusMap[1]} text={formatMessage({ id: key })} />;
            } else if (text === 'Finished') {
              return <Badge status={taskStatusMap[2]} text={formatMessage({ id: key })} />;
            } else if (text === 'Error') {
              return <Badge status={taskStatusMap[3]} text={formatMessage({ id: key })} />;
            } else if (text === 'Cancel') {
              return <Badge status={taskStatusMap[4]} text={formatMessage({ id: key })} />;
            }
          } else {
            return <FormattedMessage id="app.taskDetail.notAvailable" />;
          }
        },
      },
      {
        title: formatMessage({ id: 'app.taskDetail.targetCellId' }),
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
        title: formatMessage({ id: 'app.taskDetail.createTime' }),
        dataIndex: 'createTime',
        align: 'center',
        width: 150,
        render: (text) => {
          if (!text) {
            return <span>{formatMessage({ id: 'app.taskDetail.notAvailable' })}</span>;
          }
          return <span>{dateFormat(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
        },
      },
      {
        title: formatMessage({ id: 'app.taskDetail.updateTime' }),
        dataIndex: 'updateTime',
        align: 'center',
        width: 150,
        render: (text) => {
          if (!text) {
            return <span>{formatMessage({ id: 'app.taskDetail.notAvailable' })}</span>;
          }
          return <span>{dateFormat(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
        },
      },
      {
        title: formatMessage({ id: 'app.button.operation' }),
        dataIndex: 'taskId',
        align: 'center',
        width: 100,
        render: (taskId) => {
          return (
            <Button
              type="link"
              onClick={() => {
                checkDetail(taskId, TaskAgvType, NameSpace);
              }}
              icon={<InfoOutlined />}
            >
              <FormattedMessage id="app.taskDetail.info" />
            </Button>
          );
        },
      },
    ];
  };

  render() {
    return (
      <TaskLibraryComponent
        getColumn={this.getColumn} // 提供表格列数据
        nameSpace={NameSpace} // 标记当前页面的车型
        cancel={true} // 标记该页面是否允许执行取消操作
      />
    );
  }
}
