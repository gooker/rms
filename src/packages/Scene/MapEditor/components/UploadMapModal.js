import React, { memo, useState } from 'react';
import { Checkbox, Col, Form, Input, InputNumber, message, Modal, Row, Select, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import { connect } from '@/utils/RmsDva';
import { formatMessage, getFormLayout, isNull } from '@/utils/util';
import {
  convertMushinyOldMapToNew,
  extractFromOldMap,
  getMapName,
  isOldMushinyMap,
  MUSHINY,
  SEER,
} from '@/utils/mapParser';
import { NavigationType, NavigationTypeView } from '@/config/config';

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
    setNavigationType(null);
    onCancel();
  }

  function handleFile() {
    formRef
      .validateFields()
      .then(({ file, navigationType, addMap, ...transform }) => {
        const reader = new FileReader();
        // beforeUpload返回false情况下, antd选择后的文件file是经过包装的数据，获取真是文件对象需要取file.originFileObj. WTF???
        reader.readAsText(file[0].originFileObj, 'UTF-8');
        reader.onload = async (evt) => {
          try {
            const fileMapData = JSON.parse(evt.target.result);
            if (addMap) {
              let mapData;
              if (navigationType === NavigationType.M_QRCODE) {
                if (isOldMushinyMap(fileMapData)) {
                  // 旧版牧星地图需要特地的转换逻辑
                  mapData = convertMushinyOldMapToNew(fileMapData);
                } else {
                  mapData = fileMapData;
                  // 新版地图数据结构只要改变下部分附属数据即可
                  mapData.sectionId = window.localStorage.getItem('sectionId');
                }
              } else {
                const mapName = getMapName(fileMapData, navigationType);
                if (navigationType === NavigationType.SEER_SLAM) {
                  mapData = SEER(fileMapData, [], {
                    getMap: true,
                    mapName,
                    currentLogicArea,
                    transform: transform,
                  });
                } else {
                  message.error(
                    `${formatMessage({
                      id: 'app.map.navigation.unrecognizedType',
                    })}: ${navigationType}`,
                  );
                }
              }
              if (!isNull(mapData)) {
                const result = await dispatch({ type: 'editor/importMap', payload: mapData });
                result && cancel();
              }
            } else {
              let payload;
              const existIds = Object.keys(currentMap.cellMap).map((item) => parseInt(item));
              if (navigationType === NavigationType.M_QRCODE) {
                // 这个逻辑分支只会在增量导入情况下运行
                if (isOldMushinyMap(fileMapData)) {
                  payload = extractFromOldMap(fileMapData);
                } else {
                  payload = MUSHINY(fileMapData, existIds, { currentLogicArea });
                }
              } else if (navigationType === NavigationType.SEER_SLAM) {
                payload = SEER(fileMapData, existIds, {
                  currentLogicArea,
                });
              } else {
                message.error(
                  `${formatMessage({
                    id: 'app.map.navigation.unrecognizedType',
                  })}: ${navigationType}`,
                );
              }
              if (!isNull(payload)) {
                const result = await dispatch({
                  type: 'editor/incrementalImportMap',
                  payload: { ...payload, transform },
                });
                result && cancel();
              }
            }
          } catch (err) {
            // eslint-disable-next-line no-console
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
          name="file"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true }]}
        >
          <Upload.Dragger
            name="files"
            maxCount={1}
            beforeUpload={() => false}
            onRemove={() => true}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
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

        {/* 选择牧星地图时候就不需要选择坐标系类型了 */}
        {navigationType !== NavigationType.M_QRCODE && (
          <Form.Item
            name={'coordinationType'}
            label={formatMessage({ id: 'app.map.coordinationType' })}
            rules={[{ required: true }]}
          >
            <Select style={{ width: 200 }}>
              <Select.Option value={'L'}>
                <FormattedMessage id="app.map.coordination.lefthand" />
              </Select.Option>
              <Select.Option value={'R'}>
                <FormattedMessage id="app.map.coordination.righthand" />
              </Select.Option>
            </Select>
          </Form.Item>
        )}

        <Form.Item
          name={'zoom'}
          initialValue={1}
          label={<FormattedMessage id="app.map.scalingFactor" />}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item label={<FormattedMessage id="app.map.offsetCompensation" />}>
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
        <Form.Item
          name={'compensationAngle'}
          initialValue={0}
          label={<FormattedMessage id="app.map.angleCompensation" />}
        >
          <InputNumber addonAfter={'°'} />
        </Form.Item>
        <Form.Item
          name="addMap"
          initialValue={true}
          valuePropName="checked"
          {...formItemLayoutNoLabel}
        >
          <Checkbox>
            <FormattedMessage id="app.map.save.newMap" />
          </Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default connect(({ global, editor }) => ({
  currentMap: editor.currentMap,
  currentLogicArea: editor.currentLogicArea,
}))(memo(UploadMapModal));
