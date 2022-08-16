import React, { memo, useState } from 'react';
import { Button, Form, Input, Select, Switch } from 'antd';
import { getFormLayout, formatMessage } from '@/utils/util';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';
import { BroadCastPattern, BroadCastTiming, ContentType, BroadCastType } from '../enum';

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(6, 16);
const BroadcastChannelForm = (props) => {
  const { data, onSubmit, loading, systemLanguage } = props;

  const [formRef] = Form.useForm();
  const [broadCastPattern, setBroadCastPattern] = useState(data?.broadCastPattern || null);
  const [broadCastType, setBroadCastType] = useState(data?.broadCastType || null);

  function submit() {
    formRef.validateFields().then((values) => {
      const _values = { ...values };

      // 目前只有 Email 类型的频道才可以订阅
      if (_values.broadCastPattern === 'Email') {
        _values.webhook = null;
        _values.sign = null;
        _values.isSubscribe = true;
      } else {
        _values.isSubscribe = false;
      }
      onSubmit(_values);
    });
  }

  return (
    <Form form={formRef} {...formItemLayout}>
      <Form.Item
        name={'name'}
        label={formatMessage({ id: 'app.common.name' })}
        rules={[{ required: true }]}
        initialValue={data?.name || null}
      >
        <Input />
      </Form.Item>

      {/* 广播渠道 */}
      <Form.Item
        name={'broadCastPattern'}
        label={formatMessage({ id: 'app.notification.broadCastPattern' })}
        rules={[{ required: true }]}
        initialValue={data?.broadCastPattern || null}
        getValueFromEvent={(value) => {
          setBroadCastPattern(value);
          return value;
        }}
      >
        <Select>
          {BroadCastPattern.map(({ key, label }) => (
            <Select.Option key={key} value={key}>
              <FormattedMessage id={label} />
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {/* 广播类型 */}
      <Form.Item
        name={'broadCastType'}
        label={formatMessage({ id: 'app.notification.broadCastType' })}
        rules={[{ required: true }]}
        initialValue={data?.broadCastType || null}
      >
        <Select>
          {BroadCastType.map(({ key, label }) => (
            <Select.Option key={key} value={key}>
              <FormattedMessage id={label} />
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {/* 广播时机 */}
      <Form.Item
        name={'broadCastTiming'}
        label={formatMessage({ id: 'app.notification.broadCastTiming' })}
        rules={[{ required: true }]}
        initialValue={data?.broadCastTiming || null}
        getValueFromEvent={(value) => {
          setBroadCastType(value);
          return value;
        }}
      >
        <Select>
          {BroadCastTiming.map(({ key, label }) => (
            <Select.Option key={key} value={key}>
              <FormattedMessage id={label} />
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {/* 广播类型为延时播报才需要配置延时时长 */}
      {broadCastType === 'Delay' && (
        <Form.Item
          name={'timeOut'}
          label={formatMessage({ id: 'app.notification.broadCastTiming.delayLabel' })}
          rules={[{ required: true }]}
          initialValue={data?.timeOut || null}
        >
          <Input suffix={formatMessage({ id: 'app.time.seconds' })} />
        </Form.Item>
      )}

      <Form.Item
        name={'contentType'}
        label={formatMessage({ id: 'app.notification.contentType' })}
        rules={[{ required: true }]}
        initialValue={data?.contentType || null}
      >
        <Select>
          {ContentType.map(({ key, label }) => (
            <Select.Option key={key} value={key}>
              <FormattedMessage id={label} />
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {/* 延迟推送的话就不需要配置周期了 */}
      {broadCastType !== 'TimeOut' && (
        <Form.Item
          name={'cycle'}
          label={formatMessage({ id: 'app.notification.cycle' })}
          rules={[{ required: true }]}
          initialValue={data?.cycle || null}
        >
          <Input suffix={formatMessage({ id: 'app.time.seconds' })} />
        </Form.Item>
      )}

      {/* 只有选择了钉钉渠道才需要填写 */}
      {broadCastPattern === 'DingTalk' && (
        <>
          <Form.Item
            name={'webhook'}
            label={'Web Hook'}
            rules={[{ required: true }]}
            initialValue={data?.webhook || null}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name={'sign'}
            label={'Sign'}
            rules={[{ required: true }]}
            initialValue={data?.sign || null}
          >
            <Input.TextArea />
          </Form.Item>
        </>
      )}

      <Form.Item
        name={'languageType'}
        label={formatMessage({ id: 'translator.languageManage.language' })}
        rules={[{ required: true }]}
        initialValue={data?.languageType || null}
      >
        <Select>
          {systemLanguage?.map(({ code, name }) => (
            <Select.Option value={code} key={code}>
              {name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name={'isOpen'}
        label={formatMessage({ id: 'app.notification.isOpen' })}
        initialValue={data ? data.isOpen : true}
        rules={[{ required: true }]}
        valuePropName={'checked'}
      >
        <Switch />
      </Form.Item>
      <Form.Item {...formItemLayoutNoLabel}>
        <Button type={'primary'} onClick={submit} loading={loading} disabled={loading}>
          <FormattedMessage id={'app.button.submit'} />
        </Button>
      </Form.Item>
    </Form>
  );
};

export default connect(({ global }) => ({
  systemLanguage: global.systemLanguage,
}))(BroadcastChannelForm);
