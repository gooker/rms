import React, { memo, useEffect } from 'react';
import { Form, Modal, Select } from 'antd';
import { dealResponse, formatMessage, getFormLayout } from '@/utils/util';
import { updateVehicleFirmWareFile } from '@/services/resourceService';

const { formItemLayout } = getFormLayout(4, 18);
const CreateUpgradeOrderModal = (props) => {
  const { visible, onCancel, upgradeOrder, selectedRows, hardWareData, onRefresh } = props;
  const [form] = Form.useForm();

  // 取出正在下载固件的小车，不传
  const vehicleInProgress = [];
  upgradeOrder?.forEach(({ vehicles }) => {
    vehicles.forEach((vehicle) => {
      if (vehicle.state === 'downloading') {
        vehicleInProgress.push(vehicle.uniqueId);
      }
    });
  });
  const availableVehicle = selectedRows.filter(
    (vehicle) => !vehicleInProgress.includes(vehicle.id),
  );

  useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [visible]);

  function onSubmit() {
    form.validateFields().then(async (values) => {
      const { fileName } = values;
      const params = [];
      availableVehicle?.map(({ vehicleId, adapterType }) => {
        params.push({ vehicleId, adapterType, fileName });
      });

      const response = await updateVehicleFirmWareFile(params);
      if (!dealResponse(response, 1)) {
        onCancel();
        onRefresh();
      }
    });
  }

  return (
    <Modal
      title={formatMessage({ id: 'firmdware.upload' })}
      visible={visible}
      closable={false}
      maskClosable={false}
      onCancel={onCancel}
      onOk={onSubmit}
    >
      <Form form={form} {...formItemLayout}>
        <Form.Item
          name={'fileName'}
          label={formatMessage({ id: 'firmdware.upload' })}
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
