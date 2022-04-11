import React, { memo } from 'react';
import { Button, Form, InputNumber, Select } from 'antd';
import { formatMessage, getFormLayout } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';

const { Option } = Select;
const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(8, 16);
const workModel = ['PICK', 'TALLY', 'STORE_PREPARE', 'STORE'];

const StationEditComponent = (props) => {
  const { submit, data, cancel } = props;
  const [formRef] = Form.useForm();

  function onSubmit() {
    formRef.validateFields().then((value) => {
      submit({ ...value, id: data.id, editType: 'EDIT' });
    });
  }

  return (
    <Form ref={formRef}>
      <Form.Item
        {...formItemLayout}
        name={'maxPod'}
        label={<FormattedMessage id="latentTote.station.maxPod" />}
        initialValue={data?.maxPod}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <InputNumber min={1} />
      </Form.Item>

      <Form.Item
        {...formItemLayout}
        name={'workModel'}
        label={<FormattedMessage id="latentTote.station.workModel" />}
        initialValue={data?.workModel}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select>
          {workModel?.map((item) => (
            <Option
              key={formatMessage({ id: `latentTote.station.workModel.${item}` })}
              value={item}
            >
              {formatMessage({ id: `latentTote.station.workModel.${item}` })}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item {...formItemLayoutNoLabel}>
        <Button onClick={cancel}>
          <FormattedMessage id="app.button.cancel" />
        </Button>
        <Button type="primary" onClick={onSubmit} style={{ marginLeft: '20px' }}>
          <FormattedMessage id="app.button.confirm" />
        </Button>
      </Form.Item>
    </Form>
  );
};
export default memo(StationEditComponent);
