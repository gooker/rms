import React from 'react';
import { Tooltip } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import StorageOrPodLock from './components/StorageOrPodLock';
import { AGVType } from '@/config/config';
import { isNull } from '@/utils/utils';
import commonStyles from '@/common.module.less';

const PodLock = () => {
  function getColumn(checkDetail) {
    return [
      {
        title: <FormattedMessage id="app.pod.id" />,
        dataIndex: 'podId',
        sorter: (a, b) => a.podId - b.podId,
        align: 'center',
      },
      {
        title: <FormattedMessage id="app.task.id" />,
        dataIndex: 'taskId',
        align: 'center',
        render: (text) => {
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
      type="podlock"
    />
  );
};

export default React.memo(PodLock);
