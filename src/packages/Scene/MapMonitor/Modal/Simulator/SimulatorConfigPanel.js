import React from 'react';
import { Input, Button, Col, Drawer, Form, InputNumber, Row } from 'antd';
import { formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { AGVType } from '@/config/config';

const layout = { labelCol: { span: 12 }, wrapperCol: { span: 12 } };
const layout2 = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
const agvTypeNameMap = {
  LatentLifting: formatMessage({ id: 'app.agvType.LatentLifting' }),
  Tote: formatMessage({ id: 'app.agvType.Tote' }),
  ForkLifting: formatMessage({ id: 'app.agvType.ForkLifting' }),
  Sorter: formatMessage({ id: 'app.agvType.Sorter' }),
};

export default function SimulatorConfigPanel(props) {
  const { simulatorConfig, robotType, onCancel, submit } = props;
  const config = simulatorConfig?.actionSpeed?.actionConfigId || {};
  const runSpeed = config && config.runSpeed ? config.runSpeed : {};
  const [formRef] = Form.useForm();

  function handleSave() {
    formRef.validateFields().then((value) => {
      let obj = null;
      if (robotType === AGVType.LatentLifting) {
        obj = {
          robotType,
          consumePowerSpeed: value.consumePowerSpeed,
          actionConsumePowerSpeed: value.actionConsumePowerSpeed,
          chargeSpeed: value.chargeSpeed,
          actionSpeed: {
            actionControl: true,
            actionConfigId: {
              upSpeed: value.upSpeed,
              downSpeed: value.downSpeed,
              podRotateSpeed: value.podRotateSpeed,
              startSpeed: value.startSpeed,
              stopSpeed: value.stopSpeed,
              backSpeed: value.backSpeed,
              startStopSpeed: value.startStopSpeed,
              agvEmptyRotateSpeed: value.agvEmptyRotateSpeed,
              agvHeavyRotateSpeed: value.agvHeavyRotateSpeed,
              podRobotRotateSpeed: value.podRobotRotateSpeed,
              runSpeed: {
                1: value.runSpeed1,
                2: value.runSpeed2,
                3: value.runSpeed3,
                4: value.runSpeed4,
                5: value.runSpeed5,
                6: value.runSpeed6,
              },
              robotType,
              consent: false,
            },
          },
        };
      } else if (robotType === AGVType.Tote) {
        obj = {
          consumePowerSpeed: value.consumePowerSpeed,
          actionConsumePowerSpeed: value.actionConsumePowerSpeed,
          chargeSpeed: value.chargeSpeed,
          robotType,
          actionSpeed: {
            actionControl: true,
            actionConfigId: {
              startSpeed: value.startSpeed,
              stopSpeed: value.stopSpeed,
              startStopSpeed: value.startStopSpeed,
              agvEmptyRotateSpeed: value.agvEmptyRotateSpeed,
              agvHeavyRotateSpeed: value.agvHeavyRotateSpeed,
              pickPlaceSpeed: value.pickPlaceSpeed,
              level: value.level,
              runSpeed: {
                1: value.runSpeed1,
                2: value.runSpeed2,
                3: value.runSpeed3,
                4: value.runSpeed4,
                5: value.runSpeed5,
                6: value.runSpeed6,
              },
              robotType,
              consent: false,
            },
          },
        };
      } else if (robotType === AGVType.ForkLifting) {
        obj = {
          consumePowerSpeed: value.consumePowerSpeed,
          actionConsumePowerSpeed: value.actionConsumePowerSpeed,
          chargeSpeed: value.chargeSpeed,
          robotType,
          actionSpeed: {
            actionControl: true,
            actionConfigId: {
              startSpeed: value.startSpeed,
              stopSpeed: value.stopSpeed,
              startStopSpeed: value.startStopSpeed,
              agvEmptyRotateSpeed: value.agvEmptyRotateSpeed,
              agvHeavyRotateSpeed: value.agvHeavyRotateSpeed,
              pickPlaceSpeed: value.pickPlaceSpeed,
              lineSpeed: value.lineSpeed,
              bezierSpeed: value.bezierSpeed,
              level: value.level,
              runSpeed: {
                1: value.runSpeed1,
                2: value.runSpeed2,
                3: value.runSpeed3,
                4: value.runSpeed4,
                5: value.runSpeed5,
                6: value.runSpeed6,
              },
              robotType,
              consent: false,
            },
          },
        };
      } else if (robotType === AGVType.Sorter) {
        obj = {
          consumePowerSpeed: value.consumePowerSpeed,
          actionConsumePowerSpeed: value.actionConsumePowerSpeed,
          chargeSpeed: value.chargeSpeed,
          robotType,
          actionSpeed: {
            actionControl: true,
            actionConfigId: {
              upSpeed: value.upSpeed,
              downSpeed: value.downSpeed,
              podRotateSpeed: value.podRotateSpeed,
              startSpeed: value.startSpeed,
              stopSpeed: value.stopSpeed,
              backSpeed: value.backSpeed,
              startStopSpeed: value.startStopSpeed,
              agvEmptyRotateSpeed: value.agvEmptyRotateSpeed,
              agvHeavyRotateSpeed: value.agvHeavyRotateSpeed,
              podRobotRotateSpeed: value.podRobotRotateSpeed,
              runSpeed: {
                1: value.runSpeed1,
                2: value.runSpeed2,
                3: value.runSpeed3,
                4: value.runSpeed4,
                5: value.runSpeed5,
                6: value.runSpeed6,
              },
              robotType,
              consent: false,
            },
          },
        };
      }
      submit && submit(obj);
    });
  }

  return (
    <Drawer width={750} visible={true} closable={false} style={{ top: 84 }}>
      <Row style={{ marginBottom: 20 }}>
        <Col span={12}>
          <h3 style={{ display: 'inline-block' }}>
            <FormattedMessage id="monitor.simulator.config.title" />
          </h3>
          <span style={{ marginLeft: 20 }}>{agvTypeNameMap[robotType]}</span>
        </Col>
        <Col span={12} style={{ textAlign: 'end' }}>
          <Button type="primary" onClick={handleSave}>
            <FormattedMessage id="app.button.save" />
          </Button>
          <Button
            style={{ marginLeft: 20 }}
            onClick={() => {
              onCancel && onCancel();
            }}
          >
            <FormattedMessage id="app.button.cancel" />
          </Button>
        </Col>
      </Row>

      <Form form={formRef} {...layout}>
        {/* 通用配置 */}
        <Row>
          <Col span={8}>
            <Form.Item
              name={'consumePowerSpeed'}
              initialValue={simulatorConfig?.consumePowerSpeed}
              label={formatMessage({ id: 'monitor.simulator.config.consumePowerSpeed' })}
            >
              <Input suffix={'ms/%'} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name={'actionConsumePowerSpeed'}
              initialValue={simulatorConfig?.actionConsumePowerSpeed}
              label={formatMessage({ id: 'monitor.simulator.config.actionConsumePowerSpeed' })}
            >
              <Input suffix={'ms/%'} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name={'chargeSpeed'}
              initialValue={simulatorConfig?.chargeSpeed}
              label={formatMessage({ id: 'monitor.simulator.config.chargeSpeed' })}
            >
              <Input suffix={'ms/%'} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name={'startStopSpeed'}
              initialValue={config?.startStopSpeed}
              label={formatMessage({ id: 'monitor.simulator.config.startStopSpeed' })}
            >
              <Input suffix={'ms'} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name={'agvEmptyRotateSpeed'}
              initialValue={config?.agvEmptyRotateSpeed}
              label={formatMessage({ id: 'monitor.simulator.config.agvEmptyRotateSpeed' })}
            >
              <Input suffix={'ms/°'} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name={'agvHeavyRotateSpeed'}
              initialValue={config?.agvHeavyRotateSpeed}
              label={formatMessage({ id: 'monitor.simulator.config.agvHeavyRotateSpeed' })}
            >
              <Input suffix={'ms/°'} />
            </Form.Item>
          </Col>
        </Row>

        {/* 潜伏车 */}
        {robotType === 'LatentLifting' && (
          <Row>
            <Col span={8}>
              <Form.Item
                name={'podRobotRotateSpeed'}
                initialValue={config?.podRobotRotateSpeed}
                label={formatMessage({ id: 'monitor.simulator.config.podRobotRotateSpeed' })}
              >
                <Input suffix={'ms/°'} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name={'backSpeed'}
                initialValue={config?.backSpeed}
                label={formatMessage({ id: 'monitor.simulator.config.backSpeed' })}
              >
                <Input suffix={'mm/s'} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name={'upSpeed'}
                initialValue={config?.upSpeed}
                label={formatMessage({ id: 'monitor.simulator.config.upSpeed' })}
              >
                <Input suffix={'ms'} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name={'downSpeed'}
                initialValue={config?.downSpeed}
                label={formatMessage({ id: 'monitor.simulator.config.downSpeed' })}
              >
                <Input suffix={'ms'} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name={'podRotateSpeed'}
                initialValue={config?.podRotateSpeed}
                label={formatMessage({ id: 'monitor.simulator.config.podRotate90Speed' })}
              >
                <Input suffix={'ms'} />
              </Form.Item>
            </Col>
          </Row>
        )}

        {/* 料箱车 */}
        {robotType === 'Tote' && (
          <Row>
            <Col span={8}>
              <Form.Item
                name={'pickPlaceSpeed'}
                initialValue={config?.pickPlaceSpeed}
                label={formatMessage({ id: 'monitor.simulator.config.pickPlaceSpeed' })}
              >
                <Input suffix={'ms'} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name={'level'}
                initialValue={config?.level}
                label={formatMessage({ id: 'app.taskDetail.layers' })}
              >
                <Input suffix={<FormattedMessage id="monitor.simulator.config.leve" />} />
              </Form.Item>
            </Col>
          </Row>
        )}

        {/* 叉车 */}
        {robotType === 'ForkLifting' && (
          <Row>
            <Col span={8}>
              <Form.Item
                name={'lineSpeed'}
                initialValue={config?.lineSpeed}
                label={formatMessage({ id: 'monitor.simulator.config.lineSpeed' })}
              >
                <InputNumber />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name={'bezierSpeed'}
                initialValue={config?.bezierSpeed}
                label={formatMessage({ id: 'monitor.simulator.config.bezierSpeed' })}
              >
                <InputNumber />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name={'pickPlaceSpeed'}
                initialValue={config?.pickPlaceSpeed}
                label={formatMessage({ id: 'monitor.simulator.config.forkPickPlaceSpeed' })}
              >
                <Input suffix={'ms'} />
              </Form.Item>
            </Col>
          </Row>
        )}

        {/* 车档位速度 */}
        <div style={{ display: 'flex', border: '1px dashed', height: '100px' }}>
          <div
            style={{
              flex: '0 15%',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <FormattedMessage id="monitor.simulator.config.AMRGearSpeed" />:
          </div>
          <div style={{ flex: 1 }}>
            <Row type={'flex'} style={{ height: '100%', alignItems: 'center', paddingRight: 20 }}>
              <Col span={8}>
                <Form.Item
                  {...layout2}
                  style={{ marginBottom: 0 }}
                  name={'runSpeed1'}
                  initialValue={runSpeed['1']}
                  label={formatMessage({ id: 'monitor.simulator.config.1Gear' })}
                >
                  <Input suffix={'mm/s'} />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  {...layout2}
                  style={{ marginBottom: 0 }}
                  name={'runSpeed2'}
                  initialValue={runSpeed['2']}
                  label={formatMessage({ id: 'monitor.simulator.config.2Gear' })}
                >
                  <Input suffix={'mm/s'} />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  {...layout2}
                  style={{ marginBottom: 0 }}
                  name={'runSpeed3'}
                  initialValue={runSpeed['3']}
                  label={formatMessage({ id: 'monitor.simulator.config.3Gear' })}
                >
                  <Input suffix={'mm/s'} />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  {...layout2}
                  style={{ marginBottom: 0 }}
                  name={'runSpeed4'}
                  initialValue={runSpeed['4']}
                  label={formatMessage({ id: 'monitor.simulator.config.4Gear' })}
                >
                  <Input suffix={'mm/s'} />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  {...layout2}
                  style={{ marginBottom: 0 }}
                  name={'runSpeed5'}
                  initialValue={runSpeed['5']}
                  label={formatMessage({ id: 'monitor.simulator.config.5Gear' })}
                >
                  <Input suffix={'mm/s'} />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  {...layout2}
                  style={{ marginBottom: 0 }}
                  name={'runSpeed6'}
                  initialValue={runSpeed['6']}
                  label={formatMessage({ id: 'monitor.simulator.config.6Gear' })}
                >
                  <Input suffix={'mm/s'} />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </div>
      </Form>
    </Drawer>
  );
}
