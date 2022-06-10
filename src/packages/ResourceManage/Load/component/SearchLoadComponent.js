/* TODO: I18N */
import React, { memo } from 'react';
import { Form, Row, Col, Select, Input } from 'antd';
import { getFormLayout } from '@/utils/util';
const { formItemLayout } = getFormLayout(5, 18);

const SearchLoadComponent = (props) => {
  const { allLoadSpec, list, search } = props;
  const [formRef] = Form.useForm();
  function handleLoadType(_, values) {
    search(list, values);
  }

  return (
    <>
      <Form {...formItemLayout} form={formRef} onValuesChange={handleLoadType}>
        <Row>
          <Col span={6}>
            <Form.Item label={'ID'} name={'id'}>
              <Input allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={'载具规格'} name="loadSpecificationCode">
              <Select allowClear style={{ width: '100%' }}>
                {allLoadSpec?.map(({ code, name }) => (
                  <Select.Option key={code} value={code}>
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
export default memo(SearchLoadComponent);
