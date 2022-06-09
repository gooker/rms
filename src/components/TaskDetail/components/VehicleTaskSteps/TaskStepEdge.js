import React, { memo } from 'react';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Popover, Table } from 'antd';
import { convertToUserTimezone, formatMessage } from '@/utils/util';
import { getTaskNodeColorFlag } from '@/components/TaskDetail/taskDetailUtil';
import styles from './index.module.less';

const TaskStepEdge = (props) => {
  const { edge } = props;
  const { actions } = edge;

  const hasAction = Array.isArray(actions) && actions.length > 0;

  function renderPopoverContent() {
    if (hasAction) {
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
              <ul style={{ listStyle: 'none' }}>
                {text.map(({ description, key }, index) => (
                  <li key={index}>{description ? `${description}: ${key}` : key}</li>
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
      return (
        <Table
          size={'small'}
          dataSource={actionDataSource}
          columns={actionColumns}
          pagination={false}
          rowClassName={(record) => styles[getTaskNodeColorFlag(record)]}
        />
      );
    }
  }

  return (
    <Popover
      trigger='click'
      destroyTooltipOnHide={{ keepParent: false }}
      content={renderPopoverContent()}
    >
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
        <ArrowRightOutlined style={{ fontSize: 18 }} />
      </div>
    </Popover>
  );
};
export default memo(TaskStepEdge);
