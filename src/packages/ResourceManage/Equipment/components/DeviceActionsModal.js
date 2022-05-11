/* TODO: I18N */
import React, { memo, useEffect, useState } from 'react';
import {
  Form,
  Modal,
  Select,
  Row,
  Col,
  Input,
  Switch,
  InputNumber,
  Checkbox,
  Radio,
  Divider,
} from 'antd';
import { getFormLayout, adaptModalHeight } from '@/utils/util';
import { forIn, find } from 'lodash';
import FormattedMessage from '@/components/FormattedMessage';

const { formItemLayout } = getFormLayout(5, 17);
const DeviceActionsModal = (props) => {
  const { visible, deviceActions, onCancelModal, onSave, isEdit } = props;
  const [formRef] = Form.useForm();
  const [currentTypeAction, setCurrentTypeAction] = useState([]); //

  // useEffect(() => {
  //   if (!visible) {
  //     formRef.resetFields();
  //   }
  // }, [visible]);

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
        const currentOptions = find(deviceActionDefinitionList, (define) => define.key === key);
        deviceActionParamsDefinitionList.push({ ...currentOptions, key, value });
      });
      newDeviceActions.push({ ...currentActionParam, id, deviceActionParamsDefinitionList });
    });
    onSave(newDeviceActions);
    onCancelModal();
  }

  function renderFormItemContent(content) {
    const { type, options, isisabled } = content;

    if (type === 'ARRAY') {
      return <Select mode="tags" options={options} maxTagCount={4} />;
    }

    if (type === 'BOOL') {
      return <Switch />;
    }
    if (type === 'STRING') {
      return <Input disabled={!!isisabled} />;
    }

    if (type === 'NUMBER') {
      return <InputNumber min={1} />;
    }

    if (type === 'select') {
      return <Select options={options} />;
    }
    if (type === 'checkbox') {
      if (options.length === 0) {
        return <Checkbox />;
      }
      return <Checkbox.Group options={options} />;
    }
    if (type === 'radio') {
      return <Radio.Group options={options} />;
    }
  }

  function renderItem(keyid, record) {
    return record.map(
      ({ name: labelName, key: fieldName, isRequired, valueDataType: type, value }, index) => {
        const rules = [];
        if (isRequired) {
          rules.push({
            required: true,
          });
        }
        const param = { type };
        const valuePropName = type === 'BOOL' ? 'checked' : 'value';
        let defaultValue = type === 'BOOL' ? value ?? false : value;
        return (
          <Form.Item
            label={labelName}
            name={[keyid, fieldName]}
            key={`${keyid}-${index}-${fieldName}`}
            valuePropName={valuePropName}
            initialValue={defaultValue}
            rules={rules}
          >
            {renderFormItemContent(param)}
          </Form.Item>
        );
      },
    );
  }

  return (
    <Modal
      destroyOnClose
      visible={visible}
      title={'设备动作'}
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
                <Col span={22}>{renderItem(id, deviceActionParamsDefinitionList)}</Col>
              </Row>
            );
          })}
      </Form>
    </Modal>
  );
};
export default memo(DeviceActionsModal);
