import React, { memo, useState } from 'react';
import { Form, Button, InputNumber, Input, Checkbox, Select } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { releaseAdvancedLatnetHandling } from '@/services/monitor';
import { dealResponse, formatMessage, getFormLayout } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../../monitorLayout.module.less';

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(5, 18);

const AdvancedReleaseComponent = (props) => {
  const { dispatch, functionArea } = props;
  const [formRef] = Form.useForm();
  const [executing, setExecuting] = useState(false);

  function close() {
    dispatch({ type: 'monitor/saveCategoryModal', payload: null });
  }

  function release() {
    formRef
      .validateFields()
      .then((values) => {
        setExecuting(true);
        releaseAdvancedLatnetHandling({ ...values }).then((response) => {
          if (!dealResponse(response, formatMessage({ id: 'app.message.sendCommandSuccess' }))) {
            close();
          }
        });
        setExecuting(false);
      })
      .catch(() => {});
  }

  return (
    <>
      <Form form={formRef} labelWrap className={styles.advancedForm} {...formItemLayout}>
        <Form.Item
          name={'podId'}
          label={formatMessage({ id: 'app.pod' })}
          rules={[{ required: true }]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item name={'taskId'} label={formatMessage({ id: 'app.task.id' })}>
          <Input allowClear style={{ width: '80%' }} />
        </Form.Item>
        <Form.Item
          name={'backZone'}
          label={formatMessage({ id: 'monitor.advancedCarry.backZone' })}
        >
          <Checkbox.Group>
            {functionArea?.map((item) => (
              <Checkbox key={item} value={item}>
                {item}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>

        <Form.Item
          name={'scopeCodes'}
          label={formatMessage({
            id: 'monitor.advancedCarry.scopeCode',
          })}
        >
          <Select mode="tags" style={{ width: '80%' }} />
        </Form.Item>

        <Form.Item {...formItemLayoutNoLabel}>
          <Button onClick={release} loading={executing} disabled={executing} type="primary">
            <SendOutlined /> <FormattedMessage id={'app.button.execute'} />
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
export default memo(AdvancedReleaseComponent);
