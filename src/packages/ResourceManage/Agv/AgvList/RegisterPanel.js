/* TODO: I18N */
import React, { memo, useEffect, useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined, SwapOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { dealResponse } from '@/utils/util';
import TableWithPages from '@/components/TableWithPages';
import FormattedMessage from '@/components/FormattedMessage';
import AddRegistrationModal from '@/packages/ResourceManage/Agv/AgvList/AddRegistrationModal';
import RegisterRobotModal from '@/packages/ResourceManage/Agv/AgvList/RegisterRobotModal';
import { registerRobot } from '@/services/resourceManageAPI';
import commonStyle from '@/common.module.less';

const RegisterPanel = (props) => {
  const { dispatch, loading, allRobots, showRegisterPanel } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const unregisterRobots = allRobots.filter((item) => !item.register);
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: <FormattedMessage id='app.agv.id' />,
      dataIndex: 'agvId',
      align: 'center',
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      align: 'center',
    },
    {
      title: <FormattedMessage id='app.agv.port' />,
      dataIndex: 'port',
      align: 'center',
    },
    {
      title: <FormattedMessage id='app.configInfo.header.adapter' />,
      dataIndex: 'agvAdapter',
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
    const [agvAdapter, agvType] = values.agvType.split('@');
    registerRobot([{ agvAdapter, agvType, ids: selectedRowKeys }]).then((response) => {
      if (!dealResponse(response, true)) {
        setSelectedRowKeys([]);
        dispatch({ type: 'agvList/updateRegisterRobotModalShown', payload: false });
        dispatch({ type: 'agvList/fetchInitialData' });
      }
    });
  }

  return (
    <div>
      <div className={commonStyle.tableToolLeft} style={{ marginBottom: 15 }}>
        <Button
          type={'primary'}
          onClick={() => {
            dispatch({ type: 'agvList/updateRegisterRobotModalShown', payload: true });
          }}
          disabled={selectedRowKeys.length === 0}
        >
          <SwapOutlined /> 注册
        </Button>
        <Button
          onClick={() => {
            dispatch({ type: 'agvList/updateAddRegistrationModalShown', payload: true });
          }}
        >
          <PlusOutlined /> 添加发现
        </Button>
      </div>
      <TableWithPages
        loading={loading}
        columns={columns}
        dataSource={unregisterRobots}
        rowKey={(record) => record.id}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange,
        }}
      />

      <AddRegistrationModal />
      <RegisterRobotModal onSubmit={onRegister} />
    </div>
  );
};
export default connect(({ agvList, loading }) => ({
  loading: loading.effects['agvList/fetchInitialData'],
  allRobots: agvList.allRobots,
  showRegisterPanel: agvList.showRegisterPanel,
}))(memo(RegisterPanel));
