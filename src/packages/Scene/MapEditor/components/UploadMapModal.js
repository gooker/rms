import React, { memo } from 'react';
import { formatMessage, getFormLayout } from '@/utils/util';
import { Form, Modal, Select, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import { NavigationCellType } from '@/mockData';

const { formItemLayout } = getFormLayout(5, 18);
const UploadMapModal = (props) => {
  const { dispatch, visible, onCancel } = props;
  const [formRef] = Form.useForm();

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  function cancel() {
    formRef.resetFields();
    onCancel();
  }

  function handleFile() {
    formRef
      .validateFields()
      .then(({ file, navigationCellType }) => {
        const reader = new FileReader();
        // beforeUpload返回false情况下, antd选择后的文件file是经过包装的数据，获取真是文件对象需要取file.originFileObj. 日他妈...
        reader.readAsText(file[0].originFileObj, 'UTF-8');
        reader.onload = (evt) => {
          const mapData = evt.target.result;
          submit(navigationCellType, mapData);
        };
      })
      .catch(() => {});
  }

  function submit(param) {
    // 校验地图数据
    console.log(param);
  }

  return (
    <Modal
      destroyOnClose
      width={500}
      visible={visible}
      onCancel={cancel}
      onOk={handleFile}
      title={formatMessage({ id: 'editor.map.upload' })}
    >
      <Form form={formRef} {...formItemLayout}>
        <Form.Item
          name="file"
          label={formatMessage({ id: 'app.common.file' })}
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true }]}
        >
          <Upload.Dragger name="files" maxCount={1} accept={'.json'} beforeUpload={() => false}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              <FormattedMessage id={'app.message.upload.tip'} />
            </p>
          </Upload.Dragger>
        </Form.Item>
        <Form.Item
          initialValue={'NONE'}
          name={'navigationCellType'}
          label={formatMessage({ id: 'editor.navigationCellType' })}
          rules={[{ required: true }]}
        >
          <Select>
            <Select.Option value={'NONE'}>
              <FormattedMessage id={'editor.navigationCellType.none'} />
            </Select.Option>
            {NavigationCellType.map(({ code, name }, index) => (
              <Select.Option key={index} value={code}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default memo(UploadMapModal);
