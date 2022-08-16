import React, { memo, useEffect, useState } from 'react';
import { Button, Col, Row } from 'antd';
import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import { convertToUserTimezone, dealResponse, formatMessage } from '@/utils/util';
import { fetchChargerLockList } from '@/services/commonService';
import RmsConfirm from '@/components/RmsConfirm';
import commonStyles from '@/common.module.less';
import TableWithPages from '@/components/TableWithPages';
import TablePageWrapper from '@/components/TablePageWrapper';

const ChargerLock = () => {
  const [loading, setLoading] = useState(false);
  const [dataSourceList, setDataSourceList] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const columns = [
    {
      title: <FormattedMessage id='charger.code' />,
      dataIndex: 'chargerCode',
      align: 'center',
    },
    {
      title: <FormattedMessage id='charger.id' />,
      dataIndex: 'chargerId',
      align: 'center',
    },
    {
      title: <FormattedMessage id='app.vehicle' />,
      dataIndex: 'vehicleId',
      align: 'center',
    },
    {
      title: <FormattedMessage id='app.vehicleType' />,
      dataIndex: 'vehicleType',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'monitor.sourceLock.lockTime' }),
      dataIndex: 'lockedTimestamp',
      align: 'center',
      render: (lockedTimestamp) =>
        convertToUserTimezone(lockedTimestamp).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  useEffect(() => {
    freshData();
  }, []);

  async function freshData() {
    setLoading(true);
    const response = await fetchChargerLockList();
    if (!dealResponse(response)) {
      setDataSourceList(response);
    }
    setLoading(false);
  }

  function onSelectChange(selectedKeys, selectedRow) {
    setSelectedRowKeys(selectedKeys);
  }

  async function unlockCharger() {
    RmsConfirm({
      content: formatMessage({ id: 'app.message.batchDelete.confirm' }),
      onOk: async () => {
        // const response = await batchDeleteTaskTargetLock(selectedRow);
        // if (!dealResponse(response)) {
        //   message.success(formatMessage({ id: 'app.message.operateSuccess' }));
        //   freshData();
        // } else {
        //   message.success(formatMessage({ id: 'app.tip.operateFailed' }));
        // }
      },
    });
  }

  return (
    <TablePageWrapper>
      <Row>
        <Col flex='auto' className={commonStyles.tableToolLeft}>
          <Button danger disabled={selectedRowKeys.length === 0} onClick={unlockCharger}>
            <DeleteOutlined /> <FormattedMessage id='app.button.delete' />
          </Button>
          <Button onClick={freshData}>
            <ReloadOutlined /> <FormattedMessage id='app.button.refresh' />
          </Button>
        </Col>
      </Row>
      <TableWithPages
        bordered
        loading={loading}
        columns={columns}
        dataSource={dataSourceList}
        rowKey={({ chargerCode }) => chargerCode}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange,
        }}
      />
    </TablePageWrapper>
  );
};
export default memo(ChargerLock);
