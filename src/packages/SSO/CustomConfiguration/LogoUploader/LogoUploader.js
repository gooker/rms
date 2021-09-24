import React from 'react';
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { formatMessage, FormattedMessage } from '@/utils/Lang';
import { getBase64 } from '@/utils/utils';
import styles from './LogoUploader.module.less';
export default class LogoUploader extends React.Component {
  state = {
    imageUrl: null,
    loading: false,
  };

  componentDidMount() {
    const { value } = this.props;
    this.setState({ imageUrl: value });
  }

  beforeUpload=(file)=> {
     const { onChange } = this.props;
    const isPng = file.type === 'image/png';
    if (!isPng) {
      message.error(formatMessage({ id: 'app.microApp.tip.pictureTypeError' }));
      return;
    }
    const isLt100kb = file.size / 1024 < 100;
    if (!isLt100kb) {
      message.error(formatMessage({ id: 'app.microApp.tip.pictureSizeError' }));
      return;
    }
    getBase64(file).then(imageUrl => {
      this.setState({ imageUrl, loading: false }, () => {
        onChange(imageUrl);
      });
      return false;
    });
  
    return false;
  }



  clearLogo = () => {
    const { clear } = this.props;
    clear();
    this.setState({ imageUrl: null });
  };

  render() {
    const uploadButton = (
      <div>
        {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
        <FormattedMessage id="sso.init.upload" />
      </div>
    );
    const { imageUrl } = this.state;
    return (
      <div className={styles.logoUploader}>
        <Upload
          listType="picture-card"
          showUploadList={false}
          beforeUpload={this.beforeUpload}
        >
          {imageUrl ? (
            <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
          ) : (
            uploadButton
          )}
        </Upload>
        {imageUrl && (
          <div className={styles.deleteLogo}>
            <DeleteOutlined onClick={this.clearLogo} />
          </div>
        )}
      </div>
    );
  }
}
