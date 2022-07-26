import React, { memo, useEffect, useState } from 'react';
import { Col, Divider, Form, message, Modal, Row, Select, Tag } from 'antd';
import { dealResponse, formatMessage, getFormLayout } from '@/utils/util';
import { updateVehicleFirmWareFile } from '@/services/resourceService';
import FormattedMessage from '@/components/FormattedMessage';

const { formItemLayout } = getFormLayout(4, 18);
const CreateUpgradeOrderModal = (props) => {
  const { visible, onCancel, selectedRows, hardWareData, onRefresh } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const upgradeRows = selectedRows?.filter(
    ({ vehicleStatus, disabled }) => vehicleStatus === 'Idle' && disabled,
  );
  const notAvailable = selectedRows
    ?.filter(({ vehicleStatus, disabled }) => vehicleStatus !== 'Idle' || !disabled)
    .map(({ vehicleId }) => vehicleId);

  useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [visible]);

  function onSubmit() {
    if (upgradeRows?.length === 0) {
      message.info(formatMessage({ id: 'firmdware.upgrade.message' }));
      return false;
    }
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
        {notAvailable?.length > 0 && (
          <>
            <Divider dashed plain>
              <FormattedMessage id="firmdware.upgrade.notAvailable" />
            </Divider>
            <Row>
              <Col offset={4}>
                {notAvailable.map((item) => {
                  return (
                    <Tag color="blue" key={item}>
                      {item}
                    </Tag>
                  );
                })}
              </Col>
            </Row>
          </>
        )}
      </Form>
    </Modal>
  );
};
export default memo(CreateUpgradeOrderModal);
