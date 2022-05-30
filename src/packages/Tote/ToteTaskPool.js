import React from 'react';
import { Badge, Tag, Button, Tooltip } from 'antd';
import { convertToUserTimezone } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import TaskPoolComponent from '@/pages/TaskPool/TaskPoolComponent';
import { VehicleType } from '@/config/config';
import { TaskStateBageType } from '@/config/consts';

const statusTransform = {
  New: 'New',
  EXECUTING: 'Executing',
  FINISHED: 'Finished',
  CANCELLED: 'Cancel',
  ERROR: 'Error',
};

const ToteTaskPool = () => {
  function getColumn(checkDetail) {
    return [
      {
        title: <FormattedMessage id="app.vehicle.id" />,
        dataIndex: 'vehicleId',
        align: 'center',
        width: 100,
        fixed: 'left',
      },
      {
        title: <FormattedMessage id="app.task.customId" />,
        dataIndex: 'customId',
        align: 'center',
        width: 120,
      },
      {
        title: <FormattedMessage id="app.task.poolId" />,
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
        title: <FormattedMessage id="app.executionQ.executionState" />,
        dataIndex: 'taskActionStatus',
        align: 'center',
        width: 120,
        render: (text) => {
          if (text != null) {
            return (
              <Badge
                status={TaskStateBageType[text]}
                text={<FormattedMessage id={`app.task.state.${statusTransform[text]}`} />}
              />
            );
          } else {
            return <FormattedMessage id="app.taskDetail.notAvailable" />;
          }
        },
      },
      {
        title: <FormattedMessage id="app.taskQueue.priority" />,
        dataIndex: 'priority',
        width: 80,
      },
      {
        title: <FormattedMessage id="app.taskPool.code" />,
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
        title: <FormattedMessage id="app.taskPool.fetchLocation" />,
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
        title: <FormattedMessage id="app.taskPool.putLocation" />,
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
        title: <FormattedMessage id="app.taskPool.createTime" />,
        dataIndex: 'addedTS',
        align: 'center',
        width: 150,
        render: (text) => {
          if (!text) {
            return <FormattedMessage id="app.taskDetail.notAvailable" />;
          }
          return <span>{convertToUserTimezone(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
        },
      },
      {
        title: <FormattedMessage id="app.taskPool.targetTime" />,
        dataIndex: 'targetTS',
        width: 190,
        render: (text) => {
          if (!text) {
            return <FormattedMessage id="app.taskDetail.notAvailable" />;
          }
          return <span>{convertToUserTimezone(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
        },
      },
      {
        title: <FormattedMessage id="app.taskPool.fetchStatus" />,
        dataIndex: 'isFetched',
        width: 100,
        render: (text) => (
          <>
            {text ? (
              <FormattedMessage id="app.common.true" />
            ) : (
              <FormattedMessage id="app.common.false" />
            )}
          </>
        ),
      },
      {
        title: <FormattedMessage id="app.taskPool.lockStatus" />,
        dataIndex: 'isLocked',
        width: 100,
        render: (text) => (
          <>
            {text ? (
              <FormattedMessage id="app.common.true" />
            ) : (
              <FormattedMessage id="app.common.false" />
            )}
          </>
        ),
      },
      {
        title: <FormattedMessage id="app.button.operation" />,
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
                    checkDetail(record.relationToteTaskIds[k], VehicleType.Tote);
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
                    checkDetail(record.relationToteTaskIds[k], VehicleType.Tote);
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
      vehicleType={VehicleType.Tote} // 标记当前页面的车型
      cancel={true} // 标记该页面是否允许执行取消操作
    />
  );
};

export default React.memo(ToteTaskPool);
