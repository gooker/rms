import React, { memo, useEffect, useState } from 'react';
import { Button, Cascader, Col, Form, Input, Row, Select, Switch } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { find, isPlainObject } from 'lodash';
import { convertMapToArrayMap, convertPrograming2Cascader, formatMessage, isNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { OperateType } from '@/components/ProgramingConfiguer/ProgramingConst';

const ProgramingForm = (props) => {
  const { programing, operationType, onAdd } = props;

  const [formRef] = Form.useForm();
  const [operateType, setOperateType] = useState(OperateType.ADD); // 方式: 新增、删除、替换等等
  const [actionType, setActionType] = useState(null); // 已选择动作类型

  const cascadeOption = convertPrograming2Cascader(programing);

  useEffect(() => {
    if (!isNull(operationType)) {
      setOperateType(operationType);
    }
  }, []);

  function renderItemInput(valueDataType, isReadOnly, options) {
    switch (valueDataType) {
      case 'ARRAY':
        if (isPlainObject(options)) {
          return (
            <Select disabled={isReadOnly}>
              {convertMapToArrayMap(options, 'code', 'name').map(({ code, name }) => (
                <Select.Option key={code} value={code}>
                  {name}
                </Select.Option>
              ))}
            </Select>
          );
        }
        return (
          <Select mode={'tags'} maxTagCount={4} notFoundContent={null} disabled={isReadOnly} />
        );
      case 'BOOL':
        return <Switch disabled={isReadOnly} />;
      default:
        return <Input disabled={isReadOnly} />;
    }
  }

  function getInitialValue(valueDataType, value) {
    if (valueDataType === 'BOOL') {
      return JSON.parse(value);
    }
    if (valueDataType === 'ARRAY') {
      return JSON.parse(value) ?? [];
    }
    return value;
  }

  function renderFormItem() {
    if (Array.isArray(actionType) && actionType.length > 1) {
      const [p1, p2] = actionType;
      const { actionParameters } = find(programing[p1], { actionId: p2 });
      if (Array.isArray(actionParameters)) {
        return actionParameters.map(
          ({ code, name, value, valueDataType, options, isOptional, isReadOnly }, index) => {
            const valuePropName = valueDataType === 'BOOL' ? 'checked' : 'value';
            const initialValue = getInitialValue(valueDataType, value);
            return (
              <Col key={index} span={8}>
                <Form.Item
                  name={code}
                  label={name}
                  rules={[{ required: isOptional === false }]}
                  initialValue={initialValue}
                  valuePropName={valuePropName}
                >
                  {renderItemInput(valueDataType, isReadOnly, options)}
                </Form.Item>
              </Col>
            );
          },
        );
      }
    }
    return null;
  }

  function add() {
    formRef
      .validateFields()
      .then((value) => {
        onAdd({ operateType, actionType, ...value });
        formRef.resetFields();
      })
      .catch(() => {});
  }

  return (
    <div>
      <Select
        value={operateType}
        onChange={setOperateType}
        style={{ marginRight: 16, width: 150 }}
        disabled={!isNull(operationType)}
      >
        <Select.Option value={OperateType.ADD}>
          <FormattedMessage id={'customTasks.operationType.add'} />
        </Select.Option>
        <Select.Option value={OperateType.UPDATE}>
          <FormattedMessage id={'customTasks.operationType.update'} />
        </Select.Option>
        <Select.Option value={OperateType.DELETE}>
          <FormattedMessage id={'customTasks.operationType.delete'} />
        </Select.Option>
        <Select.Option value={OperateType.PARAM}>
          <FormattedMessage id={'customTasks.operationType.param'} />
        </Select.Option>
      </Select>
      <Cascader
        allowClear
        value={actionType}
        options={cascadeOption}
        onChange={setActionType}
        placeholder={formatMessage({ id: 'configure.select.specificItems' })}
        style={{ width: '30%' }}
      />

      <Form form={formRef} style={{ marginTop: 15 }}>
        <Row gutter={10}>
          {renderFormItem()}
          {Array.isArray(actionType) && actionType.length > 0 && (
            <Col span={6}>
              <Button onClick={add}>
                <PlusOutlined /> <FormattedMessage id="configure.add" />
              </Button>
            </Col>
          )}
        </Row>
      </Form>
    </div>
  );
};
export default memo(ProgramingForm);
