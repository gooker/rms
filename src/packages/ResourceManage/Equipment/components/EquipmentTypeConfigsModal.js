/* TODO: I18N */
import React, { memo, useEffect } from 'react';
import { Form, Modal, Row, Col, AutoComplete, Input, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { getFormLayout, adaptModalHeight } from '@/utils/util';

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(5, 17);
const EquipmentTypeConfigsModal = (props) => {
  const { cancelModal, visible, onSubmit } = props;
  const [formRef] = Form.useForm();

  useEffect(() => {
    if (!visible) {
      formRef.resetFields();
    }
  }, [visible]);

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
      title={'设备类型配置信息'}
      maskClosable={false}
      onCancel={cancelModal}
      onOk={submit}
      bodyStyle={{ maxHeight: adaptModalHeight() * 0.9, overflow: 'auto' }}
    >
      <Form form={formRef} {...formItemLayout} labelWrap>
        <Form.Item
          name={'deviceTypeConfigurationCode'}
          label={'信息标识'}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.List name={'configs'} initialValue={[{ key: null, value: null }]}>
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  {...(index === 0 ? formItemLayout : formItemLayoutNoLabel)}
                  label={index === 0 ? '设备配置信息' : ''}
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
