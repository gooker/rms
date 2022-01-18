import React, { memo, useEffect, useState } from 'react';
import { Row, Col, Form, Button, Input, Select } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import { formatMessage } from '@/utils/utils';

const formLayout = { labelCol: { span: 9 }, wrapperCol: { span: 14 } };
let _prefix = null;

const FilterSearch = (props) => {
  const { searchKey, onValuesChange, onShowkey, prefix } = props;
  _prefix = prefix || 'reportCenter.qrcodehealth';

  const [form] = Form.useForm();
  const [togglesCode, setTogglesCode] = useState(0);

  useEffect(() => {
    function init() {}
    init();
  }, []);

  // function clearForm() {
  //   form.resetFields();
  // }

  return (
    <div key="a" style={{ position: 'relative' }}>
      {togglesCode === 1 ? (
        <>
          <Form form={form} onValuesChange={onValuesChange} {...formLayout}>
            <Row>
              <>
                {searchKey.map((key) => {
                  return (
                    <Col span={6} key={key}>
                      <Form.Item
                        name={key}
                        label={
                          !onShowkey
                            ? `${formatMessage({
                                id: `${_prefix}.${key}`,
                              })}`
                            : `${key}`
                        }
                        rules={[
                          {
                            pattern: new RegExp(/^[1-9]\d*$/, 'g'),
                            message: '请输入正整数',
                          },
                        ]}
                      >
                        <Input allowClear/>
                      </Form.Item>
                    </Col>
                  );
                })}

                <Col span={6}>
                  <Form.Item name={'robotIds'} label={<FormattedMessage id="app.agv" />}>
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      maxTagTextLength={5}
                      maxTagCount={4}
                      allowClear
                    />
                  </Form.Item>
                </Col>
              </>
            </Row>
          </Form>
          <Row>
            <Col span={24} style={{ padding: '10px 0', borderTop: '1px solid #e8e8e8' }}>
              <Button
                type="text"
                onClick={() => {
                  setTogglesCode(0);
                }}
              >
                <UpOutlined />
                <FormattedMessage id="app.reportCenter.packUp" />
              </Button>
            </Col>
          </Row>
        </>
      ) : (
        <Row>
          <Col span={24}>
            <Button
              type="text"
              style={{ padding: '10px 0' }}
              onClick={() => {
                setTogglesCode(1);
              }}
            >
              <DownOutlined />
              <FormattedMessage id="app.reportCenter.expand" />
            </Button>
          </Col>
        </Row>
      )}
    </div>
  );
};
export default memo(FilterSearch);
