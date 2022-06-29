/* TODO: I18N */
import React, { memo, useEffect, useState } from 'react';
import { Button, Form, Modal, Select, Space, Table, Tag } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { find, isEmpty } from 'lodash';
import { dealResponse, formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { saveResourceGroup } from '@/services/resourceService';

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
        <Button
          type={'link'}
          onClick={() => {
            removeFromGroup(record);
          }}
        >
          <FormattedMessage id={'app.button.remove'} />
        </Button>
      ),
    },
  ];

  const updateRef = React.useRef([]); // 更新组元素优先级
  const deletionRef = React.useRef([]); // 删除组元素

  const [loading, setLoading] = useState(false);
  const [selection, setSelection] = useState(null);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    if (!visible) {
      setSelection(null);
      setDataSource([]);
      resetRef();
    }
  }, [visible]);

  useEffect(() => {
    resetRef();
    if (selection) {
      const { priority } = find(groups, { code: selection });
      const _dataSource = Object.entries(priority).map(([id, item]) => ({ id, ...item })); // id, memberId, priority
      setDataSource(_dataSource);
    }
  }, [selection]);

  function resetRef() {
    updateRef.current = [];
    deletionRef.current = [];
  }

  function editPriority(record, priority) {
    const _dataSource = dataSource.map((item) => {
      if (item.id === record.id) {
        return { ...item, priority };
      }
      return item;
    });
    setDataSource(_dataSource);
    updateRef.current.push({ id: [record.id], priority });
  }

  function removeFromGroup(record) {
    const _dataSource = dataSource.filter((item) => item.id !== record.id);
    setDataSource(_dataSource);
    deletionRef.current.push(record);
  }

  async function confirm() {
    if (!isEmpty(deletionRef.current) || !isEmpty(updateRef.current)) {
      setLoading(true);
      const group = find(groups, { code: selection });
      // 先删除，在调整优先级
      if (!isEmpty(deletionRef.current)) {
        const deletedIds = deletionRef.current.map(({ id }) => id);
        group.members = group.members.filter((item) => !deletedIds.includes(item));
        deletedIds.forEach((id) => {
          delete group['priority'][id];
        });
      }

      if (!isEmpty(updateRef.current)) {
        updateRef.current.forEach(({ id, priority }) => {
          group['priority'][id] = priority;
        });
      }

      const response = await saveResourceGroup(group);
      if (!dealResponse(response, true)) {
        resetRef();
        onCancel(true);
      }
      setLoading(false);
    } else {
      onCancel();
    }
  }

  return (
    <Modal
      visible={visible}
      title={'资源组管理'}
      width={750}
      bodyStyle={{ maxHeight: '80vh', overflow: 'auto' }}
      maskClosable={false}
      onOk={confirm}
      okButtonProps={{
        loading,
        disabled: deletionRef.current.length === 0 && updateRef.current.length === 0,
      }}
      onCancel={onCancel}
    >
      <Form.Item label={formatMessage({ id: 'group.resourceGroup' })}>
        <Select style={{ width: 240 }} value={selection} onChange={setSelection}>
          {groups.map(({ code, groupName }) => (
            <Select.Option key={code} value={code}>
              {groupName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Table
        size={'small'}
        columns={columns}
        dataSource={dataSource}
        footer={null}
        pagination={false}
        rowKey={({ id }) => id}
      />
    </Modal>
  );
};
export default memo(GroupResourceModal);
