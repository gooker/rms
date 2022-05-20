import React, { memo } from 'react';
import { Form, Input, Switch } from 'antd';
import {formatMessage } from '@/utils/util';
import CodeEditor from '@/components/CodeEditor';

const FormLayout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };

const EventForm = (props) => {
  const { code, type, hidden } = props;
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
        label={formatMessage({ id: 'app.common.code' })}
      >
        <Input style={{ width: 300 }} />
      </Form.Item>

      {/* --------------------------------------------------------------- */}
      {/* Topic */}
      <Form.Item hidden={hidden} {...FormLayout} name={[code, 'topic']} label={'Topic'}>
        <Input style={{ width: 300 }} />
      </Form.Item>

      {/* 消息体 */}
      <Form.Item
        hidden={hidden}
        {...FormLayout}
        name={[code, 'payLoad']}
        label={formatMessage({ id: 'customTask.form.payLoad' })}
      >
        <CodeEditor mode={'json'} />
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
        label={formatMessage({ id: 'customTask.form.skip' })}
      >
        <Switch />
      </Form.Item>
    </>
  );
};
export default memo(EventForm);
