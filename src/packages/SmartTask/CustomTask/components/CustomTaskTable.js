import React, { memo, useEffect, useState } from 'react';
import { connect } from '@/utils/RmsDva';
import { Button, Col, message, Modal, Row } from 'antd';
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FileTextOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import { convertToUserTimezone, dealResponse, formatMessage, isNull, renderLabel } from '@/utils/util';
import { deleteCustomTasksById } from '@/services/commonService';
import RmsConfirm from '@/components/RmsConfirm';
import TaskBodyModal from './TaskBodyModal';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWithPages from '@/components/TableWithPages';
import commonStyles from '@/common.module.less';
import styles from '../customTask.module.less';
import { IconFont } from '@/components/IconFont';
import CopyCustomTaskModal from '@/packages/SmartTask/CustomTask/components/CopyCustomTaskModal';

const CustomTaskTable = (props) => {
  const { dispatch, listVisible, listData, loading } = props;

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [copyVisible, setCopyVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [exampleStructure, setExampleStructure] = useState(null); // 请求体结构

  useEffect(() => {
    dispatch({ type: 'customTask/getCustomTaskList' });
  }, []);

  const columns = [
    {
      title: <FormattedMessage id="app.common.code" />,
      align: 'center',
      dataIndex: 'code',
    },
    {
      title: <FormattedMessage id='app.common.name' />,
      align: 'center',
      dataIndex: 'name',
      render: (text) => renderLabel(text),
    },
    {
      title: <FormattedMessage id="app.common.priority" />,
      align: 'center',
      dataIndex: 'priority',
    },
    {
      title: <FormattedMessage id="app.common.creator" />,
      align: 'center',
      dataIndex: 'createdByUser',
    },
    {
      title: <FormattedMessage id="app.common.operator" />,
      align: 'center',
      dataIndex: 'operator',
    },
    {
      title: <FormattedMessage id="customTasks.table.requestBody" />,
      align: 'center',
      fixed: 'right',
      render: (text, record) => (
        <span
          className={styles.tableIcon}
          onClick={() => {
            setExampleStructure(record.sample);
          }}
        >
          <IconFont type={'icon-json'} style={{ fontSize: 23 }} />
        </span>
      ),
    },
    {
      title: <FormattedMessage id="app.common.operation" />,
      align: 'center',
      fixed: 'right',
      render: (text, record) => (
        <Row justify={'center'} gutter={16}>
          <Col className={styles.tableIcon}>
            <EyeOutlined
              onClick={() => {
                editRow({ ...record, viewMode: true }); // 标记当前是查看模式
              }}
            />
          </Col>

          <Col className={styles.tableIcon}>
            <CopyOutlined
              onClick={() => {
                copy(record);
              }}
            />
          </Col>

          {/* 系统默认不支持编辑操作 */}
          {!record.readOnly && (
            <Col className={styles.tableIcon}>
              <EditOutlined
                onClick={() => {
                  editRow(record);
                }}
              />
            </Col>
          )}
        </Row>
      ),
    },
  ];

  const expandColumns = [
    {
      title: <FormattedMessage id="app.common.creationTime" />,
      align: 'center',
      dataIndex: 'createTime',
      render: (text) => convertToUserTimezone(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: <FormattedMessage id="app.common.updateTime" />,
      align: 'center',
      dataIndex: 'updateTime',
    },
    {
      title: <FormattedMessage id="app.common.updater" />,
      align: 'center',
      dataIndex: 'updatedByUser',
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (rowKeys) => setSelectedRowKeys(rowKeys),
    getCheckboxProps: (record) => ({
      disabled: record.readOnly,
    }),
  };

  function copy(record) {
    dispatch({
      type: 'customTask/saveEditingRow',
      payload: record,
    });
    setCopyVisible(true);
  }

  function deleteListItem() {
    RmsConfirm({
      content: formatMessage({ id: 'app.message.batchDelete.confirm' }),
      onOk: async () => {
        setDeleteLoading(true);
        const customListCodeMap = {};
        listData.forEach((item) => {
          customListCodeMap[item.code] = item;
        });
        const selectedIds = selectedRowKeys.map((item) => customListCodeMap[item].id);
        const response = await deleteCustomTasksById(selectedIds);
        if (!dealResponse(response)) {
          setSelectedRowKeys([]);
          refreshPage();
        }
        setDeleteLoading(false);
      },
    });
  }

  function refreshPage() {
    dispatch({ type: 'customTask/getCustomTaskList' });
  }

  function gotoFormPage() {
    dispatch({
      type: 'customTask/saveListVisible',
      payload: !listVisible,
    });
  }

  function editRow(rowData) {
    dispatch({
      type: 'customTask/saveEditingRow',
      payload: rowData,
    });
    gotoFormPage();
  }

  function copyTaskBody() {
    // 去掉字符串中的转义符
    let copiedString = JSON.stringify(exampleStructure);
    copiedString = copiedString.replace(/\\"/g, "'");

    if (navigator.clipboard === undefined) {
      message.warn(formatMessage({ id: 'app.global.browser.clipboardNotSupport' }));
      return;
    }

    navigator.clipboard
      .writeText(copiedString)
      .then(() => {
        message.success(formatMessage({ id: 'app.message.copy.successfully' }));
      })
      .catch((err) => {
        console.log(`Copy Body: ${err.message}`);
      });
  }

  return (
    <TablePageWrapper>
      <div className={commonStyles.tableToolLeft}>
        <Button type="primary" onClick={gotoFormPage}>
          <FileTextOutlined /> <FormattedMessage id="app.task.state.New" />
        </Button>
        <Button danger disabled={selectedRowKeys.length === 0} onClick={deleteListItem}>
          <DeleteOutlined /> <FormattedMessage id="app.button.delete" />
        </Button>
        <Button onClick={refreshPage}>
          <RedoOutlined /> <FormattedMessage id="app.button.refresh" />
        </Button>
      </div>

      {/* 自定义任务列表 */}
      <TableWithPages
        bordered
        loading={loading || deleteLoading}
        columns={columns}
        expandColumns={expandColumns}
        dataSource={listData}
        rowSelection={rowSelection}
        rowKey={({ code }) => code}
        pagination={null}
      />

      {/* 复制自定义任务 */}
      <CopyCustomTaskModal
        visible={copyVisible}
        onCancel={() => {
          setCopyVisible(false);
        }}
      />

      {/* 任务数据结构预览 */}
      <Modal
        destroyOnClose
        visible={!isNull(exampleStructure)}
        width={600}
        title={formatMessage({ id: 'customTasks.requestBodyDemo' })}
        onCancel={() => {
          setExampleStructure(null);
        }}
        bodyStyle={{ maxHeight: '80vh', overflow: 'auto' }}
        style={{ top: 30 }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setExampleStructure(null);
            }}
          >
            <FormattedMessage id="app.button.turnOff" />
          </Button>,
          <Button key="copy" type="primary" onClick={copyTaskBody}>
            <FormattedMessage id="app.button.copy" />
          </Button>,
        ]}
      >
        <TaskBodyModal data={exampleStructure} />
      </Modal>
    </TablePageWrapper>
  );
};
export default connect(({ customTask, loading }) => ({
  loading: loading.effects['customTask/getCustomTaskList'],
  listVisible: customTask.listVisible,
  listData: customTask.customTaskList,
}))(memo(CustomTaskTable));
