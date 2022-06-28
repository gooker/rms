import React, { memo, useEffect, useState } from 'react';
import { Form, Modal, Row, Col, Divider } from 'antd';
import { getFormLayout, adaptModalHeight, formatMessage } from '@/utils/util';
import { forIn, find } from 'lodash';
import { renderFormItemContent } from './equipUtils';
import FormattedMessage from '@/components/FormattedMessage';

const { formItemLayout } = getFormLayout(5, 17);
const DeviceActionsModal = (props) => {
  const { visible, deviceActions, onCancelModal, onSave, isEdit } = props;
  const [formRef] = Form.useForm();
  const [currentTypeAction, setCurrentTypeAction] = useState([]); //

  useEffect(() => {
    setCurrentTypeAction(deviceActions);
  }, [deviceActions]);

  function onSubmit() {
    formRef
      .validateFields()
      .then((values) => {
        generateDefinitions(values);
      })
      .catch(() => {});
  }

  function generateDefinitions(param) {
    const newDeviceActions = [];
    Object.keys(param).forEach((id) => {
      const items = param[id];
      const currentActionParam = find(currentTypeAction, (param) => {
        return param.id === id;
      });
      const deviceActionDefinitionList = currentActionParam.deviceActionParamsDefinitionList;
      const deviceActionParamsDefinitionList = [];
      forIn(items, (value, key) => {
        const currentOptions = find(deviceActionDefinitionList, (define) => define.code === key);
        deviceActionParamsDefinitionList.push({ ...currentOptions, value });
      });
      newDeviceActions.push({ ...currentActionParam, id, deviceActionParamsDefinitionList });
    });
    onSave(newDeviceActions);
    onCancelModal();
  }

  function renderItem(keyid, record) {
    return record.map(({ name, code, isOptional, valueDataType: type, value }, index) => {
      const valuePropName = type === 'BOOL' ? 'checked' : 'value';
      let defaultValue = type === 'BOOL' ? JSON.parse(value) ?? false : value;
      return (
        <Form.Item
          label={name}
          name={[keyid, code]}
          key={`${keyid}-${index}-${code}`}
          valuePropName={valuePropName}
          initialValue={defaultValue}
          rules={[{ required: isOptional === false }]}
        >
          {renderFormItemContent({ type })}
        </Form.Item>
      );
    });
  }

  return (
    <Modal
      destroyOnClose
      visible={visible}
      title={formatMessage({ id: 'device.action' })}
      maskClosable={false}
      onCancel={onCancelModal}
      okText={
        isEdit ? (
          <FormattedMessage id="app.button.submit" />
        ) : (
          <FormattedMessage id="app.button.confirm" />
        )
      }
      onOk={onSubmit}
      bodyStyle={{ maxHeight: adaptModalHeight() * 0.9, overflow: 'auto' }}
    >
      <Form form={formRef} {...formItemLayout} labelWrap>
        {/* 设备动作 */}
        {currentTypeAction?.length > 0 &&
          currentTypeAction.map(({ id, name, deviceActionParamsDefinitionList }) => {
            return (
              <Row
                key={name}
                style={{
                  border: '1px solid #e0dcdc',
                  padding: '10px',
                  borderRadius: '5px',
                  marginBottom: '20px',
                  marginLeft: 20,
                }}
              >
                <Divider orientation="left">{name}</Divider>
                <Col span={22} key={id}>
                  {renderItem(id, deviceActionParamsDefinitionList)}
                </Col>
              </Row>
            );
          })}
      </Form>
    </Modal>
  );
};
export default memo(DeviceActionsModal);
