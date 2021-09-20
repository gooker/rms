import React, { Component } from 'react';
import intl from 'react-intl-universal';
import { Input, Button, Col, Drawer, Form, InputNumber, Row } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import Config from '@/config';

const layout = {
  labelCol: { span: 12 },
  wrapperCol: { span: 12 },
};
const layout2 = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

export default class SimulatorConfig extends Component {
  formRef = React.createRef();

  agvTypeNameMap = {
    LatentLifting: intl.formatMessage({ id: 'app.simulator.type.latent' }),
    Tote: intl.formatMessage({ id: 'app.simulator.type.tote' }),
    ForkLifting: intl.formatMessage({ id: 'app.simulator.type.fork' }),
  };

  handleSave = () => {
    const { submit, robotType, sectionId } = this.props;
    const { validateFields } = this.formRef.current;
    validateFields().then((value) => {
      let obj = null;
      if (robotType === Config.AGVType.LatentLifting) {
        obj = {
          robotType,
          consumePowerSpeed: value.consumePowerSpeed,
          actionConsumePowerSpeed: value.actionConsumePowerSpeed,
          chargeSpeed: value.chargeSpeed,
          actionSpeed: {
            actionControl: true,
            actionConfigId: {
              sectionId,
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
      } else if (robotType === Config.AGVType.Tote) {
        obj = {
          consumePowerSpeed: value.consumePowerSpeed,
          actionConsumePowerSpeed: value.actionConsumePowerSpeed,
          chargeSpeed: value.chargeSpeed,
          robotType,
          actionSpeed: {
            actionControl: true,
            actionConfigId: {
              sectionId,
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
      } else if (robotType === Config.AGVType.ForkLifting) {
        obj = {
          consumePowerSpeed: value.consumePowerSpeed,
          actionConsumePowerSpeed: value.actionConsumePowerSpeed,
          chargeSpeed: value.chargeSpeed,
          robotType,
          actionSpeed: {
            actionControl: true,
            actionConfigId: {
              sectionId,
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
      } else if (robotType === Config.AGVType.Sorter) {
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
              sectionId,
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
  };

  render() {
    const { robotType, simulatorConfig } = this.props;

    if (!simulatorConfig) return;
    const {
      actionSpeed: { actionConfigId },
    } = simulatorConfig;

    const config = actionConfigId || {};
    const runSpeed = config && config.runSpeed ? config.runSpeed : {};
    return (
      <Drawer width={850} visible={true} closable={false}>
        <Row style={{ marginBottom: 20 }}>
          <Col span={12}>
            <h3 style={{ display: 'inline-block' }}>
              <FormattedMessage id="app.simulator.config.title" />
            </h3>
            <span style={{ marginLeft: 20 }}>{this.agvTypeNameMap[robotType]}</span>
          </Col>
          <Col span={12} style={{ textAlign: 'end' }}>
            <Button type="primary" onClick={this.handleSave}>
              <FormattedMessage id="app.simulator.action.save" />
            </Button>
            <Button
              style={{ marginLeft: 20 }}
              onClick={() => {
                const { onCancel } = this.props;
                onCancel && onCancel();
              }}
            >
              <FormattedMessage id="app.simulator.action.cancel" />
            </Button>
          </Col>
        </Row>

        <Form ref={this.formRef}>
          {/* 通用配置 */}
          <Row>
            <Col span={8}>
              <Form.Item
                {...layout}
                name={'consumePowerSpeed'}
                initialValue={simulatorConfig.consumePowerSpeed}
                label={intl.formatMessage({ id: 'app.simulator.config.consumePowerSpeed' })}
              >
                <Input suffix={'ms/%'} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                {...layout}
                name={'actionConsumePowerSpeed'}
                initialValue={simulatorConfig.actionConsumePowerSpeed}
                label={intl.formatMessage({ id: 'app.simulator.config.actionConsumePowerSpeed' })}
              >
                <Input suffix={'ms/%'} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                {...layout}
                name={'chargeSpeed'}
                initialValue={simulatorConfig.chargeSpeed}
                label={intl.formatMessage({ id: 'app.simulator.config.chargeSpeed' })}
              >
                <Input suffix={'ms/%'} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                {...layout}
                name={'startStopSpeed'}
                initialValue={config.startStopSpeed}
                label={intl.formatMessage({ id: 'app.simulator.config.startStopSpeed' })}
              >
                <Input suffix={'ms'} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                {...layout}
                name={'agvEmptyRotateSpeed'}
                initialValue={config.agvEmptyRotateSpeed}
                label={intl.formatMessage({ id: 'app.simulator.config.agvEmptyRotateSpeed' })}
              >
                <Input suffix={'ms/°'} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                {...layout}
                name={'agvHeavyRotateSpeed'}
                initialValue={config.agvHeavyRotateSpeed}
                label={intl.formatMessage({ id: 'app.simulator.config.agvHeavyRotateSpeed' })}
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
                  {...layout}
                  name={'podRobotRotateSpeed'}
                  initialValue={config.podRobotRotateSpeed}
                  label={intl.formatMessage({ id: 'app.simulator.config.podRobotRotateSpeed' })}
                >
                  <Input suffix={'ms/°'} />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  {...layout}
                  name={'backSpeed'}
                  initialValue={config.backSpeed}
                  label={intl.formatMessage({ id: 'app.simulator.config.backSpeed' })}
                >
                  <Input suffix={'mm/s'} />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  {...layout}
                  name={'upSpeed'}
                  initialValue={config.upSpeed}
                  label={intl.formatMessage({ id: 'app.simulator.config.upSpeed' })}
                >
                  <Input suffix={'ms'} />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  {...layout}
                  name={'downSpeed'}
                  initialValue={config.downSpeed}
                  label={intl.formatMessage({ id: 'app.simulator.config.downSpeed' })}
                >
                  <Input suffix={'ms'} />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  {...layout}
                  name={'podRotateSpeed'}
                  initialValue={config.podRotateSpeed}
                  label={intl.formatMessage({ id: 'app.simulator.config.podRotate90Speed' })}
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
                  {...layout}
                  name={'pickPlaceSpeed'}
                  initialValue={config.pickPlaceSpeed}
                  label={intl.formatMessage({ id: 'app.simulator.config.pickPlaceSpeed' })}
                >
                  <Input suffix={'ms'} />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  {...layout}
                  name={'level'}
                  initialValue={config.level}
                  label={intl.formatMessage({ id: 'app.simulator.config.levelCount' })}
                >
                  <Input suffix={<FormattedMessage id="app.simulator.config.leve" />} />
                </Form.Item>
              </Col>
            </Row>
          )}

          {/* 叉车 */}
          {robotType === 'ForkLifting' && (
            <Row>
              <Col span={8}>
                <Form.Item
                  {...layout}
                  name={'lineSpeed'}
                  initialValue={config.lineSpeed}
                  label={intl.formatMessage({ id: 'app.simulator.config.lineSpeed' })}
                >
                  <InputNumber />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  {...layout}
                  name={'bezierSpeed'}
                  initialValue={config.bezierSpeed}
                  label={intl.formatMessage({ id: 'app.simulator.config.bezierSpeed' })}
                >
                  <InputNumber />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  {...layout}
                  name={'pickPlaceSpeed'}
                  initialValue={config.pickPlaceSpeed}
                  label={intl.formatMessage({ id: 'app.simulator.config.forkPickPlaceSpeed' })}
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
              <FormattedMessage id="app.simulator.config.AMRGearSpeed" />:
            </div>
            <div style={{ flex: 1 }}>
              <Row type={'flex'} style={{ height: '100%', alignItems: 'center', paddingRight: 20 }}>
                <Col span={8}>
                  <Form.Item
                    {...layout2}
                    style={{ marginBottom: 0 }}
                    name={'runSpeed1'}
                    initialValue={runSpeed['1']}
                    label={intl.formatMessage({ id: 'app.simulator.config.1Gear' })}
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
                    label={intl.formatMessage({ id: 'app.simulator.config.2Gear' })}
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
                    label={intl.formatMessage({ id: 'app.simulator.config.3Gear' })}
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
                    label={intl.formatMessage({ id: 'app.simulator.config.4Gear' })}
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
                    label={intl.formatMessage({ id: 'app.simulator.config.5Gear' })}
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
                    label={intl.formatMessage({ id: 'app.simulator.config.6Gear' })}
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
}
