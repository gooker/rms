/* TODO: I18N */
import React, { memo, useEffect } from 'react';
import { Form, Modal, Select } from 'antd';
import { connect } from '@/utils/RmsDva';
import { getFormLayout } from '@/utils/util';

const { formItemLayout } = getFormLayout(5, 17);
const RegisterChargeModal = (props) => {
  const { visible, allMapChargers = [], onSubmit, onCancel } = props;
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
        onSubmit(values);
      })
      .catch(() => {});
  }

  return (
    <Modal
      destroyOnClose
      visible={visible}
      title={'充电桩注册'}
      maskClosable={false}
      onCancel={onCancel}
      onOk={submit}
    >
      <Form form={formRef} {...formItemLayout}>
        <Form.Item name={'mapChargerCode'} label={'地图充电桩'} rules={[{ required: true }]}>
          <Select>
            {Array.isArray(allMapChargers) &&
              allMapChargers?.map(({ code, name }) => (
                <Select.Option key={code} value={code}>
                  {name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default connect(({ chargerList }) => ({
  allMapChargers: chargerList.allMapChargers,
  visible: chargerList.registerChargerModalShown,
}))(memo(RegisterChargeModal));
