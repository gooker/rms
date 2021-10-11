import React, { PureComponent } from 'react';
import { Upload, message, Modal } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import MenuIcon from '@/utils/MenuIcon';

const { Dragger } = Upload;

class UploadUtils extends PureComponent {
  render() {
    const { analyzeFunction, visible, fileType = false } = this.props;
    const props = {
      name: 'file',
      multiple: true,
      onChange: (info) => {
        const { status } = info.file;
        if (status === 'done') {
          message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
      beforeUpload: (file) => {
        // 是否前端分析如果前端分析，关闭向后端发送请求，这里处理数据
        if (analyzeFunction) {
          const reader = new FileReader();
          reader.readAsText(file, 'UTF-8');
          reader.onload = (evt) => {
            if (fileType) {
              analyzeFunction(file);
            } else {
              const fileJson = JSON.parse(evt.target.result);
              analyzeFunction(fileJson);
            }
          };
          return false;
        }
        return true;
      },
    };
    return (
      <Modal
        destroyOnClose
        widt={600}
        visible={visible}
        footer={null}
        onCancel={() => {
          const { onCancel } = this.props;
          onCancel && onCancel();
        }}
      >
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">{MenuIcon.inbox}</p>
          <p className="ant-upload-text">
            <FormattedMessage id="app.upload.dragUploadedFileToThisArea" />
          </p>
        </Dragger>
      </Modal>
    );
  }
}
export default UploadUtils;
