/* TODO: I18N */
import React, { memo, useEffect, useState } from 'react';
import { Button } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, RedoOutlined } from '@ant-design/icons';
import { find } from 'lodash';
import RmsConfirm from '@/components/RmsConfirm';
import { allStorageType } from './component/storage';
import TableWithPages from '@/components/TableWithPages';
import { GroupManager, GroupResourceMemberId } from '@/components/ResourceGroup';
import AddStorageModal from './component/AddStorageModal';
import InitStorageModal from './component/InitStorageModal';
import TablePageWrapper from '@/components/TablePageWrapper';
import FormattedMessage from '@/components/FormattedMessage';
import SearchStorageComponent from './component/SearchStorageComponent';
import { deleteSelectedStorage, fetchAllStorage } from '@/services/resourceService';
import { dealResponse, formatMessage, generateResourceGroups } from '@/utils/util';
import commonStyles from '@/common.module.less';

const StorageManagement = () => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [initVisible, setInitVisible] = useState(false);

  const [dataSource, setDataSource] = useState([]);
  const [searchParam, setSearchParam] = useState(null);
  const [updateRecord, setUpdateRecord] = useState(null);
  const [page, setPage] = useState({ currentPage: 1, size: 10 });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
    },
    { title: <FormattedMessage id={'app.map.cell'} />, dataIndex: 'cellId', align: 'center' },
    {
      title: <FormattedMessage id='app.common.type' />,
      dataIndex: 'storageType',
      align: 'center',
      render: (text) => {
        const currentType = find(allStorageType, { code: text });
        return currentType?.label;
      },
    },
    {
      title: <FormattedMessage id="resourceGroup.grouping" />,
      dataIndex: 'groupName',
      align: 'center',
      render: (text, record) => {
        return generateResourceGroups(record);
      },
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
    { title: '载具ID', dataIndex: 'loadId', align: 'center' },
    { title: '储位编码', dataIndex: 'code', align: 'center' },
  ];

  function initStorage() {
    setInitVisible(true);
  }

  function editRow(record) {
    setVisible(true);
    setUpdateRecord(record);
  }

  function onCancel() {
    setVisible(false);
    setUpdateRecord(null);
  }

  // 删除载具
  async function deleteStorage() {
    RmsConfirm({
      content: formatMessage({ id: 'app.message.batchDelete.confirm' }),
      onOk: async () => {
        const response = await deleteSelectedStorage(selectedRowKeys);
        if (!dealResponse(response)) {
          getData();
        }
      },
    });
  }

  async function getData(values, newPage) {
    setLoading(true);

    let requestValues;
    if (values) {
      requestValues = values;
      setSearchParam(values);
    } else {
      requestValues = searchParam;
    }
    const currentPages = newPage ? newPage : page;
    const params = {
      current: currentPages.currentPage,
      size: currentPages.size,
      ...requestValues,
    };
    const response = await fetchAllStorage(params);
    if (!dealResponse(response)) {
      const { list, page } = response;
      setDataSource(list);
      setPage(page);
    }
    setSelectedRowKeys([]);
    setSelectedRows([]);
    setLoading(false);
  }

  function handleTableChange(pagination) {
    const pages = {
      currentPage: pagination.current,
      size: pagination.pageSize,
    };
    setPage(pages);
    getData(null, pages);
  }

  function rowSelectChange(selectedRowKeys, selectedRows) {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
  }

  return (
    <TablePageWrapper>
      <div>
        <SearchStorageComponent onSearch={getData} />
        <div className={commonStyles.tableToolLeft}>
          <Button type='primary' onClick={initStorage}>
            <PlusOutlined /> 初始化储位
          </Button>
          <Button danger disabled={selectedRowKeys.length === 0} onClick={deleteStorage}>
            <DeleteOutlined /> <FormattedMessage id='app.button.delete' />
          </Button>
          <GroupManager
            type={'STORE'}
            memberIdKey={GroupResourceMemberId.STORE}
            selections={selectedRows}
            refresh={() => getData()}
            cancelSelection={() => {
              setSelectedRows([]);
              setSelectedRowKeys([]);
            }}
          />
          <Button
            onClick={() => {
              getData();
            }}
          >
            <RedoOutlined /> <FormattedMessage id='app.button.refresh' />
          </Button>
        </div>
      </div>
      <TableWithPages
        columns={columns}
        dataSource={dataSource}
        expandColumns={expandColumns}
        loading={loading}
        rowSelection={{ selectedRowKeys, onChange: rowSelectChange }}
        rowKey={({ id }) => id}
        pagination={{
          current: page.current,
          pageSize: page.size,
          total: page.totalElements || 0,
        }}
        onChange={handleTableChange}
      />

      {/*新增/编辑 储位 */}
      <AddStorageModal
        visible={visible}
        onCancel={onCancel}
        onOk={getData}
        updateRecord={updateRecord}
      />

      {/* 初始化储位 */}
      <InitStorageModal
        visible={initVisible}
        title={'初始化储位'}
        onOk={getData}
        onCancel={() => {
          setInitVisible(false);
        }}
      />
    </TablePageWrapper>
  );
};
export default memo(StorageManagement);
