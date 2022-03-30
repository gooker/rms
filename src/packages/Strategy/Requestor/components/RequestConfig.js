import React, { memo, useState, useEffect } from 'react';
import { Select, Form, TimePicker, InputNumber } from 'antd';
import styles from './requestConfig.less';
import moment from 'moment';
import { formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';

const { Option } = Select;

/**
 *  0 立即执行
 *  1 间隔执行
 */
const RequestConfig = (props) => {
  const { id, value, onChange } = props; // id是api的id

  const [formRef] = Form.useForm();
  const [category, setCategory] = useState(null);

  useEffect(() => {
    if (value?.id !== id) {
      setCategory(null);
      formRef.setFieldsValue({ category: null });
    }
  }, [id]);

  // 定义时间数组
  const Hours = Array.from(Array(24), (v, k) => k);
  const Minutes = Array.from(Array(60), (v, k) => k);

  function disableHoure() {
    const h = moment().hour();
    return Hours.slice(0, h);
  }

  function disableMinute(hour) {
    const h = moment().hour();
    const m = moment().minute();
    if (hour > h) {
      return [];
    }
    return Minutes.slice(0, m - 1);
  }

  function onValuesChange(_, allValues) {
    onChange(allValues);
  }

  return (
    <Form form={formRef} onValuesChange={onValuesChange} className={styles.requestConfig}>
      <Form.Item hidden name="id" initialValue={id} />
      <Form.Item name="category" label={formatMessage({ id: 'app.requestor.config.category' })}>
        <Select
          style={{ width: 200 }}
          onChange={(_value) => {
            setCategory(_value);
          }}
        >
          <Option value={0}>
            <FormattedMessage id="app.requestor.config.immediately" />
          </Option>
          <Option value={1}>
            <FormattedMessage id="app.requestor.config.interval" />
          </Option>
        </Select>
      </Form.Item>
      {category === 1 && (
        <>
          <Form.Item
            name="interval"
            label={formatMessage({ id: 'app.requestor.config.sendInterval' })}
          >
            <InputNumber style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="endTime" label={formatMessage({ id: 'app.requestor.config.endTime' })}>
            <TimePicker
              format={'HH:mm:00'}
              showNow={false}
              style={{ width: 200 }}
              disabledHours={disableHoure}
              disabledMinutes={disableMinute}
            />
          </Form.Item>
        </>
      )}
    </Form>
  );
};
export default memo(RequestConfig);
