/* TODO: I18N */
import React, { memo, useEffect } from 'react';
import { Form, Modal, Select } from 'antd';
import { connect } from '@/utils/RmsDva';
import { getFormLayout } from '@/utils/util';

const { formItemLayout } = getFormLayout(5, 17);
const RegisterChargeModal = (props) => {
  const { dispatch, visible, allMapChargers, onSubmit } = props;
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
      onCancel={() => {
        dispatch({ type: 'vehicleList/updateRegisterVehicleModalShown', payload: false });
      }}
      onOk={submit}
    >
      <Form form={formRef} {...formItemLayout}>
        <Form.Item name={'mapChargerCode'} label={'地图充电桩'} rules={[{ required: true }]}>
          <Select>
            {allMapChargers?.map(({ code, name }) => {
              <Select.Option key={code} value={code}>
                {name}
              </Select.Option>;
            })}
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
