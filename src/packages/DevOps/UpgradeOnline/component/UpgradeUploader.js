import React, { memo, useRef, useState } from 'react';
import { message, Progress, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import RmsConfirm from '@/components/RmsConfirm';
import { uploadUpgradePackage } from '@/services/devOpsService';
import { formatMessage } from '@/utils/util';

const { Dragger } = Upload;

const UpgradeUploader = (props) => {
  const { onFinish } = props;

  const fileRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [percent, setPercent] = useState(0);

  const draggerProps = {
    maxCount: 1,
    showUploadList: false,
    beforeUpload: (file) => {
      fileRef.current = file;
      RmsConfirm({
        content: file.name,
        onOk: () => {
          setUploading(true);
          const formData = new FormData();
          formData.append('file', file);
          uploadUpgradePackage(formData, (progressEvent) => {
            const { loaded, total } = progressEvent;
            const currentProgress = Math.round((loaded * 100) / total);
            if (currentProgress < 100) {
              setPercent(currentProgress);
            }
          }).then((response) => {
            message.success(formatMessage({ id: 'upgradeOnline.upload.success' }));
            setUploading(false);
            setPercent(0);
            typeof onFinish === 'function' && onFinish();
          });
        },
      });
      return false;
    },
  };

  return (
    <div style={{ width: 420 }}>
      <Dragger {...draggerProps} disabled={uploading}>
        {uploading ? (
          <Progress type='circle' percent={percent} width={100} />
        ) : (
          <>
            <p className='ant-upload-drag-icon'>
              <InboxOutlined />
            </p>
            <p className='ant-upload-text'>
              <FormattedMessage id='upgradeOnline.upload.tip' />
            </p>
          </>
        )}
      </Dragger>
    </div>
  );
};
export default memo(UpgradeUploader);
