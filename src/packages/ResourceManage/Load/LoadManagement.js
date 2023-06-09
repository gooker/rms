import React, { memo, useEffect, useState } from 'react';
import { Button, Col, Row, Switch } from 'antd';
import {
  DeleteOutlined,
  DiffOutlined,
  EditOutlined,
  PlusOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWithPages from '@/components/TableWithPages';
import FormattedMessage from '@/components/FormattedMessage';
import RmsConfirm from '@/components/RmsConfirm';
import {
  deleteSelectedLoad,
  fetchAllLoad,
  fetchAllLoadSpecification,
  saveLoad,
} from '@/services/resourceService';
import { dealResponse, formatMessage, generateResourceGroups, isNull } from '@/utils/util';
import AddLoadModal from './component/AddLoadModal';
import SearchLoadComponent from './component/SearchLoadComponent';
import commonStyles from '@/common.module.less';
import VirtualLoadModal from './component/VirtualLoadModal';
import { GroupManager, GroupResourceMemberId } from '@/components/ResourceGroup';

const ContainerManage = () => {
  const [allLoadSpec, setAllLoadSpec] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const [virtualVisible, setVirtualVisible] = useState(false);

  const [searchParam, setSearchParam] = useState(null);
  const [page, setPage] = useState({
    currentPage: 1,
    size: 10,
  });

  const [updateRecord, setUpdateRecord] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    { title: <FormattedMessage id="resource.load.code" />, dataIndex: 'loadId', align: 'center' },
    {
      title: <FormattedMessage id="app.common.angle" />,
      dataIndex: 'angle',
      align: 'center',
    },
    {
      title: <FormattedMessage id="resource.load.location" />,
      dataIndex: 'cellId',
      align: 'center',
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
      title: <FormattedMessage id="app.common.status" />,
      align: 'center',
      dataIndex: 'disabled',
      render: (text, record) => {
        return (
          <Switch
            checked={!isNull(text) && !text}
            onClick={() => {
              statusChange({
                ...record,
                disabled: !text,
              });
            }}
            checkedChildren={formatMessage({ id: 'app.common.enable' })}
            unCheckedChildren={formatMessage({ id: 'app.common.disable' })}
          />
        );
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

  function addSpec() {
    setVisible(true);
  }

  function editRow(record) {
    setVisible(true);
    setUpdateRecord(record);
  }

  function onCancel() {
    setVisible(false);
    setVirtualVisible(false);
    setUpdateRecord(null);
  }

  // 更新状态
  async function statusChange(record) {
    const response = await saveLoad(record);
    if (!dealResponse(response, 1)) {
      getData();
    }
  }

  // 删除载具
  async function deleteSpec() {
    RmsConfirm({
      content: formatMessage({ id: 'app.message.batchDelete.confirm' }),
      onOk: async () => {
        const response = await deleteSelectedLoad(selectedRowKeys);
        if (!dealResponse(response, 1)) {
          getData();
        }
      },
    });
  }

  /*
   *@params values 搜索参数
   *@params pages  是否使用传进来的页码
   * */
  async function getData(values, pages) {
    setLoading(true);

    let requestValues;
    if (values) {
      requestValues = values;
      setSearchParam(values);
    } else {
      requestValues = searchParam;
    }
    const currentPages = pages ? pages : page;

    const params = {
      current: currentPages.currentPage,
      size: currentPages.size,
      ...requestValues,
    };

    const [response, specResponse] = await Promise.all([
      fetchAllLoad(params),
      fetchAllLoadSpecification(),
    ]);
    if (!dealResponse(response)) {
      const { list, page } = response;
      setDataSource(list);
      setPage(page);
    }

    if (!dealResponse(specResponse)) {
      setAllLoadSpec(specResponse);
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
        <SearchLoadComponent allLoadSpec={allLoadSpec} onSearch={getData} />
        <Row justify={'space-between'} style={{ userSelect: 'none' }}>
          <Col className={commonStyles.tableToolLeft} flex="auto">
            <Button type="primary" onClick={addSpec}>
              <PlusOutlined /> <FormattedMessage id="app.button.add" />
            </Button>

            <Button
              onClick={() => {
                setVirtualVisible(true);
              }}
            >
              <DiffOutlined /> <FormattedMessage id="resource.load.virtual" />
            </Button>

            <GroupManager
              type={'LOAD'}
              memberIdKey={GroupResourceMemberId.LOAD}
              selections={selectedRows}
              refresh={() => getData()}
              cancelSelection={() => {
                setSelectedRows([]);
                setSelectedRowKeys([]);
              }}
            />

            <Button danger disabled={selectedRowKeys.length === 0} onClick={deleteSpec}>
              <DeleteOutlined /> <FormattedMessage id="app.button.delete" />
            </Button>

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
        loading={loading}
        rowSelection={{ selectedRowKeys, onChange: rowSelectChange }}
        rowKey={(record) => {
          return record.id;
        }}
        pagination={{
          current: page.current,
          pageSize: page.size,
          total: page.totalElements || 0,
        }}
        onChange={handleTableChange}
      />

      {/*新增/编辑 载具 */}
      {visible && (
        <AddLoadModal
          visible={visible}
          onCancel={onCancel}
          onOk={getData}
          updateRecord={updateRecord}
          allData={dataSource}
          allLoadSpec={allLoadSpec}
        />
      )}

      {/* 虚拟载具 */}
      <VirtualLoadModal
        visible={virtualVisible}
        onCancel={onCancel}
        onOk={getData}
        updateRecord={updateRecord}
        allLoadSpec={allLoadSpec}
      />
    </TablePageWrapper>
  );
};
export default memo(ContainerManage);
