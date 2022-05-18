/* TODO: I18N */
import React, { memo, useEffect, useState } from 'react';
import { Form, Modal, Select, Row, Col, AutoComplete, Input, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { find } from 'lodash';
import { dealResponse, getFormLayout, adaptModalHeight, formatMessage } from '@/utils/util';
import {
  findDeviceActionsByDeviceType,
  findDeviceMonitorsByDeviceType,
} from '@/services/resourceManageAPI';
import DeviceActionsModal from './DeviceActionsModal';
import DeviceStateConfigsModal from './DeviceStateConfigsModal';

const connectTypes = {
  MODBUS_TCP: 'MODBUS_TCP',
  MODBUS_RTU: 'MODBUS_RTU',
  HTTP: 'HTTP',
  TCP: 'TCP',
  UDP: 'UDP',
};

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(5, 17);
const RegisterDeviceModal = (props) => {
  const { dispatch, deviceMonitorData, visible, allDeviceTypes, allDevices, onSubmit } = props;
  const [formRef] = Form.useForm();
  const [deviceActions, setDeviceActions] = useState([]); // 设备动作
  const [actionVisible, setActionVisible] = useState(false); // 设备动作modal

  const [configState, setConfigState] = useState([]); // 配置状态options
  const [configStateVisible, setConfigStateVisible] = useState(false); // 配置状态动作modal

  useEffect(() => {
    if (!visible) {
      formRef.resetFields();
      setDeviceActions([]);
      setConfigState([]);
    }
  }, [visible]);

  function submit() {
    formRef
      .validateFields()
      .then((values) => {
        const { infos } = values;
        const newParams = { ...values };
        const configs = {};
        infos?.map(({ key, value }) => {
          configs[key] = value;
        });
        delete newParams.infos;
        onSubmit({
          ...newParams,
          deviceActionDTO: deviceActions,
          deviceMonitorDTO: deviceMonitorData,
        });
      })
      .catch(() => {});
  }

  async function onDeviceTypeChange(e) {
    const params = { deviceTypeCode: e, deviceId: '' };
    const [response, stateData] = await Promise.all([
      findDeviceActionsByDeviceType(params),
      findDeviceMonitorsByDeviceType(params),
    ]);
    if (!dealResponse(response) && !dealResponse(stateData)) {
      const actions = [...response];
      const configState = [...stateData];
      setDeviceActions(actions);
      setConfigState(configState);
    }
  }

  function duplicateId(_, value) {
    const recordIndex = find(allDevices, { deviceID: value });
    if (recordIndex && Object.keys(recordIndex)?.length > 0) {
      return Promise.reject(new Error(formatMessage({ id: 'app.form.id.duplicate' })));
    }

    return Promise.resolve();
  }

  function cancelModal() {
    dispatch({ type: 'equipList/updateRegisterDeviceModalShown', payload: false });
    dispatch({ type: 'equipList/saveState', payload: { deviceMonitorData: [] } });
  }

  return (
    <Modal
      destroyOnClose
      visible={visible}
      title={'设备注册'}
      maskClosable={false}
      onCancel={cancelModal}
      onOk={submit}
      bodyStyle={{ maxHeight: adaptModalHeight() * 0.9, overflow: 'auto' }}
      footer={[
        <Button key="back" onClick={cancelModal}>
          取消
        </Button>,
        <Button
          key="setAction"
          disabled={configState?.length === 0}
          onClick={() => {
            setConfigStateVisible(true);
          }}
        >
          配置状态动作
        </Button>,
        <Button
          key="setConfig"
          disabled={deviceActions?.length === 0}
          onClick={() => {
            setActionVisible(true);
          }}
        >
          配置设备动作
        </Button>,
        <Button key="submit" type="primary" onClick={submit}>
          注册
        </Button>,
      ]}
    >
      <Form form={formRef} {...formItemLayout} labelWrap>
        <Form.Item
          name={'deviceTypeCode'}
          label={'设备类型'}
          rules={[{ required: true }]}
          getValueFromEvent={(e) => {
            onDeviceTypeChange(e);
            return e;
          }}
        >
          <Select>
            {allDeviceTypes.map(({ deviceType }) => {
              return (
                <Select.Option key={deviceType.code} value={deviceType.code}>
                  {deviceType.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item
          name={'deviceID'}
          label={'设备Id'}
          rules={[{ required: true }, { validator: duplicateId }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name={'deviceName'} label={'设备名称'} rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name={'connectionType'} label={'连接方式'} rules={[{ required: true }]}>
          <Select>
            {Object.keys(connectTypes)?.map((item) => (
              <Select.Option key={item} value={item}>
                {connectTypes[item]}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name={'deviceDescription'} label={'设备描述'}>
          <Input />
        </Form.Item>

        <Form.List name={'infos'} initialValue={[{ key: null, value: null }]}>
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  {...(index === 0 ? formItemLayout : formItemLayoutNoLabel)}
                  label={index === 0 ? '设备配置信息' : ''}
                  key={field.key}
                >
                  <Row gutter={10}>
                    <Col span={9}>
                      <Form.Item noStyle {...field} name={[field.name, 'key']}>
                        <AutoComplete placeholder={'key'} />
                      </Form.Item>
                    </Col>
                    <Col span={11}>
                      <Form.Item noStyle {...field} name={[field.name, 'value']}>
                        <Input placeholder={'value'} />
                      </Form.Item>
                    </Col>
                    <Col span={4} style={{ textAlign: 'center' }}>
                      {fields.length > 1 ? (
                        <MinusCircleOutlined
                          onClick={() => remove(field.name)}
                          style={{ fontSize: 16 }}
                        />
                      ) : null}
                    </Col>
                  </Row>
                </Form.Item>
              ))}
              <Form.Item {...formItemLayoutNoLabel}>
                <Button type="dashed" onClick={() => add()} style={{ width: '60%' }}>
                  <PlusOutlined />
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>

      {/* 设备动作 */}
      {actionVisible && (
        <DeviceActionsModal
          visible={actionVisible}
          deviceActions={deviceActions}
          onCancelModal={() => {
            setActionVisible(false);
          }}
          onSave={(values) => {
            setDeviceActions(values);
          }}
        />
      )}

      {/* 状态动作 */}
      {configStateVisible && (
        <DeviceStateConfigsModal
          visible={configStateVisible}
          onCancel={() => {
            setConfigStateVisible(false);
          }}
          configs={configState}
        />
      )}
    </Modal>
  );
};
export default connect(({ equipList }) => ({
  allDevices: equipList.allDevices,
  allDeviceTypes: equipList.allDeviceTypes,
  visible: equipList.registerDeviceModalShown,
  deviceMonitorData: equipList.deviceMonitorData,
}))(memo(RegisterDeviceModal));
