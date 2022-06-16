import React, { useEffect, useState } from 'react';
import { Modal, Form, Input } from 'antd';
import { dealResponse, formatMessage, getFormLayout, getRandomString } from '@/utils/util';
import { fetchActiveMap } from '@/services/commonService';
import { saveResourceGroup } from '@/services/resourceService';
const { formItemLayout } = getFormLayout(5, 18);

export default function ResourceGroupModal(props) {
  const { visible, title, groupType, members, onCancel, onOk } = props;

  const [mapId, setMapId] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    async function init() {
      const data = await fetchActiveMap();
      if (!dealResponse(data)) {
        setMapId(data?.id);
      }
    }

    if (!visible) {
      form.resetFields();
    } else {
      init();
    }
  }, [visible]);

  function onSubmit() {
    form
      .validateFields()
      .then(async (values) => {
        const params = { ...values, members, mapId, groupType };
        const response = await saveResourceGroup(params);
        if (!dealResponse(response, 1)) {
          onCancel();
          onOk();
        }
      })
      .catch(() => {});
  }

  return (
    <Modal destroyOnClose visible={visible} onCancel={onCancel} title={title} onOk={onSubmit}>
      <Form form={form} {...formItemLayout}>
        {/* 编码 */}
        <Form.Item hidden name={'code'} initialValue={`${groupType}${getRandomString(6)}`} />
        <Form.Item
          name={'groupName'}
          label={formatMessage({ id: 'app.common.groupName' })}
          rules={[{ required: true }]}
        >
          <Input allowClear />
        </Form.Item>
      </Form>
    </Modal>
  );
}
