import React, { memo, useEffect, useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined, SwapOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { dealResponse } from '@/utils/util';
import TableWithPages from '@/components/TableWithPages';
import FormattedMessage from '@/components/FormattedMessage';
import AddFindInfoModal from './AddFindInfoModal';
import RegisterChargeModal from './RegisterChargeModal';
import { fetchChargerList, operateChargers } from '@/services/resourceService';
import commonStyle from '@/common.module.less';
import styles from '@/packages/ResourceManage/Vehicle/vehicle.module.less';

const ChargeRegisterPanel = (props) => {
  const { dispatch, showRegisterPanel } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [unregisterChargers, setUnregisterChargers] = useState([]);
  const [loading, setLoading] = useState(false);
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
      title: <FormattedMessage id="app.configInfo.header.adapter" />,
      dataIndex: 'adapterType',
      align: 'center',
    },
  ];

  useEffect(() => {
    if (!showRegisterPanel) {
      setSelectedRowKeys([]);
    } else {
      getData();
    }
  }, [showRegisterPanel]);

  function onSelectChange(selectedRowKeys) {
    setSelectedRowKeys(selectedRowKeys);
  }

  async function getData() {
    setLoading(true);
    const response = await fetchChargerList({ filterType: 'UNREGISTER' });
    if (!dealResponse(response)) {
      setUnregisterChargers(response);
    }
    setLoading(false);
  }

  // 注册
  async function onRegister(values) {
    const response = await operateChargers({
      updateType: 'REGISTER',
      ...values,
      ids: [selectedRowKeys[0]],
    });
    if (!dealResponse(response, true)) {
      setSelectedRowKeys([]);
      getData();
      shownedRegisterModal(false);
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
          <SwapOutlined /> <FormattedMessage id="app.button.register" />
        </Button>
        <Button
          onClick={() => {
            dispatch({ type: 'chargerList/updateAddRegistrationModalShown', payload: true });
          }}
        >
          <PlusOutlined /> <FormattedMessage id="app.button.addFound" />
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
      <RegisterChargeModal
        onSubmit={onRegister}
        onCancel={async () => {
          shownedRegisterModal(false);
        }}
      />
    </div>
  );
};
export default connect(({ chargerList }) => ({
  showRegisterPanel: chargerList.showRegisterPanel,
}))(memo(ChargeRegisterPanel));
