/* TODO: I18N */
import React, { memo } from 'react';
import { Form, Row, Col, Select } from 'antd';
import { FunnelPlotOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';

const SearchSpecComponent = (props) => {
  const { setLoadType, allLoadSpecType } = props;

  const [formRef] = Form.useForm();

  function handleLoadType(_, values) {
    setLoadType(values?.loadTypeCode);
  }

  return (
    <>
      <Form form={formRef} onValuesChange={handleLoadType}>
        <Row gutter={24}>
          <Col
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 30,
              height:30,
            }}
          >
            <FunnelPlotOutlined />
          </Col>
          <Col span={6}>
            <Form.Item label={<FormattedMessage id="app.common.type" />} name="loadTypeCode">
              <Select allowClear style={{ width: '100%' }}>
                {allLoadSpecType?.map(({ id, code, name }) => (
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
export default memo(SearchSpecComponent);
