import React, { memo, useEffect, useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined, SwapOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { dealResponse } from '@/utils/util';
import TableWithPages from '@/components/TableWithPages';
import FormattedMessage from '@/components/FormattedMessage';
import AddFindInfoModal from './AddFindInfoModal';
import RegisterDeviceModal from './RegisterDeviceModal';
import { registerDevice } from '@/services/resourceService';
import commonStyle from '@/common.module.less';
import styles from '@/packages/ResourceManage/Vehicle/vehicle.module.less';

const EquipmentRegisterPanel = (props) => {
  const { dispatch, loading, allDevices, showRegisterPanel, onRefresh } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const unregisterDevices = allDevices.filter((item) => !item.hasRegistered);
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
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
      dataIndex: 'deviceAdapterCode',
      align: 'center',
    },
    {
      title: <FormattedMessage id="resource.signalStrength" />,
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

  // 注册
  async function onRegister(values) {
    const response = await registerDevice({ ...values, id: selectedRowKeys[0] }); //ids: selectedRowKeys
    if (!dealResponse(response, true)) {
      setSelectedRowKeys([]);
      dispatch({ type: 'equipList/updateRegisterDeviceModalShown', payload: false });
      dispatch({ type: 'equipList/saveState', payload: { deviceMonitorData: [] } });
      onRefresh();
    }
  }

  return (
    <div className={styles.registerPanel}>
      <div className={commonStyle.tableToolLeft} style={{ marginBottom: 15 }}>
        <Button
          type={'primary'}
          onClick={() => {
            dispatch({ type: 'equipList/updateRegisterDeviceModalShown', payload: true });
          }}
          disabled={selectedRowKeys.length !== 1}
        >
          <SwapOutlined /> <FormattedMessage id="app.button.register" />
        </Button>
        <Button
          onClick={() => {
            dispatch({ type: 'equipList/updateAddRegistrationModalShown', payload: true });
          }}
        >
          <PlusOutlined /> <FormattedMessage id="app.button.addFound" />
        </Button>
      </div>
      <TableWithPages
        loading={loading}
        columns={columns}
        dataSource={unregisterDevices}
        rowKey={(record) => record.id}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange,
        }}
      />

      <AddFindInfoModal />
      <RegisterDeviceModal onSubmit={onRegister} />
    </div>
  );
};
export default connect(({ equipList, loading }) => ({
  loading: loading.effects['equipList/fetchInitialData'],
  allDevices: equipList.allDevices,
  showRegisterPanel: equipList.showRegisterPanel,
}))(memo(EquipmentRegisterPanel));
