import React, { memo } from 'react';
import { Popover, Table, Tag } from 'antd';
import { TagOutlined } from '@ant-design/icons';
import { isEmpty, isPlainObject } from 'lodash';
import { convertToUserTimezone, formatMessage } from '@/utils/util';
import { getTaskNodeColor, getTaskNodeColorFlag } from '@/components/TaskDetail/taskDetailUtil';
import styles from './index.module.less';

const TaskStepNode = (props) => {
  const { node, translation } = props;
  const { nodeId, actions, cellEventAction } = node;

  const hasAction = Array.isArray(actions) && actions.length > 0;
  const hasCellEventAction = isPlainObject(cellEventAction) && !isEmpty(cellEventAction);

  function renderPopoverContent() {
    // 处理【动作】数据表格
    const actionColumns = [
      {
        title: formatMessage({ id: 'app.taskDetail.actionName' }),
        dataIndex: 'actionName',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.taskDetail.action' }),
        dataIndex: 'action',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.taskDetail.actionParam' }),
        dataIndex: 'params',
        align: 'center',
        render: (text) => {
          return (
            <ul>
              {text.map(({ name, value }, index) => (
                <li key={index}>{name ? `${name}: ${value}` : value}</li>
              ))}
            </ul>
          );
        },
      },
      {
        title: formatMessage({ id: 'app.taskDetail.endTime' }),
        dataIndex: 'finishTime',
        align: 'center',
      },
    ];
    const actionDataSource = [];
    actions.forEach((action) => {
      const dataSourceItem = {
        actionName: action.actionDescription ?? action.actionType,
        action: action.actionId,
        params: action.actionParameters ?? [],
        finishTime: action.finishTime
          ? convertToUserTimezone(action.finishTime).format('MM-DD HH:mm:ss')
          : null,
        released: action.released,
        actionState: action.actionState,
      };
      dataSourceItem.params = dataSourceItem.params.filter(Boolean);
      actionDataSource.push(dataSourceItem);
    });

    // 处理【事件】表格数据
    const eventColumns = [
      {
        title: formatMessage({ id: 'app.taskDetail.eventName' }),
        dataIndex: 'eventName',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.taskDetail.event' }),
        dataIndex: 'event',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.taskDetail.eventParam' }),
        dataIndex: 'eventParam',
        align: 'center',
        render: (text) => {
          return (
            <ul style={{ listStyle: 'none' }}>
              {text.map(({ name, value }, index) => (
                <li key={index}>{name ? `${name}: ${value}` : value}</li>
              ))}
            </ul>
          );
        },
      },
    ];
    const eventDataSource = [];
    if (hasCellEventAction) {
      Object.values(cellEventAction).forEach((action) => {
        const dataSourceItem = {
          event: action.actionId,
          eventName: action.actionDescription ?? action.actionId,
          eventParam: action.actionParameters ?? [],
        };
        dataSourceItem.eventParam = dataSourceItem.eventParam.filter(Boolean);
        eventDataSource.push(dataSourceItem);
      });
    }

    return (
      <div>
        {hasAction && (
          <Table
            size={'small'}
            dataSource={actionDataSource}
            columns={actionColumns}
            pagination={false}
          />
        )}
        {hasCellEventAction && (
          <Table
            size={'small'}
            dataSource={eventDataSource}
            columns={eventColumns}
            pagination={false}
            rowClassName={(record) => styles[getTaskNodeColorFlag(record)]}
            style={hasAction ? { marginTop: 20 } : {}}
          />
        )}
      </div>
    );
  }

  const nodeColor = getTaskNodeColor(node);
  if (hasAction || hasCellEventAction) {
    return (
      <Popover
        trigger="click"
        destroyTooltipOnHide={{ keepParent: false }}
        content={renderPopoverContent()}
      >
        <div className={styles.taskStepItem} style={{ cursor: 'pointer' }}>
          <div className={styles.cellId} style={{ background: nodeColor }}>
            <span style={{ color: '#fff', fontSize: 15, fontWeight: 500 }}>{nodeId}</span>
          </div>
          {(actions?.length > 0 || !isEmpty(cellEventAction)) && (
            <div
              className={styles.actions}
              style={{ border: `1px solid ${nodeColor}`, borderLeft: 'none' }}
            >
              {actions.map((action, $index) => (
                <Tag key={$index}>
                  <span style={{ color: getTaskNodeColor(action) }}>
                    {action.actionDescription ?? action.actionId}
                  </span>
                </Tag>
              ))}
              {cellEventAction && !isEmpty(cellEventAction) && (
                <TagOutlined style={{ color: '#37A3FF' }} theme={'twoTone'} />
              )}
            </div>
          )}
        </div>
      </Popover>
    );
  }
  return (
    <div className={styles.taskStepItem}>
      <div className={styles.cellId} style={{ background: nodeColor }}>
        <span style={{ color: '#fff', fontSize: 15, fontWeight: 500 }}>{nodeId}</span>
      </div>
    </div>
  );
};
export default memo(TaskStepNode);
