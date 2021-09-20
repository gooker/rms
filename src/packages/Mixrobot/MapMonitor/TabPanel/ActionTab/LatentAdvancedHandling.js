import React from 'react';
import { connect } from 'umi';
import {
  Col,
  InputNumber,
  Radio,
  Button,
  Divider,
  Card,
  Input,
  Select,
  message,
  Checkbox,
  Switch,
  Form,
} from 'antd';
import { dealResponse } from '@/utils/utils';
import intl from 'react-intl-universal';
import FormattedMessage from '@/components/FormattedMessage';
import {
  fetchSuperCarryReleasePod,
  fetchSuperPodToCell,
  fetchGetAllScopeActions,
} from '@/services/map';

const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
const noLabelLayout = { wrapperCol: { span: 16, offset: 6 } };

@connect(({ user }) => ({ user }))
class LatentAdvancedHandling extends React.Component {
  formRef = React.createRef();

  state = {
    functionArea: [],
  };

  async componentDidMount() {
    const response = await fetchGetAllScopeActions(window.localStorage.getItem('sectionId'));
    if (dealResponse(response)) {
      message.error('获取地图功能区信息失败!');
    } else {
      const functionAreaSet = new Set();
      response.forEach(({ sectionCellIdMap }) => {
        if (sectionCellIdMap) {
          Object.values(sectionCellIdMap).forEach((item) => {
            functionAreaSet.add(item);
          });
        }
      });
      this.setState({ functionArea: [...functionAreaSet] });
    }
  }

  startCarry = () => {
    const { user } = this.props;
    const { validateFields } = this.formRef.current;
    validateFields([
      'podId',
      'targetCellId',
      'targetDirection',
      'direction',
      'agvAction',
      'rotateCellId',
      'backZone',
      'scopeCodes1',
      'isBackToRestCellId',
      'robotId',
    ]).then((value) => {
      const params = {
        podId: value.podId,
        targetCellId: value.targetCellId,
        robotId: value.robotId,
        targetDirection: value.targetDirection,
        direction: value.direction,
        agvAction: value.agvAction,
        rotateCellId: value.rotateCellId,
        backZone: value.backZone,
        scopeCodes: value.scopeCodes1,
        sectionId: user.sectionId,
      };
      if (params.agvAction === 'DOWN_POD') {
        params.isBackToRestCellId = value.isBackToRestCellId;
      }
      fetchSuperPodToCell(params).then((res) => {
        if (!dealResponse(res)) {
          message.success(
            intl.formatMessage({
              id: 'app.monitorOperation.advancedHandlingRack.superPodToCellSuccess',
            }),
          );
        }
      });
    });
  };

  release = () => {
    const user = this.props.user;
    const { validateFields } = this.formRef.current;
    validateFields(['podId', 'taskId', 'backZone', 'scopeCodes']).then((value) => {
      const params = {
        ...value,
        sectionId: user.sectionId,
      };
      fetchSuperCarryReleasePod(params).then((res) => {
        if (!dealResponse(res)) {
          message.success(
            intl.formatMessage({
              id: 'app.monitorOperation.advancedHandlingRack.releasePodSuccess',
            }),
          );
        }
      });
    });
  };

