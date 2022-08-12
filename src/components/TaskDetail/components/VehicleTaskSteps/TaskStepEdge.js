import React, { memo } from 'react';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
import { convertToUserTimezone, formatMessage } from '@/utils/util';
import { getTaskNodeColor, getTaskNodeColorFlag } from '@/components/TaskDetail/taskDetailUtil';
import SimpleTable from '@/components/SimpleTable';
import { TaskPathColor } from '@/config/consts';

const TaskStepEdge = (props) => {
  const {
    edge: { actions },
  } = props;

  const hasAction = Array.isArray(actions) && actions.length > 0;
  let actionStates = actions.map((item) => getTaskNodeColorFlag(item));
  actionStates = [...new Set(actionStates)];
  let color = TaskPathColor.locked.replace('0x', '#');
  // 未开始执行
  if (actionStates.length === 1 && actionStates[0] === 'future') {
    color = TaskPathColor.future.replace('0x', '#');
  }
  if (actionStates.length === 1 && actionStates[0] === 'passed') {
    color = TaskPathColor.passed.replace('0x', '#');
  }

  function renderPopoverContent() {
    if (hasAction) {
      const actionColumns = [
        {
          title: formatMessage({ id: 'app.taskDetail.actionName' }),
          dataIndex: 'actionName',
          align: 'center',
          width: 100,
        },
        {
          title: formatMessage({ id: 'app.taskDetail.action' }),
          dataIndex: 'action',
          align: 'center',
          width: 100,
        },
        {
          title: formatMessage({ id: 'app.taskDetail.actionParam' }),
          dataIndex: 'params',
          align: 'center',
          render: (text) => {
            return (
              <ul style={{ listStyle: 'none' }}>
                {text.map(({ description, value }, index) => (
                  <li key={index}>{description ? `${description}: ${value}` : value}</li>
                ))}
              </ul>
            );
          },
        },
        {
          title: formatMessage('app.taskDetail.blockingType'),
          dataIndex: 'blockingType',
          align: 'center',
          width: 100,
        },
        {
          title: formatMessage({ id: 'app.taskDetail.endTime' }),
          dataIndex: 'finishTime',
          align: 'center',
          width: 100,
        },
      ];
      const actionDataSource = [];
      actions.forEach((action) => {
        const dataSourceItem = {
          actionName: action.actionType,
          action: action.actionId,
          blockingType: action.blockingType,
          params: action.actionParameters ?? [],
          finishTime: action.finishTime
            ? convertToUserTimezone(action.finishTime).format('MM-DD HH:mm:ss')
            : null,
          released: action.released,
          actionState: action.actionState,
        };
        dataSourceItem.params = dataSourceItem.params.filter(Boolean);
        dataSourceItem.$$color = getTaskNodeColor(dataSourceItem);
        actionDataSource.push(dataSourceItem);
      });
      return <SimpleTable marker dataSource={actionDataSource} columns={actionColumns} />;
    }
  }

  return (
    <Popover
      trigger="click"
      destroyTooltipOnHide={{ keepParent: false }}
      content={renderPopoverContent()}
    >
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
        <ArrowRightOutlined style={{ fontSize: 18, color }} />
      </div>
    </Popover>
  );
};
export default memo(TaskStepEdge);
