/* TODO: I18N */
import React, { memo, useEffect, useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined, ReloadOutlined, SwapOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { dealResponse } from '@/utils/util';
import TableWithPages from '@/components/TableWithPages';
import FormattedMessage from '@/components/FormattedMessage';
import AddFindInfoModal from './AddFindInfoModal';
import RegisterDeviceModal from './RegisterDeviceModal';
import { registerDevice } from '@/services/resourceManageAPI';
import commonStyle from '@/common.module.less';
import styles from '@/packages/ResourceManage/Agv/agv.module.less';

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
      title: <FormattedMessage id="app.agv.port" />,
      dataIndex: 'port',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.configInfo.header.adapter" />,
      dataIndex: 'agvAdapter',
      align: 'center',
    },
    {
      title: '品牌',
      dataIndex: 'brand',
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

  // 注册
  async function onRegister(values) {
    const response = registerDevice({ ...values, id: selectedRowKeys[0] }); //ids: selectedRowKeys
    if (!dealResponse(response, true)) {
      setSelectedRowKeys([]);
      dispatch({ type: 'equipList/updateRegisterDeviceModalShown', payload: false });
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
          <SwapOutlined /> 注册
        </Button>
        <Button
          onClick={() => {
            dispatch({ type: 'equipList/updateAddRegistrationModalShown', payload: true });
          }}
        >
          <PlusOutlined /> 添加发现
        </Button>
        <Button onClick={onRefresh}>
          <ReloadOutlined /> <FormattedMessage id={'app.button.refresh'} />
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
