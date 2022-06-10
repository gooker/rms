import React, { memo, useEffect, useState } from 'react';
import TablePageWrapper from '@/components/TablePageWrapper';
import { fetchChargerFaultList } from '@/services/commonService';
import { convertToUserTimezone, dealResponse, formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import TableWithPages from '@/components/TableWithPages';
import FaultSearchForm from '../../ResourceManage/Charger/components/FaultSearchForm';

/**
 * 充电桩上报错误信息：
 * 未知异常 (-1)
 * 正常运行 (0)
 * 电压异常 (1)
 * 电流异常 (2)
 * 充电器温度异常报警 (5)
 * 充电桩对接传感器损坏 (6)
 * 烟雾传感器触发 (7)
 * 设备未连接上服务 (20)
 */

const ChargerFaultManagement = () => {
  const [loading, setLoading] = useState(false);
  const [chargeFaultList, chargeChargeFaultList] = useState([]);

  useEffect(() => {
    async function init() {
      await fetchChargeFaultList();
    }
    init();
  }, []);

  const columns = [
    {
      title: <FormattedMessage id="chargeManager.fault. chargerId" />,
      dataIndex: 'hardwareId',
      align: 'center',
      fixed: 'left',
    },
    {
      title: <FormattedMessage id="chargeManager.fault.code" />,
      dataIndex: 'errorIndex',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.fault.name" />,
      dataIndex: 'errorName',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'chargeManager.fault.createTime' }),
      dataIndex: 'createTime',
      align: 'center',
      render: (text) => convertToUserTimezone(text).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  async function fetchChargeFaultList(formValues) {
    setLoading(true);
    const requestParam = {
      ...formValues,
    };
    const response = await fetchChargerFaultList(requestParam);
    if (!dealResponse(response)) {
      chargeChargeFaultList(response);
    }
    setLoading(false);
  }

  return (
    <TablePageWrapper>
      <FaultSearchForm search={fetchChargeFaultList} />
      <TableWithPages
        bordered
        loading={loading}
        columns={columns}
        dataSource={chargeFaultList}
        rowKey={({ id }) => id}
      />
    </TablePageWrapper>
  );
};
export default memo(ChargerFaultManagement);
