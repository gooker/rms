import React, { Component } from 'react';
import { Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import XLSX from 'xlsx';

const Dragger = Upload.Dragger;

export default class ImportI18nLanguage extends Component {
  state = {
    fileList: [],
  };
  render() {
    const { accept, analyzeFunction, remove, onChange, styles = {} } = this.props;
    const props = {
      name: 'file',
      accept: accept,
      maxCount: 1,
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

        if (onChange) {
          const reader = new FileReader();

          reader.onload = function (evt) {
            const wb = XLSX.read(evt.target.result, { type: 'binary' });
            const sheet1Name = wb.SheetNames[0];
            const sheet1 = wb.Sheets[sheet1Name];
            const languageList = XLSX.utils.sheet_to_json(sheet1);

            const i18nData = [...languageList].map((stItem) => {
              const { languageKey, ...item } = stItem;
              const currentItem = {
                languageKey,
                languageMap: { ...item },
              };
              return currentItem;
            });
            onChange(i18nData);
          };
          reader.readAsBinaryString(file);

          return false;
        }

        return true;
      },
      onRemove: () => {
        remove && remove();
        this.setState({ fileList: [] });
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
            <FormattedMessage id="app.commom.upload.dragUploadedFileToThisArea" />
          </p>
        </Dragger>
      </div>
    );
  }
}
