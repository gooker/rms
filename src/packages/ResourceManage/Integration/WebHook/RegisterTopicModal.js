import React, { memo, useEffect, useState } from 'react';
import { Form, Modal, Select, Input, Row, Col, Button } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { getFormLayout } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(5, 17);

const RegisterTopicModal = (props) => {
  const { onClose, visible, mqQueue, onSubmit, data } = props;
  const [formRef] = Form.useForm();
  const [editRecord, setEditRecord] = useState({});

  useEffect(() => {
    if (data?.length === 1) {
      setEditRecord(data[0]);
    }
  }, [data]);

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
      title={<FormattedMessage id="app.register" />}
      maskClosable={false}
      onCancel={onClose}
      onOk={submit}
    >
      <Form form={formRef} {...formItemLayout}>
        <Form.Item
          name={'topic'}
          label={<FormattedMessage id={'webHook.queue'} />}
          rules={[{ required: true }]}
        >
          <Select>
            {mqQueue.map((queue) => (
              <Select.Option key={queue} value={queue}>
                {queue}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name={'name'} label={<FormattedMessage id={'app.common.name'} />}>
          <Input />
        </Form.Item>

        <Form.Item name={'desc'} label={<FormattedMessage id={'app.common.description'} />}>
          <Input />
        </Form.Item>
        <Form.List name={'mappings'} initialValue={[{ value: null }]}>
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  {...(index === 0 ? formItemLayout : formItemLayoutNoLabel)}
                  label={index === 0 ? '订阅信息' : ''}
                  key={field.key}
                >
                  <Row gutter={10}>
                    <Col span={15}>
                      <Form.Item noStyle {...field} name={[field.name, 'value']}>
                        <Input placeholder={''} />
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
export default memo(RegisterTopicModal);
