/* TODO: I18N */
import React, { memo, useState } from 'react';
import { Form, InputNumber, Modal } from 'antd';
import { cloneDeep, isEmpty } from 'lodash';
import { connect } from '@/utils/RmsDva';
import { dealResponse } from '@/utils/util';
import VehicleVariable from './VehicleVariable';
import TargetVariable from './TargetVariable';
import { executeCustomTask } from '@/services/commonService';

const ExecuteQuickTaskModal = (props) => {
  const { dispatch, editing, executeModalVisible } = props;

  const [formRef] = Form.useForm();
  const [loading, setLoading] = useState(false);

  function onOk() {
    formRef.validateFields().then(async (value) => {
      setLoading(true);
      const variable = cloneDeep(editing.variable);
      const newParams = {};
      Object.entries(value).forEach(([code, param]) => {
        newParams[code] = param;
      });
      variable.customParams.forEach((item) => {
        if (newParams[item.code]) {
          item.param = newParams[item.code].code;
        }
      });
      const response = await executeCustomTask(variable);
      if (!dealResponse(response, true)) {
        dispatch({ type: 'quickTask/updateExecuteModalVisible', payload: false });
      }
      setLoading(false);
    });
  }

  function onCancel() {
    dispatch({
      type: 'quickTask/updateState',
      payload: {
        editing: null,
        executeModalVisible: false,
      },
    });
  }

  // 这里需要编辑的变量：选车、目标点、载具角度。这个逻辑与自定义任务相关逻辑强绑定，如果自定义任务相关逻辑发生变化，这里也要同步更新
  function renderFormItems() {
    let vehicleSelection;
    if (Array.isArray(editing?.variable?.customParams)) {
      // 只取param为空的字段
      const emptyParams = editing.variable.customParams.filter((item) => isEmpty(item.param));
      return emptyParams
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
      visible={executeModalVisible}
      title={'执行快捷任务'}
      width={600}
      maskClosable={false}
      closable={false}
      onOk={onOk}
      okText={'执行'}
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
  executeModalVisible: quickTask.executeModalVisible,
}))(memo(ExecuteQuickTaskModal));
