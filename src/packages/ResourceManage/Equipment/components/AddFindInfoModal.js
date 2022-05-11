/* TODO: I18N */
import React, { memo } from 'react';
import { Form, Modal, Select, Input, InputNumber } from 'antd';
import { connect } from '@/utils/RmsDva';
import { getFormLayout, dealResponse } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { addDevice } from '@/services/resourceManageAPI';

const { formItemLayout } = getFormLayout(5, 17);
const AddRegistrationModal = (props) => {
  const { dispatch, visible, allAdaptors } = props;
  const [formRef] = Form.useForm();

  function onSubmit() {
    formRef
      .validateFields()
      .then((values) => {
        sendfindDevice({ ...values });
      })
      .catch(() => {});
  }

  async function sendfindDevice(param) {
    const response = await addDevice(param);
    if (!dealResponse(response)) {
      await dispatch({ type: 'equipList/fetchInitialData' });
      closeModal();
    }
  }

  function closeModal() {
    dispatch({ type: 'equipList/updateAddRegistrationModalShown', payload: false });
  }

  return (
    <Modal
      visible={visible}
      title={'添加发现'}
      maskClosable={false}
      onCancel={closeModal}
      onOk={onSubmit}
    >
      <Form form={formRef} {...formItemLayout}>
        <Form.Item
          name={'deviceAdapterCode'}
          label={<FormattedMessage id={'app.configInfo.header.adapter'} />}
          rules={[{ required: true }]}
        >
          <Select>
            {allAdaptors?.map(({ name }) => {
              return (
                <Select.Option key={name} value={name}>
                  {name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item name={'IP'} label={'IP'}>
          <Input />
        </Form.Item>

        <Form.Item
          name={'port'}
          label={<FormattedMessage id={'app.agv.port'} />}
        >
          <InputNumber />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default connect(({ equipList }) => ({
  allAdaptors: equipList.allAdaptors,
  visible: equipList.addRegistrationModalShown,
}))(memo(AddRegistrationModal));
