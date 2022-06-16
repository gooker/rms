/* TODO: I18N */
import React, { memo, useEffect, useState } from 'react';
import { Row, Col, Button } from 'antd';
import { EditOutlined, DeleteOutlined, RedoOutlined, PlusOutlined } from '@ant-design/icons';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWithPages from '@/components/TableWithPages';
import FormattedMessage from '@/components/FormattedMessage';
import {
  fetchAllLoadSpecification,
  fetchAllLoadType,
  deleteLoadSpecification,
} from '@/services/resourceService';
import SearchSpecComponent from './component/SearchSpecComponent';
import LoadSpecificationModal from './component/LoadSpecificationModal';
import commonStyles from '@/common.module.less';
import { dealResponse, isStrictNull } from '@/utils/util';

const CustomLoadType = (props) => {
  const [allLoadType, setAllLoadType] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loadTypeCode, setLoadTypeCode] = useState(null);
  const [updateRecord, setUpdateRecord] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (!isStrictNull(loadTypeCode)) {
      filterData(dataSource, loadTypeCode);
    }
  }, [loadTypeCode]);

  const columns = [
    { title: '长', dataIndex: 'length', align: 'center' },
    {
      title: '宽',
      dataIndex: 'width',
      align: 'center',
    },
    {
      title: '高',
      dataIndex: 'height',
      align: 'center',
    },
    {
      title: '颜色',
      dataIndex: 'color',
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
    { title: '类型编码', dataIndex: 'code', align: 'center' },
    { title: '类型名称', dataIndex: 'name', align: 'center' },
    { title: '类型描述', dataIndex: 'desc', align: 'center' },
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
    setUpdateRecord(null);
  }

  function onSubmit() {
    onCancel();
    onRefresh();
  }

  // 删除规格
  async function deleteSpec() {
    const response = await deleteLoadSpecification(selectedRowKeys);
    if (!dealResponse(response)) {
      onRefresh();
    }
  }

  async function getData() {
    setLoading(true);
    const [allType, allSpec] = await Promise.all([fetchAllLoadType(), fetchAllLoadSpecification()]);
    if (!dealResponse(allType)) {
      setAllLoadType(allType);
    }
    if (!dealResponse(allSpec)) {
      setDataSource(allSpec);
      filterData(allSpec);
    }
    setLoading(false);
  }

  async function filterData(list, values) {
    let currentList = [...list];
    if (isStrictNull(values)) {
      setDataSource(currentList);
      return;
    }

    currentList = currentList?.filter(({ code }) => code === loadTypeCode);
    setDataSource(currentList);
  }

  function onRefresh() {
    getData();
  }

  function rowSelectChange(selectedRowKeys) {
    setSelectedRowKeys(selectedRowKeys);
  }

  return (
    <TablePageWrapper>
      <div>
        <SearchSpecComponent setLoadType={setLoadTypeCode} allLoadSpecType={allLoadType} />
        <Row justify={'space-between'} style={{ userSelect: 'none' }}>
          <Col className={commonStyles.tableToolLeft} flex="auto">
            <Button type="primary" onClick={addSpec}>
              <PlusOutlined /> <FormattedMessage id="app.button.add" />
            </Button>
            <Button danger disabled={selectedRowKeys.length === 0} onClick={deleteSpec}>
              <DeleteOutlined /> <FormattedMessage id="app.button.delete" />
            </Button>

            <Button onClick={onRefresh}>
              <RedoOutlined /> <FormattedMessage id="app.button.refresh" />
            </Button>
          </Col>
        </Row>
      </div>
      <TableWithPages
        columns={columns}
        dataSource={dataSource}
        expandColumns={expandColumns}
        expandColumnsKey={'loadType'}
        loading={loading}
        rowSelection={{ selectedRowKeys, onChange: rowSelectChange }}
        rowKey={(record) => {
          return record.id;
        }}
      />

      {/*新增/编辑 载具规格 */}
      <LoadSpecificationModal
        visible={visible}
        onCancel={onCancel}
        onOk={onRefresh}
        updateRecord={updateRecord}
        allLoadType={allLoadType}
      />
    </TablePageWrapper>
  );
};
export default memo(CustomLoadType);
