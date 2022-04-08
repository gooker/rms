import React, { memo, useState, useEffect } from 'react';
import { Button, Form, Select } from 'antd';
import { dealResponse, formatMessage, getFormLayout } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';

const { Option } = Select;
const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(5, 19);

const StationBindingComponent = (props) => {
  const { submit, data, cancel } = props;
  const [formRef] = Form.useForm();
  const [podList, setPodList] = useState([]);

  useEffect(() => {
    async function init() {
      getAllPod();
    }
    init();
  }, []);

  function onSubmit() {
    formRef.validateFields().then((value) => {
      submit({ ...value, id: data.id, editType: 'BIND' });
    });
  }

  async function getAllPod() {
    //TODO: 根据站点获取groupCode
    setPodList([]);
  }

  return (
    <Form ref={formRef}>
      <Form.Item
        {...formItemLayout}
        name={'stationCode'}
        label={<FormattedMessage id="latentTote.mainStationCode" />}
        initialValue={data?.stationCode}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select>
          {podList?.map((item) => (
            <Option key={item} value={item}>
              {item}
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
export default memo(StationBindingComponent);
