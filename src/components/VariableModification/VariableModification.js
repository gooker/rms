import React, { Fragment, memo } from 'react';
import { Button, Col, Divider, Form, InputNumber, Row, Select } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import {
  convertMapToArrayMap,
  formatMessage,
  getFormLayout,
  getRandomString,
  isEmptyPlainObject,
  isNull,
} from '@/utils/util';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';
import VehicleVariable from '@/components/VariableModification/VehicleVariable';
import ResourceLimit from '@/packages/SmartTask/CustomTask/components/ResourceLimit';
import TargetSelector from '@/packages/SmartTask/CustomTask/components/TargetSelector';
import BackZoneSelector from '@/packages/SmartTask/CustomTask/components/BackZoneSelector';
import commonStyle from '@/common.module.less';

const { formItemLayout } = getFormLayout(4, 18);
const VariableModification = (props) => {
  const { prefix, form, variable, customTask, loadSpecification, targetSource } = props;

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
    } else {
      if (customTask) {
        const { customActions } = customTask;
        const taskNode = customActions?.[nodeType];
        if (taskNode && taskNode.name) {
          return taskNode.name;
        } else {
          return (
            <>
              <FormattedMessage id={`customTask.type.${nodeType}`} />
            </>
          );
        }
      }
    }
  }

  function renderStartVariable() {
    const variables = variable.customStart;
    if (variables?.vehicle && variables?.vehicleLimit) {
      const { vehicle, vehicleLimit } = variables;
      return (
        <>
          <Divider orientation={'left'}>{renderPartTitle('START')}</Divider>
          {Object.entries(vehicle).map(([variableKey, variableValue]) => {
            return (
              <Form.Item
                key={getRandomString(6)}
                name={prefix ? [prefix, 'customStart', 'vehicle'] : ['customStart', 'vehicle']}
                label={<FormattedMessage id="customTask.form.vehicle" />}
                initialValue={{ type: variableKey, code: variableValue }}
              >
                <VehicleVariable dataSource={targetSource} />
              </Form.Item>
            );
          })}

          {/****************** 资源限制 ****************/}
          <ResourceLimit
            hidden={false}
            prefix={
              prefix ? [prefix, 'customStart', 'vehicleLimit'] : ['customStart', 'vehicleLimit']
            }
            loadSpecification={loadSpecification}
            data={vehicleLimit}
          />
        </>
      );
    }
  }

  function renderSubTaskVariable() {
    let { customStart, customAction } = variable;
    const vehicleName = prefix ? [prefix, 'customStart', 'vehicle'] : ['customStart', 'vehicle'];
    if (customAction && !isEmptyPlainObject(customAction)) {
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
            Object.entries(preParams).forEach(([variableKey, variableValue]) =>
              doms.push(
                <Form.Item
                  key={getRandomString(6)}
                  name={
                    prefix
                      ? [prefix, 'customAction', nodeType, 'preParams', variableKey]
                      : ['customAction', nodeType, 'preParams', variableKey]
                  }
                  label={
                    <>
                      <FormattedMessage id={'app.common.targetCell'} />
                      (<FormattedMessage id={'app.task.pre'} />)
                    </>
                  }
                  initialValue={{ type: variableKey, code: variableValue }}
                >
                  <TargetSelector
                    limit={variableKey}
                    dataSource={targetSource}
                    form={form}
                    vehiclePathName={vehicleName}
                  />
                </Form.Item>,
              ),
            );
          }

          // 子任务目标点
          Object.entries(params).forEach(([variableKey, variableValue]) =>
            doms.push(
              <Form.Item
                key={getRandomString(6)}
                name={
                  prefix
                    ? [prefix, 'customAction', nodeType, 'params', variableKey]
                    : ['customAction', nodeType, 'params', variableKey]
                }
                label={<FormattedMessage id={'app.common.targetCell'} />}
                initialValue={{ type: variableKey, code: variableValue }}
              >
                <TargetSelector
                  dataSource={targetSource}
                  limit={variableKey}
                  form={form}
                  vehiclePathName={vehicleName}
                />
              </Form.Item>,
            ),
          );

          if (isNull(operateAngle)) {
            doms.push(
              <Form.Item
                key={getRandomString(6)}
                name={
                  prefix
                    ? [prefix, 'customAction', nodeType, 'loadAngle']
                    : ['customAction', nodeType, 'loadAngle']
                }
                label={formatMessage({ id: 'resource.load.direction' })}
                initialValue={loadAngle}
              >
                <InputNumber addonAfter="°" />
              </Form.Item>,
            );
          } else {
            doms.push(
              <>
                <Form.Item
                  key={getRandomString(6)}
                  name={
                    prefix
                      ? [prefix, 'customAction', nodeType, 'loadAngle']
                      : ['customAction', nodeType, 'loadAngle']
                  }
                  initialValue={loadAngle}
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
                <Form.Item
                  key={getRandomString(6)}
                  name={
                    prefix
                      ? [prefix, 'customAction', nodeType, 'operateAngle']
                      : ['customAction', nodeType, 'operateAngle']
                  }
                  initialValue={operateAngle}
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
              </>,
            );
          }

          // 行驶速度
          doms.push(
            <Form.Item
              key={getRandomString(6)}
              name={
                prefix
                  ? [prefix, 'customAction', nodeType, 'speed']
                  : ['customAction', nodeType, 'speed']
              }
              label={formatMessage({ id: 'customTask.form.speed' })}
              initialValue={speed}
            >
              <InputNumber />
            </Form.Item>,
          );
          return doms;
        })
        .flat();
    }
    return null;
  }

  function renderEndVariable() {
    const variables = variable.customEnd;
    if (variables?.backZone && variables?.loadBackZone) {
      const { loadBackZone, backZone } = variables;
      const loadBackZoneInitValue = convertBackZoneToFormValue(loadBackZone);
      const backZoneInitValue = convertBackZoneToFormValue(backZone);
      return (
        <>
          <Divider orientation={'left'}>{renderPartTitle('END')}</Divider>
          <Fragment>
            {/* 载具自动放回储位 */}
            <Form.Item label={formatMessage({ id: 'customTask.form.loadBackZone' })}>
              <Form.List
                name={
                  prefix ? [prefix, 'customEnd', 'loadBackZone'] : ['customEnd', 'loadBackZone']
                }
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
                            className={commonStyle.flexCenter}
                            style={{ width: '32px' }}
                          >
                            <MinusOutlined />
                          </Button>
                        </Col>
                      </Row>
                    ))}
                    <Button type="dashed" onClick={() => add()} style={{ width: 460 }}>
                      <PlusOutlined />
                    </Button>
                  </>
                )}
              </Form.List>
            </Form.Item>

            {/* 自动找停车点 */}
            <Form.Item label={formatMessage({ id: 'customTask.form.backZone' })}>
              <Form.List
                initialValue={backZoneInitValue}
                name={prefix ? [prefix, 'customEnd', 'backZone'] : ['customEnd', 'backZone']}
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
                            className={commonStyle.flexCenter}
                            style={{ width: '32px' }}
                          >
                            <MinusOutlined />
                          </Button>
                        </Col>
                      </Row>
                    ))}
                    <Button type="dashed" onClick={() => add()} style={{ width: 460 }}>
                      <PlusOutlined />
                    </Button>
                  </>
                )}
              </Form.List>
            </Form.Item>
          </Fragment>
        </>
      );
    }
  }

  return (
    <Form labelWrap form={form} {...formItemLayout}>
      {renderStartVariable()}
      {renderSubTaskVariable()}
      {renderEndVariable()}
    </Form>
  );
};
export default connect(({ quickTask }) => ({
  targetSource: quickTask.targetSource,
}))(memo(VariableModification));

export function convertBackZoneToFormValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) => convertMapToArrayMap(item, 'type', 'code')[0]);
  }
  return [];
}
