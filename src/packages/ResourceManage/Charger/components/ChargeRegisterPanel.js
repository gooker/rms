/* TODO: I18N */
import React, { memo, useEffect, useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined, SwapOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { dealResponse } from '@/utils/util';
import TableWithPages from '@/components/TableWithPages';
import FormattedMessage from '@/components/FormattedMessage';
import AddFindInfoModal from './AddFindInfoModal';
import RegisterChargeModal from './RegisterChargeModal';
import { handleleChargers } from '@/services/resourceManageAPI';
import commonStyle from '@/common.module.less';
import styles from '@/packages/ResourceManage/Vehicle/vehicle.module.less';

const ChargeRegisterPanel = (props) => {
  const { dispatch, loading, allChargers, showRegisterPanel, onRefresh } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const unregisterChargers = allChargers.filter((item) => !item.hasRegistered);
  const columns = [
    {
      title: '充电桩ID',
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
      title: <FormattedMessage id="app.configInfo.header.adapter" />,
      dataIndex: 'adapterType',
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
    const response = await handleleChargers({
      updateType: 'REGISTER',
      ...values,
      ids: selectedRowKeys[0],
    });
    if (!dealResponse(response, true)) {
      setSelectedRowKeys([]);
      onRefresh();
    }
  }

  // 注册
  function shownedRegisterModal(flag) {
    dispatch({ type: 'chargerList/updateRegisterChargerModalShown', payload: flag });
  }

  return (
    <div className={styles.registerPanel}>
      <div className={commonStyle.tableToolLeft} style={{ marginBottom: 15 }}>
        <Button
          type={'primary'}
          onClick={() => {
            shownedRegisterModal(true);
          }}
          disabled={selectedRowKeys.length !== 1}
        >
          <SwapOutlined /> 注册
        </Button>
        <Button
          onClick={() => {
            dispatch({ type: 'chargerList/updateAddRegistrationModalShown', payload: true });
          }}
        >
          <PlusOutlined /> 添加发现
        </Button>
      </div>
      <TableWithPages
        loading={loading}
        columns={columns}
        dataSource={unregisterChargers}
        rowKey={(record) => record.id}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange,
        }}
      />
      {/* 添加发现 */}
      <AddFindInfoModal />

      {/* 注册 */}
      <RegisterChargeModal onSubmit={onRegister} />
    </div>
  );
};
export default connect(({ chargerList, loading }) => ({
  loading: loading.effects['chargerList/fetchInitialData'],
  allChargers: chargerList.allChargers,
  showRegisterPanel: chargerList.showRegisterPanel,
}))(memo(ChargeRegisterPanel));
