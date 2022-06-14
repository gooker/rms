/* TODO: I18N */
import React, { memo, useState } from 'react';
import { Checkbox, Col, Form, Input, InputNumber, message, Modal, Row, Select, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import { formatMessage, getFormLayout, isNull } from '@/utils/util';
import { NavigationType, NavigationTypeView } from '@/config/config';
import { connect } from '@/utils/RmsDva';
import {
  convertMushinyOldMapToNew,
  extractCellAndRelationFromOldMap,
  getMapName,
  isOldMushinyMap,
  MUSHINY,
  SEER,
} from '@/utils/mapParser';
import { isEmpty } from 'lodash';

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(5, 19);
const UploadMapModal = (props) => {
  const { dispatch, visible, onCancel, currentMap, currentLogicArea } = props;
  const [formRef] = Form.useForm();
  const [navigationType, setNavigationType] = useState(null);

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
      .then(({ file, navigationType, addMap, ...rest }) => {
        let existIds = [];
        if (!addMap) {
          existIds = Object.keys(currentMap.cellMap).map((item) => parseInt(item));
        }
        const reader = new FileReader();
        // beforeUpload返回false情况下, antd选择后的文件file是经过包装的数据，获取真是文件对象需要取file.originFileObj. WTF???
        reader.readAsText(file[0].originFileObj, 'UTF-8');
        reader.onload = async (evt) => {
          try {
            const fileMapData = JSON.parse(evt.target.result);
            // "新增 + 牧星地图" 作为唯一一个特殊case进行处理
            if (addMap && navigationType === NavigationType.M_QRCODE) {
              if (isEmpty(fileMapData.cellMap)) {
                message.error('地图点位数据为空');
              } else {
                let payload = fileMapData;
                if (isOldMushinyMap(fileMapData)) {
                  payload = convertMushinyOldMapToNew(fileMapData);
                }
                if (!isNull(payload)) {
                  const result = await dispatch({ type: 'editor/importMushinyMap', payload });
                  result && cancel();
                }
              }
            } else {
              // 根据不同类型的地图数据-->提取出点位和线条数据
              let mapData;
              const mapName = getMapName(fileMapData, navigationType);
              if (navigationType === NavigationType.SEER_SLAM) {
                mapData = SEER(fileMapData, existIds, currentLogicArea);
              } else if (navigationType === NavigationType.M_QRCODE) {
                if (isOldMushinyMap(fileMapData)) {
                  // 提取旧版本地图数据
                  mapData = extractCellAndRelationFromOldMap(fileMapData);
                } else {
                  // 提取新版本地图数据
                  mapData = MUSHINY(fileMapData, existIds);
                }
              } else {
                mapData = fileMapData;
              }
              dispatch({
                type: 'editor/importMap',
                payload: { addMap, mapName, mapData, transform: rest },
              }).then((result) => {
                result && cancel();
              });
            }
          } catch (err) {
            console.log(err);
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
          noStyle
          name='file'
          valuePropName='fileList'
          getValueFromEvent={normFile}
          rules={[{ required: true }]}
        >
          <Upload.Dragger
            name="files"
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
        <br />
        <Form.Item
          name={'navigationType'}
          label={formatMessage({ id: 'editor.navigationType' })}
          rules={[{ required: true }]}
          getValueFromEvent={(value) => {
            setNavigationType(value);
            if (value === NavigationType.M_QRCODE) {
              formRef.setFieldsValue({ coordinationType: 'L' });
            } else {
              formRef.setFieldsValue({ coordinationType: null });
            }
            return value;
          }}
        >
          <Select style={{ width: 200 }}>
            {NavigationTypeView.map(({ code, name }, index) => (
              <Select.Option key={index} value={code}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {navigationType !== NavigationType.M_QRCODE && (
          <Form.Item name={'coordinationType'} label={'坐标系类型'} rules={[{ required: true }]}>
            <Select style={{ width: 200 }}>
              <Select.Option value={'L'}>左手坐标系</Select.Option>
              <Select.Option value={'R'}>右手坐标系</Select.Option>
            </Select>
          </Form.Item>
        )}

        <Form.Item name={'zoom'} initialValue={1} label={'缩放系数'}>
          <InputNumber />
        </Form.Item>
        <Form.Item label={'补偿偏移'}>
          <Input.Group>
            <Row gutter={10} style={{ width: '90%' }}>
              <Col span={12}>
                <Form.Item noStyle name={['compensationOffset', 'x']} initialValue={0}>
                  <InputNumber addonBefore={'X'} addonAfter={'mm'} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item noStyle name={['compensationOffset', 'Y']} initialValue={0}>
                  <InputNumber addonBefore={'Y'} addonAfter={'mm'} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          </Input.Group>
        </Form.Item>
        <Form.Item name={'compensationAngle'} initialValue={0} label={'补偿角度'}>
          <InputNumber addonAfter={'°'} />
        </Form.Item>
        <Form.Item
          name='addMap'
          initialValue={true}
          valuePropName='checked'
          {...formItemLayoutNoLabel}
        >
          <Checkbox>保存为新地图</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default connect(({ global, editor }) => ({
  currentMap: editor.currentMap,
  currentLogicArea: editor.currentLogicArea,
}))(memo(UploadMapModal));
