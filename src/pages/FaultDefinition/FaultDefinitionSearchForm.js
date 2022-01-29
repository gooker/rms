import React, { memo } from 'react';
import { Form, Row, Col, Input, Button } from 'antd';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import { isStrictNull } from '@/utils/util';

const FaultDefinitionSearchForm = (props) => {
  const { search } = props;

  const [formRef] = Form.useForm();

  function getFormatter() {
    const { errorCode, errorName, errorType, level } = formRef.getFieldsValue();
    return (dataSource) => {
      let result = [...dataSource];
      if (!isStrictNull(errorCode)) {
        result = result.filter((item) => item.errorCode === errorCode);
      }
      if (!isStrictNull(errorName)) {
        result = result.filter((item) => {
          if (isStrictNull(item.errorName)) {
            return false;
          }
          return item.errorName.includes(errorName);
        });
      }
      if (!isStrictNull(errorType)) {
        result = result.filter((item) => item.errorType === errorType);
      }
      if (!isStrictNull(level)) {
        result = result.filter((item) => item.level === level);
      }
      return result;
    };
  }

  return (
    <Form form={formRef}>
      <Row gutter={10}>
        <Col span={5}>
          <Form.Item name={'errorName'} label={<FormattedMessage id={'app.fault.name'} />}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item name={'errorCode'} label={<FormattedMessage id={'app.fault.code'} />}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item name={'errorType'} label={<FormattedMessage id={'app.fault.type'} />}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item name={'level'} label={<FormattedMessage id={'app.fault.level'} />}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Button type={'primary'} onClick={() => search(getFormatter())}>
            <SearchOutlined /> <FormattedMessage id={'app.button.search'} />
          </Button>
          <Button
            onClick={() => {
              formRef.resetFields();
              search();
            }}
            style={{ marginLeft: 10 }}
          >
            <ReloadOutlined /> <FormattedMessage id={'app.button.reset'} />
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
export default memo(FaultDefinitionSearchForm);
