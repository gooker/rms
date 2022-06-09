import React, { memo } from 'react';
import { Form, Modal, InputNumber, DatePicker } from 'antd';
import moment from 'moment';
import {
  dealResponse,
  formatMessage,
  getFormLayout,
  isStrictNull,
  convertToUserTimezone,
} from '@/utils/util';
import { updateLatentToteOrder } from '@/services/latentToteService';
import FormattedMessage from '@/components/FormattedMessage';

const { formItemLayout } = getFormLayout(6, 16);

const UpdateToteOrderTaskComponent = (props) => {
  const { visible, onClose, updateRecord, onRefresh } = props;
  const [formRef] = Form.useForm();

  function onSave() {
    formRef
      .validateFields()
      .then(async (values) => {
        const requestBody = {
          id: updateRecord.id,
          editType: 'EDIT',
          priority: values.priority,
          targetTime: convertToUserTimezone(values.targetTime).format('YYYY-MM-DD HH:mm:ss'),
        };

        const response = await updateLatentToteOrder(requestBody);
        if (!dealResponse(response, 1)) {
          onClose();
          onRefresh();
        }
      })
      .catch((err) => {});
  }

  return (
    <Modal
      destroyOnClose
      style={{ top: 30 }}
      onCancel={onClose}
      onOk={onSave}
      visible={visible}
      width={420}
      title={<FormattedMessage id="app.button.edit" />}
      bodyStyle={{ height: `180px`, overflow: 'auto' }}
    >
      <div style={{ marginTop: 10 }}>
        <Form labelWrap form={formRef} {...formItemLayout}>
          <Form.Item
            name={'priority'}
            label={formatMessage({ id: 'app.common.priority' })}
            rules={[{ required: true }]}
            initialValue={updateRecord?.priority}
          >
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item
            name={'targetTime'}
            label={formatMessage({ id: 'latentTote.targetTime' })}
            rules={[{ required: true }]}
            initialValue={
              isStrictNull(updateRecord?.targetTime)
                ? ''
                : moment(updateRecord?.targetTime, 'YYYY-MM-DD HH:mm:ss')
            }
          >
            <DatePicker showTime />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};
export default memo(UpdateToteOrderTaskComponent);
