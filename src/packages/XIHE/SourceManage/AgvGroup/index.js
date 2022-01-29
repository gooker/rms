import React, { memo, useEffect, useState } from 'react';
import { Row, Col, Button, Tag, Modal, message } from 'antd';
import { DeleteOutlined, ReloadOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWidthPages from '@/components/TableWidthPages';
import FormattedMessage from '@/components/FormattedMessage';
import AddAgvgroupModal from './AddAgvgroupModal';
import {
  fetchAllMonitorAgvGroup,
  saveMonitorAgvGroup,
  updateMonitorAgvGroup,
  batchDeleteMonitorAgvGroup,
} from '@/services/api';
import { formatMessage, dealResponse, isNull } from '@/utils/util';
import commonStyles from '@/common.module.less';
import RmsConfirm from '@/components/RmsConfirm';

const AgvGroup = () => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [btnloading, setBtnloading] = useState(false);
  const [agvGroupList, setAgvGroupList] = useState([]);
  const [updateRow, setUpdateRow] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);

  useEffect(() => {
    async function init() {
      await getData();
    }
    init();
  }, []);

  async function getData() {
    setLoading(true);
    const response = await fetchAllMonitorAgvGroup();
    if (!dealResponse(response)) {
      setAgvGroupList(response);
    }
    setLoading(false);
  }

  function deleteHandle() {
    RmsConfirm({
      content: formatMessage({ id: 'app.message.batchDelete.confirm' }),
      onOk: async () => {
        const res = await batchDeleteMonitorAgvGroup(selectedRowKeys);
        if (!dealResponse(res)) {
          message.success(formatMessage({ id: 'app.message.operateSuccess' }));
          cancelModal();
          getData();
        }
      },
    });
  }

  function onSelectChange(selectedKeys, selectedRow) {
    setSelectedRowKeys(selectedKeys);
    setSelectedRow(selectedRow);
  }

  const columns = [
    {
      title: <FormattedMessage id="sourcemanage.agvgroup.name" />,
      dataIndex: 'agvGroupCode',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.agv' }),
      dataIndex: 'agvIdList',
      render(text) {
        return text?.map((item, index) => <Tag key={index}>{item}</Tag>);
      },
    },
    {
      title: <FormattedMessage id="app.agv.type" />,
      dataIndex: 'robotType',
      align: 'center',
    },
  ];

  async function onSubmit(values) {
    setBtnloading(true);
    let response;
    if (updateRow) {
      response = await updateMonitorAgvGroup({ ...updateRow, ...values });
    } else {
      response = await saveMonitorAgvGroup(values);
    }

    if (!dealResponse(response)) {
      message.success(formatMessage({ id: 'app.message.operateSuccess' }));
      cancelModal();
      getData();
    }
    setBtnloading(false);
  }

  function cancelModal() {
    setVisible(false);
    setUpdateRow(null);
    setSelectedRowKeys([]);
    setSelectedRow([]);
  }
  return (
    <TablePageWrapper>
      <div>
        <Row>
          <Col flex="auto" className={commonStyles.tableToolLeft}>
            <Button
              type="primary"
              onClick={() => {
                setVisible(true);
              }}
            >
              <PlusOutlined /> <FormattedMessage id="app.button.add" />
            </Button>
            <Button
              disabled={selectedRowKeys.length !== 1}
              onClick={() => {
                setVisible(true);
                setUpdateRow(selectedRow[0]);
              }}
            >
              <EditOutlined /> <FormattedMessage id="app.button.update" />
            </Button>
            <Button danger disabled={selectedRowKeys.length === 0} onClick={deleteHandle}>
              <DeleteOutlined /> <FormattedMessage id="app.button.delete" />
            </Button>
            <Button onClick={getData}>
              <ReloadOutlined /> <FormattedMessage id="app.button.refresh" />
            </Button>
          </Col>
        </Row>
      </div>
      <TableWidthPages
        bordered
        loading={loading}
        columns={columns}
        dataSource={agvGroupList}
        rowKey={({ id }) => id}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange,
        }}
        scroll={{ x: 'max-content' }}
      />
      <Modal
        visible={visible}
        onCancel={cancelModal}
        title={`${formatMessage({
          id: isNull(updateRow) ? 'app.button.add' : 'app.button.update',
        })}${formatMessage({ id: 'sourcemanage.podAssign' })}`}
        width={500}
        destroyOnClose
        footer={null}
      >
        <AddAgvgroupModal
          onSubmit={onSubmit}
          onCancel={cancelModal}
          updateRow={updateRow}
          dataSource={agvGroupList}
          loading={btnloading}
        />
      </Modal>
    </TablePageWrapper>
  );
};
export default memo(AgvGroup);
