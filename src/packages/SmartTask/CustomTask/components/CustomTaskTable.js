import React, { memo, useEffect, useState } from 'react';
import { connect } from '@/utils/RmsDva';
import { Button, message, Modal } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined, FileTextOutlined, RedoOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import { convertToUserTimezone, dealResponse, formatMessage, isNull } from '@/utils/util';
import { deleteCustomTasksById } from '@/services/api';
import RmsConfirm from '@/components/RmsConfirm';
import commonStyles from '@/common.module.less';
import styles from '../customTask.module.less';
import TaskBodyModal from './TaskBodyModal';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWithPages from '@/components/TableWithPages';

const messageKey = 'MESSAGE_KEY';

const CustomTaskTable = (props) => {
  const { dispatch, listVisible, listData, loading } = props;

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [exampleStructure, setExampleStructure] = useState(null); // 示例结构

  useEffect(() => {
    dispatch({ type: 'customTask/getCustomTaskList' });
  }, []);

  function viewRequestBody(record) {
    setExampleStructure(JSON.parse(record.sample));
  }

  const columns = [
    {
      title: <FormattedMessage id='app.common.code' />,
      align: 'center',
      dataIndex: 'code',
    },
    {
      title: <FormattedMessage id="app.common.name" />,
      align: 'center',
      dataIndex: 'name',
    },
    {
      title: <FormattedMessage id='app.common.priority' />,
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
      title: <FormattedMessage id="app.common.operation" />,
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

  const expandColumns = [
    {
      title: <FormattedMessage id='app.common.creationTime' />,
      align: 'center',
      dataIndex: 'createTime',
      render: (text) => convertToUserTimezone(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: <FormattedMessage id='app.common.updateTime' />,
      align: 'center',
      dataIndex: 'updateTime',
    },
    {
      title: <FormattedMessage id='app.common.updater' />,
      align: 'center',
      dataIndex: 'updatedByUser',
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
    RmsConfirm({
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
    // 去掉字符串中的转义符
    let copiedString = JSON.stringify(exampleStructure);
    copiedString = copiedString.replace(/\\"/g, '\'');

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
        <Button type='primary' onClick={gotoFormPage}>
          <FileTextOutlined /> <FormattedMessage id='app.task.state.New' />
        </Button>
        <Button disabled={selectedRowKeys.length === 0} onClick={deleteListItem}>
          <DeleteOutlined /> <FormattedMessage id='app.button.delete' />
        </Button>
        <Button onClick={refreshPage}>
          <RedoOutlined /> <FormattedMessage id='app.button.refresh' />
        </Button>
      </div>

      {/* 自定义任务列表 */}
      <TableWithPages
        bordered
        loading={loading}
        columns={columns}
        expandColumns={expandColumns}
        dataSource={listData}
        rowSelection={rowSelection}
        rowKey={(record) => record.id}
        pagination={null}
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
        style={{ top: 30 }}
        footer={[
          <Button
            key='back'
            onClick={() => {
              setExampleStructure(null);
            }}
          >
            <FormattedMessage id='app.button.turnOff' />
          </Button>,
          <Button key='copy' type='primary' onClick={copyTaskBody}>
            <FormattedMessage id='app.button.copy' />
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
