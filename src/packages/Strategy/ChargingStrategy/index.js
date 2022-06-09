import React, { memo, useEffect, useState } from 'react';
import { Form, Row } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWithPages from '@/components/TableWithPages';
import FormattedMessage from '@/components/FormattedMessage';
import { fetchAllStrategyList } from '@/services/resourceManageAPI';
import SearchComponent from './SearchComponent';
import { dealResponse, formatMessage, isStrictNull } from '@/utils/util';
import { isNull } from 'lodash';
import ChargingStrategyComponent from '@/pages/ChargingStrategy/ChargingStrategyComponent';

const ChargingStrategy = () => {
  const [allData, setAllData] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [updateRecord, setUpdateRecord] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    async function init() {
      getData();
    }
    init();
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
      setAllData(response);
      filterData(response);
    }
    setLoading(false);
  }

  function filterData(list, formValues) {
    let result = [...list];
    if (isNull(formValues)) {
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
    return;
  }

  function addStrage() {
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
        searchData={filterData}
        data={allData}
        selectedRowKeys={selectedRowKeys}
        addStrage={addStrage}
        getData={getData}
      />
      <TableWithPages
        dataSource={dataSource}
        columns={columns}
        expandColumns={expandColumns}
        expandColumnsKey={'abc'}
        loading={loading}
        rowSelection={{ selectedRowKeys, onChange: rowSelectChange }}
        rowKey={(record) => {
          return record.id;
        }}
      />

      {/* 充电策略 */}
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
    </TablePageWrapper>
  );
};
export default memo(ChargingStrategy);
