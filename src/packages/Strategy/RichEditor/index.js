import React, { memo, useState, useEffect } from 'react';
import { Row, Col, Button, message, Divider } from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { getAllRichText, saveRichText, deleteByRichIds } from '@/services/api';
import RichEditorFormModal from './component/RichEditorFormModal';
import RichEditorDetailModal from './component/RichEditorDetailModal';
import { dealResponse, formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import RmsConfirm from '@/components/RmsConfirm';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWithPages from '@/components/TableWithPages';
import commonStyles from '@/common.module.less';
import styles from './index.module.less';

/**
 * Web Hook每个类型只能配置一个URL，所以需要做
 */
const RichEditor = () => {
  const [loading, setLoading] = useState(false);
  const [webHooks, setWebHooks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailsModalVisible, setDetailModalVisible] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const ls = [
    {
      type: 'zh-CN',
      content: '',
    },
    {
      type: 'en-US',
      content: '',
    },
    {
      type: 'ko-KR',
      content: '',
    },
    {
      type: 'vi-VN',
      content: '',
    },
  ];
  const [richContent, setRichContent] = useState(ls);

  useEffect(() => {
    async function init() {
      await refresh();
    }
    init();
  }, []);

  async function refresh() {
    setLoading(true);
    const response = await getAllRichText();
    if (!dealResponse(response)) {
      setWebHooks(response);
    }
    setLoading(false);

    setSelectedRowKeys([]);
  }

  // 编辑
  function editRow(row) {
    setEditingRow(row);
    openModal();
  }

  // see details
  function deatilRow(row) {
    setEditingRow(row);
    openDetailModal();
  }

  //提交
  function submit(webhook) {
    let requestBody = { ...webhook };
    if (editingRow) {
      requestBody = { ...editingRow, ...webhook };
    }
    saveRichText(requestBody).then((response) => {
      if (dealResponse(response)) {
        message.error(formatMessage({ id: 'app.message.operateFailed' }));
      } else {
        message.success(formatMessage({ id: 'app.message.operateSuccess' }));
        refresh();
        setEditingRow(null);
        setRichContent(ls);
        setModalVisible(false);
      }
    });
  }

  // 删除
  function deleteRich() {
    RmsConfirm({
      content: formatMessage({ id: 'app.maproute.tip.confirmDelete' }),
      okType: 'danger',
      onOk() {
        message.loading({ content: 'Loading...' });
        deleteByRichIds(selectedRowKeys).then((response) => {
          if (dealResponse(response)) {
            message.error({
              content: formatMessage({ id: 'app.requestor.tip.delete.failed' }),
            });
          } else {
            message.success({
              content: formatMessage({ id: 'app.requestor.tip.delete.success' }),
            });
            refresh();
          }
        });
      },
    });
  }

  //打开编辑模态框
  function openModal() {
    setModalVisible(true);
  }

  //打开查看详情模态框
  function openDetailModal() {
    setDetailModalVisible(true);
  }

  const tableColumn = [
    {
      title: <FormattedMessage id='app.common.code' />,
      dataIndex: 'errorCode',
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
    {
      title: <FormattedMessage id="app.common.operation" />,
      align: 'center',
      fixed: 'right',
      render: (text, record) => (
        <>
          <span className={styles.tableIcon}>
            <EditOutlined
              onClick={() => {
                editRow(record);
              }}
            />
          </span>
          <Divider type="vertical" />
          <span className={styles.tableIcon}>
            <EyeOutlined
              onClick={() => {
                deatilRow(record);
              }}
            />
          </span>
        </>
      ),
    },
  ];

  function onSelectChange(_selectedRowKeys) {
    setSelectedRowKeys(_selectedRowKeys);
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <TablePageWrapper>
      <Row style={{ display: 'flex', padding: '0 0 20px 0' }}>
        <Col flex="auto" className={commonStyles.tableToolLeft}>
          <Button
            type="primary"
            onClick={() => {
              setEditingRow(null);
              openModal();
            }}
          >
            <FormattedMessage id="app.button.add" />
          </Button>
          <Button danger disabled={selectedRowKeys.length === 0} onClick={deleteRich}>
            <FormattedMessage id="app.button.delete" />
          </Button>
          <Button onClick={refresh}>
            <FormattedMessage id="app.button.refresh" />
          </Button>
        </Col>
      </Row>
      <TableWithPages
        bordered
        loading={loading}
        rowSelection={rowSelection}
        dataSource={webHooks}
        columns={tableColumn}
        pagination={null}
        rowKey={(record) => record.id}
        scroll={{ x: 'max-content' }}
      />

      {modalVisible && (
        <RichEditorFormModal
          data={editingRow ? editingRow : { languageAndContent: richContent }}
          webHooks={webHooks}
          visible={modalVisible}
          onSubmit={submit}
          onClose={() => {
            setModalVisible(false);
            setRichContent(ls);
          }}
        />
      )}

      {detailsModalVisible && (
        <RichEditorDetailModal
          visible={detailsModalVisible}
          data={editingRow}
          onClose={() => {
            setDetailModalVisible(false);
          }}
        />
      )}
    </TablePageWrapper>
  );
};
export default memo(RichEditor);
