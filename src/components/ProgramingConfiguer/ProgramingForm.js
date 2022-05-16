import React, { memo, useState } from 'react';
import { Button, Cascader, Col, Form, Row } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { find } from 'lodash';
import { convertPrograming2Cascader } from '@/utils/util';
import { renderFormItemContent } from '@/packages/ResourceManage/Equipment/components/equipUtils';

const ProgramingForm = (props) => {
  const { programing, onAdd } = props;

  const [formRef] = Form.useForm();
  const [actionType, setActionType] = useState(null); // 已选择动作类型
  const cascaderOption = convertPrograming2Cascader(programing);

  function renderFormItem() {
    if (Array.isArray(actionType) && actionType.length > 1) {
      const [p1, p2] = actionType;
      const { actionParameters } = find(programing[p1], { actionId: p2 });
      return actionParameters.map(({ code, name, valueDataType, value }, index) => {
        const valuePropName = valueDataType === 'BOOL' ? 'checked' : 'value';
        let defaultValue = valueDataType === 'BOOL' ? JSON.parse(value) ?? false : value;
        return (
          <Col key={index} span={8}>
            <Form.Item
              name={code}
              label={name}
              valuePropName={valuePropName}
              initialValue={defaultValue}
              rules={[{ required: true }]}
            >
              {renderFormItemContent({ type: valueDataType })}
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
      .catch(() => {});
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

      <Form form={formRef} style={{ marginTop: 15 }} labelWrap>
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
