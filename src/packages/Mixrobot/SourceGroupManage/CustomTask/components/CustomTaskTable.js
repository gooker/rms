import React, { memo, useState, useEffect } from 'react';
import { connect } from '@/utils/dva';
import { Table, Button, Modal, message, Row, Col } from 'antd';
import {
  FileTextOutlined,
  EyeOutlined,
  RedoOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import {
  dateFormat,
  dealResponse,
  adaptModalWidth,
  adaptModalHeight,
  isNull,
  formatMessage,
} from '@/utils/utils';
import { deleteCustomTasksById } from '@/services/api';
import RcsConfirm from '@/components/RcsConfirm';
import commonStyles from '@/common.module.less';
import styles from '../customTask.module.less';
import TaskBodyModal from './TaskBodyModal';

const messageKey = 'MESSAGE_KEY';

const CustomTaskTable = (props) => {
  const { dispatch, listVisible, listData } = props;

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [exampleStructure, setExampleStructure] = useState(null); // 示例结构

  useEffect(() => {
    dispatch({ type: 'customTask/getCustomTaskList' });
  }, []);

  function viewRequestBody(record) {
    const _taskView = JSON.parse(record.sample);
    _taskView.name = record.name;
    _taskView.dependencies = [];
    setExampleStructure(_taskView);
  }

  const columns = [
    {
      title: formatMessage({ id: 'customTasks.table.taskCode' }),
      align: 'center',
      dataIndex: 'code',
    },
    {
      title: formatMessage({ id: 'app.common.name' }),
      align: 'center',
      dataIndex: 'name',
    },
    {
      title: formatMessage({ id: 'app.taskQueue.priority' }),
      align: 'center',
      dataIndex: 'priority',
    },
    {
      title: formatMessage({ id: 'app.common.creationTime' }),
      align: 'center',
      dataIndex: 'createTime',
      render: (text) => dateFormat(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: formatMessage({ id: 'app.common.creator' }),
      align: 'center',
      dataIndex: 'createdByUser',
    },
    {
      title: formatMessage({ id: 'app.common.updateTime' }),
      align: 'center',
      dataIndex: 'updateTime',
    },
    {
      title: formatMessage({ id: 'app.common.updater' }),
      align: 'center',
      dataIndex: 'updatedByUser',
    },
    {
      title: formatMessage({ id: 'app.common.operator' }),
      align: 'center',
      dataIndex: 'operator',
    },
    {
      title: formatMessage({ id: 'customTasks.table.requestBody' }),
      with: 80,
      align: 'center',
      fixed: 'right',
      render: (text, record) => (
        <span className={styles.tableIcon}>
          <EyeOutlined
            onClick={() => {
              viewRequestBody(record);
            }}
          />
        </span>
      ),
    },
    {
      title: formatMessage({ id: 'app.common.operation' }),
      with: 80,
      align: 'center',
      fixed: 'right',
      render: (text, record) => (
        <span className={styles.tableIcon}>
          <EditOutlined
            onClick={() => {
              editRow(record);
            }}
          />
        </span>
      ),
    },
  ];

  // 切换删除Loading状态
  function switchDeleteSpin(visible, isSuccess) {
    if (visible) {
      message.loading({
        content: formatMessage({ id: 'customTasks.requesting' }),
        key: messageKey,
        duration: 0,
      });
    } else {
      if (isSuccess) {
        message.success({
          content: formatMessage({ id: 'customTasks.delete.success' }),
          key: messageKey,
          duration: 2,
        });
      } else {
        message.error({
          content: formatMessage({ id: 'customTasks.delete.failed' }),
          key: messageKey,
          duration: 2,
        });
      }
    }
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: (rowKeys) => setSelectedRowKeys(rowKeys),
  };

  function deleteListItem() {
    RcsConfirm({
      content: formatMessage({ id: 'customTasks.deleteList.confirm' }),
      onOk: async () => {
        switchDeleteSpin(true);
        const response = await deleteCustomTasksById(selectedRowKeys);
        switchDeleteSpin(false, !dealResponse(response));
        dispatch({ type: 'customTask/getCustomTaskList' });
        setSelectedRowKeys([]);
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
    const input = document.createElement('input');
    input.setAttribute('readonly', 'readonly');

    // 去掉字符串中的转义符
    let inputValue = JSON.stringify(exampleStructure);
    inputValue = inputValue.replace(/\\"/g, "'");

    input.setAttribute('value', inputValue);
    document.body.appendChild(input);
    input.setSelectionRange(0, 99999);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    message.success(formatMessage({ id: 'app.message.copy.successfully' }));
  }

  return (
    <div className={commonStyles.globalPageStyle}>
      <Row className={commonStyles.mb20}>
        <Col flex="auto" className={commonStyles.tableToolLeft}>
          <Button type="primary" onClick={gotoFormPage}>
            <FileTextOutlined /> <FormattedMessage id="app.task.state.New" />
          </Button>
          <Button disabled={selectedRowKeys.length === 0} onClick={deleteListItem}>
            <DeleteOutlined /> <FormattedMessage id="app.button.delete" />
          </Button>
          <Button onClick={refreshPage}>
            <RedoOutlined /> <FormattedMessage id="app.button.refresh" />
          </Button>
        </Col>
      </Row>

      {/* 自定义任务列表 */}
      <Table
        bordered
        columns={columns}
        dataSource={listData}
        rowSelection={rowSelection}
        rowKey={(record) => record.id}
        pagination={null}
        scroll={{ x: 'max-content' }}
      />

      {/* 任务数据结构预览 */}
      <Modal
        destroyOnClose
        visible={!isNull(exampleStructure)}
        width={adaptModalWidth() + 100}
        title={formatMessage({ id: 'customTasks.requestBodyDemo' })}
        onCancel={() => {
          setExampleStructure(null);
        }}
        style={{ top: 30 }}
        bodyStyle={{ height: Math.ceil(adaptModalHeight()) - 25, overflow: 'auto' }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setExampleStructure(null);
            }}
          >
            <FormattedMessage id="app.button.close" />
          </Button>,
          <Button key="copy" type="primary" onClick={copyTaskBody}>
            <FormattedMessage id="app.button.copy" />
          </Button>,
        ]}
      >
        <TaskBodyModal data={exampleStructure} />
      </Modal>
    </div>
  );
};
export default connect(({ customTask }) => ({
  listVisible: customTask.listVisible,
  listData: customTask.customTaskList,
}))(memo(CustomTaskTable));
