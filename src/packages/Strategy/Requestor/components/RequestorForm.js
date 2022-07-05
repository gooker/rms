import React from 'react';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { debounce, isPlainObject } from 'lodash';
import { formatMessage, getFormLayout, isStrictNull } from '@/utils/util';
import { connect } from '@/utils/RmsDva';
import HeaderInput from './HeaderInput';
import JSONEditor from './JSONEditor';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../requestor.module.less';
import { getRequestorURLParams } from '@/packages/Strategy/Requestor/requestorUtil';

const { Option } = Select;
const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(3, 21);

/**
 * string 字符串
 * number 数字
 * list 数组
 * boolean: 布尔值
 * 例如: {{string}} 表示该字段是待填充值并且是字符串类型
 */

@connect(({ global }) => ({
  allVehicleTypes: global.allVehicleTypes,
}))
class RequestForm extends React.Component {
  formRef = React.createRef();

  componentDidMount() {
    const { apiData } = this.props;
    const { setFieldsValue } = this.formRef.current;

    if (apiData) {
      this.mapPropsToFields(apiData);
    } else {
      const header = [{ key: 'sectionId', value: window.localStorage.getItem('sectionId') }];
      const comment = [{ key: null, value: null }];
      setFieldsValue({ header, comment });
    }
  }

  mapPropsToFields = (propsValue) => {
    const { setFieldsValue } = this.formRef.current;

    // 转换请求头
    const headers = [];
    Object.keys(propsValue.header).forEach((key) => {
      headers.push({ key, value: propsValue.header[key] });
    });

    // 转换字段描述
    const comments = [];
    Object.keys(propsValue.comment).forEach((key) => {
      comments.push({ key, value: propsValue.comment[key] });
    });

    setFieldsValue({
      name: propsValue.name,
      method: propsValue.method,
      header: headers,
      url: propsValue.url,
      body: propsValue.body,
      vehicleType: propsValue.vehicleType,
      description: propsValue.description,
      comment: comments,
    });
  };

  JSONValidator = (_, value) => {
    if (!isStrictNull(value)) {
      try {
        JSON.parse(value);
      } catch (error) {
        return Promise.reject(
          new Error(formatMessage({ id: 'app.requestor.form.body.formatError' })),
        );
      }
    }
    return Promise.resolve();
  };

  collectionFields = (url, body) => {
    const { getFieldValue, setFieldsValue } = this.formRef.current;

    if (!url) {
      url = getFieldValue('url');
    }
    if (!body) {
      body = getFieldValue('body');
    }
    const URLFields = this.extractURLFields(url);
    const bodyFields = this.extractBodyFields(body);
    setFieldsValue({ comment: [...URLFields, ...bodyFields] });
  };

  extractURLFields = (url) => {
    if (!isStrictNull(url)) {
      const oldComment = this.props?.apiData?.comment || {};
      const comment = [];
      const urlParams = getRequestorURLParams(url);
      urlParams.forEach((commentKey) => {
        comment.push({ key: commentKey, value: oldComment[commentKey] });
      });
      return comment;
    }
    return [];
  };

  extractBodyFields = (body) => {
    if (isStrictNull(body)) {
      return [];
    }
    try {
      const oldComment = this.props?.apiData?.comment || {};
      const comment = [];

      // 先处理请求体
      const formatedBody = JSON.parse(body);
      // 只考虑普通对象, 并且如果存在嵌套那只能是一层且是数组
      if (isPlainObject(formatedBody)) {
        Object.keys(formatedBody).forEach((field) => {
          const fieldValue = formatedBody[field];
          if (typeof fieldValue !== 'object') {
            comment.push({ key: field, value: oldComment[field] });
          } else {
            if (Array.isArray(fieldValue)) {
              Object.keys(fieldValue[0]).forEach((nestField) => {
                const commentKey = `${field}-${nestField}`;
                comment.push({ key: commentKey, value: oldComment[commentKey] });
              });
            }
          }
        });
        return comment;
      }
    } catch (error) {
      return [];
    }
  };

  submit = () => {
    const { apiData } = this.props;
    const { validateFields } = this.formRef.current;
    validateFields().then((data) => {
      // 数据转化
      const formData = apiData ? { ...apiData, ...data } : { ...data };

      // 请求头
      const header = {};
      data.header.forEach(({ key, value }) => {
        header[key] = value;
      });
      formData.header = header;

      // 请求体
      if (isStrictNull(data.body)) {
        formData.body = '{}';
      } else {
        formData.body = JSON.stringify(JSON.parse(data.body));
      }

      // 字段说明
      const comment = {};
      data.comment.forEach(({ key, value }) => {
        comment[key] = value;
      });
      formData.comment = comment;

      this.props.submit(formData);
    });
  };

