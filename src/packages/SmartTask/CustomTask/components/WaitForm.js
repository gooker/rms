import React, { memo } from 'react';
import { Button, Form, Input, InputNumber, Switch } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { formatMessage, getFormLayout, isStrictNull } from '@/utils/util';
import StandbyConditions from '../FormComponent/StandbyConditions';
import styles from '../customTask.module.less';

const { formItemLayout } = getFormLayout(6, 19);
const DynamicButton = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
};

const WaitForm = (props) => {
  const { code, type, hidden, updateTab } = props;

  return (
    <>
      <Form.Item
        hidden
        {...formItemLayout}
        name={[code, 'customType']}
        initialValue={type}
        label={formatMessage({ id: 'app.common.type' })}
      >
        <Input disabled style={{ width: 300 }} />
      </Form.Item>

      {/* 子任务编码 */}
      <Form.Item
        hidden
        {...formItemLayout}
        name={[code, 'code']}
        initialValue={code}
        label={formatMessage({ id: 'app.common.code' })}
      >
        <Input style={{ width: 300 }} />
      </Form.Item>
      {/* --------------------------------------------------------------- */}

      <Form.Item
        hidden={hidden}
        {...formItemLayout}
        name={[code, 'name']}
        label={formatMessage({ id: 'app.common.name' })}
        getValueFromEvent={({ target: { value } }) => {
          let name = value;
          if (isStrictNull(value)) {
            name = formatMessage({ id: 'customTask.type.WAIT' });
          }
          updateTab(code, name);
          return value;
        }}
      >
        <Input style={{ width: 300 }} />
      </Form.Item>
      <Form.Item
        hidden={hidden}
        {...formItemLayout}
        name={[code, 'desc']}
        label={formatMessage({ id: 'app.common.description' })}
      >
        <Input style={{ width: 500 }} />
      </Form.Item>
      {/* --------------------------------------------------------------- */}

      {/* 可自动退出待命去充电 */}
      <Form.Item
        hidden={hidden}
        {...formItemLayout}
        name={[code, 'agvWaitTask', 'robotCanCharge']}
        valuePropName={'checked'}
        initialValue={true}
        label={formatMessage({ id: 'customTask.form.robotAutoCharge' })}
      >
        <Switch />
      </Form.Item>

      {/* 等待时间 */}
      <Form.Item
        hidden={hidden}
        {...formItemLayout}
        name={[code, 'agvWaitTask', 'waitTime']}
        initialValue={180}
        label={formatMessage({ id: 'customTask.form.waitTime' })}
      >
        <InputNumber
          style={{ width: 130 }}
          addonAfter={formatMessage({ id: 'app.time.seconds' })}
        />
      </Form.Item>

      {/* 进入待命状态条件 */}
      <div className={styles.robotStandbyCondition}>
        <Form.List name={[code, 'agvWaitTask', 'taskCriteria']} initialValue={[{}]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <Form.Item
                  key={field.key}
                  hidden={hidden}
                  className={styles.standbyDynamicFormItem}
                >
                  <div style={{ display: 'flex' }}>
                    <div style={{ width: 32, marginRight: 5 }}>
                      {fields.length > 1 ? (
                        <Button
                          type='primary'
                          onClick={() => remove(field.name)}
                          style={DynamicButton}
                        >
                          <DeleteOutlined />
                        </Button>
                      ) : null}
                    </div>
                    <Form.Item noStyle {...field}>
                      <StandbyConditions />
                    </Form.Item>
                  </div>
                </Form.Item>
              ))}
              <Form.Item hidden={hidden}>
                <Button type='dashed' onClick={() => add()} style={{ width: '100%' }}>
                  <PlusOutlined />
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </div>

      {/* --------------------------------------------------------------- */}
      {/* 备注 */}
      <Form.Item
        hidden={hidden}
        {...formItemLayout}
        name={[code, 'remark']}
        label={formatMessage({ id: 'app.common.remark' })}
      >
        <Input style={{ width: 500 }} />
      </Form.Item>

      {/* 跳过 */}
      <Form.Item
        hidden={hidden}
        {...formItemLayout}
        name={[code, 'skip']}
        initialValue={false}
        label={formatMessage({ id: 'customTask.form.skip' })}
      >
        <Switch />
      </Form.Item>
    </>
  );
};
export default memo(WaitForm);
