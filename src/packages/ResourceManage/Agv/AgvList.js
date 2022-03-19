import React from 'react';
import { Badge, Tag, Button } from 'antd';
import { ToolOutlined, InfoOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import AgvListComponent from '@/pages/AgvListComponent';
import {
  convertToUserTimezone,
  getSuffix,
  getDirectionLocale,
  getAgvStatusTag,
  formatMessage,
  isNull,
} from '@/utils/util';
import dictionary from '@/utils/Dictionary';
import { AGVType } from '@/config/config';

const AgvList = () => {
  function getColumn(checkAgvDetail) {
    return [
      {
        title: <FormattedMessage id="app.agv.id" />,
        dataIndex: 'robotId',
        align: 'center',
        width: 100,
        fixed: 'left',
      },
      {
        title: <FormattedMessage id="app.agv.serverIdentity" />,
        dataIndex: 'clusterIndex',
        align: 'center',
        width: 100,
      },
      {
        title: <FormattedMessage id="app.agv.ip" />,
        dataIndex: 'ip',
        align: 'center',
        width: 150,
      },
      {
        title: <FormattedMessage id="app.agv.port" />,
        dataIndex: 'port',
        align: 'center',
        width: 100,
      },
      {
        title: <FormattedMessage id="app.common.position" />,
        dataIndex: 'currentCellId',
        align: 'center',
        width: 100,
      },
      {
        title: <FormattedMessage id="app.agv.direction" />,
        dataIndex: 'currentDirection',
        align: 'center',
        width: 100,
        render: (text) => getDirectionLocale(text),
      },
      {
        title: <FormattedMessage id="app.agv.addingTime" />,
        dataIndex: 'createDate',
        width: 150,
        align: 'center',
        ListCardRender: true,
        render: (text, record, index, flag) => {
          if (flag) {
            return <span>{convertToUserTimezone(text).format('MM-DD HH:mm')}</span>;
          }
          return <span>{convertToUserTimezone(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
        },
      },
      {
        title: <FormattedMessage id="app.agv.maintenanceState" />,
        dataIndex: 'disabled',
        align: 'center',
        width: 100,
        ListCardRender: true,
        render: (text) => {
          return (
            <span>
              {text ? (
                <Tag color="red">
                  <ToolOutlined />
                  <span style={{ marginLeft: 3 }}>
                    <FormattedMessage id="app.agv.underMaintenance" />
                  </span>
                </Tag>
              ) : (
                <Tag color="green">{<FormattedMessage id="app.agv.normal" />}</Tag>
              )}
            </span>
          );
        },
      },
      //   {
      //     title: <FormattedMessage id="app.agv.manualMode" />,
      //     dataIndex: 'manualMode',
      //     align: 'center',
      //     width: 100,
      //     ListCardRender: true,
      //     render: (text) => {
      //       return text ? (
      //         <FormattedMessage id="app.common.true" />
      //       ) : (
      //         <FormattedMessage id="app.common.false" />
      //       );
      //     },
      //   },
      {
        title: <FormattedMessage id="app.agv.type" />,
        dataIndex: 'robotType',
        width: 100,
        ListCardRender: true,
        align: 'center',
        render: (text, record) => {
          if (record.isDummy) {
            return <FormattedMessage id="app.agv.threeGenerationsOfVehicles(Virtual)" />;
          } else if (text === 3) {
            return <FormattedMessage id="app.agv.threeGenerationOfTianma" />;
          } else {
            return <span>{text}</span>;
          }
        },
      },
      {
        title: <FormattedMessage id="app.agv.status" />,
        width: 100,
        dataIndex: 'agvStatus',
        align: 'center',
        ListCardRender: true,
        render: (agvStatus) => getAgvStatusTag(agvStatus),
      },
      {
        title: <FormattedMessage id="app.agv.battery" />,
        width: 100,
        align: 'center',
        dataIndex: 'battery',
        ListCardRender: true,
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
        width: 100,
        align: 'center',
        dataIndex: 'batteryVoltage',
        ListCardRender: true,
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
        width: 100,
        align: 'center',
        dataIndex: 'version',
      },
      {
        title: <FormattedMessage id="app.agv.batteryType" />,
        width: 150,
        align: 'center',
        dataIndex: 'batteryType',
        ListCardRender: true,
        render: (text) => {
          if (!isNull(text)) {
            return formatMessage({ id: dictionary('batteryType', text) });
          }
        },
      },
      {
        title: <FormattedMessage id="app.agv.maxChargeCurrent" />,
        width: 150,
        align: 'center',
        dataIndex: 'maxChargingCurrent',
        render: (text) => {
          if (!isNull(text)) {
            return <Badge status="success" text={getSuffix(text, ' A')} />;
          }
        },
      },
      {
        title: <FormattedMessage id="app.button.operation" />,
        width: 100,
        align: 'center',
        render: (text, record) => {
          return (
            <Button
              type="link"
              icon={<InfoOutlined />}
              onClick={() => {
                checkAgvDetail(record.robotId);
              }}
            >
              <FormattedMessage id="app.agv.details" />
            </Button>
          );
        },
      },
    ];
  }
  return (
    <AgvListComponent
      getColumn={getColumn} // 提供表格列数据
      agvType={AGVType.LatentLifting} // 标记当前页面的车型
      deleteFlag={true} // 标记该页面是否允许执行删除操作
      moveFlag={true} // 标记页面是否有移出地图按钮
      exportFlag={true}
    />
  );
};

export default React.memo(AgvList);
