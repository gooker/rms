import React, { memo, useEffect, useState } from 'react';
import { Form } from 'antd';
import TablePageWrapper from '@/components/TablePageWrapper';
import { convertToUserTimezone, dealResponse, formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import TableWithPages from '@/components/TableWithPages';
import FaultSearch from '../component/FaultSearch';

const EquipmentFaultManagement = (props) => {
  const [loading, setLoading] = useState(false);
  const [faultList, setFaultList] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    async function init() {
      await fetchFault();
    }
    init();
  }, []);

  async function fetchFault(formValues) {
    setLoading(true);
    const requestParam = {
      ...formValues,
    };
    const response = await fetchApi11(requestParam);
    if (!dealResponse(response)) {
      setFaultList(response);
    }
    setLoading(false);
  }

  const columns = [
    {
      title: <FormattedMessage id="device.id" />,
      dataIndex: 'deviceID',
      align: 'center',
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

  return (
    <TablePageWrapper>
      <FaultSearch gutter={'24'} span={'8'} form={form} onSearch={fetchFault} />
      <TableWithPages
        loading={loading}
        columns={columns}
        dataSource={faultList}
        rowKey={({ id }) => id}
      />
    </TablePageWrapper>
  );
};
export default memo(EquipmentFaultManagement);
