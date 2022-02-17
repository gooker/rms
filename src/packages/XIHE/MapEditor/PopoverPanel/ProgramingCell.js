import React, { memo } from 'react';
import { Button, Col, Divider, Form, Input, Row, Select } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import { formatMessage } from '@/utils/util';
import commonStyle from '@/common.module.less';
import { MinusCircleOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';

const ProgramingCell = (props) => {
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

        {/* 到达前*/}
        <Form.List name="willArrive" initialValue={[null]}>
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

        {/* 到达后*/}
        <Form.List name="afterArrive" initialValue={[null]}>
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  label={
                    index === 0 ? formatMessage({ id: 'editor.program.cell.afterArrive' }) : ''
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

        {/* 离开前*/}
        <Form.List name="beforeLeave" initialValue={[null]}>
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  label={
                    index === 0 ? formatMessage({ id: 'editor.program.cell.beforeLeave' }) : ''
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
export default memo(ProgramingCell);
