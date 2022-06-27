import React, { Fragment, memo } from 'react';
import { Button, Col, Divider, Form, InputNumber, Row, Select, Switch } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { isPlainObject } from 'lodash';
import { formatMessage, getRandomString, isEmptyPlainObject, isNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import VehicleVariable from '@/components/VariableModification/VehicleVariable';
import TargetSelector from '@/packages/SmartTask/CustomTask/components/TargetSelector';
import { VehicleOptionType } from '@/packages/SmartTask/CustomTask/components/VehicleSelector';
import BackZoneSelector from '@/packages/SmartTask/CustomTask/components/BackZoneSelector';

const VariableModification = (props) => {
  const { prefix, form, variable, customTask } = props;

  function renderPartTitle(nodeType) {
    if (nodeType.startsWith('step')) {
      if (customTask) {
        const { codes, customActions } = customTask;
        const stepIndex = Number.parseInt(nodeType.replace('step', ''));
        const taskNodeCode = codes[stepIndex];
        const taskNode = customActions[taskNodeCode];
        if (taskNode && taskNode.name) {
          return taskNode.name;
        } else {
          const [nodeType] = taskNodeCode.split('_');
          return (
            <>
              <FormattedMessage id={`customTask.type.${nodeType}`} /> {stepIndex}
            </>
          );
        }
      }
      return nodeType;
    }
    return <FormattedMessage id={`customTask.type.${nodeType}`} />;
  }

  function renderStartVariable() {
    const customParams = variable?.customParams;
    if (customParams && !isEmptyPlainObject(customParams)) {
      const variables = customParams.START;
      return (
        <>
          <Divider orientation={'left'}>{renderPartTitle('START')}</Divider>
          {Object.entries(variables).map(([variableKey, variableValue]) => {
            if (VehicleOptionType[variableKey]) {
              return (
                <Form.Item
                  hidden={variableKey === 'AUTO'}
                  key={getRandomString(6)}
                  name={prefix ? [prefix, 'START', variableKey] : ['START', variableKey]}
                  label={variableKey}
                  initialValue={{ type: variableKey, code: variables[variableKey] }}
                >
                  <VehicleVariable />
                </Form.Item>
              );
            } else {
              // 资源限制
              return (
                <Fragment>
                  {/* 可接小车电量约束 */}
                  <Form.Item
                    name={
                      prefix
                        ? [prefix, 'START', 'customLimit', 'vehicleBatteryLimit']
                        : ['START', 'customLimit', 'vehicleBatteryLimit']
                    }
                    label={formatMessage({
                      id: 'customTask.form.resourceLimit.vehicleBattery',
                    })}
                    initialValue={variableValue.vehicleBatteryLimit}
                  >
                    <InputNumber allowClear style={{ width: 90 }} />
                  </Form.Item>
                  {/* 车身可用容器数量约束 */}
                  <Form.Item
                    name={
                      prefix
                        ? [prefix, 'START', 'customLimit', 'canUseContainerCountLimit']
                        : ['START', 'customLimit', 'canUseContainerCountLimit']
                    }
                    label={formatMessage({
                      id: 'customTask.form.resourceLimit.availableContainerCountLimit',
                    })}
                    initialValue={variableValue.canUseContainerCountLimit}
                  >
                    <InputNumber allowClear style={{ width: 90 }} />
                  </Form.Item>
                  {/* 容器规格约束 */}
                  <Form.Item
                    name={
                      prefix
                        ? [prefix, 'START', 'customLimit', 'canUseContainerLimit']
                        : ['START', 'customLimit', 'canUseContainerLimit']
                    }
                    label={formatMessage({
                      id: 'customTask.form.resourceLimit.containerTypeLimit',
                    })}
                    initialValue={variableValue.canUseContainerLimit ?? []}
                  >
                    <Select allowClear mode={'multiple'}></Select>
                  </Form.Item>
                  {/* 载具规格约束 */}
                  <Form.Item
                    name={
                      prefix
                        ? [prefix, 'START', 'customLimit', 'canUseLoadTypeLimit']
                        : ['START', 'customLimit', 'canUseLoadTypeLimit']
                    }
                    label={formatMessage({
                      id: 'customTask.form.resourceLimit.loadTypeLimit',
                    })}
                    initialValue={variableValue.canUseLoadTypeLimit ?? []}
                  >
                    <Select allowClear mode={'multiple'}></Select>
                  </Form.Item>
                  {/* 是否要求的载具ID必须有待命车辆持有 */}
                  <Form.Item
                    name={
                      prefix
                        ? [prefix, 'START', 'customLimit', 'isLimitStandBy']
                        : ['START', 'customLimit', 'isLimitStandBy']
                    }
                    label={formatMessage({
                      id: 'customTask.form.resourceLimit.isLimitStandBy',
                    })}
                    initialValue={variableValue.isLimitStandBy ?? false}
                    valuePropName={'checked'}
                  >
                    <Switch />
                  </Form.Item>
                  {/* 是否可以使用工作中的载具 */}
                  <Form.Item
                    name={
                      prefix
                        ? [prefix, 'START', 'customLimit', 'canUseWorkLimit']
                        : ['START', 'customLimit', 'canUseWorkLimit']
                    }
                    label={formatMessage({
                      id: 'customTask.form.resourceLimit.loadWorkLimit',
                    })}
                    initialValue={variableValue.canUseWorkLimit ?? false}
                    valuePropName={'checked'}
                  >
                    <Switch />
                  </Form.Item>
                </Fragment>
              );
            }
          })}
        </>
      );
    }
  }

  function renderSubTaskVariable() {
    let vehicleSelection;
    let customParams = variable?.customParams;
    if (customParams && !isEmptyPlainObject(customParams)) {
      customParams = { ...customParams };
      // 从START中获取当前选择的小车
      for (const [type, code] of Object.entries(customParams.START)) {
        if (VehicleOptionType[type]) {
          vehicleSelection = { type, code };
          break;
        }
      }
      delete customParams.START;
      delete customParams.END;
      return Object.entries(customParams)
        .map(([nodeType, variables]) => {
          return (
            <>
              <Divider orientation={'left'}>{renderPartTitle(nodeType)}</Divider>
              {Object.keys(variables).map((variableKey) => {
                if (variableKey === 'loadAngle') {
                  return (
                    <Form.Item
                      key={getRandomString(6)}
                      name={prefix ? [prefix, nodeType, 'loadAngle'] : [nodeType, 'loadAngle']}
                      label={formatMessage({ id: 'object.load.direction' })}
                      initialValue={variables[variableKey]}
                    >
                      <InputNumber addonAfter='°' />
                    </Form.Item>
                  );
                } else {
                  return (
                    <Form.Item
                      key={getRandomString(6)}
                      name={prefix ? [prefix, nodeType, variableKey] : [nodeType, variableKey]}
                      label={<FormattedMessage id={'app.common.targetCell'} />}
                      initialValue={{
                        type: variableKey,
                        code: variables[variableKey],
                      }}
                    >
                      <TargetSelector vehicleSelection={vehicleSelection} />
                    </Form.Item>
                  );
                }
              })}
            </>
          );
        })
        .filter(Boolean);
    }
    return null;
  }

  function renderEndVariable() {
    const customParams = variable?.customParams;
    if (customParams && !isEmptyPlainObject(customParams)) {
      const variables = customParams.END;
      return (
        <>
          <Divider orientation={'left'}>{renderPartTitle('END')}</Divider>
          <Fragment>
            <Form.Item label={formatMessage({ id: 'customTask.form.heavyBackZone' })}>
              <Form.List
                name={prefix ? [prefix, 'END', 'heavyBackZone'] : ['END', 'heavyBackZone']}
                initialValue={variables.heavyBackZone ?? []}
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

            {/* 返回区域 */}
            <Form.Item label={formatMessage({ id: 'customTask.form.backZone' })}>
              <Form.List
                name={prefix ? [prefix, 'END', 'backZone'] : ['END', 'backZone']}
                initialValue={variables.backZone ?? []}
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

            {/* 自动充电 */}
            <Form.Item
              name={prefix ? [prefix, 'END', 'vehicleNeedCharge'] : ['END', 'vehicleNeedCharge']}
              initialValue={variables.vehicleNeedCharge ?? true}
              valuePropName={'checked'}
              label={formatMessage({ id: 'customTask.form.vehicleNeedCharge' })}
            >
              <Switch />
            </Form.Item>
          </Fragment>
        </>
      );
    }
  }

  return (
    <Form layout={'vertical'} form={form}>
      {renderStartVariable()}
      {renderSubTaskVariable()}
      {renderEndVariable()}
    </Form>
  );
};
export default memo(VariableModification);

export function formatVariableFormValues(values, hasPrefix = false) {
  function format(inputValue) {
    const result = { START: inputValue.START, END: inputValue.END };
    const _values = { ...inputValue };
    delete _values.END;
    Object.entries(_values).forEach(([stepKey, stepValue]) => {
      result[stepKey] = {};
      Object.entries(stepValue).forEach(([field, value]) => {
        if (isPlainObject(value) && !isNull(value.code)) {
          result[stepKey][field] = value.code;
        } else {
          result[stepKey][field] = value;
        }
      });
    });
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
