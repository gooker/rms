/* TODO: I18N */
import React, { memo, useEffect, useState } from 'react';
import { Badge, Button, Drawer } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';
import { convertToUserTimezone, getDirectionLocale, getSuffix } from '@/utils/util';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWithPages from '@/components/TableWithPages';
import EquipmentListTools from './components/EquipmentListTools';
import EquipmentRegisterPanel from './components/EquipmentRegisterPanel';

const EquipmentList = (props) => {
  const { dispatch, allDevices, searchParams, loading, showRegisterPanel } = props;

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataSource, setDatasource] = useState([]);

  const columns = [
    {
      title: '设备ID',
      dataIndex: 'deviceID',
      align: 'center',
    },
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      align: 'center',
    },
    {
      title: 'IP',
      dataIndex: 'IP',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.agv.port" />,
      dataIndex: 'port',
      align: 'center',
    },
    {
      title: '信号强度',
      dataIndex: 'signalStrength',
      align: 'center',
      render: (text) => getDirectionLocale(text),
    },
    {
      title: '连接方式',
      dataIndex: 'connectionType',
      align: 'center',
    },
    {
      title: '是否忽略',
      dataIndex: 'isIgnored',
      align: 'center',
    },
  ];

  const expandColumnsKey = [
    {
      title: <FormattedMessage id="app.agv.addingTime" />,
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
      title: '设备描述',
      align: 'center',
      dataIndex: 'deviceDescription',
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
      title: '在线状态',
      align: 'center',
      dataIndex: 'onlineStatus',
    },
  ];

  useEffect(() => {
    dispatch({ type: 'equipList/fetchInitialData' });
  }, []);

  useEffect(() => {
    filterDatasource();
  }, [allDevices, searchParams]);

  function filterDatasource() {
    let nowAllDevices = [...allDevices].filter((item) => item.register);
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
  }

  function onSelectChange(selectedRowKeys, selectedRows) {
    setSelectedRows(selectedRows);
    setSelectedRowKeys(selectedRowKeys);
  }

  return (
    <TablePageWrapper style={{ position: 'relative' }}>
      <EquipmentListTools selectedRows={selectedRows} onRefresh={fetchRegisteredDevice} />
      <TableWithPages
        loading={loading}
        columns={columns}
        expandColumnsKey={expandColumnsKey}
        dataSource={dataSource}
        rowKey={(record) => record.deviceID}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange,
        }}
      />

      {/* 注册小车 */}
      <Drawer
        title="适配器注册"
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
            <CloseOutlined /> <FormattedMessage id={'app.button.close'} />
          </Button>
        }
      >
        <EquipmentRegisterPanel onRefresh={fetchRegisteredDevice} />
      </Drawer>
    </TablePageWrapper>
  );
};

export default connect(({ equipList, loading }) => ({
  loading: loading.effects['equipList/fetchInitialData'],
  allDevices: equipList.allDevices,
  searchParams: equipList.searchParams,
  showRegisterPanel: equipList.showRegisterPanel,
}))(memo(EquipmentList));
