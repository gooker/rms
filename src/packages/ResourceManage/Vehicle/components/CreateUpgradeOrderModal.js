import React, { memo, useEffect, useState } from 'react';
import { Form, Modal, Select } from 'antd';
import { dealResponse, formatMessage, getFormLayout } from '@/utils/util';
import { updateVehicleFirmWareFile } from '@/services/resourceService';

const { formItemLayout } = getFormLayout(4, 18);
const CreateUpgradeOrderModal = (props) => {
  const { visible, onCancel, upgradeRows, hardWareData, onRefresh } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [visible]);

  function onSubmit() {
    form.validateFields().then(async (values) => {
      setLoading(true);
      const { fileName } = values;
      const params = [];
      upgradeRows?.map(({ vehicleId, adapterType }) => {
        params.push({ vehicleId, adapterType, fileName });
      });

      const response = await updateVehicleFirmWareFile(params);
      if (!dealResponse(response, 1)) {
        onCancel();
        onRefresh();
      }
      setLoading(false);
    });
  }

  return (
    <Modal
      title={formatMessage({ id: 'firmdware.upgradeTask.add' })}
      visible={visible}
      closable={false}
      maskClosable={false}
      onCancel={onCancel}
      onOk={onSubmit}
      okButtonProps={{ loading }}
    >
      <Form form={form} {...formItemLayout}>
        <Form.Item
          name={'fileName'}
          label={formatMessage({ id: 'firmdware.fileName' })}
          rules={[{ required: true }]}
        >
          <Select>
            {hardWareData?.map((hardware) => (
              <Select.Option value={hardware} key={hardware}>
                {hardware}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default memo(CreateUpgradeOrderModal);
