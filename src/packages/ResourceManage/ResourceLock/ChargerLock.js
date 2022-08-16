import React, { memo, useEffect, useState } from 'react';
import { message, Typography } from 'antd';
import { dealResponse, fastConvertToUserTimezone, formatMessage, isStrictNull } from '@/utils/util';
import { fetchChargerLockList, fetchUnlockCharger } from '@/services/commonService';
import ChargerLockSearch from './components/ChargerLockSearch';
import FormattedMessage from '@/components/FormattedMessage';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWithPages from '@/components/TableWithPages';
import RmsConfirm from '@/components/RmsConfirm';

const ChargerLock = () => {
  const [loading, setLoading] = useState(false);
  const [datasource, setDatasource] = useState([]);

  const columns = [
    {
      title: <FormattedMessage id="charger.id" />,
      dataIndex: 'chargerId',
      align: 'center',
    },
    {
      title: <FormattedMessage id="charger.code" />,
      dataIndex: 'chargerCode',
      align: 'center',
    },
    {
      title: <FormattedMessage id="vehicle.code" />,
      dataIndex: 'vehicleId',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.vehicleType" />,
      dataIndex: 'vehicleType',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'monitor.sourceLock.lockTime' }),
      dataIndex: 'lockedTimestamp',
      align: 'center',
      render: fastConvertToUserTimezone,
    },
    {
      title: formatMessage('app.common.operation'),
      align: 'center',
      render: (text, record) => (
        <Typography.Link
          onClick={() => {
            unlockCharger(record);
          }}
        >
          <FormattedMessage id={'app.button.delete'} />
        </Typography.Link>
      ),
    },
  ];

  useEffect(() => {
    freshData();
  }, []);

  async function freshData(formValue = {}) {
    setLoading(true);
    const response = await fetchChargerLockList();
    if (!dealResponse(response)) {
      filterData(response, formValue);
    }
    setLoading(false);
  }

  function filterData(list, formValues) {
    let dataSource = [...list];
    const { chargerCode, vehicleCode } = formValues;
    if (!isStrictNull(chargerCode)) {
      dataSource = dataSource.filter((item) => item.chargerCode === chargerCode);
    }
    if (!isStrictNull(vehicleCode)) {
      dataSource = dataSource.filter((item) => item.vehicleId === vehicleCode);
    }
    setDatasource(dataSource);
  }

  function unlockCharger(record) {
    RmsConfirm({
      content: formatMessage({ id: 'app.message.batchDelete.confirm' }),
      onOk: async () => {
        const response = await fetchUnlockCharger(record);
        if (!dealResponse(response, true)) {
          const { chargerCode } = record;
          const _datasource = datasource.filter((item) => item.chargerCode !== chargerCode);
          setDatasource(_datasource);
        }
      },
    });
  }

  return (
    <TablePageWrapper>
      <ChargerLockSearch onSearch={freshData} />
      <TableWithPages
        bordered
        loading={loading}
        columns={columns}
        dataSource={datasource}
        rowKey={({ chargerCode }) => chargerCode}
      />
    </TablePageWrapper>
  );
};
export default memo(ChargerLock);
