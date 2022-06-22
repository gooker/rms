/* TODO: I18N */
import React, { memo, useState } from 'react';
import { Form, InputNumber, Modal } from 'antd';
import { connect } from '@/utils/RmsDva';
import TargetVariable from './TargetVariable';
import VehicleVariable from './VehicleVariable';
import { saveQuickTask } from '@/services/smartTaskService';
import { dealResponse } from '@/utils/util';

const VariableModificationModal = (props) => {
  const { dispatch, editing, variableModalVisible } = props;

  const [formRef] = Form.useForm();
  const [loading, setLoading] = useState(false);

  function onOk() {
    formRef.validateFields().then(async (value) => {
      const quickTask = { ...editing };
      quickTask.variable = { ...quickTask.variable, customParams: [] };
      Object.entries(value).forEach(([code, value]) => {
        quickTask.variable.customParams.push({
          code,
          param: value.code,
        });
      });
      setLoading(true);
      const response = await saveQuickTask(quickTask);
      if (!dealResponse(response, true)) {
        dispatch({ type: 'quickTask/getVisibleQuickTasks' });
        dispatch({ type: 'quickTask/updateVariableModalVisible', payload: false });
      }
      setLoading(false);
    });
  }

  function onCancel() {
    dispatch({
      type: 'quickTask/updateState',
      payload: {
        editing: null,
        variableModalVisible: false,
      },
    });
  }

  // 这里需要编辑的变量：选车、目标点、载具角度。这个逻辑与自定义任务相关逻辑强绑定，如果自定义任务相关逻辑发生变化，这里也要同步更新
  function renderFormItems() {
    let vehicleSelection;
    if (Array.isArray(editing?.variable?.customParams)) {
      return editing.variable.customParams
        .map(({ code, param }, index) => {
          if (code.startsWith('START')) {
            vehicleSelection = code.split('-')[1];
            if (code === 'START-AUTO') {
              return null;
            }
            return (
              <Form.Item
                key={index}
                name={code}
                label={code}
                initialValue={{ type: code.split('-')[1], code: param }}
              >
                <VehicleVariable />
              </Form.Item>
            );
          } else if (code.endsWith('-loadAngle')) {
            return (
              <Form.Item key={index} name={code} label={code} initialValue={param}>
                <InputNumber addonAfter='°' />
              </Form.Item>
            );
          } else {
            return (
              <Form.Item
                key={index}
                name={code}
                label={code}
                initialValue={{
                  type: code.split('-')[1],
                  code: param,
                }}
              >
                <TargetVariable vehicleSelection={vehicleSelection} />
              </Form.Item>
            );
          }
        })
        .filter(Boolean);
    }
    return null;
  }

  return (
    <Modal
      visible={variableModalVisible}
      title={'编辑任务变量'}
      width={600}
      maskClosable={false}
      closable={false}
      onOk={onOk}
      onCancel={onCancel}
      okButtonProps={{ loading }}
    >
      <Form layout={'vertical'} form={formRef}>
        {renderFormItems()}
      </Form>
    </Modal>
  );
};
export default connect(({ quickTask }) => ({
  editing: quickTask.editing,
  variableModalVisible: quickTask.variableModalVisible,
}))(memo(VariableModificationModal));
