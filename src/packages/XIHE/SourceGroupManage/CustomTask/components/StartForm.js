import React, { memo, useEffect, useState } from 'react';
import { connect } from '@/utils/RcsDva';
import { Form, Input } from 'antd';
import { formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import CascadeSelect from '../FormComponent/CascadeSelect';

const FormLayout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };

const StartForm = (props) => {
  const { form, code, type, hidden, modelTypes } = props;

  const [seconOptionDisabled, setSeconOptionDisabled] = useState(false);

  const OptionsData = [
    // {
    //   code: 'AUTO',
    //   name: <FormattedMessage id="app.customTask.form.AUTO" />,
    // },
    {
      code: 'AGV',
      name: <FormattedMessage id="app.customTask.form.SPECIFY_AGV" />,
      value: modelTypes?.AGV.options ?? {},
    },
    {
      code: 'AGV_GROUP',
      name: <FormattedMessage id="app.customTask.form.SPECIFY_GROUP" />,
      value: modelTypes?.AGV_GROUP.options ?? {},
    },
  ];

  useEffect(() => {
    const fieldValue = form.getFieldValue(code);
    if (fieldValue) {
      const { robot } = fieldValue;
      setSeconOptionDisabled(robot.type === 'AUTO');
    }
  }, []);

  return (
    <>
      <Form.Item
        hidden
        {...FormLayout}
        name={[code, 'customType']}
        initialValue={type}
        label={formatMessage({ id: 'app.common.type' })}
      >
        <Input disabled style={{ width: 300 }} />
      </Form.Item>
      <Form.Item
        hidden
        {...FormLayout}
        name={[code, 'code']}
        initialValue={code}
        label={formatMessage({ id: 'app.customTask.form.code' })}
        rules={[{ required: true }]}
      >
        <Input style={{ width: 300 }} />
      </Form.Item>

      {/* --------------------------------------------------------------- */}
      {/* 分小车 */}
      <Form.Item
        hidden={hidden}
        {...FormLayout}
        name={[code, 'robot']}
        initialValue={{ type: 'AUTO', code: [] }}
        label={<FormattedMessage id="app.customTask.form.robot" />}
        getValueFromEvent={(value) => {
          setSeconOptionDisabled(value.type === 'AUTO');
          return value;
        }}
      >
        <CascadeSelect data={OptionsData} disabled={[false, seconOptionDisabled]} />
      </Form.Item>

      {/* 备注 */}
      <Form.Item
        hidden={hidden}
        {...FormLayout}
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
