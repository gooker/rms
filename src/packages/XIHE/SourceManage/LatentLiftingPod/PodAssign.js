import React, { memo, useEffect, useState } from 'react';
import { Row, Col, Button, Tag, Modal, message } from 'antd';
import { DeleteOutlined, ReloadOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWidthPages from '@/components/TableWidthPages';
import FormattedMessage from '@/components/FormattedMessage';
import AddPodAssignModal from './components/AddPodAssignModal';
import { fetchPodAssignData, savePodAssign, batchDeletePodAssign } from '@/services/api';
import { formatMessage, dealResponse, isNull } from '@/utils/utils';
import commonStyles from '@/common.module.less';
import RmsConfirm from '@/components/RmsConfirm';

const PodAssign = () => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [podAssignList, setPodAssignList] = useState([]);
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
    const response = await fetchPodAssignData();
    if (!dealResponse(response)) {
      setPodAssignList(response);
    }
    setLoading(false);
  }

  function deleteHandle() {
    RmsConfirm({
      content: formatMessage({ id: 'app.message.batchDelete.confirm' }),
      onOk: async () => {
        const res = await batchDeletePodAssign(selectedRowKeys);
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
      title: <FormattedMessage id="app.agv" />,
      dataIndex: 'robotIds',
      align: 'center',
      render(text) {
        return text?.map((item, index) => <Tag key={index}>{item}</Tag>);
      },
    },
    {
      title: formatMessage({ id: 'app.common.type' }),
      dataIndex: 'robotTypes',
      key: 'robotTypes',
      render(text) {
        return text?.map((item, index) => <Tag key={index}>{item}</Tag>);
      },
    },
    {
      title: <FormattedMessage id="sourcemanage.pod.length.bd" />,
      dataIndex: 'podLength',
      align: 'center',
    },
    {
      title: <FormattedMessage id="sourcemanage.pod.length.ac" />,
      dataIndex: 'podWidth',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.common.creator" />,
      dataIndex: 'createdByUser',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.common.creationTime" />,
      dataIndex: 'createTime',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.common.updater" />,
      dataIndex: 'updatedByUser',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.common.updateTime" />,
      dataIndex: 'updateTime',
      align: 'center',
    },
  ];

  async function onSubmit(values) {
    let _values = {
      ...values,
      sectionId: window.localStorage.getItem('sectionId'),
    };
    if (updateRow) {
      _values = { ...selectedRow[0], ..._values };
    }

    const response = await savePodAssign(_values);
    if (!dealResponse(response)) {
      message.success(formatMessage({ id: 'app.message.operateSuccess' }));
      cancelModal();
      getData();
    }
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
        dataSource={podAssignList}
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
        <AddPodAssignModal onSubmit={onSubmit} onCancel={cancelModal} updateRow={updateRow} />
      </Modal>
    </TablePageWrapper>
  );
};
export default memo(PodAssign);
