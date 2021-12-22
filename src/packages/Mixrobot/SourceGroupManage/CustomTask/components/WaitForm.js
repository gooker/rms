import React, { memo } from 'react';
import { Form, Row, Input, InputNumber, Switch } from 'antd';
import {formatMessage } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../customTask.module.less';

const FormLayout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };

const WaitForm = (props) => {
  const { code, type, hidden } = props;
  return (
    <>
      <Form.Item
        hidden
        {...FormLayout}
        name={[code, 'customType']}
        initialValue={type}
        label={formatMessage({ id: 'app.customTask.form.type' })}
      >
        <Input disabled style={{ width: 300 }} />
      </Form.Item>

      {/* --------------------------------------------------------------- */}
      <Form.Item
        hidden={hidden}
        {...FormLayout}
        name={[code, 'code']}
        initialValue={code}
        label={formatMessage({ id: 'app.customTask.form.recover' })}
      >
        <Input disabled style={{ width: 300 }} />
      </Form.Item>
      <Form.Item
        hidden={hidden}
        {...FormLayout}
        label={formatMessage({ id: 'app.customTask.form.waitTime' })}
      >
        <Row>
          <Form.Item noStyle name={[code, 'waitTime']} initialValue={-1}>
            <InputNumber style={{ width: 300 }} />
          </Form.Item>
          <div className={styles.inputUnitLabel}>
            <FormattedMessage id="app.time.seconds" />
          </div>
        </Row>
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

      {/* 跳过 */}
      <Form.Item
        hidden={hidden}
        {...FormLayout}
        name={[code, 'skip']}
        initialValue={false}
        label={formatMessage({ id: 'app.customTask.form.skip' })}
      >
        <Switch />
      </Form.Item>
    </>
  );
};
export default memo(WaitForm);
