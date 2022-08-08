import React, { useState } from 'react';
import { Button, Col, Form, Input, InputNumber, message, Row, Select } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { find, isEmpty, isPlainObject } from 'lodash';
import { convertMapToArrayMap, dealResponse, formatMessage, getFormLayout, isNull, isStrictNull } from '@/utils/util';
import { IconFont } from '@/components/IconFont';
import CommonModal from '@/components/CommonModal';
import { saveWebHook } from '@/services/commonService';
import FormattedMessage from '@/components/FormattedMessage';
import RequestHeaderForm from '@/components/RequestHeaderForm';
import WebHookTestModal from './WebHookTestModal';
import WebHookBatchTestModal from './WebHookBatchTestModal';
import commonStyle from '@/common.module.less';

const { formItemLayout } = getFormLayout(3, 20);

const WebHookFormModal = (props) => {
  const { editing, onClose, mqQueue, visible } = props;

  const [formRef] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [testPayload, setTestPayload] = useState(null);
  const [batchTestPayload, setBatchTestPayload] = useState(null);

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
    const currentHeader = headers.filter(Boolean);
    if (currentHeader.filter(Boolean).length === 0) {
      return Promise.resolve();
    }

    // 判断key或者value有没有空白
    for (let i = 0; i < currentHeader.length; i++) {
      const headerItem = currentHeader[i];
      if (isStrictNull(headerItem.key) || isStrictNull(headerItem.value)) {
        return Promise.reject(new Error(formatMessage('webHook.headerItem.empty')));
      }
    }

    // 判断key有没有重复
    const keys = currentHeader.map(({ key }) => key);
    if (keys.length !== new Set(keys).size) {
      return Promise.reject(new Error(formatMessage('webHook.headerItem.keyDuplicate')));
    }

    return Promise.resolve();
  }

  function convertHeaders() {
    if (editing) {
      return convertMapToArrayMap(editing.headers);
    } else {
      return [
        { key: 'sectionId', value: '' },
        { key: 'token', value: '' },
      ];
    }
  }

  function testTopic(field) {
    formRef
      .validateFields()
      .then((value) => {
        const { url, headers, urlMappingRelation } = value;
        const fieldValue = urlMappingRelation[field.fieldKey];
        if (fieldValue) {
          const { topic } = fieldValue;
          const targetTopicData = find(mqQueue, { webHookTopic: topic });
          if (targetTopicData) {
            const { payload } = targetTopicData;
            if (!isNull(payload)) {
              try {
                const _testPayload = {
                  url,
                  headers,
                  urlMappingRelation: fieldValue,
                  webHookTopicDTO: targetTopicData,
                  body: JSON.parse(payload),
                };
                setTestPayload(_testPayload);
              } catch (e) {
                message.warn(formatMessage('webHook.queueTestLoad.err'));
              }
            }
          } else {
            message.error(formatMessage('webHook.queue.loss', { queue: topic }));
          }
        }
      })
      .catch(() => {
      });
  }

  function openBatchTestModal() {
    formRef
      .validateFields()
      .then((value) => {
        const { urlMappingRelation } = value;
        if (Array.isArray(urlMappingRelation) && !isEmpty(urlMappingRelation)) {
          setBatchTestPayload(value);
        } else {
          message.error(formatMessage('webHook.subscribe.required'));
        }
      })
      .catch(() => {
      });
  }

  const title = `${formatMessage(isNull(editing) ? 'app.button.add' : 'app.button.update')}`;

  return (
    <>
      <CommonModal
        title={title}
        visible={visible}
        width={700}
        footer={[
          <Button
            key={'cancel'}
            onClick={() => {
              onClose(false);
            }}
          >
            <FormattedMessage id={'app.button.cancel'} />
          </Button>,
          <Button key={'test'} onClick={openBatchTestModal}>
            <FormattedMessage id={'webHook.batchTest'} />
          </Button>,
          <Button key={'submit'} type={'primary'} loading={submitLoading} onClick={submit}>
            <FormattedMessage id={'app.button.submit'} />
          </Button>,
        ]}
      >
        <Form form={formRef} labelWrap {...formItemLayout} preserve={false}>
          <Form.Item
            name='name'
            label={<FormattedMessage id={'app.common.name'} />}
            rules={[{ required: true }]}
            initialValue={editing?.name}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name='url'
            label={'URL'}
            initialValue={editing?.url}
            rules={[{ required: true }, { type: 'url' }]}
          >
            <Input />
          </Form.Item>

          {/* 队列 */}
          <Form.Item label={formatMessage('webHook.subscribe')}>
            <Form.List
              required
              name='urlMappingRelation'
              initialValue={editing?.urlMappingRelation ?? []}
            >
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Form.Item key={key}>
                      <Row gutter={8}>
                        <Col span={20}>
                          <Row gutter={8}>
                            <Col span={12}>
                              <Form.Item
                                noStyle
                                {...restField}
                                name={[name, 'topic']}
                                rules={[
                                  {
                                    required: true,
                                    message: formatMessage('webHook.subscribe.event.required'),
                                  },
                                ]}
                              >
                                <Select placeholder={formatMessage('webHook.subscribe.event')}>
                                  {mqQueue?.map(({ webHookTopic, name }) => (
                                    <Select.Option key={webHookTopic} value={webHookTopic}>
                                      {name}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                noStyle
                                {...restField}
                                name={[name, 'address']}
                                rules={[
                                  {
                                    required: true,
                                    message: formatMessage('webHook.subscribe.address.required'),
                                  },
                                ]}
                              >
                                <Input placeholder={formatMessage('webHook.subscribe.address')} />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>
                        <Col span={2} className={commonStyle.flexCenter}>
                          <Button
                            icon={<MinusOutlined />}
                            disabled={fields.length < 2}
                            onClick={() => remove(name)}
                          />
                        </Col>
                        <Col span={2} className={commonStyle.flexCenter}>
                          <Button
                            icon={<IconFont type={'icon-test'} style={{ color: '#000000' }} />}
                            onClick={() => testTopic(restField)}
                          />
                        </Col>
                      </Row>
                    </Form.Item>
                  ))}
                  <Form.Item noStyle>
                    <Button block type='dashed' onClick={() => add()}>
                      <PlusOutlined />
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>

          {/* 请求头 */}
          <Form.Item label={formatMessage('app.request.headers')}>
            <Form.List
              name='headers'
              initialValue={convertHeaders()}
              rules={[{ validator: validateHeaders }]}
            >
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map((field) => (
                    <Form.Item key={field.key}>
                      <Row gutter={8}>
                        <Col span={22}>
                          <Form.Item noStyle {...field}>
                            <RequestHeaderForm />
                          </Form.Item>
                        </Col>
                        <Col span={2} className={commonStyle.flexCenter}>
                          <Button icon={<MinusOutlined />} onClick={() => remove(field.name)} />
                        </Col>
                      </Row>
                    </Form.Item>
                  ))}
                  <Form.Item noStyle>
                    <Button block type='dashed' onClick={() => add()}>
                      <PlusOutlined />
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>

          <Form.Item
            name='desc'
            label={<FormattedMessage id='app.common.description' />}
            initialValue={editing?.desc}
          >
            <Input />
          </Form.Item>

          <Form.Item label={<FormattedMessage id='app.common.timeout' />}>
            <Row>
              <Col>
                <Form.Item noStyle name='timeOut' initialValue={editing?.timeOut || 60}>
                  <InputNumber />
                </Form.Item>
              </Col>
              <Col style={{ marginLeft: 10, display: 'flex', alignItems: 'center' }}>
                <FormattedMessage id='app.time.seconds' />
              </Col>
            </Row>
          </Form.Item>
          <Form.Item label={<FormattedMessage id='webHook.retryTimes' />}>
            <Row>
              <Col>
                <Form.Item noStyle name='tryCount' initialValue={editing?.tryCount || 3}>
                  <InputNumber />
                </Form.Item>
              </Col>
              <Col style={{ marginLeft: 10, display: 'flex', alignItems: 'center' }}>
                <FormattedMessage id='app.common.times' />
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </CommonModal>

      {/* 单个测试：支持修改参数 */}
      <WebHookTestModal
        data={testPayload}
        onCancel={() => {
          setTestPayload(null);
        }}
      />

      {/* 批量测试 */}
      <WebHookBatchTestModal
        data={batchTestPayload}
        onCancel={() => {
          setBatchTestPayload(null);
        }}
      />
    </>
  );
};
export default WebHookFormModal;
