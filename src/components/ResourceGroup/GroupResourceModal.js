/* TODO: I18N */
import React, { memo, useEffect, useState } from 'react';
import { Button, Form, Modal, Select, Space, Table, Tag } from 'antd';
import { formatMessage } from '@/utils/util';
import { find } from 'lodash';
import FormattedMessage from '@/components/FormattedMessage';
import { EditOutlined } from '@ant-design/icons';

const GroupResourceModal = (props) => {
  const { visible, groups, onCancel } = props;

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.common.name' }),
      dataIndex: 'memberId',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.common.priority' }),
      dataIndex: 'priority',
      align: 'center',
      render: (text, record) => {
        return (
          <Space>
            <Tag color={'blue'}>{text}</Tag>
            <EditOutlined
              style={{ cursor: 'pointer' }}
              onClick={() => {
                editPriority(record);
              }}
            />
          </Space>
        );
      },
    },
    {
      title: formatMessage({ id: 'app.common.operation' }),
      align: 'center',
      render: (_, record) => (
        <Button type={'link'}>
          <FormattedMessage id={'app.button.delete'} />
        </Button>
      ),
    },
  ];
  const [selection, setSelection] = useState(null);

  useEffect(() => {
    if (!visible) {
      setSelection(null);
    }
  }, [visible]);

  function editPriority(record) {
    //
  }

  function generateDatasource() {
    if (selection) {
      const { priority } = find(groups, { code: selection });
      return Object.entries(priority).map(([id, item]) => ({ id, ...item })); // id, memberId, priority
    }
    return [];
  }

  function confirm() {
    //
  }

  return (
    <Modal
      visible={visible}
      title={'资源组管理'}
      width={750}
      bodyStyle={{ maxHeight: '80vh', overflow: 'auto' }}
      maskClosable={false}
      onOk={confirm}
      onCancel={onCancel}
    >
      <Form.Item label={formatMessage({ id: 'group.resourceGroup' })}>
        <Select style={{ width: 100 }} value={selection} onChange={setSelection}>
          {groups.map(({ code, groupName }) => (
            <Select.Option key={code} value={code}>
              {groupName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Table columns={columns} dataSource={generateDatasource()} footer={null} pagination={false} />
    </Modal>
  );
};
export default memo(GroupResourceModal);
