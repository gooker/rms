import React, { Component } from 'react';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import XLSX from 'xlsx';
// import { forIn } from 'lodash';

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
      //   listType:"picture-card",
      onChange: (info) => {
        return new Promise((resolve, reject) => {
          let fileList = [...info.fileList];
          if (fileList.length > 1) {
            message.info('只可以上传一个');
            fileList = fileList.slice(-1);
            this.setState({ fileList });
            return reject(false);
          }
          this.setState({ fileList });
          return resolve(true);
        });
      },
      beforeUpload(file, list) {
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
            /**
             * * key.a:{
             *          zh-cn:'你好',
             *          en-us:’hello',
             *         },
             *    key.b:{
             *          zh-cn:‘再见‘，
             *          en-us:'bye'
             *       }
             * */
            // let languageMap = {};
            // languageList.map((record) => {
            //   const { languageKey, ...item } = record;
            //   if (languageKey) {
            //     languageMap[record['languageKey']] = item;
            //   }
            // });


            /**
             * * zh-cn:{
             *          key.a:'你好',
             *          key.b:'再见',
             *         },
             *   en-us:{
             *         key.a:'hi',
             *         key.b:'bye'
             *
             *   }
             * */
            // languageList.map((record) => {
            //   forIn(record, (value, key) => {
            //     const languageKey = record['languageKey'];
            //     if (key !== 'languageKey') {
            //       if (languageMap[key] == null) {
            //         languageMap[key] = {};
            //       }
            //       languageMap[key][languageKey] = value;
            //     }
            //   });
            // });
            onChange(languageList);
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
