import React, { useState } from 'react';
import { Row, Col, Form, Input, InputNumber, Select, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { isPlainObject } from 'lodash';
import {
  convertMapToArrayMap,
  dealResponse,
  formatMessage,
  getFormLayout,
  isStrictNull,
} from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { saveWebHook } from '@/services/commonService';
import RequestHeaderForm from '@/components/RequestHeaderForm';
import commonStyle from '@/common.module.less';

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(4, 18);

const WebHookFormModal = (props) => {
  const { editing, onClose, mqQueue } = props;

  const [formRef] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);

  function submit() {
    setSubmitLoading(true);
    formRef
      .validateFields()
      .then(async (webhook) => {
        let headers = {};
        if (Array.isArray(webhook.headers)) {
          webhook.headers.forEach((item) => {
            if (isPlainObject(item)) {
              const { key, value } = item;
              headers[key] = value;
            }
          });
        }
        let requestBody = { ...webhook, headers };
        if (editing) {
          requestBody = { ...editing, ...requestBody };
        }
        const response = await saveWebHook(requestBody);
        if (!dealResponse(response)) {
          onClose();
        }
      })
      .catch(() => {})
      .finally(() => {
        setSubmitLoading(false);
      });
  }

  function validateHeaders(_, headers) {
    if (headers.filter(Boolean).length === 0) {
      return Promise.resolve();
    }

    // 判断key或者value有没有空白
    for (let i = 0; i < headers.length; i++) {
      const headerItem = headers[i];
      if (isStrictNull(headerItem.key) || isStrictNull(headerItem.value)) {
        return Promise.reject(new Error(formatMessage({ id: 'webHook.headerItem.empty' })));
      }
    }

    // 判断key有没有重复
    const keys = headers.map(({ key }) => key);
    if (keys.length !== new Set(keys).size) {
      return Promise.reject(new Error(formatMessage({ id: 'webHook.headerItem.keyDuplicate' })));
    }

    return Promise.resolve();
  }

  function convertHeaders() {
    if (editing) {
      return convertMapToArrayMap(editing.headers);
    }
    return [];
  }

  return (
    <Form form={formRef} {...formItemLayout}>
      <Form.Item
        name="name"
        label={<FormattedMessage id={'app.common.name'} />}
        rules={[{ required: true }]}
        initialValue={editing?.name}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="url"
        label={'URL'}
        initialValue={editing?.url}
        rules={[{ required: true }, { type: 'url' }]}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item
        name="token"
        label={'Token'}
        initialValue={editing?.token}
        rules={[{ required: true }]}
      >
        <Input.TextArea />
      </Form.Item>

      {/* 队列 urlMappingRelation */}

      <Form.Item label={formatMessage({ id: 'webHook.queue.subscribeInfo' })}>
        <Form.List
          name="urlMappingRelation"
          initialValue={editing?.urlMappingRelation ?? [{}]}
          required={true}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item key={field.key}>
                  <Row gutter={10}>
                    <Col span={22}>
                      <Row gutter={24}>
                        <Col span={15}>
                          <Form.Item
                            noStyle
                            {...field}
                            name={[field.name, 'messageType']}
                            rules={[
                              {
                                required: true,
                                message: formatMessage({ id: 'webHook.queue.required' }),
                              },
                            ]}
                          >
                            <Select placeholder={formatMessage({ id: 'webHook.queue' })}>
                              {mqQueue?.map((type) => (
                                <Select.Option key={type} value={type}>
                                  {type}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>

                        <Col span={9}>
                          <Form.Item
                            noStyle
                            {...field}
                            name={[field.name, 'nameSpace']}
                            rules={[
                              {
                                required: true,
                                message: formatMessage({ id: 'webHook.queue.subscribe.required' }),
                              },
                            ]}
                          >
                            <Input placeholder={formatMessage({ id: 'webHook.queue.subscribe' })} />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={2} className={commonStyle.flexCenter}>
                      {fields.length > 1 ? (
                        <MinusCircleOutlined
                          onClick={() => remove(field.name)}
                          style={{ fontSize: 16 }}
                        />
                      ) : null}
                    </Col>
                  </Row>
                </Form.Item>
              ))}
              <Form.Item noStyle>
                <Button block type="dashed" onClick={() => add()}>
                  <PlusOutlined />
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>

      {/* 请求头 */}
      <Form.Item label={formatMessage({ id: 'app.request.headers' })}>
        <Form.List
          name="headers"
          initialValue={convertHeaders()}
          rules={[{ validator: validateHeaders }]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item key={field.key}>
                  <Row gutter={10}>
                    <Col span={22}>
                      <Form.Item noStyle {...field}>
                        <RequestHeaderForm />
                      </Form.Item>
                    </Col>
                    <Col span={2} className={commonStyle.flexCenter}>
                      <MinusCircleOutlined
                        onClick={() => remove(field.name)}
                        style={{ fontSize: 18 }}
                      />
                    </Col>
                  </Row>
                </Form.Item>
              ))}
              <Form.Item noStyle>
                <Button block type="dashed" onClick={() => add()}>
                  <PlusOutlined />
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>

      <Form.Item
        name="desc"
        label={<FormattedMessage id="app.common.description" />}
        initialValue={editing?.desc}
      >
        <Input />
      </Form.Item>

      <Form.Item label={<FormattedMessage id="app.common.timeout" />}>
        <Row>
          <Col>
            <Form.Item noStyle name="timeOut" initialValue={editing?.timeOut || 60}>
              <InputNumber />
            </Form.Item>
          </Col>
          <Col style={{ marginLeft: 10, display: 'flex', alignItems: 'center' }}>
            <FormattedMessage id="app.time.seconds" />
          </Col>
        </Row>
      </Form.Item>
      <Form.Item label={<FormattedMessage id="webHook.retryTimes" />}>
        <Row>
          <Col>
            <Form.Item noStyle name="tryCount" initialValue={editing?.tryCount || 3}>
              <InputNumber />
            </Form.Item>
          </Col>
          <Col style={{ marginLeft: 10, display: 'flex', alignItems: 'center' }}>
            <FormattedMessage id="app.common.times" />
          </Col>
        </Row>
      </Form.Item>
      <Form.Item {...formItemLayoutNoLabel}>
        <Button type={'primary'} onClick={submit} loading={submitLoading} disabled={submitLoading}>
          <FormattedMessage id={'app.button.submit'} />
        </Button>
        <Button
          onClick={() => {
            onClose(false);
          }}
          style={{ marginLeft: 15 }}
        >
          <FormattedMessage id={'app.button.cancel'} />
        </Button>
      </Form.Item>
    </Form>
  );
};
export default WebHookFormModal;
