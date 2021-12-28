// 小车进入待命状态的条件输入框
import React, { memo } from 'react';
import { connect } from '@/utils/dva';
import { Form, Select, Row, Col, Button } from 'antd';
import { MinusOutlined, ClearOutlined } from '@ant-design/icons';
import ModelSelection from '../FormComponent/ModelSelection';
import { convertMapToArrayMap,formatMessage } from '@/utils/utils';
import MenuIcon from '@/utils/MenuIcon';
import { AGVType } from '@/config/config';
import styles from '../customTask.module.less';

const { Option } = Select;
const FormLayout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
const NoLabelFormLayout = { wrapperCol: { offset: 6, span: 18 } };

const StandbyConditions = (props) => {
  const { hidden, modelTypes, allTaskTypes, value, onChange } = props;

  function onValuesChange(changedValues, allValues) {
    onChange(allValues);
  }

  const taskTypeOptions = convertMapToArrayMap(allTaskTypes[AGVType.LatentLifting], 'code', 'name');
  const initialValue = { ...value };
  if (!Array.isArray(initialValue.agvTaskTypes)) {
    initialValue.agvTaskTypes = [];
  }
  if (!Array.isArray(initialValue.appointResources)) {
    initialValue.appointResources = [{}];
  }

  return (
    <Form onValuesChange={onValuesChange} initialValues={initialValue}>
      {/* 可接任务类型 */}
      <Form.Item
        hidden={hidden}
        {...FormLayout}
        name={'agvTaskTypes'}
        label={formatMessage({ id: 'app.customTask.form.agvTaskTypes' })}
      >
        <Select
          showSearch
          allowClear
          mode="multiple"
          style={{ width: 460 }}
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
      <Form.List name={'appointResources'} initialValue={[{}]}>
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <div key={field.key} className={index !== 0 ? styles.dynamicNoLabel : undefined}>
                <Form.Item
                  hidden={hidden}
                  {...(index === 0 ? FormLayout : NoLabelFormLayout)}
                  label={
                    index === 0
                      ? formatMessage({ id: 'app.customTask.form.appointResources' })
                      : null
                  }
                >
                  <Row gutter={10}>
                    <Col>
                      <Form.Item noStyle {...field}>
                        <ModelSelection
                          modelTypes={modelTypes}
                          exclude={['AGV', 'AGV_GROUP']}
                          disabled={false}
                        />
                      </Form.Item>
                    </Col>
                    <Col style={{ display: 'flex', alignItems: 'center' }}>
                      {fields.length > 1 ? (
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
                      ) : null}
                    </Col>
                    {index === 0 && (
                      <Col style={{ display: 'flex', alignItems: 'center' }}>
                        <ClearOutlined
                          style={{ fontSize: 18 }}
                          onClick={(ev) => {
                            if (!ev.target.checked) {
                              for (let loopIndex = fields.length; loopIndex > 0; loopIndex--) {
                                remove(loopIndex);
                              }
                            }
                          }}
                        />
                      </Col>
                    )}
                  </Row>
                </Form.Item>
              </div>
            ))}

            <Form.Item hidden={hidden} style={{ paddingLeft: 120 }}>
              <Button onClick={() => add()} style={{ width: 460 }}>
                {MenuIcon.plus}
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form>
  );
};
export default connect(({ customTask }) => ({
  modelTypes: customTask.modelTypes,
  allTaskTypes: customTask.allTaskTypes,
}))(memo(StandbyConditions));
