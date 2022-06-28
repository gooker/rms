import React, { memo, useEffect, useState } from 'react';
import { Form, Modal, Row, Col, Select, Input, Button, Switch } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { getFormLayout, adaptModalHeight, formatMessage, isStrictNull } from '@/utils/util';

const blockingTypeOption = [
  {
    label: 'NONE',
    value: 'NONE',
  },
  {
    label: 'SOFT',
    value: 'SOFT',
  },
  {
    label: 'HARD',
    value: 'HARD',
  },
];

export const ColResponsive = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 12,
  xxl: 8,
};

const { formItemLayout } = getFormLayout(7, 17);
const { formItemLayoutNoLabel } = getFormLayout(2, 17);
const EquipmentTypeActionsModal = (props) => {
  const { onCancel, visible, onSubmit, data } = props;
  const [formRef] = Form.useForm();
  const [reredner, setRerender] = useState({});

  useEffect(() => {
    if (!visible) {
      formRef.resetFields();
    }
  }, [visible]);

  function submit() {
    formRef
      .validateFields()
      .then((values) => {
        onSubmit(values);
      })
      .catch(() => {});
  }

  return (
    <Modal
      destroyOnClose
      visible={visible}
      title={formatMessage({ id: 'device.configureActions' })}
      maskClosable={false}
      onCancel={onCancel}
      onOk={submit}
      width={'60%'}
      bodyStyle={{ maxHeight: adaptModalHeight() * 0.9, overflow: 'auto' }}
    >
      <Form form={formRef}>
        <Form.Item hidden name={'deviceTypeCode'} initialValue={data?.deviceTypeCode}>
          <Input />
        </Form.Item>
        <Form.List
          name={'customDeviceActionList'}
          initialValue={data?.deviceActionList?.length === 0 ? [{}] : data?.deviceActionList}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Row
                  key={field.key}
                  gutter={10}
                  style={{ border: '1px solid #ededed', borderRadius: 5, padding: 5, margin: 12 }}
                >
                  <Col span={22}>
                    <Row>
                      <Form.Item
                        hidden
                        {...field}
                        name={[field.name, 'deviceTypeCode']}
                        initialValue={data?.deviceTypeCode}
                      >
                        <Input />
                      </Form.Item>
                      <Col {...ColResponsive}>
                        <Form.Item
                          {...formItemLayout}
                          label={formatMessage({ id: 'app.common.code' })}
                          {...field}
                          name={[field.name, 'code']}
                          getValueFromEvent={(e) => {
                            setRerender({});
                            return e.target.value;
                          }}
                          rules={[
                            { required: true },
                            {
                              validator: (_, values) => {
                                const { customDeviceActionList = [] } = formRef.getFieldsValue();
                                const allCodes = customDeviceActionList
                                  ?.filter((_, itemIndex) => itemIndex !== index)
                                  .map(({ code }) => !isStrictNull(code) && code);
                                if (allCodes.includes(values)) {
                                  return Promise.reject(
                                    new Error(formatMessage({ id: 'app.form.code.duplicate' })),
                                  );
                                }
                                return Promise.resolve();
                              },
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col {...ColResponsive}>
                        <Form.Item
                          {...formItemLayout}
                          label={formatMessage({ id: 'app.common.name' })}
                          {...field}
                          name={[field.name, 'name']}
                          rules={[{ required: true }]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col {...ColResponsive}>
                        <Form.Item
                          {...formItemLayout}
                          label={formatMessage({ id: 'device.autocomplete' })}
                          {...field}
                          name={[field.name, 'isAutoFinish']}
                          rules={[{ required: true }]}
                          valuePropName={'checked'}
                          initialValue={false}
                        >
                          <Switch />
                        </Form.Item>
                      </Col>
                      <Col {...ColResponsive}>
                        <Form.Item
                          {...formItemLayout}
                          {...formItemLayout}
                          label={formatMessage({ id: 'app.common.description' })}
                          {...field}
                          name={[field.name, 'desc']}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col {...ColResponsive}>
                        <Form.Item
                          label={formatMessage({ id: 'device.action.executionMode' })}
                          {...field}
                          name={[field.name, 'blockingType']}
                          rules={[{ required: true }]}
                        >
                          <Select options={blockingTypeOption} style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={2} style={{ textAlign: 'center' }}>
                    <MinusCircleOutlined
                      onClick={() => remove(field.name)}
                      style={{ fontSize: 16 }}
                    />
                  </Col>
                </Row>
              ))}
              <Form.Item {...formItemLayoutNoLabel}>
                <Button type="dashed" onClick={() => add()} style={{ width: '60%', marginTop: 10 }}>
                  <PlusOutlined />
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};
export default memo(EquipmentTypeActionsModal);
