import React, { memo } from 'react';
import { Form, Input, InputNumber } from 'antd';

const EditableCell = (props) => {
  const { editing, dataIndex, title, inputType, record, index, children, ...restProps } = props;
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          required
          name={dataIndex}
          style={{ margin: 0 }}
          rules={dataIndex === 'name' && [{ required: true }]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
export default memo(EditableCell);
