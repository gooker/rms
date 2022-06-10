/* TODO: I18N */
import React, { memo } from 'react';
import { Form, Row, Col, Select } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import { getFormLayout } from '@/utils/util';
const { formItemLayout } = getFormLayout(5, 18);

const SearchSpecComponent = (props) => {
  const { setLoadType, allLoadType } = props;

  const [formRef] = Form.useForm();

  function handleLoadType(_, values) {
    setLoadType(values?.loadTypeCode);
  }

  return (
    <>
      <Form {...formItemLayout} form={formRef} onValuesChange={handleLoadType}>
        <Row>
          <Col span={6}>
            <Form.Item label={<FormattedMessage id="app.common.type" />} name="loadTypeCode">
              <Select allowClear style={{ width: '100%' }}>
                {allLoadType?.map(({ id, code, name }) => (
                  <Select.Option key={id} value={code}>
                    {name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};
export default memo(SearchSpecComponent);
