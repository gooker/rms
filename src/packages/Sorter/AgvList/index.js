import React from 'react';
import { Tag, Badge, Button } from 'antd';
import { ToolOutlined, InfoOutlined } from '@ant-design/icons';
import { formatMessage, FormattedMessage } from '@/utils/Lang';
import dictionary from '@/utils/Dictionary';
import { dateFormat, getSuffix } from '@/utils/Utils';
import AgvListComponent from '@/components/pages/AgvListComponent';
import { AGVType } from '@/config/Config';

const { red, green, yellow, blue, cyan, gray } = dictionary()['color'];

export default class AgvList extends React.PureComponent {
  getColumn = (checkAgvDetail) => {
    return [
      {
        title: formatMessage({ id: 'app.agv.id' }),
        dataIndex: 'robotId',
        align: 'center',
        width: 100,
        fixed: 'left',
      },
      {
        title: formatMessage({ id: 'app.agv.serverIdentity' }),
        dataIndex: 'clusterIndex',
        align: 'center',
        width: 100,
      },
      {
        title: formatMessage({ id: 'app.activity.ip' }),
        dataIndex: 'ip',
        align: 'center',
        width: 150,
      },
      {
        title: formatMessage({ id: 'app.activity.port' }),
        dataIndex: 'port',
        align: 'center',
        width: 100,
      },
      {
        title: formatMessage({ id: 'app.agv.position' }),
        dataIndex: 'currentCellId',
        align: 'center',
        width: 100,
      },
      {
        title: formatMessage({ id: 'app.agv.direction' }),
        dataIndex: 'currentDirection',
        align: 'center',
        width: 100,
        ListCardRender: true,
        render: (text) => {
          if (text != null) {
            return <span>{formatMessage({ id: dictionary('agvDirection', text) })}</span>;
          } else {
            return null;
          }
        },
      },
      {
        title: formatMessage({ id: 'app.agv.addingTime' }),
        dataIndex: 'createDate',
        width: 150,
        align: 'center',
        ListCardRender: true,
        render: (text, record, index, flag) => {
          if (flag) {
            return <span>{dateFormat(text).format('MM-DD HH:mm')}</span>;
          }
          return <span>{dateFormat(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
        },
      },
      {
        title: formatMessage({ id: 'app.agv.maintenanceState' }),
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
                    {formatMessage({ id: 'app.agv.underMaintenance' })}
                  </span>
                </Tag>
              ) : (
                <Tag color="green">{formatMessage({ id: 'app.agv.normal' })}</Tag>
              )}
            </span>
          );
        },
      },
      {
        title: formatMessage({ id: 'app.agv.manualMode' }),
        dataIndex: 'manualMode',
        align: 'center',
        width: 100,
        ListCardRender: true,
        render: (text) => {
          return text ? (
            <FormattedMessage id="app.common.true" />
          ) : (
            <FormattedMessage id="app.common.false" />
          );
        },
      },
      {
        title: formatMessage({ id: 'app.agv.type' }),
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
        title: formatMessage({ id: 'app.agv.status' }),
        width: 100,
        dataIndex: 'agvStatus',
        align: 'center',
        ListCardRender: true,
        render: (text) => {
          if (text != null) {
            const key = dictionary('agvStatus', [text]);
            if (text === 'Offline') {
              return <Tag color={gray}>{formatMessage({ id: key })}</Tag>;
            } else if (text === 'StandBy') {
              return <Tag color={blue}>{formatMessage({ id: key })}</Tag>;
            } else if (text === 'Working') {
              return <Tag color={green}>{formatMessage({ id: key })}</Tag>;
            } else if (text === 'Charging') {
              return <Tag color={yellow}>{formatMessage({ id: key })}</Tag>;
            } else if (text === 'Error') {
              return <Tag color={red}>{formatMessage({ id: key })}</Tag>;
            } else if (text === 'Connecting') {
              return <Tag color={cyan}>{formatMessage({ id: key })}</Tag>;
            }
          } else {
            return null;
          }
        },
      },
      {
        title: formatMessage({ id: 'app.agv.battery' }),
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
        title: formatMessage({ id: 'app.agv.batteryVoltage' }),
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
        title: formatMessage({ id: 'app.agv.version' }),
        width: 100,
        align: 'center',
        dataIndex: 'version',
      },
      {
        title: formatMessage({ id: 'app.agv.batteryType' }),
        width: 150,
        align: 'center',
        dataIndex: 'batteryType',
        ListCardRender: true,
        render: (text) => {
          return <FormattedMessage id={dictionary('batteryType', text)} />;
        },
      },
      {
        title: formatMessage({ id: 'app.agv.maxChargeCurrent' }),
        width: 150,
        align: 'center',
        dataIndex: 'maxChargingCurrent',
      },
      {
        title: formatMessage({ id: 'app.button.operation' }),
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
  };

  render() {
    return (
      <AgvListComponent
        getColumn={this.getColumn}
        agvType={AGVType.Sorter}
        delete={true} // 是否可以删除小车
        moveOut={true} // 是否可以将小车移出地图
      />
    );
  }
}
