import React, { useEffect, useState } from 'react';
import { Col, Form, InputNumber, Modal, Row } from 'antd';
import { dealResponse, formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { fetchSimulatorVehicleConfig, updateSimulatorVehicleConfig } from '@/services/monitorService';

const layout = { labelCol: { span: 12 }, wrapperCol: { span: 12 } };
const layout2 = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };

export default function SimulatorConfigModal(props) {
  const { visible, adapterType, onCancel } = props;

  const [formRef] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && adapterType) {
      fetchSimulatorVehicleConfig(adapterType).then((response) => {
        if (!dealResponse(response)) {
          formRef.setFieldsValue({
            speed: response.speed,
            consumePowerSpeed: response.consumePowerSpeed,
            actionConsumePowerSpeed: response.actionConsumePowerSpeed,
            chargeSpeed: response.chargeSpeed,
            actionSpeedConfig: response.actionSpeedConfig,
          });
        }
      });
    }
  }, [visible]);

  function submit() {
    formRef
      .validateFields()
      .then((value) => {
        setLoading(true);
        updateSimulatorVehicleConfig({ ...value, adapterType }).then((response) => {
          if (!dealResponse(response, true)) {
            onCancel();
          }
          setLoading(false);
        });
      })
      .catch(() => {
      });
  }

  return (
    <Modal
      title={formatMessage({ id: 'simulator.config.title' })}
      width={1000}
      visible={visible}
      closable={false}
      maskClosable={false}
      keyboard={false}
      onCancel={onCancel}
      onOk={submit}
      okButtonProps={{ loading }}
      style={{ top: 30 }}
    >
      <Form labelWrap form={formRef} {...layout}>
        <Row gutter={16}>
          {/* 耗电速度 */}
          <Col span={8}>
            <Form.Item
              name={'consumePowerSpeed'}
              label={formatMessage({ id: 'simulator.config.consumePowerSpeed' })}
              rules={[{ required: true }]}
            >
              <InputNumber addonAfter={'ms/%'} />
            </Form.Item>
          </Col>

          {/* 执行任务时耗电 */}
          <Col span={8}>
            <Form.Item
              name={'actionConsumePowerSpeed'}
              label={formatMessage({ id: 'simulator.config.actionConsumePowerSpeed' })}
              rules={[{ required: true }]}
            >
              <InputNumber addonAfter={'ms/%'} />
            </Form.Item>
          </Col>

          {/* 充电速度 */}
          <Col span={8}>
            <Form.Item
              name={'chargeSpeed'}
              label={formatMessage({ id: 'simulator.config.chargeSpeed' })}
              rules={[{ required: true }]}
            >
              <InputNumber addonAfter={'ms/%'} />
            </Form.Item>
          </Col>

          {/* 倍速模拟 */}
          <Col span={8}>
            <Form.Item
              name={'speed'}
              label={formatMessage({ id: 'simulator.config.simulationRate' })}
              rules={[{ required: true }]}
            >
              <InputNumber />
            </Form.Item>
          </Col>

          {/* 车辆启停耗时 */}
          <Col span={8}>
            <Form.Item
              name={['actionSpeedConfig', 'startStopSpeed']}
              label={formatMessage({ id: 'simulator.config.startStopSpeed' })}
              rules={[{ required: true }]}
            >
              <InputNumber addonAfter={'ms'} />
            </Form.Item>
          </Col>

          {/* 加速度 */}
          <Col span={8}>
            <Form.Item
              name={['actionSpeedConfig', 'accelerateSpeed']}
              label={formatMessage({ id: 'simulator.config.accelerateSpeed' })}
              rules={[{ required: true }]}
            >
              <InputNumber addonAfter={'mm/s²'} />
            </Form.Item>
          </Col>

          {/* 减速度 */}
          <Col span={8}>
            <Form.Item
              name={['actionSpeedConfig', 'decelerateSpeed']}
              label={formatMessage({ id: 'simulator.config.decelerateSpeed' })}
              rules={[{ required: true }]}
            >
              <InputNumber addonAfter={'mm/s²'} />
            </Form.Item>
          </Col>

          {/* 空车旋转速度 */}
          <Col span={8}>
            <Form.Item
              name={['actionSpeedConfig', 'vehicleEmptyRotateSpeed']}
              label={formatMessage({ id: 'simulator.config.vehicleEmptyRotateSpeed' })}
              rules={[{ required: true }]}
            >
              <InputNumber addonAfter={'ms/°'} />
            </Form.Item>
          </Col>

          {/* 重车旋转速度 */}
          <Col span={8}>
            <Form.Item
              name={['actionSpeedConfig', 'vehicleHeavyRotateSpeed']}
              label={formatMessage({ id: 'simulator.config.vehicleHeavyRotateSpeed' })}
              rules={[{ required: true }]}
            >
              <InputNumber addonAfter={'ms/°'} />
            </Form.Item>
          </Col>

          {/* 取货时间 */}
          <Col span={8}>
            <Form.Item
              name={['actionSpeedConfig', 'pickSpeed']}
              label={formatMessage({ id: 'simulator.config.pickSpeed' })}
              rules={[{ required: true }]}
            >
              <InputNumber addonAfter={'ms'} />
            </Form.Item>
          </Col>

          {/* 放货时间 */}
          <Col span={8}>
            <Form.Item
              name={['actionSpeedConfig', 'putSpeed']}
              label={formatMessage({ id: 'simulator.config.putSpeed' })}
              rules={[{ required: true }]}
            >
              <InputNumber addonAfter={'ms'} />
            </Form.Item>
          </Col>

          {/* 货架旋转速度 */}
          <Col span={8}>
            <Form.Item
              name={['actionSpeedConfig', 'podRotateSpeed']}
              label={formatMessage({ id: 'simulator.config.podRotateSpeed' })}
              rules={[{ required: true }]}
            >
              <InputNumber addonAfter={'ms/°'} />
            </Form.Item>
          </Col>
        </Row>

        {/* 车档位速度 */}
        <div style={{ display: 'flex', border: '1px dashed', paddingTop: 24 }}>
          <div
            style={{
              flex: '0 15%',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <FormattedMessage id='monitor.simulator.config.AMRGearSpeed' />:
          </div>
          <div style={{ flex: 1 }}>
            <Row type={'flex'} style={{ height: '100%', alignItems: 'center', paddingRight: 20 }}>
              <Col span={8}>
                <Form.Item
                  {...layout2}
                  name={['actionSpeedConfig', 'runSpeed', '1']}
                  label={formatMessage({ id: 'monitor.simulator.config.1Gear' })}
                  rules={[{ required: true }]}
                >
                  <InputNumber addonAfter={'mm/s'} />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  {...layout2}
                  name={['actionSpeedConfig', 'runSpeed', '2']}
                  label={formatMessage({ id: 'monitor.simulator.config.2Gear' })}
                  rules={[{ required: true }]}
                >
                  <InputNumber addonAfter={'mm/s'} />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  {...layout2}
                  name={['actionSpeedConfig', 'runSpeed', '3']}
                  label={formatMessage({ id: 'monitor.simulator.config.3Gear' })}
                  rules={[{ required: true }]}
                >
                  <InputNumber addonAfter={'mm/s'} />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  {...layout2}
                  name={['actionSpeedConfig', 'runSpeed', '4']}
                  label={formatMessage({ id: 'monitor.simulator.config.4Gear' })}
                  rules={[{ required: true }]}
                >
                  <InputNumber addonAfter={'mm/s'} />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  {...layout2}
                  name={['actionSpeedConfig', 'runSpeed', '5']}
                  label={formatMessage({ id: 'monitor.simulator.config.5Gear' })}
                  rules={[{ required: true }]}
                >
                  <InputNumber addonAfter={'mm/s'} />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  {...layout2}
                  name={['actionSpeedConfig', 'runSpeed', '6']}
                  label={formatMessage({ id: 'monitor.simulator.config.6Gear' })}
                  rules={[{ required: true }]}
                >
                  <InputNumber addonAfter={'mm/s'} />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </div>
      </Form>
    </Modal>
  );
}
