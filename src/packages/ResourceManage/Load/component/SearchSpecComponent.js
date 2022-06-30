import React, { memo } from 'react';
import { Form, Select, Space } from 'antd';
import { FunnelPlotOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';

const SearchSpecComponent = (props) => {
  const { setLoadType, allLoadSpecType } = props;

  const [formRef] = Form.useForm();

  function handleLoadType(_, values) {
    setLoadType(values?.loadTypeCode);
  }

  return (
    <Form form={formRef} onValuesChange={handleLoadType}>
      <Form.Item
        label={
          <Space>
            <FunnelPlotOutlined />
            <FormattedMessage id='app.common.type' />
          </Space>
        }
        name='loadTypeCode'
      >
        <Select allowClear style={{ width: 240 }}>
          {allLoadSpecType?.map(({ code, name }) => (
            <Select.Option key={code} value={code}>
              {name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
};
export default memo(SearchSpecComponent);
