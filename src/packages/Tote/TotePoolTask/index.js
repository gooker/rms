import React from 'react';
import { Badge, Tag, Button, Tooltip } from 'antd';
import { dateFormat, formatMessage } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';
import TaskPoolComponent from '@/components/pages/TaskPool/TaskPoolComponent';
import { AGVType } from '@/config/config';
import { TaskStateBageType } from '@/consts';

const statusTransform = {
  New: 'New',
  EXECUTING: 'Executing',
  FINISHED: 'Finished',
  CANCELLED: 'Cancel',
  ERROR: 'Error',
};

const TotePoolTask = () => {
  function getColumn(checkDetail) {
    return [
      {
        title: formatMessage({ id: 'app.agv.id' }),
        dataIndex: 'robotId',
        align: 'center',
        width: 100,
        fixed: 'left',
      },
      {
        title: formatMessage({ id: 'app.task.customId' }),
        dataIndex: 'customId',
        align: 'center',
        width: 120,
      },
      {
        title: formatMessage({ id: 'app.task.poolId' }),
        dataIndex: 'id',
        width: 130,
        render: (text) => {
          return (
            <Tooltip title={text}>
              <Button type="link">{text ? '*' + text.substr(text.length - 6, 6) : null}</Button>
            </Tooltip>
          );
        },
      },

      {
        title: formatMessage({ id: 'app.executionQ.executionState' }),
        dataIndex: 'taskActionStatus',
        align: 'center',
        width: 120,
        render: (text) => {
          if (text != null) {
            return (
              <Badge
                status={TaskStateBageType[text]}
                text={formatMessage({ id: `app.taskStatus.${statusTransform[text]}` })}
              />
            );
          } else {
            return <FormattedMessage id="app.taskDetail.notAvailable" />;
          }
        },
      },
      {
        title: formatMessage({ id: 'app.taskQueue.priority' }),
        dataIndex: 'priority',
        width: 80,
      },
      {
        title: formatMessage({ id: 'app.taskPool.code' }),
        dataIndex: 'toteCode',
        width: '10%',
        render: (text, record) =>
          record.items &&
          record.items.map((item) => (
            <Tag style={{ margin: '0px 3px' }} key={item.toteCode}>
              {item.toteCode}
            </Tag>
          )),
      },
      {
        title: formatMessage({ id: 'app.taskPool.fetchLocation' }),
        dataIndex: 'fetchLocation',
        width: '10%',
        render: (text, record) =>
          record.items &&
          record.items.map((item) => (
            <Tag style={{ margin: '0px 3px' }} key={item.fetchLocation}>
              {item.fetchLocation}
            </Tag>
          )),
      },
      {
        title: formatMessage({ id: 'app.taskPool.putLocation' }),
        dataIndex: 'putLocation',
        width: '10%',
        render: (text, record) =>
          record.items &&
          record.items.map((item) => (
            <Tag style={{ margin: '0px 3px' }} key={item.putLocation}>
              {item.putLocation}
            </Tag>
          )),
      },

      {
        title: formatMessage({ id: 'app.taskPool.createTime' }),
        dataIndex: 'addedTS',
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
        title: formatMessage({ id: 'app.taskPool.targetTime' }),
        dataIndex: 'targetTS',
        width: 190,
        render: (text) => {
          if (!text) {
            return <span>{formatMessage({ id: 'app.taskDetail.notAvailable' })}</span>;
          }
          return <span>{dateFormat(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
        },
      },
      {
        title: formatMessage({ id: 'app.taskPool.fetchStatus' }),
        dataIndex: 'isFetched',
        width: 100,
        render: (text) => (
          <>
            {text
              ? formatMessage({ id: 'app.common.true' })
              : formatMessage({ id: 'app.common.false' })}
          </>
        ),
      },
      {
        title: formatMessage({ id: 'app.taskPool.lockStatus' }),
        dataIndex: 'isLocked',
        width: 100,
        render: (text) => (
          <>
            {text
              ? formatMessage({ id: 'app.common.true' })
              : formatMessage({ id: 'app.common.false' })}
          </>
        ),
      },
      {
        title: formatMessage({ id: 'app.button.operation' }),
        dataIndex: 'relationToteTaskIds',
        align: 'center',
        fixed: 'right',
        width: 230,
        render: (text, record) =>
          record.relationToteTaskIds &&
          Object.keys(record.relationToteTaskIds).map((k) => {
            if (k === 'FETCH') {
              return (
                <Button
                  type="link"
                  onClick={() => {
                    checkDetail(record.relationToteTaskIds[k], AGVType.Tote);
                  }}
                >
                  <FormattedMessage id="app.taskPool.FetchDetail" />
                </Button>
              );
            } else if (k === 'PUT')
              return (
                <Button
                  type="link"
                  style={{ paddingLeft: 10 }}
                  onClick={() => {
                    checkDetail(record.relationToteTaskIds[k], AGVType.Tote);
                  }}
                >
                  <FormattedMessage id="app.taskPool.PutDetail" />
                </Button>
              );
          }),
      },
    ];
  }
  return (
    <TaskPoolComponent
      getColumn={getColumn} // 提供表格列数据
      agvType={AGVType.Tote} // 标记当前页面的车型
      cancel={true} // 标记该页面是否允许执行取消操作
    />
  );
};

export default React.memo(TotePoolTask);
