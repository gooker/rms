import React, { memo } from 'react';
import { Form, Row, Input, InputNumber, Switch } from 'antd';
import { formatMessage, getFormLayout, isStrictNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../customTask.module.less';

const { formItemLayout } = getFormLayout(6, 19);

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
      <Form.Item
        hidden={hidden}
        {...formItemLayout}
        name={[code, 'code']}
        initialValue={code}
        label={formatMessage({ id: 'customTask.form.recover' })}
      >
        <Input disabled style={{ width: 300 }} />
      </Form.Item>
      <Form.Item
        hidden={hidden}
        {...formItemLayout}
        label={formatMessage({ id: 'customTask.form.waitTime' })}
      >
        <Row>
          <Form.Item noStyle name={[code, 'waitTime']} initialValue={-1}>
            <InputNumber style={{ width: 300 }} />
          </Form.Item>
          <div className={styles.inputUnitLabel}>
            <FormattedMessage id='app.time.seconds' />
          </div>
        </Row>
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
