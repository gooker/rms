import React from 'react';
import { Badge, Tooltip } from 'antd';
import { formatMessage, FormattedMessage } from '@/utils/Lang';
import { dateFormat } from '@/utils/utils';
import TaskLibraryComponent from '@/components/pages/TaskLibrary/TaskLibraryComponent';
import { hasPermisson } from '@/utils/Permisson';
import commonStyles from '@/common.module.less';
import { AGVType } from '@/config/config';
import { TaskStateBageType } from '@/consts';

export default class TaskLibrary extends React.PureComponent {
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
                  checkDetail(text, AGVType.Tote);
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
        render: (text) => <FormattedMessage id={`app.taskType.${text}`} />,
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
                text={formatMessage({ id: `app.taskStatus.${text}` })}
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
    ];
  };

  render() {
    const cancelFlag = hasPermisson('/tote/center/taskManger/cancel') ? true : false;
    return (
      <TaskLibraryComponent
        getColumn={this.getColumn} // 提供表格列数据
        agvType={AGVType.Tote} // 标记当前页面的车型
        cancel={cancelFlag} // 标记该页面是否允许执行取消操作
      />
    );
  }
}
