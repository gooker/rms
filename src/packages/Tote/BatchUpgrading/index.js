import React from 'react';
import { Badge, Progress, Button } from 'antd';
import Dictionary from '@/utils/Dictionary';
import BatchUpgradingComponent from '@/components/pages/BatchUpgrading/BatchUpgradingComponent';
import { formatMessage, renderAgvStatus, getSuffix } from '@/utils/utils';
import { hasPermission } from '@/utils/Permission';
import FormattedMessage from '@/components/FormattedMessage';
import { AGVType } from '@/config/config';

const { red, green } = Dictionary('color');

export function renderupgradeStatus(Type, status, record) {
  const typeStatus = `${Type}${status}`;
  switch (typeStatus) {
    case 'UPGRADE0':
      return (
        <Badge status="success" text={<FormattedMessage id="app.activity.upgradeSuccessed" />} />
      );
    case 'UPGRADE1':
      return (
        <span style={{ marginLeft: 4 }}>
          <FormattedMessage id="app.activity.duringUpgrade" />
        </span>
      );
    case 'UPGRADE2':
      return (
        <Badge status="error" text={<FormattedMessage id="app.activity.upgradeUnsuccessful" />} />
      );
    case 'DOWNLOAD0':
      return (
        <Badge status="success" text={<FormattedMessage id="app.activity.downloadSuccessful" />} />
      );
    case 'DOWNLOAD1':
      return (
        <>
          <span>
            <Progress type="circle" percent={parseInt(record.fileProgress)} width={50} />
          </span>
          <span style={{ marginLeft: 4 }}>
            <FormattedMessage id="app.activity.downloadLog" />
          </span>
        </>
      );
    case 'DOWNLOAD2':
      return <Badge status="error" text={<FormattedMessage id="app.activity.downloadFailed" />} />;
    case 'UPLOAD0':
      return <Badge status="success" text={<FormattedMessage id="app.activity.uploadSuccess" />} />;
    case 'UPLOAD1':
      return (
        <>
          <span>
            <Progress type="circle" percent={parseInt(record.fileProgress)} width={50} />
          </span>
          <span style={{ marginLeft: 4 }}>
            <FormattedMessage id="app.activity.uploadFirmware" />
          </span>
        </>
      );
    case 'UPLOAD2':
      return <Badge status="error" text={<FormattedMessage id="app.activity.uploadFailed" />} />;
    default:
  }
}

export default class ExecutionQueue extends React.PureComponent {
  getColumn = (operate) => {
    return [
      {
        title: <FormattedMessage id="app.agv.id" />,
        dataIndex: 'robotId',
        width: 150,
        align: 'center',
      },
      {
        title: <FormattedMessage id="app.agv.maintenanceState" />,
        dataIndex: 'disabled',
        align: 'center',
        width: 150,
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
        width: 150,
        render: (agvStatus) => renderAgvStatus(agvStatus),
      },

      {
        title: <FormattedMessage id="app.agv.battery" />,
        dataIndex: 'battery',
        align: 'center',
        width: 100,
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
        width: 100,
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
        width: 120,
      },
      {
        title: <FormattedMessage id="app.agv.firmwareStatus" />,
        dataIndex: 'fileStatus',
        align: 'center',
        width: 100,
        render: (text,record) => renderAgvStatus(record.fileTaskType,record.fileStatus,record),
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
  };

  render() {
    const maintainFlag = hasPermission('/tote/agv/batchFirmwareUpgrade/Maintain');
    const uploadFlag = hasPermission('/tote/agv/batchFirmwareUpgrade/uploadFirmware');
    const upgradeFlag = hasPermission('/tote/agv/batchFirmwareUpgrade/upgrade');
    return (
      <BatchUpgradingComponent
        getColumn={this.getColumn} // 提供表格列数据
        agvType={AGVType.Tote} // 标记当前页面的车型
        maintainFlag={maintainFlag} //维护/取消维护
        uploadFlag={uploadFlag} //上传固件
        upgradeFlag={upgradeFlag} //升级
      />
    );
  }
}
