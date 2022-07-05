import React, { memo, useEffect } from 'react';
import { Form, Modal, Select } from 'antd';
import { connect } from '@/utils/RmsDva';
import { formatMessage, getFormLayout } from '@/utils/util';

const { formItemLayout } = getFormLayout(5, 17);
const RegisterVehicleModal = (props) => {
  const { dispatch, visible, allAdaptors, onSubmit } = props;
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
      title={formatMessage({ id: 'app.vehicle.register' })}
      maskClosable={false}
      onCancel={() => {
        dispatch({ type: 'vehicleList/updateRegisterVehicleModalShown', payload: false });
      }}
      onOk={submit}
    >
      <Form form={formRef} {...formItemLayout}>
        <Form.Item
          name={'vehicleType'}
          label={formatMessage({ id: 'app.vehicleType' })}
          rules={[{ required: true }]}
        >
          <Select>
            {Object.values(allAdaptors).map(({ adapterType }) => {
              const { id, name, vehicleTypes } = adapterType;
              return (
                <Select.OptGroup key={id} label={name}>
                  {vehicleTypes.map((item, index) => (
                    <Select.Option key={index} value={`${id}@${item.code}`}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select.OptGroup>
              );
            })}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default connect(({ vehicleList, global }) => ({
  allAdaptors: global.allAdaptors,
  visible: vehicleList.registerVehicleModalShown,
}))(memo(RegisterVehicleModal));
