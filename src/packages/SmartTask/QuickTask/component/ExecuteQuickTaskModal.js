/* TODO: I18N */
import React, { Fragment, memo, useState } from 'react';
import { Button, Col, Divider, Form, InputNumber, Modal, Row } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { cloneDeep, isEmpty } from 'lodash';
import { connect } from '@/utils/RmsDva';
import { dealResponse, formatMessage, getRandomString, isEmptyPlainObject, isNull } from '@/utils/util';
import { executeCustomTask } from '@/services/commonService';
import FormattedMessage from '@/components/FormattedMessage';
import TargetVariable from '@/components/VariableModification/TargetVariable';
import VehicleVariable from '@/components/VariableModification/VehicleVariable';
import { VehicleOptionType } from '@/packages/SmartTask/CustomTask/components/VehicleSelector';
import BackZoneSelector from '@/packages/SmartTask/CustomTask/components/BackZoneSelector';

const ExecuteQuickTaskModal = (props) => {
  const { dispatch, customTask, quickTask, executeModalVisible } = props;

  const [formRef] = Form.useForm();
  const [loading, setLoading] = useState(false);

  function onOk() {
    formRef.validateFields().then(async (value) => {
      setLoading(true);
      const variable = cloneDeep(quickTask.variable);
      const newParams = {};
      Object.entries(value).forEach(([code, param]) => {
        newParams[code] = param;
      });
      variable.customParams.forEach((item) => {
        if (newParams[item.code]) {
          item.param = newParams[item.code].code;
        }
      });
      const response = await executeCustomTask(variable);
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
    const customParams = quickTask?.variable?.customParams;
    if (customParams && !isEmptyPlainObject(customParams)) {
      const variables = customParams.START;
      const dom = Object.entries(variables)
        .map(([fieldKey, fieldValue]) => {
          if (VehicleOptionType[fieldKey] && fieldKey !== 'AUTO') {
            return (
              <Form.Item
                key={getRandomString(6)}
                name={['START', fieldKey]}
                label={fieldKey}
                initialValue={{ type: fieldKey, code: fieldValue }}
              >
                <VehicleVariable />
              </Form.Item>
            );
          }
          return null;
        })
        .filter(Boolean);

      if (dom.length > 0) {
        return (
          <>
            <Divider orientation={'left'}>{renderPartTitle('START')}</Divider>
            {dom}
          </>
        );
      }
    }
  }

  function renderSubTaskVariable() {
    let vehicleSelection;
    let customParams = quickTask?.variable?.customParams;
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
          const dom = Object.entries(variables)
            .map(([variableKey, variableValue]) => {
              if (variableKey === 'loadAngle') {
                if (isNull(variableValue)) {
                  return (
                    <Form.Item
                      key={getRandomString(6)}
                      name={[nodeType, 'loadAngle']}
                      label={formatMessage({ id: 'object.load.direction' })}
                      initialValue={variableValue}
                    >
                      <InputNumber addonAfter='°' />
                    </Form.Item>
                  );
                }
              } else {
                if (isEmpty(variableValue)) {
                  return (
                    <Form.Item
                      key={getRandomString(6)}
                      name={[nodeType, variableKey]}
                      label={<FormattedMessage id={'app.common.targetCell'} />}
                      initialValue={{ type: variableKey, code: variableValue }}
                    >
                      <TargetVariable vehicleSelection={vehicleSelection} />
                    </Form.Item>
                  );
                }
              }
            })
            .filter(Boolean);
          if (dom.length > 0) {
            return (
              <>
                <Divider orientation={'left'}>{renderPartTitle(nodeType)}</Divider>
                {dom}
              </>
            );
          }
        })
        .filter(Boolean);
    }
    return null;
  }

  function renderEndVariable() {
    const customParams = quickTask?.variable?.customParams;
    if (customParams && !isEmptyPlainObject(customParams)) {
      const variables = { ...customParams.END };
      delete variables.vehicleNeedCharge;
      let heavyBackZoneVisible = isEmpty(variables.heavyBackZone);
      let backZoneVisible = isEmpty(variables.backZone);

      return (
        <>
          {(heavyBackZoneVisible || backZoneVisible) && (
            <Divider orientation={'left'}>{renderPartTitle('END')}</Divider>
          )}
          <Fragment>
            {heavyBackZoneVisible && (
              <Form.Item label={formatMessage({ id: 'customTask.form.heavyBackZone' })}>
                <Form.List
                  name={['END', 'heavyBackZone']}
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
            )}

            {/* 返回区域 */}
            {backZoneVisible && (
              <Form.Item label={formatMessage({ id: 'customTask.form.backZone' })}>
                <Form.List name={['END', 'backZone']} initialValue={variables.backZone ?? []}>
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
            )}
          </Fragment>
        </>
      );
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
