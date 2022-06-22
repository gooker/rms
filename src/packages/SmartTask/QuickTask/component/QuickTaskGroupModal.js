import React, { memo, useEffect, useState } from 'react';
import { Button, Divider, Form, Modal, Popconfirm, Table, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { dealResponse, formatMessage, getRandomString } from '@/utils/util';
import { deleteQuickTaskGroup, saveQuickTaskGroup } from '@/services/smartTaskService';
import FormattedMessage from '@/components/FormattedMessage';
import EditableCell from './EditableCell';

const QuickTaskGroupModal = (props) => {
  const { dispatch, quickTaskGroups, groupModalVisible } = props;

  const [formRef] = Form.useForm();
  const [isAdding, setIsAdding] = useState(false); // 标记当前是否正在执行新增操作
  const [editingKey, setEditingKey] = useState('');

  useEffect(() => {
    if (!groupModalVisible) {
      setEditingKey('');
    }
  }, [groupModalVisible]);

  const columns = [
    {
      title: formatMessage({ id: 'app.common.name' }),
      dataIndex: 'name',
      align: 'center',
      editable: true,
    },
    {
      title: formatMessage({ id: 'app.common.description' }),
      dataIndex: 'desc',
      align: 'center',
      editable: true,
    },
    {
      title: formatMessage({ id: 'app.common.operation' }),
      align: 'center',
      width: 200,
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <>
            <Typography.Link onClick={() => save(record.id)}>
              <FormattedMessage id={'app.button.confirm'} />
            </Typography.Link>
            <Divider type={'vertical'} />
            <Typography.Link onClick={cancel}>
              <FormattedMessage id={'app.button.cancel'} />
            </Typography.Link>
          </>
        ) : (
          <>
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
              <FormattedMessage id={'app.button.edit'} />
            </Typography.Link>
            <Divider type={'vertical'} />
            <Popconfirm
              title={formatMessage({ id: 'app.message.delete.confirm' })}
              onConfirm={() => deleteRow(record)}
            >
              <Typography.Link>
                <FormattedMessage id={'app.button.delete'} />
              </Typography.Link>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  function isEditing(record) {
    return record.id === editingKey;
  }

  async function deleteRow(record) {
    const response = await deleteQuickTaskGroup([record.id]);
    if (!dealResponse(response, true)) {
      let newData = [...quickTaskGroups];
      newData = newData.filter((item) => item !== record);
      dispatch({ type: 'quickTask/updateQuickTaskGroups', payload: newData });
    }
  }

  function edit(record) {
    formRef.setFieldsValue({
      name: '',
      desc: '',
      ...record,
    });
    setEditingKey(record.id);
  }

  const cancel = () => {
    if (isAdding) {
      let newData = [...quickTaskGroups];
      newData = newData.filter((item) => item.id !== editingKey);
      dispatch({ type: 'quickTask/updateQuickTaskGroups', payload: newData });
    } else {
      setEditingKey('');
    }
    setIsAdding(false);
  };

  const save = async (id) => {
    try {
      const row = await formRef.validateFields();
      const newData = [...quickTaskGroups];
      const index = newData.findIndex((item) => id === item.id);
      const item = newData[index];
      const response = await saveQuickTaskGroup({ name: row.name, desc: row.desc });
      if (!dealResponse(response, true)) {
        newData.splice(index, 1, { ...item, ...row, id: response });
      } else {
        return;
      }
      dispatch({ type: 'quickTask/updateQuickTaskGroups', payload: newData });
      setEditingKey('');
      isAdding && setIsAdding(false);
    } catch (errInfo) {
      //
    }
  };

  function addRow() {
    const newData = [...quickTaskGroups];
    const record = { id: getRandomString(10), name: '', desc: '' };
    newData.push(record);
    dispatch({ type: 'quickTask/updateQuickTaskGroups', payload: newData });
    setEditingKey('');
    setIsAdding(true);
    edit(record);
  }

  function submit() {
    //
  }

  return (
    <Modal
      visible={groupModalVisible}
      title={'创建任务组'}
      width={750}
      maskClosable={false}
      footer={null}
      onOk={submit}
      onCancel={() => {
        dispatch({ type: 'quickTask/updateGroupModalVisible', payload: false });
      }}
    >
      <Button type={'primary'} style={{ marginBottom: 8 }} onClick={addRow}>
        <PlusOutlined /> <FormattedMessage id={'app.button.add'} />
      </Button>
      <Form form={formRef} component={false}>
        <Table
          bordered
          rowKey={({ id }) => id}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          columns={mergedColumns}
          dataSource={quickTaskGroups}
          pagination={false}
        />
      </Form>
    </Modal>
  );
};
export default connect(({ quickTask }) => ({
  quickTaskGroups: quickTask.quickTaskGroups,
  groupModalVisible: quickTask.groupModalVisible,
}))(memo(QuickTaskGroupModal));
