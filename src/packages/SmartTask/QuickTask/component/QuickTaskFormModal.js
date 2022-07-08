import React, { memo, useEffect, useState } from 'react';
import { Form, Input, Modal, Select, Switch } from 'antd';
import { connect } from '@/utils/RmsDva';
import { dealResponse, formatMessage, getFormLayout, isNull } from '@/utils/util';
import { saveQuickTask } from '@/services/smartTaskService';
import { find } from 'lodash';
import FormattedMessage from '@/components/FormattedMessage';

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
    formRef
      .validateFields()
      .then(async (value) => {
        setLoading(true);
        const targetCustomTask = find(customTasks, { code: value.taskCode });
        let requestParam = {
          ...value,
          variable: generateVariable(targetCustomTask),
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
      })
      .catch((err) => {
        console.log(err);
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
      title={formatMessage({ id: 'quickTask.create' })}
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
        <Form.Item label={<FormattedMessage id="quickTask.group.belongs" />} name={'groupId'}>
          <Select>
            {quickTaskGroups.map(({ id, name }) => (
              <Select.Option key={id} value={id}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name={'taskCode'}
          label={formatMessage({ id: 'quickTask.customtask.associated' })}
          rules={[{ required: true }]}
        >
          <Select>
            {customTasks.map(({ code, name }) => (
              <Select.Option key={code} value={code}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label={<FormattedMessage id="quickTask.operate.isConfirm" />}
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

function generateVariable({ codes, sample }) {
  const { sectionId, code, createCode, customStart, customAction, customEnd } = sample;
  const result = { sectionId, code, createCode, customStart: {}, customAction: {}, customEnd: {} };

  // 任务开始
  const { vehicle, vehicleLimit } = customStart;
  result.customStart.vehicle = {
    config: { visible: true, isRequired: true },
    value: vehicle,
  };
  result.customStart.vehicleLimit = {
    config: { visible: true, isRequired: false },
    value: vehicleLimit,
  };

  // 任务结束
  const { backZone, loadBackZone } = customEnd;
  result.customEnd.backZone = {
    config: { visible: true, isRequired: false },
    value: backZone,
  };
  result.customEnd.loadBackZone = {
    config: { visible: true, isRequired: false },
    value: loadBackZone,
  };

  // 子任务
  Object.entries(customAction).forEach(([step, stepConfig]) => {
    const codeIndex = Number.parseInt(step.replace('step', ''));
    result['customAction'][codes[codeIndex]] = {};
    Object.entries(stepConfig).forEach(([field, value]) => {
      result['customAction'][codes[codeIndex]][field] = {
        config: { visible: true, isRequired: false },
        value: value,
      };
    });
  });

  return result;
}
