/* TODO: I18N */
import React, { memo, useEffect, useState } from 'react';
import { Form, Modal, Select, Row, Col, AutoComplete, Input, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { dealResponse, getFormLayout, adaptModalHeight } from '@/utils/util';
import { findDeviceActionsByDeviceType } from '@/services/resourceManageAPI';
import DeviceActionsModal from './DeviceActionsModal';

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(5, 17);
const RegisterDeviceModal = (props) => {
  const { dispatch, visible, allDeviceTypes, onSubmit } = props;
  const [formRef] = Form.useForm();
  const [deviceActions, setDeviceActions] = useState([]);
  const [actionVisible, setActionVisible] = useState(false); // 设备动作modal
  const [deviceType, setDeviceType] = useState(null); // 设备动作

  useEffect(() => {
    if (!visible) {
      formRef.resetFields();
      setDeviceActions([]);
    }
  }, [visible]);

  function submit() {
    formRef
      .validateFields()
      .then((values) => {
        const { actionentitys, infos, deviceType } = values;

        console.log(values);
        let actionConfigurationsEntity = { keyValue: {} };
        const configs = {};
        infos?.map(({ key, value }) => {
          configs[key] = value;
        });
        actionentitys?.map(({ key, value }) => {
          actionConfigurationsEntity.keyValue[key] = value;
        });

        onSubmit({ actionConfigurationsEntity, configs, deviceType });
      })
      .catch(() => {});
  }

  async function onDeviceTypeChange(e) {
    const response = await findDeviceActionsByDeviceType({ deviceType: e });
    if (!dealResponse(response)) {
      setDeviceActions(response);
    }
  }

  function cancelModal() {
    dispatch({ type: 'equipList/updateRegisterDeviceModalShown', payload: false });
  }

  return (
    <Modal
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
          key="set"
          type="primary"
          disabled={deviceActions?.length === 0}
          onClick={() => {
            setActionVisible(true);
          }}
        >
          配置设备动作
        </Button>,
        <Button key="submit" type="primary" onClick={submit}>
          确定
        </Button>,
      ]}
    >
      <Form form={formRef} {...formItemLayout} labelWrap>
        <Form.Item
          name={'deviceType'}
          label={'设备类型'}
          rules={[{ required: true }]}
          getValueFromEvent={(e) => {
            onDeviceTypeChange(e);
            setDeviceType(e);
            return e;
          }}
        >
          <Select>
            {allDeviceTypes.map(({ code, name, deviceAdapterTypeCode }) => {
              return (
                <Select.Option key={code} value={code}>
                  {name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.List name={'infos'} initialValue={[{ key: null, value: null }]}>
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  {...(index === 0 ? formItemLayout : formItemLayoutNoLabel)}
                  label={index === 0 ? '设备配置信息' : ''}
                  required={true}
                  key={field.key}
                >
                  <Row gutter={10}>
                    <Col span={9}>
                      <Form.Item
                        noStyle
                        {...field}
                        name={[field.name, 'key']}
                        rules={[{ required: true }]}
                      >
                        <AutoComplete placeholder={'key'} />
                      </Form.Item>
                    </Col>
                    <Col span={11}>
                      <Form.Item
                        noStyle
                        {...field}
                        name={[field.name, 'value']}
                        rules={[{ required: true }]}
                      >
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

      <DeviceActionsModal
        visible={actionVisible}
        deviceActions={deviceActions}
        onCancelModal={() => {
          setActionVisible(false);
        }}
        deviceType={deviceType}
        onRefresh={() => {
          onDeviceTypeChange(deviceType);
        }}
      />
    </Modal>
  );
};
export default connect(({ equipList }) => ({
  allDeviceTypes: equipList.allDeviceTypes,
  visible: equipList.registerDeviceModalShown,
}))(memo(RegisterDeviceModal));
