import React, { memo, useEffect, useState } from 'react';
import { Button, Checkbox, Form, Input, InputNumber, Switch } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { formatMessage, isNull, isStrictNull } from '@/utils/util';
import StandbyConditions from '../FormComponent/StandbyConditions';
import FormattedMessage from '@/components/FormattedMessage';
import TargetSelector from '../components/TargetSelector';
import styles from '../customTask.module.less';
import { connect } from '@/utils/RmsDva';

const WaitForm = (props) => {
  const { code, form, type, hidden, updateTab, targetSource } = props;
  const [goToPickupPoint, setGotoPickupPoint] = useState(false);

  useEffect(() => {
    if (!hidden) {
      const waitTaskCell = form.getFieldValue([code, 'waitTaskCell']);
      setGotoPickupPoint(!isNull(waitTaskCell));
    }
  }, [hidden]);

  return (
    <>
      <Form.Item
        hidden
        name={[code, 'customType']}
        initialValue={type}
        label={formatMessage({ id: 'app.common.type' })}
      >
        <Input disabled style={{ width: 300 }} />
      </Form.Item>

      {/* 子任务编码 */}
      <Form.Item
        hidden
        name={[code, 'code']}
        initialValue={code}
        label={formatMessage({ id: 'app.common.code' })}
      >
        <Input style={{ width: 300 }} />
      </Form.Item>
      {/* --------------------------------------------------------------- */}

      <Form.Item
        hidden={hidden}
        name={[code, 'name']}
        label={formatMessage({ id: 'customTask.form.subTaskName' })}
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
        name={[code, 'desc']}
        label={formatMessage({ id: 'app.common.description' })}
      >
        <Input style={{ width: 500 }} />
      </Form.Item>
      {/* --------------------------------------------------------------- */}

      {/* 待命时长 */}
      <Form.Item
        hidden={hidden}
        name={[code, 'vehicleWaitTask', 'waitTime']}
        initialValue={180}
        label={formatMessage({ id: 'customTask.form.waitTime' })}
      >
        <InputNumber
          style={{ width: 130 }}
          addonAfter={formatMessage({ id: 'app.time.seconds' })}
        />
      </Form.Item>

      {/* 进入待命状态条件 */}
      <Form.Item noStyle hidden={hidden}>
        <div className={styles.vehicleStandbyCondition}>
          <Form.List name={[code, 'vehicleWaitTask', 'taskCriteria']} initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Form.Item key={field.key} className={styles.standbyDynamicFormItem}>
                    <div style={{ display: 'flex' }}>
                      <div style={{ width: 32, marginRight: 5 }}>
                        <Button
                          type="primary"
                          onClick={() => remove(field.name)}
                          icon={<DeleteOutlined />}
                          disabled={fields.length <= 1}
                        />
                      </div>
                      <Form.Item noStyle {...field}>
                        <StandbyConditions form={form} />
                      </Form.Item>
                    </div>
                  </Form.Item>
                ))}
                <Button type="dashed" onClick={() => add()} style={{ width: '100%' }}>
                  <PlusOutlined />
                </Button>
              </>
            )}
          </Form.List>
        </div>
      </Form.Item>

      {/* 可自动退出待命去充电 */}
      <Form.Item
        hidden={hidden}
        name={[code, 'vehicleWaitTask', 'vehicleCanCharge']}
        valuePropName={'checked'}
        initialValue={true}
        label={formatMessage({ id: 'customTask.form.vehicleAutoCharge' })}
      >
        <Switch />
      </Form.Item>

      {/* 是否去接任务点  */}
      <Form.Item
        hidden={hidden}
        label={
          <Checkbox
            checked={goToPickupPoint}
            onChange={(ev) => {
              setGotoPickupPoint(ev.target.checked);
              form.setFieldsValue({ [code]: { waitTaskCell: null } });
            }}
          >
            <FormattedMessage id="customTask.form.waitTaskCell" />
          </Checkbox>
        }
      >
        {goToPickupPoint && (
          <Form.Item noStyle name={[code, 'waitTaskCell']} initialValue={null}>
            <TargetSelector
              dataSource={targetSource}
              vehicleSelection={form.getFieldValue(['START', 'vehicle'])}
            />
          </Form.Item>
        )}
      </Form.Item>

      {/* --------------------------------------------------------------- */}
      {/* 备注 */}
      <Form.Item
        hidden={hidden}
        name={[code, 'remark']}
        label={formatMessage({ id: 'app.common.remark' })}
      >
        <Input style={{ width: 500 }} />
      </Form.Item>
    </>
  );
};
export default connect(({ customTask, global }) => ({
  targetSource: customTask.targetSource,
}))(memo(WaitForm));
