import React, { memo, useEffect, useState } from 'react';
import TablePageWrapper from '@/components/TablePageWrapper';
import { Badge, Button, Drawer, Switch, Tag } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import Dictionary from '@/utils/Dictionary';
import { dealResponse, formatMessage, generateResourceGroups, getSuffix, isNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import TableWithPages from '@/components/TableWithPages';
import { operateChargers } from '@/services/resourceService';
import ChargerListTools from './components/ChargerListTools';
import ChargeRegisterPanel from './components/ChargeRegisterPanel';
import { ChargerStatus, StatusColor } from './components/chargeConfig';

const ChargerList = (props) => {
  const { dispatch, searchParams, allChargers, loading, showRegisterPanel } = props;

  const [dataSource, setDatasource] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    async function init() {
      await fetchRegisteredCharge();
    }
    init();
  }, []);

  useEffect(() => {
    filterDatasource();
  }, [allChargers, searchParams]);

  function filterDatasource() {
    let nowAllCharges = [...allChargers].filter((item) => item.register);
    const { id, chargerStatus } = searchParams;
    if (id?.length > 0) {
      nowAllCharges = nowAllCharges.filter(({ chargerId }) => id.includes(chargerId));
    }

    if (chargerStatus?.length > 0) {
      nowAllCharges = nowAllCharges.filter((item) => chargerStatus.includes(item.chargerStatus));
    }

    setDatasource(nowAllCharges);
  }

  const columns = [
    {
      title: <FormattedMessage id="charger.id" />,
      dataIndex: 'chargerId',
      align: 'center',
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      align: 'center',
    },
    {
      title: <FormattedMessage id="vehicle.port" />,
      dataIndex: 'port',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.common.type" />,
      dataIndex: 'type',
      align: 'center',
      render: (type) => {
        if (!isNull(type)) {
          return (
            <Tag color="green" key={type}>
              {formatMessage({ id: Dictionary('chargerType', type) }) || type}
            </Tag>
          );
        }
      },
    },
    {
      title: <FormattedMessage id="resourceGroup.grouping" />,
      dataIndex: 'groupName',
      align: 'center',
      render: (text, record) => {
        return generateResourceGroups(record);
      },
    },
    {
      title: <FormattedMessage id="app.common.status" />,
      dataIndex: 'chargerStatus',
      align: 'center',
      render: (text) => {
        if (!isNull(text)) {
          return (
            <Tag color={StatusColor[text]} key={text}>
              {ChargerStatus[text]}
            </Tag>
          );
        }
        return text;
      },
    },

    {
      title: <FormattedMessage id="app.common.operation" />,
      dataIndex: 'disabled',
      align: 'center',
      width: 250,
      fixed: 'right',
      render: (text, record) => {
        return (
          <Switch
            checked={!isNull(text) && !text}
            onClick={(checked) => {
              statusSwitch({
                ids: [record.id],
                updateType: !text ? 'DISABLE' : 'ENABLE',
              });
            }}
            checkedChildren={formatMessage({ id: 'app.common.enabled' })}
            unCheckedChildren={formatMessage({ id: 'app.common.disabled' })}
          />
        );
      },
    },
  ];

  const expandColumns = [
    {
      title: <FormattedMessage id="charger.map.code" />,
      align: 'center',
      dataIndex: 'mapChargerCode',
    },
    {
      title: <FormattedMessage id="chargeManager.temperature" />,
      dataIndex: 'temperature',
      align: 'center',
      render: (text) => {
        if (!isNull(text)) {
          return <Badge status="success" text={getSuffix(text, '°c')} />;
        }
      },
    },
    {
      title: <FormattedMessage id="chargeManager.chargeCurrent" />,
      align: 'center',
      dataIndex: 'currentElectricity',
      render: (text) => {
        if (!isNull(text)) {
          return <Badge status="success" text={getSuffix(text, ' A')} />;
        }
      },
    },
    {
      title: <FormattedMessage id="chargeManager.batteryVoltage" />,
      align: 'center',
      dataIndex: 'currentVoltage',
      render: (text) => {
        if (!isNull(text)) {
          return <Badge status="success" text={getSuffix(text, ' V')} />;
        }
      },
    },
    {
      title: <FormattedMessage id="chargeManager.fitbattery" />,
      dataIndex: 'batteryType',
      align: 'center',
      render: (type) => {
        if (!isNull(type)) {
          return (
            <Tag color="green" key={type}>
              {formatMessage({ id: Dictionary('batteryType', type) })}
            </Tag>
          );
        }
        return type;
      },
    },
    {
      title: <FormattedMessage id={'editor.cellType.charging'} />,
      align: 'center',
      dataIndex: 'chargingCells',
      render: (text) => {
        if (!isNull(text)) {
          return renderChargingCells(text);
        }
      },
    },
  ];

  function renderChargingCells(chargingCells) {
    return chargingCells.map(({ cellId, supportTypes }, index) => (
      <>
        <span>
          <FormattedMessage id={'editor.cellType.charging'} />({cellId})
        </span>
        <span>
          {supportTypes
            .map(({ vehicleTypes }) => vehicleTypes)
            .flat()
            .join()}
        </span>
      </>
    ));
  }

  async function fetchRegisteredCharge() {
    await dispatch({ type: 'chargerList/fetchInitialData' });
    setSelectedRows([]);
    setSelectedRowKeys([]);
  }

  async function statusSwitch(params) {
    const response = await operateChargers(params);
    if (!dealResponse(response, 1)) {
      fetchRegisteredCharge();
    }
  }

  function onSelectChange(selectedKeys, selectedRows) {
    setSelectedRowKeys(selectedKeys);
    setSelectedRows(selectedRows);
  }

  return (
    <TablePageWrapper style={{ position: 'relative' }}>
      <ChargerListTools
        selectedRows={selectedRows}
        onRefresh={fetchRegisteredCharge}
        cancelSelection={() => {
          setSelectedRows([]);
          setSelectedRowKeys([]);
        }}
      />
      <TableWithPages
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        expandColumns={expandColumns}
        rowKey={({ id }) => id}
        rowSelection={{
          selectedRowKeys,
          selectedRows,
          onChange: onSelectChange,
        }}
      />

      {/* 注册充电桩 */}
      <Drawer
        title={formatMessage({ id: 'adapter.register' })}
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
              dispatch({ type: 'chargerList/updateShowRegisterPanel', payload: false });
              fetchRegisteredCharge();
            }}
          >
            <CloseOutlined /> <FormattedMessage id={'app.button.turnOff'} />
          </Button>
        }
      >
        <ChargeRegisterPanel onRefresh={fetchRegisteredCharge} />
      </Drawer>
    </TablePageWrapper>
  );
};
export default connect(({ chargerList, loading }) => ({
  loading: loading.effects['chargerList/fetchInitialData'],
  allChargers: chargerList.allChargers,
  searchParams: chargerList.searchParams,
  showRegisterPanel: chargerList.showRegisterPanel,
}))(memo(ChargerList));
