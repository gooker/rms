/* TODO: I18N */
import React, { memo, useEffect, useState } from 'react';
import { Button, Col, Divider, Form, InputNumber, Modal, Row, Select } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { merge } from 'lodash';
import { connect } from '@/utils/RmsDva';
import {
  convertMapToArrayMap,
  dealResponse,
  formatMessage,
  getRandomString,
  isEmptyPlainObject,
  isNull,
} from '@/utils/util';
import { executeCustomTask } from '@/services/commonService';
import FormattedMessage from '@/components/FormattedMessage';
import VehicleVariable from '@/components/VariableModification/VehicleVariable';
import TargetSelector from '@/packages/SmartTask/CustomTask/components/TargetSelector';
import BackZoneSelector from '@/packages/SmartTask/CustomTask/components/BackZoneSelector';
import { VehicleOptionType } from '@/packages/SmartTask/CustomTask/components/VehicleSelector';
import { convertBackZoneToFormValue } from '@/components/VariableModification/VariableModification';

const ExecuteQuickTaskModal = (props) => {
  const { dispatch, customTask, quickTask, executeModalVisible } = props;

  const [formRef] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!executeModalVisible) {
      formRef.resetFields();
    }
  }, [executeModalVisible]);

  function onOk() {
    formRef.validateFields().then(async (value) => {
      setLoading(true);
      const requestBody = merge(quickTask.variable, value);
      const response = await executeCustomTask(requestBody);
      if (!dealResponse(response, true)) {
        dispatch({ type: 'quickTask/updateExecuteModalVisible', payload: false });
      }
      setLoading(false);
    });
  }

  function onCancel() {
    dispatch({
      type: 'quickTask/updateState',
      payload: {
        editing: null,
        executeModalVisible: false,
      },
    });
  }

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
    const variables = quickTask?.variable?.customStart;
    if (variables && !isEmptyPlainObject(variables)) {
      // 不需要显示资源限制
      const vehicleConfig = variables.vehicle;
      const vehicleKey = Object.keys(vehicleConfig)[0];
      const hideVehicleSelector =
        vehicleKey === VehicleOptionType.VEHICLE && vehicleConfig[vehicleKey].length === 0;
      if (!hideVehicleSelector) {
        return (
          <>
            <Divider orientation={'left'}>{renderPartTitle('START')}</Divider>
            <Form.Item
              key={getRandomString(6)}
              name={['customStart', 'vehicle']}
              label={<FormattedMessage id='customTask.form.vehicle' />}
              initialValue={{ type: vehicleKey, code: vehicleConfig[vehicleKey] }}
            >
              <VehicleVariable />
            </Form.Item>
          </>
        );
      } else {
        return null;
      }
    }
  }

  function renderSubTaskVariable() {
    if (isNull(quickTask)) return;
    const { customStart, customAction } = quickTask?.variable ?? {};
    let vehicleSelection = convertMapToArrayMap(customStart.vehicle, 'type', 'code')[0];
    if (customAction && !isEmptyPlainObject(customAction)) {
      const nodes = Object.entries(customAction)
        .map(([nodeType, variables]) => {
          const { params, preParams, loadAngle, operateAngle, speed } = variables;
          const doms = [
            <Divider key={getRandomString(6)} orientation={'left'}>
              {renderPartTitle(nodeType)}
            </Divider>,
          ];

          // 前置任务目标点
          if (preParams) {
            Object.entries(preParams).forEach(([variableKey, variableValue]) => {
              if (variableValue.length === 0) {
                doms.push(
                  <Form.Item
                    key={getRandomString(6)}
                    name={['customAction', nodeType, 'preParams', variableKey]}
                    label={
                      <>
                        <FormattedMessage id={'app.common.targetCell'} />
                        (<FormattedMessage id={'app.task.pre'} />)
                      </>
                    }
                    initialValue={{ type: variableKey, code: variableValue }}
                  >
                    <TargetSelector vehicleSelection={vehicleSelection} limit={variableKey} />
                  </Form.Item>,
                );
              }
            });
          }

          // 子任务目标点
          Object.entries(params).forEach(([variableKey, variableValue]) => {
            if (variableValue.length === 0) {
              doms.push(
                <Form.Item
                  key={getRandomString(6)}
                  name={['customAction', nodeType, 'params', variableKey]}
                  label={<FormattedMessage id={'app.common.targetCell'} />}
                  initialValue={{ type: variableKey, code: variableValue }}
                >
                  <TargetSelector vehicleSelection={vehicleSelection} limit={variableKey} />
                </Form.Item>,
              );
            }
          });

          if (isNull(operateAngle)) {
            if (isNull(loadAngle)) {
              doms.push(
                <Form.Item
                  key={getRandomString(6)}
                  name={['customAction', nodeType, 'loadAngle']}
                  label={formatMessage({ id: 'resource.load.direction' })}
                  initialValue={loadAngle}
                >
                  <InputNumber addonAfter='°' />
                </Form.Item>,
              );
            }
          } else {
            if (isNull(loadAngle)) {
              doms.push(
                <Form.Item
                  key={getRandomString(6)}
                  name={['customAction', nodeType, 'loadAngle']}
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
                </Form.Item>,
              );
            }

            if (isNull(operateAngle)) {
              doms.push(
                <Form.Item
                  key={getRandomString(6)}
                  name={['customAction', nodeType, 'operateAngle']}
                  initialValue={operateAngle}
                  label={formatMessage({ id: 'customTask.form.operatorDirection' })}
                >
                  <Select style={{ width: 207 }}>
                    <Select.Option value={0}>
                      <FormattedMessage id={'app.common.targetCell'} />
                      <FormattedMessage id={'app.direction.topSide'} />
                    </Select.Option>
                    <Select.Option value={90}>
                      <FormattedMessage id={'app.common.targetCell'} />
                      <FormattedMessage id={'app.direction.rightSide'} />
                    </Select.Option>
                    <Select.Option value={180}>
                      <FormattedMessage id={'app.common.targetCell'} />
                      <FormattedMessage id={'app.direction.bottomSide'} />
                    </Select.Option>
                    <Select.Option value={270}>
                      <FormattedMessage id={'app.common.targetCell'} />
                      <FormattedMessage id={'app.direction.leftSide'} />
                    </Select.Option>
                  </Select>
                </Form.Item>,
              );
            }
          }
          return doms;
        })
        .flat();

      if (nodes.length === 1) {
        return null;
      }
      return nodes;
    }
    return null;
  }

  function renderEndVariable() {
    const variables = quickTask?.variable?.customEnd;
    if (variables && variables?.backZone && variables?.loadBackZone) {
      const { loadBackZone, backZone } = variables;

      const doms = [
        <Divider key={getRandomString(10)} orientation={'left'}>
          {renderPartTitle('END')}
        </Divider>,
      ];

      if (
        !Array.isArray(loadBackZone) ||
        (Array.isArray(loadBackZone) && loadBackZone.length === 0)
      ) {
        const loadBackZoneInitValue = convertBackZoneToFormValue(loadBackZone);
        doms.push(
          <Form.Item
            key={getRandomString(10)}
            label={formatMessage({ id: 'customTask.form.loadBackZone' })}
          >
            <Form.List name={['customEnd', 'loadBackZone']} initialValue={loadBackZoneInitValue}>
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
          </Form.Item>,
        );
      }

      if (!Array.isArray(backZone) || (Array.isArray(backZone) && backZone.length === 0)) {
        const backZoneInitValue = convertBackZoneToFormValue(backZone);
        doms.push(
          <Form.Item label={formatMessage({ id: 'customTask.form.backZone' })}>
            <Form.List name={['customEnd', 'backZone']} initialValue={backZoneInitValue}>
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
          </Form.Item>,
        );
      }

      if (doms.length === 1) {
        return null;
      }
      return doms;
    }
  }

  return (
    <Modal
      visible={executeModalVisible}
      title={'执行快捷任务'}
      width={800}
      maskClosable={false}
      closable={false}
      onOk={onOk}
      okText={'执行'}
      onCancel={onCancel}
      okButtonProps={{ loading }}
    >
      <Form layout={'vertical'} form={formRef}>
        {renderStartVariable()}
        {renderSubTaskVariable()}
        {renderEndVariable()}
      </Form>
    </Modal>
  );
};
export default connect(({ quickTask }) => ({
  quickTask: quickTask.editing,
  executeModalVisible: quickTask.executeModalVisible,
}))(memo(ExecuteQuickTaskModal));
