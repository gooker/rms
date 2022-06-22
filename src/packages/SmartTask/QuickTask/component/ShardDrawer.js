import React, { memo, useEffect, useRef, useState } from 'react';
import { Drawer, Form, List, Modal, Select } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { dealResponse, formatMessage } from '@/utils/util';
import style from '../quickTask.module.less';
import { saveQuickTask } from '@/services/smartTaskService';

const ShardDrawer = (props) => {
  const { dispatch, visible, sharedTasks, quickTaskGroups } = props;

  const tempRecord = useRef(null);
  const [formRef] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!visible) {
      tempRecord.current = null;
      formRef.resetFields();
    }
  }, [visible]);

  function clone() {
    formRef.validateFields().then(async ({ groupId }) => {
      const { name, desc, taskCode, variable, isNeedConfirm } = tempRecord.current;
      const newQuickTask = {
        name,
        desc,
        taskCode,
        variable,
        isNeedConfirm,
        isShared: false,
        groupId,
      };
      const response = await saveQuickTask(newQuickTask);
      if (!dealResponse(response)) {
        dispatch({ type: 'quickTask/getVisibleQuickTasks' });
        setModalVisible(false);
      }
    });
  }

  function renderItem(item) {
    return (
      <div className={style.drawerListItem}>
        <div>
          <span>{item.name}</span>
          <span>{`${formatMessage({ id: 'app.taskDetail.createUser' })}: ${
            item.createdByUser
          }`}</span>
        </div>
        <div>
          <CopyOutlined
            onClick={() => {
              tempRecord.current = item;
              setModalVisible(true);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <Drawer
        title='已分享的快捷任务'
        mask={false}
        placement='left'
        closable={false}
        maskClosable={false}
        getContainer={false}
        visible={visible}
        style={{ position: 'absolute' }}
      >
        <List itemLayout='horizontal' dataSource={sharedTasks} renderItem={renderItem} />
      </Drawer>

      <Modal
        title='克隆快捷任务'
        visible={modalVisible}
        onOk={clone}
        onCancel={() => {
          setModalVisible(false);
        }}
      >
        <Form form={formRef}>
          <Form.Item name={'groupId'} label={'分组'}>
            <Select>
              {quickTaskGroups.map(({ id, name }) => (
                <Select.Option key={id} value={id}>
                  {name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default connect(({ quickTask }) => ({
  sharedTasks: quickTask.sharedTasks,
  quickTaskGroups: quickTask.quickTaskGroups,
  visible: quickTask.shardTaskModalVisible,
}))(memo(ShardDrawer));
