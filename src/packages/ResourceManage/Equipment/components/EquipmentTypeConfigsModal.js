import React, { memo, useEffect } from 'react';
import { Form, Modal, Row, Col, AutoComplete, Input, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { getFormLayout, adaptModalHeight, formatMessage } from '@/utils/util';
import { forIn } from 'lodash';

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(5, 17);
const EquipmentTypeConfigsModal = (props) => {
  const { cancelModal, visible, onSubmit, data } = props;
  const [formRef] = Form.useForm();

  useEffect(() => {
    if (!visible) {
      formRef.resetFields();
    }
  }, [visible]);

  useEffect(() => {
    const configs = [];
    forIn(data?.keyValue, (value, key) => {
      configs.push({ key, value });
    });

    if (configs.length === 0) {
      configs.push({ key: null, value: null });
    }

    formRef.setFieldsValue({
      configs,
    });
  }, [data]);

  function submit() {
    formRef
      .validateFields()
      .then((values) => {
        const { configs } = values;
        const actionConfigurationsEntity = {};
        configs?.map(({ key, value }) => {
          actionConfigurationsEntity[key] = value;
        });
        onSubmit({ ...actionConfigurationsEntity });
      })
      .catch(() => {});
  }

  return (
    <Modal
      destroyOnClose
      visible={visible}
      title={formatMessage({ id: 'app.configInfo' })}
      maskClosable={false}
      onCancel={cancelModal}
      onOk={submit}
      bodyStyle={{ maxHeight: adaptModalHeight() * 0.9, overflow: 'auto' }}
    >
      <Form form={formRef} {...formItemLayout} labelWrap>
        <Form.List name={'configs'} initialValue={[{ key: null, value: null }]}>
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  {...(index === 0 ? formItemLayout : formItemLayoutNoLabel)}
                  label={index === 0 ? formatMessage({ id: 'device.configInfo' }) : ''}
                  key={field.key}
                >
                  <Row gutter={10}>
                    <Col span={9}>
                      <Form.Item noStyle {...field} name={[field.name, 'key']}>
                        <AutoComplete placeholder={'key'} />
                      </Form.Item>
                    </Col>
                    <Col span={11}>
                      <Form.Item noStyle {...field} name={[field.name, 'value']}>
                        <Input placeholder={'value'} />
                      </Form.Item>
                    </Col>
                    <Col span={4} style={{ textAlign: 'center' }}>
                      {fields.length > 1 ? (
                        <MinusCircleOutlined
                          onClick={() => remove(field.name)}
                          style={{ fontSize: 16 }}
                        />
                      ) : null}
                    </Col>
                  </Row>
                </Form.Item>
              ))}
              <Form.Item {...formItemLayoutNoLabel}>
                <Button type="dashed" onClick={() => add()} style={{ width: '60%' }}>
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
export default memo(EquipmentTypeConfigsModal);