  render() {
    const { allVehicleTypes } = this.props;
    return (
      <Form {...formItemLayout} ref={this.formRef}>
        {/* 名称 */}
        <Form.Item
          label={formatMessage({ id: 'app.requestor.form.name' })}
          name="name"
          rules={[
            { required: true, message: formatMessage({ id: 'app.requestor.form.name.required' }) },
          ]}
        >
          <Input style={{ width: '80%' }} maxLength={6} />
        </Form.Item>

        {/* 描述 */}
        <Form.Item
          label={formatMessage({ id: 'app.requestor.form.description' })}
          name="description"
        >
          <Input style={{ width: '80%' }} />
        </Form.Item>

        {/* 请求路径 */}
        <Form.Item
          label={formatMessage({ id: 'app.requestor.form.url' })}
          name="url"
          getValueFromEvent={(ev) => {
            debounce((url) => {
              this.collectionFields(url, undefined);
            }, 500)(ev.target.value);
            return ev.target.value;
          }}
        >
          <Input style={{ width: '80%' }} />
        </Form.Item>

        {/* 请求方法 */}
        <Form.Item
          label={formatMessage({ id: 'app.requestor.form.method' })}
          name="method"
          rules={[{ required: true }]}
        >
          <Select style={{ width: '80%' }}>
            <Option value="GET">GET</Option>
            <Option value="POST">POST</Option>
            <Option value="DELETE">DELETE</Option>
            <Option value="PUT">PUT</Option>
          </Select>
        </Form.Item>

        {/* 请求头 */}
        <Form.List name="header">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  key={field.key}
                  required={true}
                  {...(index === 0 ? formItemLayout : formItemLayoutNoLabel)}
                  label={index === 0 ? formatMessage({ id: 'app.requestor.form.header' }) : ''}
                >
                  <Row style={{ width: '80%' }}>
                    <Col span={21}>
                      <Form.Item noStyle {...field}>
                        <HeaderInput />
                      </Form.Item>
                    </Col>
                    <Col span={1} className={styles.headerDelete}>
                      {index > 1 ? (
                        <MinusCircleOutlined
                          className="dynamic-delete-button"
                          onClick={() => remove(field.name)}
                        />
                      ) : null}
                    </Col>
                  </Row>
                </Form.Item>
              ))}
              <Form.Item {...formItemLayoutNoLabel}>
                <Button block type="dashed" onClick={() => add()} style={{ width: '27.5%' }}>
                  <PlusOutlined /> <FormattedMessage id="app.requestor.form.header.add" />
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        {/* 请求体 */}
        <Form.Item
          label={formatMessage({ id: 'app.requestor.form.body' })}
          name="body"
          rules={[{ required: true, validator: this.JSONValidator }]}
          getValueFromEvent={(ev) => {
            debounce((body) => {
              this.collectionFields(undefined, body);
            }, 500)(ev);
            return ev;
          }}
        >
          <JSONEditor />
        </Form.Item>

        {/* 字段描述 */}
        <Form.List name="comment">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  key={field.key}
                  required={true}
                  {...(index === 0 ? formItemLayout : formItemLayoutNoLabel)}
                  label={index === 0 ? formatMessage({ id: 'app.requestor.form.fieldsDesc' }) : ''}
                >
                  <Row style={{ width: '80%' }}>
                    <Col span={22}>
                      <Form.Item noStyle {...field}>
                        <HeaderInput />
                      </Form.Item>
                    </Col>
                    <Col span={2} className={styles.headerCommentDelete}>
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        onClick={() => remove(field.name)}
                      />
                    </Col>
                  </Row>
                </Form.Item>
              ))}
              <Form.Item {...formItemLayoutNoLabel}>
                <Button
                  block
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                  style={{ width: '27.5%' }}
                >
                  {' '}
                  <FormattedMessage id="app.requestor.form.fieldsDesc.add" />
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        {/* 车辆类型 */}
        <Form.Item
          label={formatMessage({ id: 'app.requestor.form.vehicleType' })}
          name="vehicleType"
        >
          <Select style={{ width: '80%' }}>
            {allVehicleTypes.map(({ name, key, standardName }) => (
              <Option key={key} value={standardName}>
                <FormattedMessage id={name} />
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* 提交 */}
        <Form.Item {...formItemLayoutNoLabel}>
          <Button type="primary" onClick={this.submit}>
            <FormattedMessage id="app.button.submit" />
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
export default RequestForm;
