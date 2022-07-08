import React, { memo, useEffect, useState } from 'react';
import { Badge, Button, Drawer, Tag } from 'antd';
import { CloseOutlined, ToolOutlined } from '@ant-design/icons';
import { formatMessage, getDirectionLocale, getSuffix, getVehicleStatusTag, isNull } from '@/utils/util';
import { connect } from '@/utils/RmsDva';
import Dictionary from '@/utils/Dictionary';
import RegisterPanel from './RegisterPanel';
import VehicleListTools from './VehicleListTools';
import TableWithPages from '@/components/TableWithPages';
import FormattedMessage from '@/components/FormattedMessage';
import TablePageWrapper from '@/components/TablePageWrapper';

const Colors = Dictionary().color;

const VehicleList = (props) => {
  const { dispatch, allVehicles, searchParams, loading, showRegisterPanel } = props;

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataSource, setDatasource] = useState([]);

  const columns = [
    {
      title: <FormattedMessage id='resourceGroup.grouping' />,
      dataIndex: 'groupName',
      align: 'center',
    },
    {
      title: <FormattedMessage id='vehicle.id' />,
      dataIndex: 'vehicleId',
      align: 'center',
    },
    {
      title: <FormattedMessage id='app.common.position' />,
      dataIndex: 'currentCellId',
      align: 'center',
    },
    {
      title: <FormattedMessage id='vehicle.direction' />,
      dataIndex: 'currentDirection',
      align: 'center',
      render: getDirectionLocale,
    },
    {
      title: <FormattedMessage id='app.vehicleState' />,
      dataIndex: 'vehicleStatus',
      align: 'center',
      render: getVehicleStatusTag,
    },
    {
      title: <FormattedMessage id="vehicle.maintenanceState" />,
      dataIndex: 'disabled',
      align: 'center',
      render: (text) => {
        return (
          <span>
            {text ? (
              <Tag color={Colors.red}>
                <ToolOutlined />
                <span style={{ marginLeft: 3 }}>
                  <FormattedMessage id="vehicle.maintenanceState" />
                </span>
              </Tag>
            ) : (
              <Tag color={Colors.green}>{<FormattedMessage id="app.common.normal" />}</Tag>
            )}
          </span>
        );
      },
    },
    {
      title: <FormattedMessage id='app.vehicleType' />,
      dataIndex: 'vehicleType',
      align: 'center',
      render: (text, record) => {
        if (record.isSimulator) {
          return <FormattedMessage id='app.vehicle.simulator' />;
        } else if (text === 3) {
          return <FormattedMessage id='app.vehicle.threeGenerationOfTianma' />;
        } else {
          return <span>{text}</span>;
        }
      },
    },
  ];

  const expandColumns = [
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
      title: <FormattedMessage id='vehicle.serverIdentity' />,
      dataIndex: 'clusterIndex',
      align: 'center',
    },
    {
      title: <FormattedMessage id='vehicle.battery' />,
      align: 'center',
      dataIndex: 'battery',
      render: (text) => {
        if (text != null) {
          if (parseInt(text) > 50) {
            return <Badge status='success' text={getSuffix(text, '%')} />;
          } else if (parseInt(text) > 10) {
            return <Badge status='warning' text={getSuffix(text, '%')} />;
          } else {
            return <Badge status='error' text={getSuffix(text, '%')} />;
          }
        }
      },
    },
    {
      title: <FormattedMessage id='vehicle.battery.voltage' />,
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
      title: <FormattedMessage id="vehicle.battery.type" />,
      align: 'center',
      dataIndex: 'batteryType',
      render: (text) => {
        if (!isNull(text)) {
          return formatMessage({ id: Dictionary('batteryType', text) });
        }
      },
    },
    {
      title: <FormattedMessage id='vehicle.battery.maxCurrent' />,
      align: 'center',
      dataIndex: 'maxChargingCurrent',
      render: (text) => {
        if (!isNull(text)) {
          return <Badge status='success' text={getSuffix(text, ' A')} />;
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
    let registeredVehicles = allVehicles.filter((item) => item.register);
    const { id: uniqueIds, state, vehicleType } = searchParams;
    if (uniqueIds?.length > 0) {
      registeredVehicles = registeredVehicles.filter(({ id }) => uniqueIds.includes(id));
    }

    if (state?.length > 0) {
      registeredVehicles = registeredVehicles.filter((item) => state.includes(item.vehicleStatus));
    }

    if (!isNull(vehicleType)) {
      const currentType = vehicleType.split('@'); // adapterType@vehicleType
      registeredVehicles = registeredVehicles.filter(
        (item) => item.adapterType === currentType[0] && item.vehicleType === currentType[1],
      );
    }
    setDatasource(registeredVehicles);
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
        cancelSelection={() => {
          setSelectedRows([]);
          setSelectedRowKeys([]);
        }}
      />
      <TableWithPages
        loading={loading}
        columns={columns}
        expandColumns={expandColumns}
        expandColumnSpan={6}
        dataSource={dataSource}
        rowKey={(record) => record.id}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange,
        }}
      />

      {/* 注册小车 */}
      <Drawer
        title={formatMessage({ id: 'app.vehicle.register' })}
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
