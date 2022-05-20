/* TODO: I18N */
import React, { memo, useState } from 'react';
import { Button, Space, Drawer } from 'antd';
import { ReloadOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWithPages from '@/components/TableWithPages';
import FormattedMessage from '@/components/FormattedMessage';
import RmsConfirm from '@/components/RmsConfirm';
import { formatMessage } from '@/utils/util';
import AllMenuModal from './components/AllMenuModal';
import AddCustomMenuModal from './components/AddCustomMenuModal';
import { mockData } from './components/mockData';
import commonStyle from '@/common.module.less';
import { isNull } from 'lodash';

const CustomMenuManager = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([...mockData]);
  const [visiblePanel, setVisiblePanel] = useState(false);
  const [edit, setEdit] = useState(null);
  const columns = [
    {
      title: '应用',
      dataIndex: 'appCode',
      align: 'center',
    //   render: (text, record) => {
    //     return record?.parentPath?.split('/')[1];
    //   },
    },
    {
      title: '父节点',
      dataIndex: 'parentPath',
      align: 'center',
    },
    {
      title: '名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'id',
      align: 'center',
      render: (text, record) => {
        return (
          <Space>
            <Button type="link" onClick={deleteMenu}>
              <DeleteOutlined />
            </Button>
            <Button
              type="link"
              onClick={() => {
                setEdit(record);
              }}
            >
              <EditOutlined />
            </Button>
          </Space>
        );
      },
    },
  ];

  function onSubmit(values) {
    console.log(values);
    const newSource = [...dataSource];
    newSource.push(values);
    setDataSource(newSource);
  }
  // TODO: 等接口出来了 就不需要这样层层传了
  function deleteMenu() {
    // 调接口
    RmsConfirm({
      content: formatMessage({ id: 'app.message.delete.confirm' }),
      onOk: async () => {},
    });
  }

  //
  function handleEdit(values) {
    console.log(values);
    console.log(dataSource);
  }
  return (
    <TablePageWrapper style={{ position: 'relative' }}>
      <div className={commonStyle.tableToolLeft}>
        <Button
          type={'primary'}
          onClick={() => {
            setVisiblePanel(true);
          }}
        >
          <PlusOutlined /> <FormattedMessage id={'app.button.add'} />
        </Button>
        <Button>
          <ReloadOutlined /> <FormattedMessage id={'app.button.refresh'} />
        </Button>
      </div>
      <TableWithPages
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        rowKey={(record) => record.id}
      />

      {/* 权限分配 */}
      <Drawer
        destroyOnClose
        width={'35%'}
        visible={visiblePanel}
        style={{ overflow: 'auto' }}
        title={'菜单'}
        onClose={() => {
          setVisiblePanel(false);
        }}
      >
        <AllMenuModal handlSubmit={onSubmit} />
      </Drawer>

      {!isNull(edit) && (
        <AddCustomMenuModal
          visible={!isNull(edit)}
          onClose={() => {
            setEdit(null);
          }}
          editRecord={edit}
          onSave={handleEdit}
        />
      )}
    </TablePageWrapper>
  );
};
export default memo(CustomMenuManager);
