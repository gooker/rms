import React, { memo, useEffect, useState } from 'react';
import { EditOutlined } from '@ant-design/icons';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWithPages from '@/components/TableWithPages';
import FormattedMessage from '@/components/FormattedMessage';
import { fetchAllStrategyList } from '@/services/resourceService';
import SearchComponent from './SearchComponent';
import { dealResponse, formatMessage, isNull, isStrictNull } from '@/utils/util';
import ChargingStrategyComponent from '@/pages/ChargingStrategy/ChargingStrategyComponent';

const ChargingStrategy = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [updateRecord, setUpdateRecord] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    { title: <FormattedMessage id="app.common.code" />, dataIndex: 'code', align: 'center' },
    {
      title: <FormattedMessage id="app.common.name" />,
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.button.edit" />,
      align: 'center',
      fixed: 'right',
      render: (text, record) => (
        <EditOutlined
          style={{ color: '#1890FF', fontSize: 18 }}
          onClick={() => {
            editRow(record);
          }}
        />
      ),
    },
  ];

  const expandColumns = [
    { title: <FormattedMessage id="app.common.type" />, dataIndex: 'type', align: 'center' },
    { title: 'xxx', dataIndex: 'value', align: 'center' },
    {
      title: <FormattedMessage id="app.common.status" />,
      dataIndex: 'status',
      align: 'center',
      render: (current) => {
        if (current === 'Normal') {
          return <FormattedMessage id="app.chargeStrategy.normal" />;
        }

        return <FormattedMessage id="app.chargeStrategy.idleHours" />;
      },
    },
  ];

  async function getData() {
    setLoading(true);
    const response = await fetchAllStrategyList();
    if (!dealResponse(response)) {
      filterData(response);
    }
    setSelectedRowKeys([]);
    setLoading(false);
  }

  function filterData(list, formValues) {
    let result = [...list];
    if (isStrictNull(formValues)) {
      setDataSource(result);
      return;
    }
    const { code } = formValues;
    if (!isStrictNull(code)) {
      result = result.filter((item) => {
        return item.code === code;
      });
    }
    setDataSource(result);
  }

  function addStrategy() {
    setVisible(true);
  }

  function editRow(record) {
    setVisible(true);
    setUpdateRecord(record);
  }

  function onCancel() {
    setVisible(false);
    setUpdateRecord(null);
  }

  function onSubmit() {
    onCancel();
    getData();
  }

  function rowSelectChange(selectedRowKeys) {
    setSelectedRowKeys(selectedRowKeys);
  }

  return (
    <TablePageWrapper>
      <SearchComponent
        selectedRowKeys={selectedRowKeys}
        addStrategy={addStrategy}
        getData={getData}
      />
      <TableWithPages
        dataSource={dataSource}
        columns={columns}
        // expandColumns={expandColumns}
        // expandColumnsKey={'abc'}
        loading={loading}
        rowSelection={{
          selectedRowKeys,
          onChange: rowSelectChange,
          getCheckboxProps: (record) => ({
            disabled: record.isGlobal,
          }),
        }}
        rowKey={(record) => {
          return record.id;
        }}
      />

      {/* 充电策略 */}
      {visible && (
        <ChargingStrategyComponent
          visible={visible}
          title={
            isNull(updateRecord)
              ? formatMessage({ id: 'app.button.add' })
              : formatMessage({ id: 'app.button.edit' })
          }
          onCancel={onCancel}
          onOk={onSubmit}
          editing={updateRecord}
        />
      )}
    </TablePageWrapper>
  );
};
export default memo(ChargingStrategy);
