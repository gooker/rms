import React, { memo, useState, useEffect } from 'react';
import { Row, Col, Button } from 'antd';
import { EditOutlined, DeleteOutlined, RedoOutlined, PlusOutlined } from '@ant-design/icons';
import { find } from 'lodash';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWithPages from '@/components/TableWithPages';
import FormattedMessage from '@/components/FormattedMessage';
import { fetchAllStorage, deleteSelectedStorage } from '@/services/resourceService';
import SearchStorageComponent from './component/SearchStorageComponent';
import AddStorageModal from './component/AddStorageModal';
import commonStyles from '@/common.module.less';
import { dealResponse, formatMessage } from '@/utils/util';
import { allStorageType } from './component/storage';
import RmsConfirm from '@/components/RmsConfirm';
import ResourceGroupOperateComponent from '../component/ResourceGroupOperateComponent';
import InitStorageModal from './component/InitStorageModal';

const StorageManagement = () => {
  const [dataSource, setDataSource] = useState([]);

  const [searchParam, setSearchParam] = useState(null);
  const [page, setPage] = useState({
    currentPage: 1,
    size: 10,
  });

  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [updateRecord, setUpdateRecord] = useState(null);
  const [initVisible, setInitVisible] = useState(false);

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

    { title: '点位', dataIndex: 'cellId', align: 'center' },

    // { title: <FormattedMessage id="app.common.name" />, dataIndex: 'name', align: 'center' },

    {
      title: <FormattedMessage id="app.common.type" />,
      dataIndex: 'storageType',
      align: 'center',
      render: (text) => {
        const currentType = find(allStorageType, { code: text });
        return currentType?.label;
      },
    },
    { title: '分组', dataIndex: 'groups', align: 'center' },
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

  function addStorage() {
    setVisible(true);
  }

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
        <Row justify={'space-between'} style={{ userSelect: 'none' }}>
          <Col className={commonStyles.tableToolLeft} flex="auto">
            {/* <Button type="primary" onClick={addStorage}>
              <PlusOutlined /> <FormattedMessage id="app.button.add" />
            </Button> */}

            <Button type="primary" onClick={initStorage}>
              <PlusOutlined /> 初始化储位
            </Button>
            <Button danger disabled={selectedRowKeys.length === 0} onClick={deleteStorage}>
              <DeleteOutlined /> <FormattedMessage id="app.button.delete" />
            </Button>

            <ResourceGroupOperateComponent
              selectedRows={selectedRows}
              selectedRowKeys={selectedRowKeys}
              groupType={'STORE'}
              onRefresh={getData}
            />

            <Button
              onClick={() => {
                getData();
              }}
            >
              <RedoOutlined /> <FormattedMessage id="app.button.refresh" />
            </Button>
          </Col>
        </Row>
      </div>
      <TableWithPages
        columns={columns}
        dataSource={dataSource}
        expandColumns={expandColumns}
        loading={loading}
        rowSelection={{ selectedRowKeys, onChange: rowSelectChange }}
        rowKey={(record) => {
          return record.id;
        }}
        pagination={{
          current: page.current,
          pageSize: page.size,
          total: page.total || 0,
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
