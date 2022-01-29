import React from 'react';
import { Row, Col, Modal, Form, Input, InputNumber, Select } from 'antd';
import { isNull,formatMessage} from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';

const { Item } = Form;
const { Option } = Select;
const formLayout = { labelCol: { span: 3 }, wrapperCol: { span: 20 } };

const WebHookFormModal = (props) => {
  const { data, visible, onSubmit, onClose, options = [] } = props;

  const [form] = Form.useForm();

  function submit() {
    form.validateFields().then((values) => {
      onSubmit(values);
      form.resetFields();
    }).catch(()=>{});
  }

  function closeModal() {
    form.resetFields();
    onClose();
  }

  const title = `${formatMessage({ id: isNull(data) ? 'app.button.add' : 'app.button.update' })} WebHook`;
  return (
    <Modal title={title} width={600} visible={visible} onOk={submit} onCancel={closeModal}>
      <Form form={form}>
        <Item
          {...formLayout}
          name="webHookType"
          initialValue={data?.webHookType}
          label={<FormattedMessage id="app.common.type" />}
          rules={[{required:true}]}
        >
          <Select style={{ width: 200 }}>
            {options.map(({ type, label }) => (
              <Option key={type} value={type}>
                {label}
              </Option>
            ))}
          </Select>
        </Item>
        <Item
          {...formLayout}
          name="name"
          label={formatMessage({ id: 'app.common.name' })}
          initialValue={data?.name}
        >
          <Input />
        </Item>
        <Item
          {...formLayout}
          name="url"
          label={'URL'}
          initialValue={data?.url}
          rules={[{ type: 'url' }]}
        >
          <Input.TextArea />
        </Item>
        <Item {...formLayout} name="token" label={'Token'} initialValue={data?.token}>
          <Input.TextArea />
        </Item>
        <Item
          {...formLayout}
          name="desc"
          label={<FormattedMessage id="app.common.description" />}
          initialValue={data?.desc}
        >
          <Input />
        </Item>
        <Item {...formLayout} label={<FormattedMessage id="app.common.timeout" />}>
          <Row>
            <Col>
              <Item noStyle name="timeOut" initialValue={data?.timeOut || 60}>
                <InputNumber />
              </Item>
            </Col>
            <Col style={{ marginLeft: 10, display: 'flex', alignItems: 'center' }}>
              <FormattedMessage id="app.time.seconds" />
            </Col>
          </Row>
        </Item>
        <Item {...formLayout} label={<FormattedMessage id="webHook.retryTimes" />}>
          <Row>
            <Col>
              <Item noStyle name="tryCount" initialValue={data?.tryCount || 3}>
                <InputNumber />
              </Item>
            </Col>
            <Col style={{ marginLeft: 10, display: 'flex', alignItems: 'center' }}>
              <FormattedMessage id="app.common.times" />
            </Col>
          </Row>
        </Item>
      </Form>
    </Modal>
  );
};
export default WebHookFormModal;
