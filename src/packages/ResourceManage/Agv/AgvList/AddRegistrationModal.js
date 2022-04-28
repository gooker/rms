/* TODO: I18N */
import React, { memo } from 'react';
import { Form, Input, InputNumber, Modal, Select } from 'antd';
import { getFormLayout } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { connect } from '@/utils/RmsDva';
import { NavigationCellType } from '@/config/config';

const { formItemLayout } = getFormLayout(5, 17);
const AddRegistrationModal = (props) => {
  const { dispatch, visible, allAdaptors } = props;
  const [formRef] = Form.useForm();

  function onSubmit() {
    formRef
      .validateFields()
      .then((values) => {
        console.log(values);
      })
      .catch(() => {
      });
  }

  return (
    <Modal
      visible={visible}
      title={'添加发现'}
      maskClosable={false}
      onCancel={() => {
        dispatch({ type: 'agvList/updateAddRegistrationModalShown', payload: false });
      }}
      onOk={onSubmit}
    >
      <Form form={formRef} {...formItemLayout}>
        <Form.Item name={'brand'} label={'品牌'} rules={[{ required: true }]}>
          <Select>
            {NavigationCellType.map(({ code, name }) => (
              <Select.Option key={code} value={code}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name={'ip'}
          label={<FormattedMessage id={'app.agv.ip'} />}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={'port'}
          label={<FormattedMessage id={'app.agv.port'} />}
          rules={[{ required: true }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          name={'adapter'}
          label={<FormattedMessage id={'app.configInfo.header.adapter'} />}
          rules={[{ required: true }]}
        >
          <Select>
            {Object.values(allAdaptors).map(({ adapterType }) => {
              const { id, name } = adapterType;
              return (
                <Select.Option key={id} value={id}>
                  {name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name={'connectType'} label={'连接方式'} rules={[{ required: true }]}>
          <Select>
            <Select.Option value={'TCP'}>TCP</Select.Option>
            <Select.Option value={'MQTT'}>MQTT</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default connect(({ agvList }) => ({
  allAdaptors: agvList.allAdaptors,
  visible: agvList.addRegistrationModalShown,
}))(memo(AddRegistrationModal));
