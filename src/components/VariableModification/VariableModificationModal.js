import React, { Fragment, memo, useEffect } from 'react';
import { Button, Card, Checkbox, Col, Divider, Form, InputNumber, Row, Select } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { isPlainObject } from 'lodash';
import { connect } from '@/utils/RmsDva';
import {
  convertMapToArrayMap,
  formatMessage,
  getFormLayout,
  getRandomString,
  isNull,
  renderLabel,
} from '@/utils/util';
import FormModal from '@/components/CommonModal';
import FormattedMessage from '@/components/FormattedMessage';
import ResourceLimit from '@/packages/SmartTask/CustomTask/components/ResourceLimit';
import TargetSelector from '@/packages/SmartTask/CustomTask/components/TargetSelector';
import BackZoneSelector from '@/packages/SmartTask/CustomTask/components/BackZoneSelector';
import VehicleSelector from '@/packages/SmartTask/CustomTask/components/VehicleSelector';

const cardStyle = {
  style: { marginBottom: 16, border: '1px solid #d4d4d4' },
  bodyStyle: { borderTop: '1px solid #d4d4d4' },
};
const { formItemLayout } = getFormLayout(4, 20);
const formLayout = getFormLayout(2, 22);

const VariableModificationModal = (props) => {
  const { quickTask, visible, customTask, onOk, onCancel, loadSpecification, targetSource } = props;

  const [formRef] = Form.useForm();

  useEffect(() => {
    if (!visible) {
      formRef.resetFields();
    }
  }, [visible]);

  function confirm() {
    formRef
      .validateFields()
      .then((values) => {
        onOk(formatVariableFormValues(values));
      })
      .catch(console.log);
  }

  function renderPartTitle(nodeType) {
    if (nodeType.startsWith('ACTION_')) {
      if (customTask) {
        const { codes, customActions } = customTask;
        const stepIndex = codes.indexOf(nodeType);
        const taskNode = customActions[nodeType];
        if (taskNode && taskNode.name) {
          return renderLabel(taskNode.name);
        } else {
          const [taskNodeType] = nodeType.split('_');
          return (
            <>
              <FormattedMessage id={`customTask.type.${taskNodeType}`} /> {stepIndex}
            </>
          );
        }
      }
      return nodeType;
    }
    return <FormattedMessage id={`customTask.type.${nodeType}`} />;
  }

  function renderStartVariable() {
    const { customStart } = quickTask.variable;
    if (customStart) {
      const { vehicle, vehicleLimit } = customStart;
      return (
        <>
          <Divider orientation={'left'}>{renderPartTitle('START')}</Divider>
          <Card
            hoverable
            {...cardStyle}
            key={getRandomString(12)}
            extra={
              <Row gutter={24}>
                <Col>
                  <Form.Item
                    noStyle
                    key={getRandomString(12)}
                    name={['customStart', 'vehicle', 'config', 'visible']}
                    initialValue={vehicle.config.visible}
                    valuePropName={'checked'}
                  >
                    <Checkbox>可见</Checkbox>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item
                    noStyle
                    name={['customStart', 'vehicle', 'config', 'isRequired']}
                    initialValue={vehicle.config.isRequired}
                    valuePropName={'checked'}
                  >
                    <Checkbox>必填</Checkbox>
                  </Form.Item>
                </Col>
              </Row>
            }
          >
            {Object.entries(vehicle.value).map(([variableKey, variableValue]) => {
              return (
                <Form.Item
                  key={getRandomString(12)}
                  name={['customStart', 'vehicle', 'value']}
                  label={<FormattedMessage id='customTask.form.vehicle' />}
                  initialValue={{ type: variableKey, code: variableValue }}
                  {...formLayout.formItemLayout}
                >
                  <VehicleSelector dataSource={targetSource} width={590} />
                </Form.Item>
              );
            })}
          </Card>

          {/****************** 资源限制 ****************/}
          <Card
            hoverable
            {...cardStyle}
            key={getRandomString(12)}
            extra={
              <Row gutter={24}>
                <Col>
                  <Form.Item
                    noStyle
                    key={getRandomString(12)}
                    name={['customStart', 'vehicleLimit', 'config', 'visible']}
                    initialValue={vehicleLimit.config.visible}
                    valuePropName={'checked'}
                  >
                    <Checkbox>可见</Checkbox>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item
                    noStyle
                    name={['customStart', 'vehicleLimit', 'config', 'isRequired']}
                    initialValue={vehicleLimit.config.isRequired}
                    valuePropName={'checked'}
                  >
                    <Checkbox>必填</Checkbox>
                  </Form.Item>
                </Col>
              </Row>
            }
          >
            <ResourceLimit
              hidden={false}
              prefix={['customStart', 'vehicleLimit', 'value']}
              loadSpecification={loadSpecification}
              data={vehicleLimit.value}
            />
          </Card>
        </>
      );
    }
  }

  function renderSubTaskVariable() {
    let { customStart = {}, customAction = {} } = quickTask.variable;
    let vehicleSelection = convertMapToArrayMap(customStart.vehicle.value, 'type', 'code')[0];
    if (customAction) {
      return Object.entries(customAction)
        .map(([nodeType, variables]) => {
          const { params, preParams, loadAngle, operateAngle, speed } = variables;
          const doms = [
            <Divider key={getRandomString(6)} orientation={'left'}>
              {renderPartTitle(nodeType)}
            </Divider>,
          ];

          // 前置任务目标点
          if (preParams) {
            Object.entries(preParams.value).forEach(([variableKey, variableValue]) => {
              doms.push(
                <Card
                  hoverable
                  {...cardStyle}
                  key={getRandomString(12)}
                  extra={
                    <Row gutter={24}>
                      <Col>
                        <Form.Item
                          noStyle
                          key={getRandomString(12)}
                          name={['customAction', nodeType, 'preParams', 'config', 'visible']}
                          initialValue={preParams.config.visible}
                          valuePropName={'checked'}
                        >
                          <Checkbox>可见</Checkbox>
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item
                          noStyle
                          name={['customAction', nodeType, 'preParams', 'config', 'isRequired']}
                          initialValue={preParams.config.isRequired}
                          valuePropName={'checked'}
                        >
                          <Checkbox>必填</Checkbox>
                        </Form.Item>
                      </Col>
                    </Row>
                  }
                >
                  <Form.Item
                    key={getRandomString(6)}
                    name={['customAction', nodeType, 'preParams', 'value']}
                    label={
                      <>
                        <FormattedMessage id={'app.common.targetCell'} />
                        (<FormattedMessage id={'app.task.pre'} />)
                      </>
                    }
                    initialValue={{ type: variableKey, code: variableValue }}
                    {...formLayout.formItemLayout}
                  >
                    <TargetSelector
                      dataSource={targetSource}
                      vehicleSelection={vehicleSelection}
                      limit={variableKey}
                      width={590}
                    />
                  </Form.Item>
                </Card>,
              );
            });
          }

          // 子任务目标点
          Object.entries(params.value).forEach(([variableKey, variableValue]) =>
            doms.push(
              <Card
                hoverable
                {...cardStyle}
                key={getRandomString(12)}
                extra={
                  <Row gutter={24}>
                    <Col>
                      <Form.Item
                        noStyle
                        key={getRandomString(12)}
                        name={['customAction', nodeType, 'params', 'config', 'visible']}
                        initialValue={params.config.visible}
                        valuePropName={'checked'}
                      >
                        <Checkbox>可见</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item
                        noStyle
                        name={['customAction', nodeType, 'params', 'config', 'isRequired']}
                        initialValue={params.config.isRequired}
                        valuePropName={'checked'}
                      >
                        <Checkbox>必填</Checkbox>
                      </Form.Item>
                    </Col>
                  </Row>
                }
              >
                <Form.Item
                  key={getRandomString(6)}
                  name={['customAction', nodeType, 'params', 'value']}
                  label={<FormattedMessage id={'app.common.targetCell'} />}
                  initialValue={{ type: variableKey, code: variableValue }}
                  {...formLayout.formItemLayout}
                >
                  <TargetSelector
                    dataSource={targetSource}
                    limit={variableKey}
                    vehicleSelection={vehicleSelection}
                    width={560}
                  />
                </Form.Item>
              </Card>,
            ),
          );

          // 与载具角度有关的，loadAngle存在的情况下才会有operateAngle数据；如果连loadAngle都没有，那么就不需要配置载具角度相关的了
          if (!isNull(loadAngle)) {
            if (isNull(operateAngle)) {
              // 载具角度
              doms.push(
                <Card
                  hoverable
                  {...cardStyle}
                  key={getRandomString(12)}
                  extra={
                    <Row gutter={24}>
                      <Col>
                        <Form.Item
                          noStyle
                          name={['customAction', nodeType, 'loadAngle', 'config', 'visible']}
                          initialValue={loadAngle.config.visible}
                          valuePropName={'checked'}
                        >
                          <Checkbox>可见</Checkbox>
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item
                          noStyle
                          name={['customAction', nodeType, 'loadAngle', 'config', 'isRequired']}
                          initialValue={loadAngle.config.isRequired}
                          valuePropName={'checked'}
                        >
                          <Checkbox>必填</Checkbox>
                        </Form.Item>
                      </Col>
                    </Row>
                  }
                >
                  <Form.Item
                    name={['customAction', nodeType, 'loadAngle', 'value']}
                    label={formatMessage({ id: 'resource.load.direction' })}
                    initialValue={loadAngle.value}
                  >
                    <InputNumber addonAfter='°' />
                  </Form.Item>
                </Card>,
              );
            } else {
              // 载具面
              doms.push(
                <Card
                  hoverable
                  {...cardStyle}
                  key={getRandomString(12)}
                  extra={
                    <Row gutter={24}>
                      <Col>
                        <Form.Item
                          noStyle
                          name={['customAction', nodeType, 'loadAngle', 'config', 'visible']}
                          initialValue={loadAngle.config.visible}
                          valuePropName={'checked'}
                        >
                          <Checkbox>可见</Checkbox>
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item
                          noStyle
                          name={['customAction', nodeType, 'loadAngle', 'config', 'isRequired']}
                          initialValue={loadAngle.config.isRequired}
                          valuePropName={'checked'}
                        >
                          <Checkbox>必填</Checkbox>
                        </Form.Item>
                      </Col>
                    </Row>
                  }
                >
                  <Form.Item
                    name={['customAction', nodeType, 'loadAngle', 'value']}
                    initialValue={loadAngle.value}
                    label={formatMessage({ id: 'customTask.form.podSide' })}
                  >
                    <Select style={{ width: 207 }}>
                      <Select.Option value={0}>
                        <FormattedMessage id={'app.pod.side.A'} />
                      </Select.Option>
                      <Select.Option value={90}>
                        <FormattedMessage id={'app.pod.side.B'} />
                      </Select.Option>
                      <Select.Option value={180}>
                        <FormattedMessage id={'app.pod.side.C'} />
                      </Select.Option>
                      <Select.Option value={270}>
                        <FormattedMessage id={'app.pod.side.D'} />
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Card>,
              );
              // 操作者位置
              doms.push(
                <Card
                  hoverable
                  {...cardStyle}
                  key={getRandomString(12)}
                  extra={
                    <Row gutter={24}>
                      <Col>
                        <Form.Item
                          noStyle
                          name={['customAction', nodeType, 'operateAngle', 'config', 'visible']}
                          initialValue={operateAngle.config.visible}
                          valuePropName={'checked'}
                        >
                          <Checkbox>可见</Checkbox>
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item
                          noStyle
                          name={['customAction', nodeType, 'operateAngle', 'config', 'isRequired']}
                          initialValue={operateAngle.config.isRequired}
                          valuePropName={'checked'}
                        >
                          <Checkbox>必填</Checkbox>
                        </Form.Item>
                      </Col>
                    </Row>
                  }
                >
                  <Form.Item
                    name={['customAction', nodeType, 'operateAngle', 'value']}
                    initialValue={operateAngle.value}
                    label={formatMessage({ id: 'customTask.form.operatorDirection' })}
                  >
                    <Select style={{ width: 207 }}>
                      <Select.Option value={90}>
                        <FormattedMessage id={'app.common.targetCell'} />
                        <FormattedMessage id={'app.direction.topSide'} />
                      </Select.Option>
                      <Select.Option value={0}>
                        <FormattedMessage id={'app.common.targetCell'} />
                        <FormattedMessage id={'app.direction.rightSide'} />
                      </Select.Option>
                      <Select.Option value={270}>
                        <FormattedMessage id={'app.common.targetCell'} />
                        <FormattedMessage id={'app.direction.bottomSide'} />
                      </Select.Option>
                      <Select.Option value={180}>
                        <FormattedMessage id={'app.common.targetCell'} />
                        <FormattedMessage id={'app.direction.leftSide'} />
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Card>,
              );
            }
          }

          // 行驶速度
          doms.push(
            <Card
              hoverable
              {...cardStyle}
              key={getRandomString(12)}
              extra={
                <Row gutter={24}>
                  <Col>
                    <Form.Item
                      noStyle
                      name={['customAction', nodeType, 'speed', 'config', 'visible']}
                      initialValue={speed.config.visible}
                      valuePropName={'checked'}
                    >
                      <Checkbox>可见</Checkbox>
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      noStyle
                      name={['customAction', nodeType, 'speed', 'config', 'isRequired']}
                      initialValue={speed.config.isRequired}
                      valuePropName={'checked'}
                    >
                      <Checkbox>必填</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
              }
            >
              <Form.Item
                name={['customAction', nodeType, 'speed', 'value']}
                label={formatMessage({ id: 'customTask.form.speed' })}
                initialValue={speed.value}
              >
                <InputNumber />
              </Form.Item>
            </Card>,
          );
          return doms;
        })
        .flat();
    }
    return null;
  }

  function renderEndVariable() {
    const variables = quickTask?.variable?.customEnd;
    if (variables?.backZone && variables?.loadBackZone) {
      const { loadBackZone, backZone } = variables;
      const backZoneInitValue = convertBackZoneToFormValue(backZone.value);
      const loadBackZoneInitValue = convertBackZoneToFormValue(loadBackZone.value);
      return (
        <>
          <Divider orientation={'left'}>{renderPartTitle('END')}</Divider>
          <Fragment>
            <Card
              hoverable
              {...cardStyle}
              key={getRandomString(12)}
              extra={
                <Row gutter={24}>
                  <Col>
                    <Form.Item
                      noStyle
                      name={['customEnd', 'loadBackZone', 'config', 'visible']}
                      initialValue={loadBackZone.config.visible}
                      valuePropName={'checked'}
                    >
                      <Checkbox>可见</Checkbox>
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      noStyle
                      name={['customEnd', 'loadBackZone', 'config', 'isRequired']}
                      initialValue={loadBackZone.config.isRequired}
                      valuePropName={'checked'}
                    >
                      <Checkbox>必填</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
              }
            >
              <Form.Item label={formatMessage({ id: 'customTask.form.loadBackZone' })}>
                <Form.List
                  name={['customEnd', 'loadBackZone', 'value']}
                  initialValue={loadBackZoneInitValue}
                >
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field, index) => (
                        <Row key={field.key} gutter={10} style={{ marginBottom: 16 }}>
                          <Col>
                            <Form.Item noStyle {...field}>
                              <BackZoneSelector />
                            </Form.Item>
                          </Col>
                          <Col style={{ display: 'flex', alignItems: 'center' }}>
                            <Button
                              onClick={() => remove(field.name)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '32px',
                              }}
                            >
                              <MinusOutlined />
                            </Button>
                          </Col>
                        </Row>
                      ))}
                      <Button type='dashed' onClick={() => add()} style={{ width: 460 }}>
                        <PlusOutlined />
                      </Button>
                    </>
                  )}
                </Form.List>
              </Form.Item>
            </Card>

            {/* 返回区域 */}
            <Card
              hoverable
              {...cardStyle}
              key={getRandomString(12)}
              extra={
                <Row gutter={24}>
                  <Col>
                    <Form.Item
                      noStyle
                      name={['customEnd', 'backZone', 'config', 'visible']}
                      initialValue={backZone.config.visible}
                      valuePropName={'checked'}
                    >
                      <Checkbox>可见</Checkbox>
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      noStyle
                      name={['customEnd', 'backZone', 'config', 'isRequired']}
                      initialValue={backZone.config.isRequired}
                      valuePropName={'checked'}
                    >
                      <Checkbox>必填</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
              }
            >
              <Form.Item label={formatMessage({ id: 'customTask.form.backZone' })}>
                <Form.List
                  name={['customEnd', 'backZone', 'value']}
                  initialValue={backZoneInitValue}
                >
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field, index) => (
                        <Row key={field.key} gutter={10} style={{ marginBottom: 16 }}>
                          <Col>
                            <Form.Item noStyle {...field}>
                              <BackZoneSelector />
                            </Form.Item>
                          </Col>
                          <Col style={{ display: 'flex', alignItems: 'center' }}>
                            <Button
                              onClick={() => remove(field.name)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '32px',
                              }}
                            >
                              <MinusOutlined />
                            </Button>
                          </Col>
                        </Row>
                      ))}
                      <Button type='dashed' onClick={() => add()} style={{ width: 460 }}>
                        <PlusOutlined />
                      </Button>
                    </>
                  )}
                </Form.List>
              </Form.Item>
            </Card>
          </Fragment>
        </>
      );
    }
  }

  if (isNull(quickTask?.variable)) return null;
  return (
    <FormModal
      title={formatMessage({ id: 'variable.task.edit' })}
      visible={visible}
      width={900}
      onOk={confirm}
      onCancel={onCancel}
    >
      <Form labelWrap form={formRef} {...formItemLayout} preserve={false}>
        {renderStartVariable()}
        {renderSubTaskVariable()}
        {renderEndVariable()}
      </Form>
    </FormModal>
  );
};
export default connect(({ quickTask }) => ({
  visible: quickTask.variableModalVisible,
  targetSource: quickTask.targetSource,
  loadSpecification: quickTask.loadSpecification,
}))(memo(VariableModificationModal));

