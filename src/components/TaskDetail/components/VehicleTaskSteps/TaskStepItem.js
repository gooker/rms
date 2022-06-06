import React, { memo } from 'react';
import { Popover, Table, Tag } from 'antd';
import { TagOutlined } from '@ant-design/icons';
import { TaskPathColor } from '@/config/consts';
import { convertToUserTimezone, formatMessage, isNull } from '@/utils/util';
import styles from './index.module.less';

// 任务步骤的某个点位
const TaskStepItem = (props) => {
  /**
   * index标识当前是第几个点
   * pathStepType标识当前步骤状态: passed, locked, future
   */
  const {
    cellIndex,
    data, // 点位动作数据
    nextData, // 下一个点位动作数据
    pathStepType,
    pathIndex,
    endPathIndex,
    actionIndex,
    endActionIndex,
    translation,
  } = props;
  const { cellId, actions, cellEventAction } = data;

  /**
   * 如果 actionIndex 或者 endActionIndex 为null, 表示在该点位的动作只有最后一个A动作还未执行 (原因可能是没有锁中下一个点)
   * 所以需要判断 pathIndex是否大于endPathIndex
   * 如果大于，说明可以直行，为黄色
   * 如果等于，说明下一个点还未锁中，为灰色
   */
  function defineActionStepColor(currentIndex) {
    if (['passed', 'future'].includes(pathStepType)) {
      return TaskPathColor[pathStepType];
    } else {
      let _actionIndex = actionIndex;
      if (_actionIndex === null) {
        _actionIndex = actions.length - 2;
      }

      let _endActionIndex = endActionIndex;
      if (_endActionIndex === null) {
        if (pathIndex === endPathIndex && currentIndex > _actionIndex) {
          _endActionIndex = actions.length - 2;
        } else {
          _endActionIndex = actions.length - 1;
        }
      }

      if (currentIndex < _actionIndex) {
        return TaskPathColor.passed;
      }
      if (currentIndex >= _actionIndex && currentIndex <= _endActionIndex) {
        return TaskPathColor.locked;
      }
      if (currentIndex > _endActionIndex) {
        return TaskPathColor.future;
      }
    }
  }

  function renderPopoverContent() {
    // 处理【动作】数据表格
    const actionColumns = [
      {
        title: formatMessage({ id: 'app.taskDetail.actionName' }),
        dataIndex: 'actionName',
        width: 100,
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.taskDetail.action' }),
        dataIndex: 'action',
        width: 80,
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.taskDetail.actionParam' }),
        dataIndex: 'params',
        align: 'center',
        render: (text) => text.map((item, index) => <Tag key={index}>{item}</Tag>),
      },
      {
        title: formatMessage({ id: 'app.taskDetail.endTime' }),
        dataIndex: 'finishTime',
        width: 180,
        align: 'center',
      },
    ];
    const actionDataSource = [];
    const { actions, actionsWithFinishTime, cellEventAction } = data;
    const nextActionsWithFinishTime = nextData?.actionsWithFinishTime;
    actions.forEach((action, index) => {
      const dataSourceItem = {
        ...action,
        actionName: translation[action.action],
      };
      // 如果最后一个动作是A动作，那么它的finishTime必定在 nextActionsWithFinishTime 的第一个
      if (index === actions.length - 1 && action.action.startsWith('A')) {
        if (Array.isArray(nextActionsWithFinishTime) && !isNull(nextActionsWithFinishTime[0])) {
          dataSourceItem.finishTime = convertToUserTimezone(
            nextActionsWithFinishTime[0].finishTime,
          ).format('YYYY-MM-DD HH:mm:ss');
          // 这一步很重要，因为该步骤已经把下一个点位的第一个完成时间使用掉了，所以要剔除
          nextActionsWithFinishTime.shift();
        }
      } else {
        if (Array.isArray(actionsWithFinishTime) && !isNull(actionsWithFinishTime[index])) {
          dataSourceItem.finishTime = convertToUserTimezone(
            actionsWithFinishTime[index].finishTime,
          ).format('YYYY-MM-DD HH:mm:ss');
        }
      }
      actionDataSource.push(dataSourceItem);
    });

    // 处理【事件】表格数据
    const eventColumns = [
      {
        title: formatMessage({ id: 'app.taskDetail.eventName' }),
        dataIndex: 'eventName',
        width: 100,
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.taskDetail.event' }),
        dataIndex: 'event',
        width: 80,
        align: 'center',
      },

      {
        title: formatMessage({ id: 'app.taskDetail.eventParam' }),
        dataIndex: 'eventParam',
        align: 'center',
        render: (text) => text.map((item, index) => <Tag key={index}>{item}</Tag>),
      },
    ];
    const eventDataSource = [];
    if (cellEventAction) {
      Object.values(cellEventAction).forEach(({ action, params }) => {
        eventDataSource.push({
          event: action,
          eventParam: params,
          eventName: translation[action],
        });
      });
    }

    return (
      <div>
        <Table
          size={'small'}
          title={() => formatMessage({ id: 'app.taskDetail.action' })}
          dataSource={actionDataSource}
          columns={actionColumns}
          pagination={false}
        />

        {cellEventAction && (
          <Table
            size={'small'}
            title={() => formatMessage({ id: 'app.taskDetail.event' })}
            dataSource={eventDataSource}
            columns={eventColumns}
            pagination={false}
            style={{ marginTop: 20 }}
          />
        )}
      </div>
    );
  }

  const color = TaskPathColor[pathStepType].replace('0x', '#');
  return (
    <Popover trigger="click" content={renderPopoverContent()}>
      <div className={styles.taskStepItem}>
        <div style={{ marginRight: 5 }}>{`${cellIndex + 1}.`}</div>
        <div className={styles.cellId} style={{ background: color }}>
          <span style={{ color: '#fff', fontSize: 15, fontWeight: 500 }}>{cellId}</span>
        </div>
        <div
          className={styles.actions}
          style={{ border: `1px solid ${color}`, borderLeft: 'none' }}
        >
          {actions.map((action, $index) => (
            <Tag key={$index}>
              <span style={{ color: defineActionStepColor($index).replace('0x', '#') }}>
                {translation[action.action]}
              </span>
            </Tag>
          ))}
          {cellEventAction && <TagOutlined style={{ color: '#37A3FF' }} theme={'twoTone'} />}
        </div>
      </div>
    </Popover>
  );
};
export default memo(TaskStepItem);
