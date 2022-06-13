import React, { memo } from 'react';
import { connect } from '@/utils/RmsDva';
import { Form, Input, Rate } from 'antd';
import { formatMessage, getRandomString, isNull } from '@/utils/util';
import styles from '../customTask.module.less';

const InformationForm = (props) => {
  const { hidden, customTaskList } = props;

  function validateDuplicateCode(_, value) {
    const existCodes = customTaskList.map(({ code }) => code);
    if (!value || !existCodes.includes(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error(formatMessage({ id: 'app.form.code.duplicate' })));
  }

  function validateDuplicateName(_, value) {
    const existNames = customTaskList.map(({ name }) => name);
    if (!value || !existNames.includes(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error(formatMessage({ id: 'app.form.name.duplicate' })));
  }

  return (
    <>
      <Form.Item
        hidden={hidden}
        name='code'
        label={formatMessage({ id: 'app.common.code' })}
        initialValue={`cst_${getRandomString(8)}`}
        rules={[{ required: true }, { validator: validateDuplicateCode }]}
      >
        <Input style={{ width: 300 }} />
      </Form.Item>
      <Form.Item
        hidden={hidden}
        name='name'
        label={formatMessage({ id: 'customTask.form.name' })}
        rules={[{ required: true }, { validator: validateDuplicateName }]}
      >
        <Input style={{ width: 300 }} />
      </Form.Item>
      <Form.Item
        hidden={hidden}
        name="desc"
        initialValue={null}
        label={formatMessage({ id: 'app.common.description' })}
      >
        <Input style={{ width: 500 }} />
      </Form.Item>
      <Form.Item
        hidden={hidden}
        name="priority"
        initialValue={5}
        label={formatMessage({ id: 'app.common.priority' })}
      >
        <Rate
          tooltips={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}
          allowClear={false}
          count={10}
          className={styles.priority}
        />
      </Form.Item>
    </>
  );
};
export default connect(({ customTask }) => {
  const { customTaskList, editingRow } = customTask;
  if (isNull(editingRow)) {
    return { customTaskList };
  }
  return {
    customTaskList: customTaskList.filter((item) => item !== editingRow),
  };
})(memo(InformationForm));
