import React, { memo, useEffect } from 'react';
import { Form, Input, InputNumber, Modal, Select } from 'antd';
import { connect } from '@/utils/RmsDva';
import { dealResponse, formatMessage, getFormLayout } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { findCharger } from '@/services/resourceService';

const { formItemLayout } = getFormLayout(5, 17);
const AddRegistrationModal = (props) => {
  const { dispatch, visible, allAdaptors } = props;
  const [formRef] = Form.useForm();

  useEffect(() => {
    if (!visible) {
      formRef.resetFields();
    }
  }, [visible]);

  function onSubmit() {
    formRef
      .validateFields()
      .then(async (values) => {
        const { adapterType, ip, port } = values;
        const params = {
          adapterCode: adapterType[0],
          typeCode: adapterType[1],
          parameter: {
            ip,
            port,
          },
        };
        const response = await findCharger(params);
        if (!dealResponse(response,1)) {
          await dispatch({ type: 'chargerList/fetchInitialData' });
          closeModal();
        }
      })
      .catch(() => {});
  }

  function closeModal() {
    dispatch({ type: 'chargerList/updateAddRegistrationModalShown', payload: false });
  }

  return (
    <Modal
      destroyOnClose
      visible={visible}
      title={formatMessage({ id: 'app.button.addFound' })}
      maskClosable={false}
      onCancel={closeModal}
      onOk={onSubmit}
    >
      <Form form={formRef} {...formItemLayout}>
        <Form.Item
          name={'adapterType'}
          label={<FormattedMessage id={'app.configInfo.header.adapter'} />}
          rules={[{ required: true }]}
        >
          <Select allowClear>
            {allAdaptors?.map((adapter) => {
              const { chargerAdapterTypes } = adapter;
              return (
                <Select.OptGroup
                  key={adapter.code}
                  label={`${formatMessage({ id: 'app.configInfo.header.adapter' })}: ${
                    adapter.name
                  }`}
                >
                  {chargerAdapterTypes.map((chargeType, index) => (
                    <Select.Option
                      key={index}
                      value={`${adapter.code}@${chargeType.code}`}
                      disabled={!chargeType.addDiscovery}
                    >
                      {chargeType.name}
                    </Select.Option>
                  ))}
                </Select.OptGroup>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item name={'ip'} label={'IP'}>
          <Input />
        </Form.Item>

        <Form.Item name={'port'} label={<FormattedMessage id={'vehicle.port'} />}>
          <InputNumber />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default connect(({ chargerList }) => ({
  allAdaptors: chargerList.allAdaptors,
  visible: chargerList.addRegistrationModalShown,
}))(memo(AddRegistrationModal));
