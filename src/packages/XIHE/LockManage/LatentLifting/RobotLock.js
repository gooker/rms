import React from 'react';
import { Tooltip } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import RobotLockComponent from '../components/RobotLockComponent';
import { AGVType } from '@/config/config';
import { isNull } from '@/utils/util';
import commonStyles from '@/common.module.less';

const RobotLock = () => {
  function getColumn(checkDetail) {
    return [
      {
        title: <FormattedMessage id="app.agv.id" />,
        dataIndex: 'robotId',
        align: 'center',
        fixed: 'left',
      },
      {
        title: <FormattedMessage id="lockManage.robot.status" />,
        dataIndex: 'lockStatus',
        render: (text) => {
          if (text === 0) {
            return <FormattedMessage id="lockManage.robot.fullLock" />;
          }
          if (text === 1) {
            return <FormattedMessage id="lockManage.robot.missingTaskLock" />;
          }
          if (text === 2) {
            return <FormattedMessage id="lockManage.robot.missingRobotLock" />;
          }
          return <FormattedMessage id="lockManage.robot.notAvailable" />;
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
                    checkDetail(text, record.robotType);
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
    // <RobotLockComponent
    //   getColumn={getColumn} // 提供表格列数据
    //   agvType={AGVType.LatentLifting} // 标记当前页面的车型
    // />
    <>1238884</>
  );
};

export default React.memo(RobotLock);
