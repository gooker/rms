import React, { memo, useEffect, useState } from 'react';
import { connect } from '@/utils/RmsDva';
import { Form, Input, Checkbox } from 'antd';
import { formatMessage, getFormLayout } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import CascadeSelect from '../FormComponent/CascadeSelect';
import style from '../customTask.module.less';

const { formItemLayout } = getFormLayout(6, 18);

const StartForm = (props) => {
  const { form, code, type, hidden, modelTypes } = props;

  const [secondOptionDisabled, setSecondOptionDisabled] = useState(false);

  const OptionsData = [
    {
      code: 'AGV',
      name: <FormattedMessage id='customTask.form.SPECIFY_AGV' />,
      value: {},
    },
    {
      code: 'AGV_GROUP',
      name: <FormattedMessage id='customTask.form.SPECIFY_GROUP' />,
      value: {},
    },
  ];

  useEffect(() => {
    const fieldValue = form.getFieldValue(code);
    if (fieldValue) {
      const { robot } = fieldValue;
      setSecondOptionDisabled(robot.type === 'AUTO');
    }
  }, []);

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
      <Form.Item
        hidden
        {...formItemLayout}
        name={[code, 'code']}
        initialValue={code}
        label={formatMessage({ id: 'app.common.code' })}
        rules={[{ required: true }]}
      >
        <Input style={{ width: 300 }} />
      </Form.Item>

      {/* --------------------------------------------------------------- */}
      {/* 分小车 */}
      <Form.Item
        hidden={hidden}
        {...formItemLayout}
        name={[code, 'robot']}
        initialValue={{ type: 'AUTO', code: [] }}
        label={<FormattedMessage id='customTask.form.robot' />}
        getValueFromEvent={(value) => {
          setSecondOptionDisabled(value.type === 'AUTO');
          return value;
        }}
      >
        <CascadeSelect data={OptionsData} disabled={[false, secondOptionDisabled]} />
      </Form.Item>

      <Form.Item
        hidden={hidden}
        {...formItemLayout}
        label={formatMessage({ id: 'customTask.form.limit' })}
      >
        <div className={style.limitDiv}>
          <Form.Item noStyle name={[code, 'limit']}>
            <Checkbox.Group
              options={[
                {
                  label: formatMessage({ id: 'customTask.form.limit.podWithStandbyAgv' }),
                  value: 'podWithStandbyAgv',
                },
              ]}
            />
          </Form.Item>
        </div>
      </Form.Item>

      {/* 备注 */}
      <Form.Item
        hidden={hidden}
        {...formItemLayout}
        name={[code, 'remark']}
        label={formatMessage({ id: 'app.common.remark' })}
      >
        <Input style={{ width: 500 }} />
      </Form.Item>
    </>
  );
};
export default connect(({ customTask }) => {
  return { modelTypes: customTask.modelTypes };
})(memo(StartForm));