export function formatVariableFormValues(values, hasPrefix = false) {
  function format(inputValue) {
    const result = {};
    const { customStart, customAction, customEnd } = inputValue;

    // 任务开始
    result.customStart = {
      vehicle: { value: {}, config: {} },
      vehicleLimit: { value: {}, config: {} },
    };
    const { vehicle, vehicleLimit } = customStart;
    result.customStart['vehicle']['value'][vehicle.value.type] = vehicle.value.code;
    result.customStart['vehicle']['config'] = vehicle.config;
    result.customStart.vehicleLimit = vehicleLimit;

    // 子任务
    result.customAction = {};
    Object.entries(customAction).forEach(([step, stepLoad]) => {
      if (result.customAction[step] === undefined) {
        result.customAction[step] = {};
      }
      Object.entries(stepLoad).forEach(([fieldKey, fieldValue]) => {
        if (result.customAction[step][fieldKey] === undefined) {
          result.customAction[step][fieldKey] = {};
        }
        const { config, value } = fieldValue;
        if (isPlainObject(value)) {
          result.customAction[step][fieldKey]['value'] = {};
          result.customAction[step][fieldKey]['value'][value.type] = value.code;
        } else {
          result.customAction[step][fieldKey] = fieldValue;
        }
        result.customAction[step][fieldKey]['config'] = config;
      });
    });

    // 任务结束
    result.customEnd = {
      backZone: { value: {}, config: {} },
      loadBackZone: { value: {}, config: {} },
    };
    const { backZone, loadBackZone } = customEnd;
    result.customEnd.backZone = {
      ...backZone,
      value: backZone.value.map(({ type, code }) => ({ [type]: code })),
    };
    result.customEnd.loadBackZone = {
      ...loadBackZone,
      value: loadBackZone.value.map(({ type, code }) => ({ [type]: code })),
    };
    return result;
  }

  if (hasPrefix) {
    const result = {};
    Object.entries(values).forEach(([prefix, inputValue]) => {
      result[prefix] = format(inputValue);
    });
    return result;
  }
  return format(values);
}

export function convertBackZoneToFormValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) => convertMapToArrayMap(item, 'type', 'code')[0]);
  }
  return [];
}
