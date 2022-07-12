import React, { memo, useState } from 'react';
import { Button, Divider, Form, Modal, Popconfirm, Table, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { dealResponse, formatMessage, getRandomString } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import EditableCell from '@/packages/SmartTask/QuickTask/component/EditableCell';
import { deleteResourceGroup, saveResourceGroup } from '@/services/resourceService';

const GroupModal = (props) => {
  const { type, mapId, visible, onCancel, groups, onChange } = props;

  const [formRef] = Form.useForm();
  const [isAdding, setIsAdding] = useState(false); // 标记当前是否正在执行新增操作
  const [editingKey, setEditingKey] = useState('');

  const columns = [
    {
      title: formatMessage({ id: 'app.common.name' }),
      dataIndex: 'groupName',
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
            <Typography.Link onClick={() => save(record)}>
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
    return record.code === editingKey;
  }

  function addRow() {
    const record = { code: generateUniqueCode(), groupName: '', desc: '' };
    onChange([...groups, record]);
    setEditingKey('');
    setIsAdding(true);
    edit(record);
  }

  async function deleteRow({ id, code }) {
    const response = await deleteResourceGroup([code]);
    if (!dealResponse(response)) {
      const newData = [...groups].filter((item) => item.code !== code);
      onChange(newData);
    }
  }

  function edit(record) {
    formRef.setFieldsValue({
      groupName: '',
      desc: '',
      ...record,
    });
    setEditingKey(record.code);
  }

  const cancel = () => {
    if (isAdding) {
      const newData = [...groups].filter((item) => item.code !== editingKey);
      onChange(newData);
    } else {
      setEditingKey('');
    }
    setIsAdding(false);
  };

  const save = async ({ id, code }) => {
    try {
      const formValues = await formRef.validateFields();
      const newData = [...groups].filter((item) => item.code !== code);
      const response = await saveResourceGroup({
        mapId,
        code,
        id,
        groupType: type,
        groupName: formValues.groupName,
        desc: formValues.desc,
      });
      if (!dealResponse(response, true)) {
        newData.push({ ...response });
        onChange(newData);
      } else {
        return;
      }
      setEditingKey('');
      isAdding && setIsAdding(false);
    } catch (errInfo) {
      //
    }
  };

  function generateUniqueCode() {
    let code = getRandomString(10);
    const existCodes = groups.map(({ code }) => code);
    while (existCodes.includes(code)) {
      code = getRandomString(10);
    }
    return code;
  }

  return (
    <Modal
      visible={visible}
      title={formatMessage({ id: 'group.sourceManag.add' })}
      width={750}
      maskClosable={false}
      footer={null}
      onCancel={onCancel}
    >
      <Button type={'primary'} style={{ marginBottom: 8 }} onClick={addRow}>
        <PlusOutlined /> <FormattedMessage id={'app.button.add'} />
      </Button>
      <Form form={formRef} component={false}>
        <Table
          bordered
          rowKey={({ code }) => code}
          components={{
            body: { cell: EditableCell },
          }}
          columns={mergedColumns}
          dataSource={groups}
          pagination={false}
        />
      </Form>
    </Modal>
  );
};
export default memo(GroupModal);
