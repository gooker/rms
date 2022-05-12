/* TODO: I18N */
import React, { memo, useEffect, useState } from 'react';
import { Badge, Button, Drawer, Tag } from 'antd';
import { CloseOutlined, InfoOutlined, ToolOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import {
  convertToUserTimezone,
  formatMessage,
  getAgvStatusTag,
  getDirectionLocale,
  getSuffix,
  isNull,
} from '@/utils/util';
import dictionary from '@/utils/Dictionary';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWithPages from '@/components/TableWithPages';
import AgvListTools from './AgvListTools';
import { connect } from '@/utils/RmsDva';
import RegisterPanel from '@/packages/ResourceManage/Agv/AgvList/RegisterPanel';

const AgvList = (props) => {
  const { dispatch, allRobots, searchParams, loading, showRegisterPanel } = props;

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataSource, setDatasource] = useState([]);

  const columns = [
    {
      title: <FormattedMessage id="app.agv.id" />,
      dataIndex: 'agvId',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.agvType" />,
      dataIndex: 'robotType',
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
      title: 'IP',
      dataIndex: 'ip',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.agv.port" />,
      dataIndex: 'port',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.agv.direction" />,
      dataIndex: 'currentDirection',
      align: 'center',
      render: (text) => getDirectionLocale(text),
    },
    {
      title: <FormattedMessage id="app.common.position" />,
      dataIndex: 'currentCellId',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.agv.maintenanceState" />,
      dataIndex: 'disabled',
      align: 'center',
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
    {
      title: <FormattedMessage id="app.agvStatus" />,
      dataIndex: 'agvStatus',
      align: 'center',
      render: (agvStatus) => getAgvStatusTag(agvStatus),
    },
    {
      title: <FormattedMessage id="app.agv.serverIdentity" />,
      dataIndex: 'clusterIndex',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.common.operation" />,
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

  const expandColumns = [
    {
      title: <FormattedMessage id="app.agv.addingTime" />,
      dataIndex: 'createDate',
      align: 'center',
      render: (text, record, index, flag) => {
        if (flag) {
          return <span>{convertToUserTimezone(text).format('MM-DD HH:mm')}</span>;
        }
        return <span>{convertToUserTimezone(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
      },
    },
    {
      title: <FormattedMessage id="app.agv.battery" />,
      align: 'center',
      dataIndex: 'battery',
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
      align: 'center',
      dataIndex: 'batteryVoltage',
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
      align: 'center',
      dataIndex: 'version',
    },
    {
      title: <FormattedMessage id="app.agv.batteryType" />,
      align: 'center',
      dataIndex: 'batteryType',
      render: (text) => {
        if (!isNull(text)) {
          return formatMessage({ id: dictionary('batteryType', text) });
        }
      },
    },
    {
      title: <FormattedMessage id="app.agv.maxChargeCurrent" />,
      align: 'center',
      dataIndex: 'maxChargingCurrent',
      render: (text) => {
        if (!isNull(text)) {
          return <Badge status="success" text={getSuffix(text, ' A')} />;
        }
      },
    },
  ];

  useEffect(() => {
    dispatch({ type: 'agvList/fetchInitialData' });
  }, []);

  useEffect(() => {
    filterDatasource();
  }, [allRobots, searchParams]);

  function filterDatasource() {
    setDatasource(allRobots.filter((item) => item.register));
  }

  function fetchRegisteredRobot() {
    //
  }

  function checkAgvDetail() {
    //
  }

  function onSelectChange(selectedRowKeys, selectedRows) {
    setSelectedRows(selectedRows);
    setSelectedRowKeys(selectedRowKeys);
  }

  return (
    <TablePageWrapper style={{ position: 'relative' }}>
      <AgvListTools
        selectedRows={selectedRows}
        onFilter={filterDatasource}
        onRefresh={fetchRegisteredRobot}
      />
      <TableWithPages
        loading={loading}
        columns={columns}
        expandColumns={expandColumns}
        dataSource={dataSource}
        rowKey={(record) => record.id}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange,
        }}
      />

      {/* 注册小车 */}
      <Drawer
        title="车辆注册"
        placement="top"
        height="50%"
        closable={false}
        maskClosable={false}
        getContainer={false}
        visible={showRegisterPanel}
        style={{ position: 'absolute' }}
        extra={
          <Button
            type={'primary'}
            onClick={() => {
              dispatch({ type: 'agvList/updateShowRegisterPanel', payload: false });
            }}
          >
            <CloseOutlined /> <FormattedMessage id={'app.button.close'} />
          </Button>
        }
      >
        <RegisterPanel />
      </Drawer>
    </TablePageWrapper>
  );
};

export default connect(({ agvList, loading }) => ({
  loading: loading.effects['agvList/fetchInitialData'],
  allRobots: agvList.allRobots,
  searchParams: agvList.searchParams,
  showRegisterPanel: agvList.showRegisterPanel,
}))(memo(AgvList));
