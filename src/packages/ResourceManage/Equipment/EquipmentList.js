import React, { memo, useEffect, useState } from 'react';
import { Button, Drawer, message } from 'antd';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';
import {
  findDeviceActionsByDeviceType,
  findDeviceMonitorsByDeviceType,
  saveDeviceActions,
  saveDeviceMonitors,
} from '@/services/resourceService';
import { convertToUserTimezone, dealResponse, formatMessage, isNull } from '@/utils/util';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWithPages from '@/components/TableWithPages';
import EquipmentListTools from './components/EquipmentListTools';
import EquipmentRegisterPanel from './components/EquipmentRegisterPanel';
import DeviceActionsModal from './components/DeviceActionsModal';
import DeviceStateConfigsModal from './components/DeviceStateConfigsModal';

const EquipmentList = (props) => {
  const { dispatch, allDevices, searchParams, loading, showRegisterPanel } = props;

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataSource, setDatasource] = useState([]);

  const [deviceActions, setDeviceActions] = useState([]); // 设备动作数据
  const [visible, setVisible] = useState(false); // 设备动作visible

  const [deviceConfig, setDeviceConfig] = useState([]); // 设备状态 option 地址数据
  const [configVisible, setConfigVisible] = useState(false); // 设备状态配置visible

  const columns = [
    {
      title: <FormattedMessage id="device.id" />,
      dataIndex: 'deviceID',
      align: 'center',
    },
    {
      title: <FormattedMessage id="device.name" />,
      dataIndex: 'deviceName',
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
      title: <FormattedMessage id="device.connectionType" />,
      dataIndex: 'connectionType',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.common.operation" />,
      align: 'center',
      render: (text, record) => {
        return (
          <>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => {
                showDeviceActionModal(record);
              }}
            >
              <FormattedMessage id="device.action" />
            </Button>

            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => {
                showDeviceConfigModal(record);
              }}
            >
              <FormattedMessage id="device.status" />
            </Button>
          </>
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
      title: <FormattedMessage id="resource.signalStrength" />,
      dataIndex: 'signalStrength',
      align: 'center',
    },
    {
      title: <FormattedMessage id="device.description" />,
      align: 'center',
      dataIndex: 'deviceDescription',
    },
    {
      title: <FormattedMessage id="vehicle.onlineState" />,
      align: 'center',
      dataIndex: 'onlineStatus',
    },

    {
      title: <FormattedMessage id="device.ignored" />,
      dataIndex: 'ignored',
      align: 'center',
      render: (text) => {
        if (!isNull(text)) {
          if (text) {
            return <FormattedMessage id="app.common.true" />;
          }
          return <FormattedMessage id="app.common.false" />;
        }
      },
    },
  ];

  useEffect(() => {
    dispatch({ type: 'equipList/fetchInitialData' });
  }, []);

  useEffect(() => {
    filterDatasource();
  }, [allDevices, searchParams]);

  function filterDatasource() {
    let nowAllDevices = [...allDevices].filter((item) => item.hasRegistered);
    const { id, connectionType } = searchParams;
    if (id?.length > 0) {
      nowAllDevices = nowAllDevices.filter(({ deviceID }) => id.includes(deviceID));
    }

    if (connectionType?.length > 0) {
      nowAllDevices = nowAllDevices.filter((item) => connectionType.includes(item.connectionType));
    }

    setDatasource(nowAllDevices);
  }

  function fetchRegisteredDevice() {
    dispatch({ type: 'equipList/fetchInitialData' });
    setSelectedRows([]);
    setSelectedRowKeys([]);
  }

  // 修改设备动作弹框 start
  async function showDeviceActionModal(record) {
    const { deviceTypeCode, deviceID: deviceId } = record;
    const response = await findDeviceActionsByDeviceType({ deviceTypeCode, deviceId });
    if (!dealResponse(response)) {
      const data = [...response];
      if (data?.length > 0) {
        setDeviceActions(response);
        setVisible(true);
      } else {
        message.info(formatMessage({ id: 'device.deviceAction.tips' }));
      }
    }
  }

  async function onSaveActions(values) {
    const deviceActionDTO = [...values];
    const res = await saveDeviceActions(deviceActionDTO);
    if (!dealResponse(res, 1)) {
      setVisible(false);
      setDeviceActions([]);
      fetchRegisteredDevice();
    }
  }
  // 修改设备动作弹框end

  // 修改设备状态弹框 start
  async function showDeviceConfigModal(record) {
    const { deviceTypeCode, deviceID: deviceId } = record;
    const response = await findDeviceMonitorsByDeviceType({ deviceTypeCode, deviceId });
    if (!dealResponse(response)) {
      const data = [...response];
      if (data?.length > 0) {
        dispatch({
          type: 'equipList/saveState',
          payload: { deviceMonitorData: data },
        });
        setConfigVisible(true);
        setDeviceConfig(data);
      } else {
        message.info(formatMessage({ id: 'device.statusAction.tips' }));
      }
    }
  }

  async function onSaveConfig(param) {
    const response = await saveDeviceMonitors(param);
    if (!dealResponse(response, 1)) {
      fetchRegisteredDevice();
    }
  }

  function cancelConfig() {
    dispatch({
      type: 'equipList/saveState',
      payload: { deviceMonitorData: [] },
    });
    setConfigVisible(false);
    setDeviceConfig([]);
  }

  function onSelectChange(selectedRowKeys, selectedRows) {
    setSelectedRows(selectedRows);
    setSelectedRowKeys(selectedRowKeys);
  }

  return (
    <TablePageWrapper style={{ position: 'relative' }}>
      <EquipmentListTools
        selectedRows={selectedRows}
        onRefresh={fetchRegisteredDevice}
        cancelSelection={() => {
          setSelectedRows([]);
          setSelectedRowKeys([]);
        }}
      />
      <TableWithPages
        loading={loading}
        columns={columns}
        expandColumns={expandColumns}
        dataSource={dataSource}
        rowKey={(record) => record.deviceID}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange,
        }}
      />

      {/* 注册小车 */}
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
              dispatch({ type: 'equipList/updateShowRegisterPanel', payload: false });
            }}
          >
            <CloseOutlined /> <FormattedMessage id={'app.button.turnOff'} />
          </Button>
        }
      >
        <EquipmentRegisterPanel onRefresh={fetchRegisteredDevice} />
      </Drawer>

      {/* 编辑设备动作 */}
      {visible && (
        <DeviceActionsModal
          visible={visible}
          deviceActions={deviceActions}
          onCancelModal={() => {
            setVisible(false);
          }}
          isEdit={true}
          onSave={onSaveActions}
        />
      )}

      {/* 编辑设备状态 */}
      {configVisible && (
        <DeviceStateConfigsModal
          visible={configVisible}
          onCancel={cancelConfig}
          configs={deviceConfig}
          onSave={onSaveConfig}
        />
      )}
    </TablePageWrapper>
  );
};

export default connect(({ equipList, loading }) => ({
  loading: loading.effects['equipList/fetchInitialData'],
  allDevices: equipList.allDevices,
  searchParams: equipList.searchParams,
  showRegisterPanel: equipList.showRegisterPanel,
}))(memo(EquipmentList));
