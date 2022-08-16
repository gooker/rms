import React, { memo, useEffect, useState } from 'react';
import { Button, Col, Divider, Form, InputNumber, Row, Select } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import {
  convertMapToArrayMap,
  dealResponse,
  formatMessage,
  getFormLayout,
  getRandomString,
  isNull,
  renderLabel,
} from '@/utils/util';
import { connect } from '@/utils/RmsDva';
import { convertQuickTaskVarToRequestStruct, formatVariableFormValues, mergeQuickTaskVar } from '../quickTaskUtil';
import { executeCustomTask } from '@/services/commonService';
import FormModal from '@/components/CommonModal';
import FormattedMessage from '@/components/FormattedMessage';
import ResourceLimit from '@/packages/SmartTask/CustomTask/components/ResourceLimit';
import TargetSelector from '@/packages/SmartTask/CustomTask/components/TargetSelector';
import BackZoneSelector from '@/packages/SmartTask/CustomTask/components/BackZoneSelector';
import { convertBackZoneToFormValue } from '@/components/VariableModification/VariableModification';
import VehicleSelector from '@/packages/SmartTask/CustomTask/components/VehicleSelector';
import commonStyle from '@/common.module.less';

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(4, 18);
const formLayout = getFormLayout(2, 22);

const ExecuteQuickTaskModal = (props) => {
  const { dispatch, customTask, quickTask } = props;
  const { loadSpecification, targetSource, executeModalVisible } = props;

  const [formRef] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!executeModalVisible) {
      formRef.resetFields();
    }
  }, [executeModalVisible]);

  function onOk() {
    formRef
      .validateFields()
      .then(async (value) => {
        setLoading(true);
        const requestBody = mergeQuickTaskVar(
          convertQuickTaskVarToRequestStruct(quickTask.variable),
          formatVariableFormValues(value),
        );

        // 将customAction的key转换成step
        let customAction = {};
        Object.entries(requestBody.customAction).forEach(([nodeCode, data]) => {
          const index = customTask.codes.indexOf(nodeCode);
          customAction[`step${index}`] = data;
        });
        requestBody.customAction = customAction;

        const response = await executeCustomTask(requestBody);
        if (!dealResponse(response, true)) {
          dispatch({ type: 'quickTask/updateExecuteModalVisible', payload: false });
        }
        setLoading(false);
      })
      .catch((reason) => {
        console.log(`[RMS]: ${reason.message}`);
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

  function getValidator(required, messageKey) {
    if (required) {
      return {
        validator: (_, value) => {
          if (!Array.isArray(value) || value.length === 0) {
            return Promise.reject(
              new Error(
                formatMessage(
                  { id: 'app.message.ruleRequired' },
                  {
                    label: formatMessage({ id: messageKey }),
                  },
                ),
              ),
            );
          } else {
            return Promise.resolve();
          }
        },
      };
    }
    return null;
  }

  function renderPartTitle(nodeCode) {
    if (nodeCode.startsWith('ACTION')) {
      if (customTask) {
        const { codes, customActions } = customTask;
        const stepIndex = codes.indexOf(nodeCode);
        const taskNode = customActions[nodeCode];
        if (taskNode && taskNode.name) {
          return renderLabel(taskNode.name);
        } else {
          const [nodeType] = nodeCode.split('_');
          return (
            <>
              <FormattedMessage id={`customTask.type.${nodeType}`} /> {stepIndex}
            </>
          );
        }
      }
      return nodeCode;
    }
    return <FormattedMessage id={`customTask.type.${nodeCode}`} />;
  }

  function renderStartVariable() {
    const { customStart } = quickTask.variable;
    if (customStart) {
      const { vehicle, vehicleLimit } = customStart;
      const doms = [
        <Divider key={getRandomString(12)} orientation={'left'}>
          {renderPartTitle('START')}
        </Divider>,
      ];

      // 如果是必填，那么默认是显示
      if (vehicle.config.isRequired || vehicle.config.visible) {
        const vehicleKey = Object.keys(vehicle.value)[0];
        doms.push(
          <Form.Item
            key={getRandomString(12)}
            name={['customStart', 'vehicle']}
            label={<FormattedMessage id='customTask.form.vehicle' />}
            initialValue={{ type: vehicleKey, code: vehicle.value[vehicleKey] }}
            rules={[{ required: vehicle.config.isRequired }]}
            {...formLayout.formItemLayout}
          >
            <VehicleSelector dataSource={targetSource} width={590} />
          </Form.Item>,
        );
      }
      if (vehicleLimit.config.isRequired || vehicleLimit.config.visible) {
        doms.push(
          <ResourceLimit
            key={getRandomString(12)}
            hidden={false}
            isRequired={vehicleLimit.config.isRequired}
            prefix={['customStart', 'vehicleLimit']}
            loadSpecification={loadSpecification}
            data={vehicleLimit.value}
          />,
        );
      }

      if (doms.length === 1) return null;
      return doms;
    }
    return null;
  }

  function renderSubTaskVariable() {
    const { customStart, customAction } = quickTask.variable;
    let vehicleSelection = convertMapToArrayMap(customStart.vehicle.value, 'type', 'code')[0];
    if (customAction) {
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
            Object.entries(preParams.value).forEach(([variableKey, variableValue]) => {
              if (preParams.config.isRequired || preParams.config.visible) {
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
                    rules={[{ required: preParams.config.isRequired }]}
                    {...formLayout.formItemLayout}
                  >
                    <TargetSelector
                      dataSource={targetSource}
                      vehicleSelection={vehicleSelection}
                      limit={variableKey}
                      width={560}
                    />
                  </Form.Item>,
                );
              }
            });
          }

          // 子任务目标点
          Object.entries(params.value).forEach(([variableKey, variableValue]) => {
            if (params.config.isRequired || params.config.visible) {
              doms.push(
                <Form.Item
                  key={getRandomString(6)}
                  name={['customAction', nodeType, 'params', variableKey]}
                  label={<FormattedMessage id={'app.common.targetCell'} />}
                  initialValue={{ type: variableKey, code: variableValue }}
                  rules={[{ required: params.config.isRequired }]}
                  {...formLayout.formItemLayout}
                >
                  <TargetSelector
                    dataSource={targetSource}
                    vehicleSelection={vehicleSelection}
                    limit={variableKey}
                    width={560}
                  />
                </Form.Item>,
              );
            }
          });

          // 载具方向
          if (!isNull(loadAngle)) {
            if (isNull(operateAngle)) {
              if (loadAngle.config.isRequired || loadAngle.config.visible) {
                doms.push(
                  <Form.Item
                    key={getRandomString(6)}
                    name={['customAction', nodeType, 'loadAngle']}
                    label={formatMessage({ id: 'resource.load.direction' })}
                    initialValue={loadAngle.value}
                    rules={[{ required: preParams?.config?.isRequired }]}
                  >
                    <InputNumber addonAfter='°' />
                  </Form.Item>,
                );
              }
            } else {
              if (loadAngle.config.isRequired || loadAngle.config.visible) {
                doms.push(
                  <Form.Item
                    key={getRandomString(6)}
                    name={['customAction', nodeType, 'loadAngle']}
                    initialValue={loadAngle.value}
                    label={formatMessage({ id: 'customTask.form.podSide' })}
                    rules={[{ required: loadAngle.config.isRequired }]}
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

              if (operateAngle.config.isRequired || operateAngle.config.visible) {
                doms.push(
                  <Form.Item
                    key={getRandomString(6)}
                    name={['customAction', nodeType, 'operateAngle']}
                    label={formatMessage({ id: 'customTask.form.operatorDirection' })}
                    initialValue={operateAngle.value}
                    rules={[{ required: operateAngle.config.isRequired }]}
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
                  </Form.Item>,
                );
              }
            }
          }

          // 行驶速度
          if (speed.config.isRequired || speed.config.visible) {
            doms.push(
              <Form.Item
                key={getRandomString(6)}
                name={['customAction', nodeType, 'speed']}
                label={formatMessage({ id: 'customTask.form.speed' })}
                initialValue={speed.value}
                rules={[{ required: speed.config.isRequired }]}
              >
                <InputNumber />
              </Form.Item>,
            );
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
    const { customEnd } = quickTask.variable;
    if (customEnd) {
      const { loadBackZone, backZone } = customEnd;
      const doms = [
        <Divider key={getRandomString(10)} orientation={'left'}>
          {renderPartTitle('END')}
        </Divider>,
      ];

      if (loadBackZone.config.isRequired || loadBackZone.config.visible) {
        const loadBackZoneInitValue = convertBackZoneToFormValue(loadBackZone.value);
        doms.push(
          <Form.List
            key={getRandomString(10)}
            name={['customEnd', 'loadBackZone']}
            initialValue={loadBackZoneInitValue}
            rules={[getValidator(loadBackZone.config.isRequired, 'customTask.form.loadBackZone')]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item
                    key={field.key}
                    required={false}
                    {...(index === 0 ? formItemLayout : formItemLayoutNoLabel)}
                    label={index === 0 ? formatMessage({ id: 'customTask.form.loadBackZone' }) : ''}
                  >
                    <Row key={field.key} gutter={10}>
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
                  </Form.Item>
                ))}
                <Button type='dashed' onClick={() => add()} style={{ width: 460 }}>
                  <PlusOutlined />
                </Button>
                <Form.ErrorList errors={errors} />
              </>
            )}
          </Form.List>,
        );
      }

      if (backZone.config.isRequired || backZone.config.visible) {
        const backZoneInitValue = convertBackZoneToFormValue(backZone.value);
        doms.push(
          <Form.List
            key={getRandomString(10)}
            name={['customEnd', 'backZone']}
            initialValue={backZoneInitValue}
            rules={[getValidator(backZone.config.isRequired, 'customTask.form.backZone')]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item
                    key={field.key}
                    required={false}
                    {...(index === 0 ? formItemLayout : formItemLayoutNoLabel)}
                    label={index === 0 ? formatMessage({ id: 'customTask.form.backZone' }) : ''}
                    style={{ marginTop: 24 }}
                  >
                    <Row key={field.key} gutter={10}>
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
                  </Form.Item>
                ))}
                <Button
                  type='dashed'
                  onClick={() => add()}
                  style={{ width: 460, marginTop: fields.length === 0 ? 24 : 0 }}
                >
                  <PlusOutlined />
                </Button>
                <Form.ErrorList errors={errors} />
              </>
            )}
          </Form.List>,
        );
      }

      if (doms.length === 1) {
        return null;
      }
      return doms;
    }
  }

  if (isNull(quickTask?.variable)) return null;
  return (
    <FormModal
      destroyOnClose
      visible={executeModalVisible}
      title={formatMessage({ id: 'quickTask.execute' })}
      width={900}
      onOk={onOk}
      okText={formatMessage({ id: 'app.button.execute' })}
      onCancel={onCancel}
      okButtonProps={{ loading }}
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
  quickTask: quickTask.editing,
  targetSource: quickTask.targetSource,
  loadSpecification: quickTask.loadSpecification,
  executeModalVisible: quickTask.executeModalVisible,
}))(memo(ExecuteQuickTaskModal));
