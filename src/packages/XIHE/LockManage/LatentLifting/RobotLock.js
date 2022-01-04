import React, { memo } from 'react';
import { Tooltip } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import { isNull } from '@/utils/utils';
import commonStyles from '@/common.module.less';

const RobotLock = () => {
  const columns = [
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
              <span className={commonStyles.textLinks}>
                {text ? '*' + text.substr(text.length - 6, 6) : null}
              </span>
            </Tooltip>
          );
        }
      },
    },
  ];
  return <span>1111</span>;
};
export default memo(RobotLock);
