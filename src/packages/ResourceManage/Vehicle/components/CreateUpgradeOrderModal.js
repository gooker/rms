import React, { memo, useEffect } from 'react';
import { Form, Modal, Select } from 'antd';
import { dealResponse, formatMessage, getFormLayout } from '@/utils/util';
import { updateVehicleFirmWareFile } from '@/services/resourceService';

const { formItemLayout } = getFormLayout(4, 18);
const CreateUpgradeOrderModal = (props) => {
  const { visible, onCancel, upgradeOrder, selectedRows, hardWareData, onRefresh } = props;
  const [form] = Form.useForm();

  // 取出 正在下载固件/正在升级的/下载成功的 小车，不传
  const vehicleInProgress = [];
  upgradeOrder?.forEach(({ vehicleId, vehicleType, vehicleFileTaskType, fileStatus }) => {
    if (
      (['1', '0'].includes(fileStatus) && vehicleFileTaskType === 'DOWNLOAD') ||
      (['1'].includes(fileStatus) && vehicleFileTaskType === 'UPGRADE')
    ) {
      vehicleInProgress.push(`${vehicleId}@${vehicleType}`);
    }
  });
  const availableVehicle = selectedRows.filter(
    ({ vehicleId, vehicleType }) => !vehicleInProgress.includes(`${vehicleId}@${vehicleType}`),
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
      title={formatMessage({ id: 'firmdware.upgradeTask.add' })}
      visible={visible}
      closable={false}
      maskClosable={false}
      onCancel={onCancel}
      onOk={onSubmit}
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
