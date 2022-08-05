import React, { memo, useEffect, useState } from 'react';
import { Form, Input, Radio } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import { formatMessage, isNull } from '@/utils/util';

const PodSimulationForm = (props) => {
  const { code, type, form, hidden } = props;
  const { setFieldsValue } = form;

  const [status, setStatus] = useState(null);
  const [isRandom, setIsRandom] = useState(null);

  useEffect(() => {
    const fieldValue = form.getFieldValue(code);
    if (fieldValue) {
      setIsRandom(fieldValue.isRandom);
    }
  }, []);

  return (
    <>
      <Form.Item
        hidden
        name={[code, 'customType']}
        initialValue={type}
        label={formatMessage({ id: 'app.common.type' })}
      >
        <Input disabled style={{ width: 300 }} />
      </Form.Item>
      <Form.Item
        hidden
        name={[code, 'code']}
        initialValue={code}
        label={formatMessage({ id: 'app.common.code' })}
      >
        <Input style={{ width: 300 }} />
      </Form.Item>

      {/* --------------------------------------------------------------- */}
      {/* 货架状态 */}
      <Form.Item
        hidden={hidden}
        name={[code, 'status']}
        label={formatMessage({ id: 'customTask.form.podStatus' })}
        rules={[{ required: true }]}
        getValueFromEvent={(ev) => {
          const value = ev.target.value;
          setFieldsValue({ [code]: { isRandom: null, podId: null } });
          setIsRandom(null);
          setStatus(value);
          return value;
        }}
      >
        <Radio.Group optionType="button" buttonStyle="solid">
          <Radio.Button value="GENERATE">
            <FormattedMessage id="customTask.form.generate" />
          </Radio.Button>
          <Radio.Button value="DISAPPEAR">
            <FormattedMessage id="customTask.form.disappear" />
          </Radio.Button>
        </Radio.Group>
      </Form.Item>

      {/* 是否随机 */}
      {status === 'GENERATE' ? (
        <Form.Item
          hidden={hidden}
          name={[code, 'isRandom']}
          label={formatMessage({ id: 'customTask.form.generateType' })}
          rules={[{ required: true }]}
          getValueFromEvent={(ev) => {
            const value = ev.target.value;
            setFieldsValue({ [code]: { podId: null } });
            setIsRandom(value);
            return value;
          }}
        >
          <Radio.Group optionType="button" buttonStyle="solid">
            <Radio.Button value={false}>
              <FormattedMessage id="customTask.form.specify" />
            </Radio.Button>
            <Radio.Button value={true}>
              <FormattedMessage id="customTask.form.random" />
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
      ) : null}

      {/* 货架ID */}
      {!isNull(isRandom) && !isRandom ? (
        <Form.Item
          hidden={hidden}
          name={[code, 'podId']}
          label={formatMessage({ id: 'resource.load.id' })}
          rules={[{ required: true }]}
        >
          <Input style={{ width: 300 }} />
        </Form.Item>
      ) : null}

      {/* 备注 */}
      <Form.Item
        hidden={hidden}
        name={[code, 'remark']}
        label={formatMessage({ id: 'app.common.remark' })}
      >
        <Input style={{ width: 500 }} />
      </Form.Item>
    </>
  );
};
export default memo(PodSimulationForm);
