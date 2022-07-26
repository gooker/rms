import React, { useEffect, useState } from 'react';
import { Col, Form, Input, Modal, Row } from 'antd';
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
            consumePowerSpeed: response.consumePowerSpeed,
            actionConsumePowerSpeed: response.actionConsumePowerSpeed,
            chargeSpeed: response.chargeSpeed,
            actionSpeed: response.actionSpeed.actionSpeedConfig,
          });
        }
      });
    }
  }, [visible]);

  function submit() {
    setLoading(true);
    formRef.validateFields().then((value) => {
      updateSimulatorVehicleConfig(value).then((response) => {
        if (!dealResponse(response, true)) {
          onCancel();
        }
        setLoading(false);
      });
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
            >
              <Input suffix={'ms/%'} />
            </Form.Item>
          </Col>

          {/* 执行任务时耗电 */}
          <Col span={8}>
            <Form.Item
              name={'actionConsumePowerSpeed'}
              label={formatMessage({ id: 'simulator.config.actionConsumePowerSpeed' })}
            >
              <Input suffix={'ms/%'} />
            </Form.Item>
          </Col>

          {/* 充电速度 */}
          <Col span={8}>
            <Form.Item
              name={'chargeSpeed'}
              label={formatMessage({ id: 'simulator.config.chargeSpeed' })}
            >
              <Input suffix={'ms/%'} />
            </Form.Item>
          </Col>

          {/* 车辆启停耗时 */}
          <Col span={8}>
            <Form.Item
              name={['actionSpeed', 'startStopSpeed']}
              label={formatMessage({ id: 'simulator.config.startStopSpeed' })}
            >
              <Input suffix={'ms'} />
            </Form.Item>
          </Col>

          {/* 加速度 */}
          <Col span={8}>
            <Form.Item
              name={['actionSpeed', 'accelerateSpeed']}
              label={formatMessage({ id: 'simulator.config.accelerateSpeed' })}
            >
              <Input suffix={'mm/s²'} />
            </Form.Item>
          </Col>

          {/* 减速度 */}
          <Col span={8}>
            <Form.Item
              name={['actionSpeed', 'decelerateSpeed']}
              label={formatMessage({ id: 'simulator.config.decelerateSpeed' })}
            >
              <Input suffix={'mm/s²'} />
            </Form.Item>
          </Col>

          {/* 空车旋转速度 */}
          <Col span={8}>
            <Form.Item
              name={['actionSpeed', 'vehicleEmptyRotateSpeed']}
              label={formatMessage({ id: 'simulator.config.vehicleEmptyRotateSpeed' })}
            >
              <Input suffix={'ms/°'} />
            </Form.Item>
          </Col>

          {/* 重车旋转速度 */}
          <Col span={8}>
            <Form.Item
              name={['actionSpeed', 'vehicleHeavyRotateSpeed']}
              label={formatMessage({ id: 'simulator.config.vehicleHeavyRotateSpeed' })}
            >
              <Input suffix={'ms/°'} />
            </Form.Item>
          </Col>

          {/* 取货时间 */}
          <Col span={8}>
            <Form.Item
              name={['actionSpeed', 'pickSpeed']}
              label={formatMessage({ id: 'simulator.config.pickSpeed' })}
            >
              <Input suffix={'ms'} />
            </Form.Item>
          </Col>

          {/* 放货时间 */}
          <Col span={8}>
            <Form.Item
              name={['actionSpeed', 'putSpeed']}
              label={formatMessage({ id: 'simulator.config.putSpeed' })}
            >
              <Input suffix={'ms'} />
            </Form.Item>
          </Col>

          {/* 小车旋转90度时间 */}
          <Col span={8}>
            <Form.Item
              name={['actionSpeed', 'turn90Time']}
              label={formatMessage({ id: 'simulator.config.turn90Time' })}
            >
              <Input suffix={'ms'} />
            </Form.Item>
          </Col>

          {/* 小车旋转180度时间 */}
          <Col span={8}>
            <Form.Item
              name={['actionSpeed', 'turn180Time']}
              label={formatMessage({ id: 'simulator.config.turn180Time' })}
            >
              <Input suffix={'ms'} />
            </Form.Item>
          </Col>

          {/* 货架旋转90度时间 */}
          <Col span={8}>
            <Form.Item
              name={['actionSpeed', 'podTurn90Time']}
              label={formatMessage({ id: 'simulator.config.podTurn90Time' })}
            >
              <Input suffix={'ms'} />
            </Form.Item>
          </Col>

          {/* 货架旋转180度时间 */}
          <Col span={8}>
            <Form.Item
              name={['actionSpeed', 'podTurn180Time']}
              label={formatMessage({ id: 'simulator.config.podTurn180Time' })}
            >
              <Input suffix={'ms'} />
            </Form.Item>
          </Col>

          {/* 货架旋转速度 */}
          <Col span={8}>
            <Form.Item
              name={['actionSpeed', 'podRotateSpeed']}
              label={formatMessage({ id: 'simulator.config.podRotateSpeed' })}
            >
              <Input suffix={'ms/°'} />
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
                  name={['actionSpeed', 'runSpeed', '1']}
                  label={formatMessage({ id: 'monitor.simulator.config.1Gear' })}
                >
                  <Input suffix={'mm/s'} />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  {...layout2}
                  name={['actionSpeed', 'runSpeed', '2']}
                  label={formatMessage({ id: 'monitor.simulator.config.2Gear' })}
                >
                  <Input suffix={'mm/s'} />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  {...layout2}
                  name={['actionSpeed', 'runSpeed', '3']}
                  label={formatMessage({ id: 'monitor.simulator.config.3Gear' })}
                >
                  <Input suffix={'mm/s'} />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  {...layout2}
                  name={['actionSpeed', 'runSpeed', '4']}
                  label={formatMessage({ id: 'monitor.simulator.config.4Gear' })}
                >
                  <Input suffix={'mm/s'} />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  {...layout2}
                  name={['actionSpeed', 'runSpeed', '5']}
                  label={formatMessage({ id: 'monitor.simulator.config.5Gear' })}
                >
                  <Input suffix={'mm/s'} />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  {...layout2}
                  name={['actionSpeed', 'runSpeed', '6']}
                  label={formatMessage({ id: 'monitor.simulator.config.6Gear' })}
                >
                  <Input suffix={'mm/s'} />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </div>
      </Form>
    </Modal>
  );
}
