/* TODO: I18N */
import React, { memo, useEffect, useState } from 'react';
import { Form, Input, Modal, Select, Switch } from 'antd';
import { connect } from '@/utils/RmsDva';
import { dealResponse, formatMessage, getFormLayout, isNull } from '@/utils/util';
import { saveQuickTask } from '@/services/smartTaskService';
import { find } from 'lodash';

const { formItemLayout } = getFormLayout(4, 18);

const QuickTaskFormModal = (props) => {
  const { dispatch, editing, taskModalVisible, quickTaskGroups, customTasks } = props;

  const [formRef] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (taskModalVisible) {
      // Modal显示时执行
      if (!isNull(editing)) {
        formRef.setFieldsValue({
          name: editing.name,
          desc: editing.desc,
          groupId: editing.groupId,
          taskCode: editing.taskCode,
          isNeedConfirm: editing.isNeedConfirm,
        });
      }
    } else {
      // Modal关闭时执行
      formRef.resetFields();
    }
  }, [taskModalVisible]);

  function onOk() {
    formRef.validateFields().then(async (value) => {
      setLoading(true);
      const targetCustomTask = find(customTasks, { code: value.taskCode });
      let requestParam = {
        ...value,
        variable: JSON.parse(targetCustomTask.sample),
      };
      if (!isNull(editing)) {
        requestParam = { ...editing, ...requestParam };
      }
      const response = await saveQuickTask(requestParam);
      if (!dealResponse(response, true)) {
        dispatch({ type: 'quickTask/getVisibleQuickTasks' });
        onCancel();
      }
      setLoading(false);
    });
  }

  function onCancel() {
    dispatch({
      type: 'quickTask/updateState',
      payload: {
        editing: null,
        taskModalVisible: false,
      },
    });
  }

  return (
    <Modal
      visible={taskModalVisible}
      title={'创建快捷任务'}
      width={600}
      maskClosable={false}
      closable={false}
      onOk={onOk}
      onCancel={onCancel}
      okButtonProps={{ loading }}
    >
      <Form labelWrap form={formRef} {...formItemLayout}>
        <Form.Item
          name={'name'}
          label={formatMessage({ id: 'app.common.name' })}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'app.common.description' })} name={'desc'}>
          <Input />
        </Form.Item>
        <Form.Item label={'所属组别'} name={'groupId'}>
          <Select>
            {quickTaskGroups.map(({ id, name }) => (
              <Select.Option key={id} value={id}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name={'taskCode'} label={'关联自定义任务'} rules={[{ required: true }]}>
          <Select>
            {customTasks.map(({ code, name }) => (
              <Select.Option key={code} value={code}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label={'确认操作'}
          name={'isNeedConfirm'}
          valuePropName={'checked'}
          initialValue={false}
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default connect(({ quickTask }) => ({
  editing: quickTask.editing,
  customTasks: quickTask.customTasks,
  quickTaskGroups: quickTask.quickTaskGroups,
  taskModalVisible: quickTask.taskModalVisible,
}))(memo(QuickTaskFormModal));
