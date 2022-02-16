import React, { memo } from 'react';
import { Button, Col, Divider, Form, Input, Row, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import { formatMessage } from '@/utils/util';
import commonStyle from '@/common.module.less';

const ProgramingRelation = (props) => {
  const {} = props;
  const [formRef] = Form.useForm();

  return (
    <div>
      <Form labelWrap form={formRef} layout={'vertical'}>
        <Form.Item name={'zone'} label={<FormattedMessage id={'app.map.cell'} />}>
          <Select>
            <Select.Option>111</Select.Option>
          </Select>
        </Form.Item>

        {/* 起点 */}
        <Form.List name="beginning" initialValue={[null]}>
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  label={
                    index === 0 ? formatMessage({ id: 'editor.program.relation.beginning' }) : ''
                  }
                  required={false}
                  key={field.key}
                >
                  <Row gutter={10}>
                    <Col span={20}>
                      <Form.Item {...field} noStyle>
                        <Input style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col span={4} className={commonStyle.flexCenter}>
                      {fields.length > 1 ? (
                        <MinusCircleOutlined
                          onClick={() => remove(field.name)}
                          style={{ color: 'red', fontSize: 24 }}
                        />
                      ) : null}
                    </Col>
                  </Row>
                </Form.Item>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} style={{ width: '60%' }}>
                  <PlusOutlined />
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        {/* 终点 */}
        <Form.List name="destination" initialValue={[null]}>
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  label={
                    index === 0 ? formatMessage({ id: 'editor.program.relation.destination' }) : ''
                  }
                  required={false}
                  key={field.key}
                >
                  <Row gutter={10}>
                    <Col span={20}>
                      <Form.Item {...field} noStyle>
                        <Input style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col span={4} className={commonStyle.flexCenter}>
                      {fields.length > 1 ? (
                        <MinusCircleOutlined
                          onClick={() => remove(field.name)}
                          style={{ color: 'red', fontSize: 24 }}
                        />
                      ) : null}
                    </Col>
                  </Row>
                </Form.Item>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} style={{ width: '60%' }}>
                  <PlusOutlined />
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item>
          <Button type="primary">
            <FormattedMessage id={'app.button.confirm'} />
          </Button>
        </Form.Item>
      </Form>
      <Divider style={{ background: '#a3a3a3' }} />
      <Input prefix={<SearchOutlined />} />
    </div>
  );
};
export default memo(ProgramingRelation);
