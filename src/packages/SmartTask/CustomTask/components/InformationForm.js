import React, { memo } from 'react';
import { connect } from '@/utils/RmsDva';
import { Form, Input, Rate } from 'antd';
import { formatMessage } from '@/utils/util';
import styles from '../customTask.module.less';

const FormLayout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };

const InformationForm = (props) => {
  const { hidden, existNames, isEdit } = props;

  function validateDuplicateName(_, value) {
    if (!value || !existNames.includes(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error(formatMessage({ id: 'app.customTask.form.name.duplicate' })));
  }

  const nameRuls = [{ required: true }];
  if (!isEdit) {
    nameRuls.push({ validator: validateDuplicateName });
  }
  return (
    <>
      <Form.Item
        hidden={hidden}
        {...FormLayout}
        name="name"
        label={formatMessage({ id: 'app.common.name' })}
        rules={nameRuls}
      >
        <Input style={{ width: 300 }} />
      </Form.Item>
      <Form.Item
        hidden={hidden}
        {...FormLayout}
        name="desc"
        label={formatMessage({ id: 'app.common.description' })}
      >
        <Input style={{ width: 500 }} />
      </Form.Item>
      <Form.Item
        hidden={hidden}
        {...FormLayout}
        name="priority"
        initialValue={5}
        label={formatMessage({ id: 'app.taskQueue.priority' })}
      >
        <Rate
          tooltips={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
          allowClear={false}
          count={10}
          className={styles.priority}
        />
      </Form.Item>
    </>
  );
};
export default connect(({ customTask }) => ({
  existNames: customTask.customTaskList.map(({ name }) => name),
}))(memo(InformationForm));
