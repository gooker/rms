import React, { memo, useState } from 'react';
import { Button, Select, Switch, Cascader, Col, Form, Input, Row } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { find } from 'lodash';
import { convertPrograming2Cascader } from '@/utils/util';

const ProgramingForm = (props) => {
  const { programing, onAdd } = props;

  const [formRef] = Form.useForm();
  const [actionType, setActionType] = useState(null); // 已选择动作类型
  const cascaderOption = convertPrograming2Cascader(programing);

  function renderItemInput(valueDataType) {
    switch (valueDataType) {
      case 'ARRAY':
        return <Select mode={'tags'} maxTagCount={4} notFoundContent={null} />;
      case 'BOOL':
        return <Switch />;
      default:
        return <Input />;
    }
  }

  function renderFormItem() {
    if (Array.isArray(actionType) && actionType.length > 1) {
      const [p1, p2] = actionType;
      const { actionParameters } = find(programing[p1], { actionId: p2 });
      return actionParameters.map(({ code, name, valueDataType, isOptional }, index) => {
        return (
          <Col key={index} span={8}>
            <Form.Item
              name={code}
              label={name}
              rules={[{ required: isOptional === false }]}
              valuePropName={valueDataType === 'BOOL' ? 'checked' : 'value'}
            >
              {renderItemInput(valueDataType)}
            </Form.Item>
          </Col>
        );
      });
    } else {
      return [];
    }
  }

  function add() {
    formRef
      .validateFields()
      .then((value) => {
        onAdd({ actionType, ...value });
        formRef.resetFields();
      })
      .catch(() => {
      });
  }

  return (
    <div>
      <Cascader
        allowClear
        value={actionType}
        options={cascaderOption}
        onChange={setActionType}
        placeholder={'请选择具体配置项'}
        style={{ width: '30%' }}
      />

      <Form form={formRef} style={{ marginTop: 15 }}>
        <Row gutter={10}>
          {renderFormItem()}
          {Array.isArray(actionType) && actionType.length > 0 && (
            <Col span={6}>
              <Button onClick={add}>
                <PlusOutlined /> 添加配置
              </Button>
            </Col>
          )}
        </Row>
      </Form>
    </div>
  );
};
export default memo(ProgramingForm);
