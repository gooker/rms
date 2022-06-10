/* TODO: I18N */
import React, { memo, useEffect, useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined, SwapOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { dealResponse } from '@/utils/util';
import TableWithPages from '@/components/TableWithPages';
import FormattedMessage from '@/components/FormattedMessage';
import AddRegistrationModal from '@/packages/ResourceManage/Vehicle/VehicleList/AddRegistrationModal';
import RegisterVehicleModal from '@/packages/ResourceManage/Vehicle/VehicleList/RegisterVehicleModal';
import { registerVehicle } from '@/services/resourceService';
import commonStyle from '@/common.module.less';

const RegisterPanel = (props) => {
  const { dispatch, loading, allVehicles, showRegisterPanel } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const unregisterVehicles = allVehicles.filter((item) => !item.register);
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: <FormattedMessage id="vehicle.id" />,
      dataIndex: 'vehicleId',
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
      title: <FormattedMessage id="app.configInfo.header.adapter" />,
      dataIndex: 'vehicleAdapter',
      align: 'center',
    },
    {
      title: '品牌',
      dataIndex: 'navigationType',
      align: 'center',
    },
    {
      title: '信号强度',
      dataIndex: 'signalStrength',
      align: 'center',
    },
  ];

  useEffect(() => {
    if (!showRegisterPanel) {
      setSelectedRowKeys([]);
    }
  }, [showRegisterPanel]);

  function onSelectChange(selectedRowKeys) {
    setSelectedRowKeys(selectedRowKeys);
  }

  function onRegister(values) {
    const [vehicleAdapter, vehicleType] = values.vehicleType.split('@');
    registerVehicle([{ vehicleAdapter, vehicleType, ids: selectedRowKeys }]).then((response) => {
      if (!dealResponse(response, true)) {
        setSelectedRowKeys([]);
        dispatch({ type: 'vehicleList/updateRegisterVehicleModalShown', payload: false });
        dispatch({ type: 'vehicleList/fetchInitialData' });
      }
    });
  }

  return (
    <div>
      <div className={commonStyle.tableToolLeft} style={{ marginBottom: 15 }}>
        <Button
          type={'primary'}
          onClick={() => {
            dispatch({ type: 'vehicleList/updateRegisterVehicleModalShown', payload: true });
          }}
          disabled={selectedRowKeys.length === 0}
        >
          <SwapOutlined /> 注册
        </Button>
        <Button
          onClick={() => {
            dispatch({ type: 'vehicleList/updateAddRegistrationModalShown', payload: true });
          }}
        >
          <PlusOutlined /> 添加发现
        </Button>
      </div>
      <TableWithPages
        loading={loading}
        columns={columns}
        dataSource={unregisterVehicles}
        rowKey={(record) => record.id}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange,
        }}
      />

      <AddRegistrationModal />
      <RegisterVehicleModal onSubmit={onRegister} />
    </div>
  );
};
export default connect(({ vehicleList, loading }) => ({
  loading: loading.effects['vehicleList/fetchInitialData'],
  allVehicles: vehicleList.allVehicles,
  showRegisterPanel: vehicleList.showRegisterPanel,
}))(memo(RegisterPanel));
