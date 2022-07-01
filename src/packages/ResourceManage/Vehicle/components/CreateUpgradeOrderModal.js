/* TODO: I18N */
import React, { memo, useEffect } from 'react';
import { Form, Modal, Select } from 'antd';
import { connect } from '@/utils/RmsDva';
import { formatMessage, getFormLayout } from '@/utils/util';

const { formItemLayout } = getFormLayout(4, 18);
const CreateUpgradeOrderModal = (props) => {
  const { form, visible, onCancel, allVehicles, upgradeOrder } = props;

  useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [visible]);

  function getAvailableVehicleOptions() {
    // 取出正在下载固件的小车，不显示在下拉框
    const vehicleInProgress = [];
    upgradeOrder.forEach(({ vehicles }) => {
      vehicles.forEach((vehicle) => {
        if (vehicle.state === 'downloading') {
          vehicleInProgress.push(vehicle.uniqueId);
        }
      });
    });

    const availableVehicle = allVehicles.filter(
      (vehicle) => !vehicleInProgress.includes(vehicle.id),
    );
    return availableVehicle.map(({ id, vehicleId }) => (
      <Select.Option key={id} value={id}>
        {vehicleId}
      </Select.Option>
    ));
  }

  return (
    <Modal
      title={formatMessage({ id: 'hardware.upload' })}
      visible={visible}
      closable={false}
      maskClosable={false}
      onCancel={onCancel}
    >
      <Form form={form} {...formItemLayout}>
        <Form.Item name={'hardware'} label={'固件'} rules={[{ required: true }]}>
          <Select>
            <Select.Option value={'AAA_5.1.1_pom'}>AAA_5.1.1_pom</Select.Option>
            <Select.Option value={'BBB_5.1.1_pom'}>BBB_5.1.1_pom</Select.Option>
            <Select.Option value={'CCC_5.1.1_pom'}>CCC_5.1.1_pom</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name={'vehicles'} label={'车辆'} rules={[{ required: true }]}>
          <Select mode={'multiple'} maxTagCount={6}>
            {getAvailableVehicleOptions()}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default connect(({ vehicleList }) => ({
  upgradeOrder: vehicleList.upgradeOrder,
  allVehicles: vehicleList.allVehicles,
}))(memo(CreateUpgradeOrderModal));
