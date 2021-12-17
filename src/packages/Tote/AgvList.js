import React from 'react';
import { Badge, Tag, Button, Divider, Table } from 'antd';
import { ToolOutlined, InfoOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import AgvListComponent from '@/pages/AgvListComponent';
import { hasPermission } from '@/utils/Permission';
import {
  dateFormat,
  getSuffix,
  getDirectionLocale,
  getAgvStatusTag,
  formatMessage,
  isNull,
} from '@/utils/utils';
import dictionary from '@/utils/Dictionary';
import { AGVType } from '@/config/config';

const deleteFlag = hasPermission('/tote/agv/agvList/delete');

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
            return <span>{dateFormat(text).format('MM-DD HH:mm')}</span>;
          }
          return <span>{dateFormat(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
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
        render: (text) => <Badge status="success" text={getSuffix(text, ' A') || '-'} />,
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

  function expandedRowRender(record) {
    let result = [];
    if (record.toteCodes) {
      result = record.toteCodes
        .map((toteCode, index) => {
          return {
            index: index + 1,
            text: toteCode,
          };
        })
        .reverse();
    }
    return (
      <div style={{ margin: 20, width: 300 }}>
        <Divider orientation="left">{<FormattedMessage id="app.taskPool.mountedBin" />}</Divider>
        <Table
          pagination={false}
          dataSource={result}
          columns={[
            {
              title: <FormattedMessage id="app.taskDetail.layers" />,
              dataIndex: 'index',
              render: (text) => {
                return <span>{text}</span>;
              },
            },
            {
              title: <FormattedMessage id="app.taskDetail.toteCode" />,
              dataIndex: 'text',
              render: (text) => {
                return <span>{text}</span>;
              },
            },
          ]}
        />
      </div>
    );
  }

  return (
    <AgvListComponent
      getColumn={getColumn} // 提供表格列数据
      agvType={AGVType.Tote} // 标记当前页面的车型
      deleteFlag={deleteFlag} // 标记该页面是否允许执行删除操作
      moveFlag={false} // 标记页面是否有移出地图按钮
      exportFlag={false}
      expandedRowRender={expandedRowRender} // tote 的table 可展开看层数 料箱号
    />
  );
};

export default React.memo(AgvList);
