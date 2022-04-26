/* TODO: I18N */
import React, { memo } from 'react';
import { Form, InputNumber, Modal, Select, Upload, Input, Row, Col, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import { formatMessage, getFormLayout } from '@/utils/util';
import { NavigationCellType, RobotBrand } from '@/config/consts';
import { connect } from '@/utils/RmsDva';
import { MUSHINY, SEER } from '@/utils/mapParser';

const { formItemLayout } = getFormLayout(5, 19);
const UploadMapModal = (props) => {
  const { dispatch, visible, onCancel, currentMap, currentLogicArea } = props;
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
      .then(({ file, navigationCellType, ...rest }) => {
        const existIds = Object.keys(currentMap.cellMap).map((item) => parseInt(item));
        const reader = new FileReader();
        // beforeUpload返回false情况下, antd选择后的文件file是经过包装的数据，获取真是文件对象需要取file.originFileObj. 日他妈...
        reader.readAsText(file[0].originFileObj, 'UTF-8');
        reader.onload = (evt) => {
          try {
            let mapData = evt.target.result;
            mapData = JSON.parse(mapData);
            switch (navigationCellType) {
              case RobotBrand.SEER:
                mapData = SEER(mapData, existIds, currentLogicArea);
                break;
              case RobotBrand.MUSHINY:
                mapData = MUSHINY(mapData, existIds, currentLogicArea);
                break;
              default:
                break;
            }
            dispatch({
              type: 'editor/importMap',
              payload: { mapData, transform: rest },
            }).then((result) => {
              result && cancel();
            });
          } catch (err) {
            message.error(err.message);
          }
        };
      })
      .catch(() => {});
  }

  return (
    <Modal
      destroyOnClose
      width={550}
      visible={visible}
      onCancel={cancel}
      onOk={handleFile}
      title={formatMessage({ id: 'editor.map.upload' })}
    >
      <Form form={formRef} {...formItemLayout}>
        <Form.Item
          name='file'
          label={formatMessage({ id: 'app.common.file' })}
          valuePropName='fileList'
          getValueFromEvent={normFile}
          rules={[{ required: true }]}
        >
          <Upload.Dragger
            name='files'
            maxCount={1}
            beforeUpload={() => false}
            onRemove={() => true}
          >
            <p className='ant-upload-drag-icon'>
              <InboxOutlined />
            </p>
            <p className='ant-upload-text'>
              <FormattedMessage id={'app.message.upload.tip'} />
            </p>
          </Upload.Dragger>
        </Form.Item>
        <Form.Item
          name={'navigationCellType'}
          label={formatMessage({ id: 'editor.navigationCellType' })}
          rules={[{ required: true }]}
        >
          <Select style={{ width: 200 }}>
            {NavigationCellType.map(({ code, name }, index) => (
              <Select.Option key={index} value={code}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name={'coordinationType'} label={'坐标系类型'} rules={[{ required: true }]}>
          <Select style={{ width: 200 }}>
            <Select.Option value={'L'}>左手坐标系</Select.Option>
            <Select.Option value={'R'}>右手坐标系</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name={'zoom'} initialValue={1} label={'缩放系数'} rules={[{ required: true }]}>
          <InputNumber />
        </Form.Item>
        <Form.Item label={'补偿偏移'}>
          <Input.Group>
            <Row gutter={10} style={{ width: '90%' }}>
              <Col span={12}>
                <Form.Item
                  noStyle
                  name={['compensationOffset', 'x']}
                  initialValue={0}
                  rules={[{ required: true }]}
                >
                  <InputNumber addonBefore={'X'} addonAfter={'mm'} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  noStyle
                  name={['compensationOffset', 'Y']}
                  initialValue={0}
                  rules={[{ required: true }]}
                >
                  <InputNumber addonBefore={'Y'} addonAfter={'mm'} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          </Input.Group>
        </Form.Item>
        <Form.Item
          name={'compensationAngle'}
          initialValue={0}
          label={'补偿角度'}
          rules={[{ required: true }]}
        >
          <InputNumber addonAfter={'°'} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default connect(({ global, editor }) => ({
  currentMap: editor.currentMap,
  currentLogicArea: editor.currentLogicArea,
}))(memo(UploadMapModal));
