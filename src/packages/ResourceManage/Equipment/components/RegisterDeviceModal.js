import React, { memo, useEffect, useState } from 'react';
import { Form, Modal, Select, Row, Col, AutoComplete, Input, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { find } from 'lodash';
import { dealResponse, getFormLayout, adaptModalHeight, formatMessage } from '@/utils/util';
import {
  findDeviceActionsByDeviceType,
  findDeviceMonitorsByDeviceType,
} from '@/services/resourceService';
import DeviceActionsModal from './DeviceActionsModal';
import DeviceStateConfigsModal from './DeviceStateConfigsModal';
import FormattedMessage from '@/components/FormattedMessage';

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
      title={formatMessage({ id: 'device.register' })}
      maskClosable={false}
      onCancel={cancelModal}
      onOk={submit}
      bodyStyle={{ maxHeight: adaptModalHeight() * 0.9, overflow: 'auto' }}
      footer={[
        <Button key="back" onClick={cancelModal}>
          <FormattedMessage id="app.button.cancel" />
        </Button>,
        <Button
          key="setAction"
          disabled={configState?.length === 0}
          onClick={() => {
            setConfigStateVisible(true);
          }}
        >
          <FormattedMessage id="device.config.statusAction" />
        </Button>,
        <Button
          key="setConfig"
          disabled={deviceActions?.length === 0}
          onClick={() => {
            setActionVisible(true);
          }}
        >
          <FormattedMessage id="device.config.deviceAction" />
        </Button>,
        <Button key="submit" type="primary" onClick={submit}>
          <FormattedMessage id="app.common,register" />
        </Button>,
      ]}
    >
      <Form form={formRef} {...formItemLayout} labelWrap>
        <Form.Item
          name={'deviceTypeCode'}
          label={formatMessage({ id: 'device.type' })}
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
          label={formatMessage({ id: 'device.id' })}
          rules={[{ required: true }, { validator: duplicateId }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={'deviceName'}
          label={formatMessage({ id: 'device.name' })}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={'connectionType'}
          label={formatMessage({ id: 'device.connectionType' })}
          rules={[{ required: true }]}
        >
          <Select>
            {Object.keys(connectTypes)?.map((item) => (
              <Select.Option key={item} value={item}>
                {connectTypes[item]}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name={'deviceDescription'} label={formatMessage({ id: 'device.description' })}>
          <Input />
        </Form.Item>

        <Form.List name={'infos'} initialValue={[{ key: null, value: null }]}>
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  {...(index === 0 ? formItemLayout : formItemLayoutNoLabel)}
                  label={index === 0 ? formatMessage({ id: 'device.configInfo' }) : ''}
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
