import React, { PureComponent } from 'react';
import { Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';

const Dragger = Upload.Dragger;

class UploadUtil extends PureComponent {
  render() {
    const { analyzeFunction, remove, styles = {} } = this.props;
    const props = {
      name: 'file',

      beforeUpload(file) {
        // 是否前端分析如果前端分析，关闭向后端发送请求，这里处理数据
        if (analyzeFunction) {
          const reader = new FileReader();
          reader.readAsText(file, 'UTF-8');
          reader.onload = (evt) => {
            analyzeFunction(evt);
          };
          return false;
        }
        return true;
      },

      onRemove() {
        remove && remove();
        return true;
      },
    };

    return (
      <div style={styles}>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            <FormattedMessage id="app.message.upload.tip" />
          </p>
        </Dragger>
      </div>
    );
  }
}
export default UploadUtil;
