import React, { memo } from 'react';
import { Modal, Upload } from 'antd';
import { formatMessage } from '@/utils/util';
import { InboxOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';

const { Dragger } = Upload;

const UploadHardwareModal = (props) => {
  const { visible, onCancel } = props;

  const uploadProps = {
    name: 'file',
    maxCount: 1,
    beforeUpload(file) {
      return false;
    },
  };

  return (
    <Modal
      title={formatMessage({ id: 'hardware.upload' })}
      visible={visible}
      closable={false}
      onCancel={onCancel}
    >
      <Dragger {...uploadProps}>
        <p className='ant-upload-drag-icon'>
          <InboxOutlined />
        </p>
        <p className='ant-upload-text'>
          <FormattedMessage id='app.message.upload.tip' />
        </p>
      </Dragger>
    </Modal>
  );
};
export default memo(UploadHardwareModal);
