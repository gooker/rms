import React, { memo, useEffect } from 'react';
import { Form, Modal, Upload } from 'antd';
import { dealResponse, formatMessage } from '@/utils/util';
import { InboxOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import { uploadVehicleFile } from '@/services/resourceService';

const { Dragger } = Upload;

const UploadHardwareModal = (props) => {
  const { visible, onCancel, refreshHardWare } = props;
  const [formRef] = Form.useForm();

  useEffect(() => {
    if (!visible) {
      formRef.resetFields();
    }
  }, [visible]);

  const uploadProps = {
    name: 'file',
    maxCount: 1,
    beforeUpload(file) {
      return false;
    },
    onRemove() {
      return true;
    },
  };

  function onSave() {
    formRef.validateFields().then(async (values) => {
      const { file } = values;
      const reader = new FileReader();
      reader.readAsText(file[0].originFileObj, 'UTF-8');
      reader.onload = async (evt) => {
        try {
          let formData = new FormData();
          formData.append('file', file[0].originFileObj);
          const response = await uploadVehicleFile(formData);
          if (!dealResponse(response, 1)) {
            onCancel();
            refreshHardWare();
          }
        } catch (err) {
          console.log(err);
        }
      };
    });
  }

  return (
    <Modal
      title={formatMessage({ id: 'firmdware.upload' })}
      visible={visible}
      closable={false}
      onCancel={onCancel}
      onOk={onSave}
    >
      <Form form={formRef}>
        <Form.Item
          noStyle
          name="file"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e && e.fileList;
          }}
          rules={[{ required: true }]}
        >
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              <FormattedMessage id="app.message.upload.tip" />
            </p>
          </Dragger>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default memo(UploadHardwareModal);
