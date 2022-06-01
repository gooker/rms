// 小车进入待命状态的条件输入框
import React, { memo } from 'react';
import { connect } from '@/utils/RmsDva';
import { Button, Col, Form, Row, Select } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { convertMapToArrayMap, formatMessage, getFormLayout } from '@/utils/util';
import TargetSelector from '@/packages/SmartTask/CustomTask/components/TargetSelector';

const { Option } = Select;
const { formItemLayoutNoLabel, formItemLayout } = getFormLayout(4, 20);

const StandbyConditions = (props) => {
  const { hidden, form, allTaskTypes, value, onChange } = props;

  function onValuesChange(changedValues, allValues) {
    onChange(allValues);
  }

  const taskTypeOptions = convertMapToArrayMap(allTaskTypes, 'code', 'name');
  const initialValue = { ...value };
  if (!Array.isArray(initialValue.vehicleTaskTypes)) {
    initialValue.vehicleTaskTypes = [];
  }
  if (!Array.isArray(initialValue.appointResources)) {
    initialValue.appointResources = [{}];
  }

  return (
    <Form
      labelWrap
      onValuesChange={onValuesChange}
      initialValues={initialValue}
      style={{ width: '100%' }}
    >
      {/* 可接任务类型 */}
      <Form.Item
        hidden={hidden}
        {...formItemLayout}
        name={'vehicleTaskTypes'}
        label={formatMessage({ id: 'customTask.form.vehicleTaskTypes' })}
      >
        <Select
          showSearch
          allowClear
          mode="multiple"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {taskTypeOptions.map((item) => (
            <Option key={item.code} value={item.code}>
              {item.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      {/* 指定资源 */}
      <Form.List name={'appointResources'}>
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <Form.Item
                key={field.key}
                hidden={hidden}
                {...(index === 0 ? formItemLayout : formItemLayoutNoLabel)}
                label={
                  index === 0 ? formatMessage({ id: 'customTask.form.appointResources' }) : null
                }
              >
                <Row gutter={10}>
                  <Col span={fields.length > 1 ? 22 : 24}>
                    <Form.Item noStyle {...field}>
                      <TargetSelector form={form} />
                    </Form.Item>
                  </Col>
                  {fields.length > 1 ? (
                    <Col span={2}>
                      <Button onClick={() => remove(field.name)} icon={<MinusOutlined />} />
                    </Col>
                  ) : null}
                </Row>
              </Form.Item>
            ))}
            <Form.Item hidden={hidden} {...formItemLayoutNoLabel}>
              <Button onClick={() => add()} style={{ width: '100%' }}>
                <PlusOutlined />
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form>
  );
};
export default connect(({ customTask, global }) => ({
  modelTypes: customTask.modelTypes,
  allTaskTypes: global.allTaskTypes,
}))(memo(StandbyConditions));
