import React, { memo } from 'react';
import { Modal, Form, Select, Input } from 'antd';
import { isNull, formatMessage, getFormLayout, dealResponse, getRandomString } from '@/utils/util';
import { saveStorage } from '@/services/resourceService';
import FormattedMessage from '@/components/FormattedMessage';
import { allStorageType } from './storage';

const { formItemLayout } = getFormLayout(5, 16);
const sectionId = window.localStorage.getItem('sectionId');

function AddStorageModal(props) {
  const { visible, onCancel, onOk, updateRecord } = props;
  const [formRef] = Form.useForm();

  function onSave() {
    formRef
      .validateFields()
      .then(async (values) => {
        const response = await saveStorage({ ...values });
        if (!dealResponse(response)) {
          onCancel();
          onOk();
        }
      })
      .catch(() => {});
  }
  return (
    <Modal
      destroyOnClose
      visible={visible}
      width={'500px'}
      title={
        isNull(updateRecord)
          ? formatMessage({ id: 'app.button.add' })
          : formatMessage({ id: 'app.button.edit' })
      }
      onCancel={onCancel}
      onOk={onSave}
    >
      <Form {...formItemLayout} form={formRef}>
        <Form.Item hidden name={'id'} initialValue={updateRecord?.id || null} />

        {/* 编码 */}
        <Form.Item
          hidden
          name={'code'}
          initialValue={updateRecord?.code || `storage${getRandomString(6)}${sectionId}`}
        />

        <Form.Item
          label={formatMessage({ id: 'app.common.name' })}
          name="name"
          rules={[{ required: true }]}
          initialValue={updateRecord?.name}
        >
          <Input allowClear />
        </Form.Item>
        <Form.Item
          label={formatMessage({ id: 'storage.template' })}
          name="storageTempCode"
          rules={[{ required: true }]}
          initialValue={updateRecord?.storageTempCode}
        >
          <Select allowClear style={{ width: '100%' }}>
            {allStorageType?.map(({ label, code }) => (
              <Select.Option key={code} value={code}>
                {label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label={<FormattedMessage id="app.common.type" />}
          name="storageType"
          rules={[{ required: true }]}
          initialValue={updateRecord?.storageType}
        >
          <Select allowClear style={{ width: '100%' }}>
            {allStorageType?.map(({ label, code }) => (
              <Select.Option key={code} value={code}>
                {label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={formatMessage({ id: 'app.map.cell' })}
          name="cellId"
          rules={[{ required: true }]}
          initialValue={updateRecord?.cellId}
        >
          <Input allowClear />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default memo(AddStorageModal);