  render() {
    const locale = window.localStorage.getItem('umi_locale') || 'zh-CN';
    const { functionArea } = this.state;
    return (
      <Form ref={this.formRef}>
        <Form.Item
          {...layout}
          name={'podId'}
          label={intl.formatMessage({ id: 'app.monitorOperation.pod' })}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          {...layout}
          name={'targetCellId'}
          label={intl.formatMessage({ id: 'app.monitorOperation.targetCell' })}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          {...layout}
          name={'robotId'}
          label={intl.formatMessage({ id: 'app.monitorOperation.robotId' })}
        >
          <InputNumber />
        </Form.Item>

        <Divider orientation="left">
          <FormattedMessage id="app.monitorOperation.advancedHandlingRack.advancedFeature" />
        </Divider>

        <Card bordered={false}>
          <Form.Item
            {...layout}
            name={'targetDirection'}
            label={intl.formatMessage({ id: 'app.monitorOperation.targetDirection' })}
          >
            <Radio.Group
              buttonStyle="solid"
              options={[
                { label: intl.formatMessage({ id: 'app.monitorOperation.faceA' }), value: 0 },
                { label: intl.formatMessage({ id: 'app.monitorOperation.faceB' }), value: 1 },
                { label: intl.formatMessage({ id: 'app.monitorOperation.faceC' }), value: 2 },
                { label: intl.formatMessage({ id: 'app.monitorOperation.faceD' }), value: 3 },
                {
                  label: intl.formatMessage({
                    id: 'app.monitorOperation.advancedHandlingRack.noRotation',
                  }),
                  value: null,
                },
              ]}
            />
          </Form.Item>

          <Form.Item
            {...(locale === 'zh-CN'
              ? layout
              : {
                  labelCol: { span: 8 },
                  wrapperCol: { span: 16 },
                })}
            name={'direction'}
            label={intl.formatMessage({
              id: 'app.monitorOperation.advancedHandlingRack.operationPoint',
            })}
          >
            <Radio.Group
              options={[
                {
                  label: intl.formatMessage({
                    id: 'app.monitorOperation.advancedHandlingRack.aboveTargetPoint',
                  }),
                  value: 0,
                },
                {
                  label: intl.formatMessage({
                    id: 'app.monitorOperation.advancedHandlingRack.rightTargetPoint',
                  }),
                  value: 1,
                },
                {
                  label: intl.formatMessage({
                    id: 'app.monitorOperation.advancedHandlingRack.BelowTargetPoint',
                  }),
                  value: 2,
                },
                {
                  label: intl.formatMessage({
                    id: 'app.monitorOperation.advancedHandlingRack.leftTargetPoint',
                  }),
                  value: 3,
                },
              ]}
              buttonStyle="solid"
            />
          </Form.Item>

          <Form.Item
            {...layout}
            name={'agvAction'}
            label={intl.formatMessage({
              id: 'app.monitorOperation.advancedHandlingRack.arrivalStatus',
            })}
          >
            <Radio.Group
              options={[
                {
                  label: intl.formatMessage({
                    id: 'app.monitorOperation.advancedHandlingRack.putDown',
                  }),
                  value: 'DOWN_POD',
                },
                {
                  label: intl.formatMessage({
                    id: 'app.monitorOperation.advancedHandlingRack.notPutDown',
                  }),
                  value: 'CARRY_POD',
                },
              ]}
              buttonStyle="solid"
            />
          </Form.Item>

          {this.formRef?.current?.getFieldValue('agvAction') === 'DOWN_POD' && (
            <Form.Item
              {...layout}
              name={'isBackToRestCellId'}
              initialValue={false}
              valuePropName={'checked'}
              label={intl.formatMessage({
                id: 'app.monitorOperation.advancedHandlingRack.toRestPoint',
              })}
            >
              <Switch
                checkedChildren={intl.formatMessage({
                  id: 'app.monitorOperation.advancedHandlingRack.yes',
                })}
                unCheckedChildren={intl.formatMessage({
                  id: 'app.monitorOperation.advancedHandlingRack.no',
                })}
              />
            </Form.Item>
          )}

          <Form.Item
            {...(locale === 'zh-CN'
              ? layout
              : {
                  labelCol: { span: 8 },
                  wrapperCol: { span: 16 },
                })}
            name={'rotateCellId'}
            label={intl.formatMessage({
              id: 'app.monitorOperation.advancedHandlingRack.rotateCell',
            })}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            {...layout}
            name={'backZone'}
            label={intl.formatMessage({ id: 'app.monitorOperation.advancedHandlingRack.backZone' })}
          >
            <Checkbox.Group>
              {functionArea?.map((item) => (
                <Checkbox key={item} value={item}>
                  {item}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Form.Item>

          <Form.Item
            {...layout}
            name={'scopeCodes1'}
            label={intl.formatMessage({
              id: 'app.monitorOperation.advancedHandlingRack.scopeCode',
            })}
          >
            <Select mode="tags" />
          </Form.Item>

          <Form.Item {...noLabelLayout}>
            <Col span={12}>
              <Button type="primary" onClick={this.startCarry}>
                <FormattedMessage id="app.monitorOperation.carryPod" />
              </Button>
            </Col>
          </Form.Item>
        </Card>

        <Divider orientation="left">
          <FormattedMessage id="app.monitorOperation.advancedHandlingRack.releasePod" />
        </Divider>

        <Card bordered={false}>
          <Form.Item
            {...layout}
            name={'podId'}
            label={intl.formatMessage({ id: 'app.monitorOperation.pod' })}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            {...layout}
            name={'taskId'}
            label={intl.formatMessage({ id: 'app.monitorOperation.advancedHandlingRack.taskId' })}
          >
            <Input />
          </Form.Item>

          <Form.Item
            {...layout}
            name={'backZone'}
            label={intl.formatMessage({ id: 'app.monitorOperation.advancedHandlingRack.backZone' })}
          >
            <Checkbox.Group>
              {functionArea?.map((item) => (
                <Checkbox key={item} value={item}>
                  {item}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Form.Item>

          <Form.Item
            {...layout}
            name={'scopeCodes'}
            label={intl.formatMessage({
              id: 'app.monitorOperation.advancedHandlingRack.scopeCode',
            })}
          >
            <Select mode="tags" />
          </Form.Item>

          <Form.Item {...noLabelLayout}>
            <Col span={12}>
              <Button type="primary" onClick={this.release}>
                <FormattedMessage id="app.monitorOperation.advancedHandlingRack.release" />
              </Button>
            </Col>
          </Form.Item>
        </Card>
      </Form>
    );
  }
}
export default LatentAdvancedHandling;
