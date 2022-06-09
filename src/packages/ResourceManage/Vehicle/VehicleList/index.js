/* TODO: I18N */
import React, { memo, useEffect, useState } from 'react';
import { Badge, Button, Drawer, Tag } from 'antd';
import { CloseOutlined, InfoOutlined, ToolOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import {
  convertToUserTimezone,
  formatMessage,
  getDirectionLocale,
  getSuffix,
  getVehicleStatusTag,
  isNull,
} from '@/utils/util';
import dictionary from '@/utils/Dictionary';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWithPages from '@/components/TableWithPages';
import VehicleListTools from './VehicleListTools';
import { connect } from '@/utils/RmsDva';
import RegisterPanel from '@/packages/ResourceManage/Vehicle/VehicleList/RegisterPanel';

const VehicleList = (props) => {
  const { dispatch, allVehicles, searchParams, loading, showRegisterPanel, history } = props;

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataSource, setDatasource] = useState([]);

  const columns = [
    {
      title: <FormattedMessage id='vehicle.id' />,
      dataIndex: 'vehicleId',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.vehicleType" />,
      dataIndex: 'vehicleType',
      align: 'center',
      render: (text, record) => {
        if (record.isDummy) {
          return <FormattedMessage id="app.vehicle.threeGenerationsOfVehicles(Virtual)" />;
        } else if (text === 3) {
          return <FormattedMessage id="app.vehicle.threeGenerationOfTianma" />;
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
      title: <FormattedMessage id='vehicle.port' />,
      dataIndex: 'port',
      align: 'center',
    },
    {
      title: <FormattedMessage id='vehicle.direction' />,
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
      title: <FormattedMessage id='vehicle.maintenanceState' />,
      dataIndex: 'disabled',
      align: 'center',
      render: (text) => {
        return (
          <span>
            {text ? (
              <Tag color='red'>
                <ToolOutlined />
                <span style={{ marginLeft: 3 }}>
                  <FormattedMessage id='vehicle.underMaintenance' />
                </span>
              </Tag>
            ) : (
              <Tag color='green'>{<FormattedMessage id='app.common.normal' />}</Tag>
            )}
          </span>
        );
      },
    },
    {
      title: <FormattedMessage id='app.vehicleState' />,
      dataIndex: 'vehicleStatus',
      align: 'center',
      render: (vehicleStatus) => getVehicleStatusTag(vehicleStatus),
    },
    {
      title: <FormattedMessage id='vehicle.serverIdentity' />,
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
              checkVehicleDetail(record.id);
            }}
          >
            <FormattedMessage id='app.common.detail' />
          </Button>
        );
      },
    },
  ];

  const expandColumns = [
    {
      title: <FormattedMessage id="app.vehicle.addingTime" />,
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
      title: <FormattedMessage id="app.vehicle.battery" />,
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
      title: <FormattedMessage id='app.vehicle.battery.voltage' />,
      align: 'center',
      dataIndex: 'batteryVoltage',
      render: (text) => {
        if (text != null) {
          if (parseInt(text) > 47000) {
            return <Badge status='success' text={getSuffix(text / 1000, 'v')} />;
          } else if (parseInt(text) > 45000) {
            return <Badge status='warning' text={getSuffix(text / 1000, 'v')} />;
          } else {
            return <Badge status='error' text={getSuffix(text / 1000, 'v')} />;
          }
        }
      },
    },
    {
      title: <FormattedMessage id="app.vehicle.version" />,
      align: 'center',
      dataIndex: 'version',
    },
    {
      title: <FormattedMessage id='vehicle.battery.type' />,
      align: 'center',
      dataIndex: 'batteryType',
      render: (text) => {
        if (!isNull(text)) {
          return formatMessage({ id: dictionary('batteryType', text) });
        }
      },
    },
    {
      title: <FormattedMessage id="app.vehicle.maxChargeCurrent" />,
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
    dispatch({ type: 'vehicleList/fetchInitialData' });
  }, []);

  useEffect(() => {
    filterDatasource();
  }, [allVehicles, searchParams]);

  function filterDatasource() {
    let nowAllVehicels = [...allVehicles].filter((item) => item.register);
    const { id: uniqueIds, state, vehicleType } = searchParams;
    if (uniqueIds?.length > 0) {
      nowAllVehicels = nowAllVehicels.filter(({ id }) => uniqueIds.includes(id));
    }

    if (state?.length > 0) {
      nowAllVehicels = nowAllVehicels.filter((item) => state.includes(item.vehicleStatus));
    }

    if (!isNull(vehicleType)) {
      const currentType = vehicleType.split('@'); // adapterType@vehicleType
      nowAllVehicels = nowAllVehicels.filter(
        (item) => item.adapterType === currentType[0] && item.vehicleType === currentType[1],
      );
    }

    setDatasource(nowAllVehicels);
  }

  function fetchRegisteredVehicle() {
    //
  }

  function checkVehicleDetail(uniqueId) {
    const route = `/ResourceManage/Vehicle/VehicleRealTime`;
    history.push({ pathname: route, search: `uniqueId=${uniqueId}` });
  }

  function onSelectChange(selectedRowKeys, selectedRows) {
    setSelectedRows(selectedRows);
    setSelectedRowKeys(selectedRowKeys);
  }

  return (
    <TablePageWrapper style={{ position: 'relative' }}>
      <VehicleListTools
        selectedRows={selectedRows}
        onFilter={filterDatasource}
        onRefresh={fetchRegisteredVehicle}
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
              dispatch({ type: 'vehicleList/updateShowRegisterPanel', payload: false });
            }}
          >
            <CloseOutlined /> <FormattedMessage id={'app.button.turnOff'} />
          </Button>
        }
      >
        <RegisterPanel />
      </Drawer>
    </TablePageWrapper>
  );
};

export default connect(({ vehicleList, loading }) => ({
  loading: loading.effects['vehicleList/fetchInitialData'],
  allVehicles: vehicleList.allVehicles,
  searchParams: vehicleList.searchParams,
  showRegisterPanel: vehicleList.showRegisterPanel,
}))(memo(VehicleList));
