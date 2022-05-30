import React, { memo } from 'react';
import { Badge, Button } from 'antd';
import Dictionary from '@/utils/Dictionary';
import BatchUpgradingComponent from '@/pages/BatchUpgrading/BatchUpgradingComponent';
import { formatMessage, getAgvStatusTag, getSuffix } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { AGVType } from '@/config/config';

const { red, green } = Dictionary('color');

const OTA = (props) => {
  const {} = props;

  function getColumn(operate) {
    return [
      {
        title: <FormattedMessage id='app.agv.id' />,
        dataIndex: 'vehicleId',
        align: 'center',
      },
      {
        title: <FormattedMessage id="app.agv.maintenanceState" />,
        dataIndex: 'disabled',
        align: 'center',
        render: (text) => {
          if (!text) {
            return (
              <span style={{ color: green }}>
                <FormattedMessage id="app.agv.normal" />
              </span>
            );
          } else {
            return (
              <span style={{ color: red }}>
                <FormattedMessage id="app.agv.underMaintenance" />
              </span>
            );
          }
        },
      },
      {
        title: <FormattedMessage id="app.common.status" />,
        dataIndex: 'agvStatus',
        align: 'center',
        render: (agvStatus) => getAgvStatusTag(agvStatus),
      },

      {
        title: <FormattedMessage id="app.agv.battery" />,
        dataIndex: 'battery',
        align: 'center',
        render: (text) => {
          if (text != null) {
            if (parseInt(text) > 50) {
              return <Badge status="success" text={getSuffix(text, '%')} />;
            } else if (parseInt(text) > 10) {
              return <Badge status="warning" text={getSuffix(text, '%')} />;
            } else {
              return <Badge status="error" text={getSuffix(text, '%')} />;
            }
          }
        },
      },
      {
        title: <FormattedMessage id="app.agv.batteryVoltage" />,
        dataIndex: 'batteryVoltage',
        align: 'center',
        render: (text) => {
          if (text != null) {
            if (parseInt(text) > 47000) {
              return <Badge status="success" text={getSuffix(text / 1000, 'v')} />;
            } else if (parseInt(text) > 45000) {
              return <Badge status="warning" text={getSuffix(text / 1000, 'v')} />;
            } else {
              return <Badge status="error" text={getSuffix(text / 1000, 'v')} />;
            }
          }
        },
      },
      {
        title: <FormattedMessage id="app.agv.version" />,
        dataIndex: 'version',
        align: 'center',
      },
      {
        title: <FormattedMessage id="app.agv.firmwareStatus" />,
        dataIndex: 'fileStatus',
        align: 'center',
        render: (text, record) => getAgvStatusTag(record.fileTaskType, record.fileStatus, record),
      },
      {
        title: <FormattedMessage id="app.task.type" />,
        dataIndex: 'fileTaskType',
        align: 'center',
        render: (text) => {
          if (text === 'UPGRADE') {
            return formatMessage({ id: 'app.activity.upgradeAGV' });
          } else if (text === 'DOWNLOAD') {
            return formatMessage({ id: 'app.activity.downloadLog' });
          } else if (text === 'UPLOAD') {
            return formatMessage({ id: 'app.activity.uploadFirmware' });
          }
        },
      },

      {
        title: <FormattedMessage id="app.button.operation" />,
        dataIndex: 'id',
        align: 'center',
        width: 200,
        render: (text, record) => {
          if (record.fileStatus === 1) {
            return (
              <Button
                type="link"
                onClick={() => {
                  operate(record);
                }}
              >
                {formatMessage({ id: 'app.activity.forcedReset' })}
              </Button>
            );
          }
        },
      },
    ];
  }
  return (
    <BatchUpgradingComponent
      getColumn={getColumn} // 提供表格列数据
      agvType={AGVType.LatentLifting} // 标记当前页面的车型
      maintainFlag={true} //维护/取消维护
      uploadFlag={true} //上传固件
      upgradeFlag={true} //升级
    />
  );
};
export default memo(OTA);
