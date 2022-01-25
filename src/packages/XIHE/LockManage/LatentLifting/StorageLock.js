import React from 'react';
import { Tooltip, Tag } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import StorageOrPodLock from './components/StorageOrPodLock';
import { AGVType } from '@/config/config';
import { isNull } from '@/utils/utils';
import commonStyles from '@/common.module.less';

const StorageLock = () => {
  function getColumn(checkDetail) {
    return [
      {
        title: <FormattedMessage id="app.map.cell" />,
        dataIndex: 'cellId',
        sorter: (a, b) => a.cellId - b.cellId,
        align: 'center',
        fixed: 'left',
      },
      {
        title: <FormattedMessage id="app.pod.id" />,
        dataIndex: 'podId',
        align: 'center',
      },
      {
        title: <FormattedMessage id="lockManage.robot.status" />,
        dataIndex: 'lockStatus',
        render: (text) => {
          if (text === '1') {
            return (
              <Tag color="success">
                <FormattedMessage id="app.agv.normal" />
              </Tag>
            );
          }
          return (
            <Tag color="error">
              <FormattedMessage id="app.agv.exception" />
            </Tag>
          );
        },
      },
      {
        title: <FormattedMessage id="app.task.id" />,
        dataIndex: 'taskId',
        align: 'center',
        render: (text, record) => {
          if (!isNull(text)) {
            return (
              <Tooltip title={text}>
                <span
                  className={commonStyles.textLinks}
                  onClick={() => {
                    checkDetail(text, AGVType.LatentLifting);
                  }}
                >
                  {text ? '*' + text.substr(text.length - 6, 6) : null}
                </span>
              </Tooltip>
            );
          }
        },
      },
    ];
  }

  return (
    <StorageOrPodLock
      getColumn={getColumn} // 提供表格列数据
      agvType={AGVType.LatentLifting} // 标记当前页面的车型
      deleteFlag={true}
      type="storagelock"
    />
  );
};

export default React.memo(StorageLock);
