import React from 'react';
import { Form,InputNumber, Select, Radio, Button } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import { formatMessage } from '@/utils/utils';
import styles from './addpod.module.less';
const FormLayout = { labelCol: { span: 7 }, wrapperCol: { span: 17 } };
const NoLabelFormLayout = { wrapperCol: { offset: 7, span: 9 } };

function AddPodModal(props) {
  const { updateRow, onCancel, onSubmit } = props;
  const [formRef] = Form.useForm();

  function submit() {
    formRef
      .validateFields()
      .then((values) => {
        onSubmit(values);
      })
      .catch(() => {});
  }
  return (
    <Form form={formRef} {...FormLayout} className={styles.addpodForm}>
      <Form.Item
        label={<FormattedMessage id="app.pod.id" />}
        name="podId"
        rules={[
          {
            required: true,
            message: formatMessage({ id: 'sourcemanage.require.podId' }),
          },
        ]}
        initialValue={updateRow ? updateRow.podId : null}
      >
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        label={<FormattedMessage id="app.agv.id" />}
        name="robotId"
        initialValue={updateRow ? updateRow.robotId : null}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item
        label={<FormattedMessage id="sourcemanage.pod.length.bd" />}
        name="length"
        initialValue={updateRow ? updateRow.length : null}
        rules={[
          {
            required: true,
            message: formatMessage({ id: 'sourcemanage.require.podLength' }),
          },
        ]}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item
        label={<FormattedMessage id="sourcemanage.pod.length.ac" />}
        name="width"
        initialValue={updateRow ? updateRow.width : null}
        rules={[
          {
            required: true,
            message: formatMessage({ id: 'sourcemanage.require.podWidth' }),
          },
        ]}
      >
        <InputNumber />
      </Form.Item>

      <Form.Item
        label={<FormattedMessage id="sourcemanage.pod.area" />}
        name="zoneIds"
        initialValue={updateRow ? updateRow.zoneIds || [] : []}
      >
        <Select allowClear mode="tags" />
      </Form.Item>
      <Form.Item
        label={<FormattedMessage id="app.common.position" />}
        name="cellId"
        initialValue={updateRow ? updateRow.cellId : null}
        rules={[
          {
            required: true,
            message: formatMessage({ id: 'sourcemanage.require.position' }),
          },
        ]}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item
        label={<FormattedMessage id="sourcemanage.pod.reserved" />}
        name="isReserved"
        rules={[
          {
            required: true,
          },
        ]}
        initialValue={updateRow ? updateRow.isReserved : true}
      >
        <Radio.Group>
          <Radio.Button value={true}>
            <FormattedMessage id="app.common.true" />
          </Radio.Button>
          <Radio.Button value={false}>
            <FormattedMessage id="app.common.false" />
          </Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        label={<FormattedMessage id="app.direction" />}
        name="angle"
        rules={[
          {
            required: true,
          },
        ]}
        initialValue={updateRow ? updateRow.angle : 0}
      >
        <Radio.Group>
          <Radio.Button value={0}>
            <FormattedMessage id="app.pod.side.A" />
          </Radio.Button>
          <Radio.Button value={90}>
            <FormattedMessage id="app.pod.side.B" />
          </Radio.Button>
          <Radio.Button value={180}>
            <FormattedMessage id="app.pod.side.C" />
          </Radio.Button>
          <Radio.Button value={270}>
            <FormattedMessage id="app.pod.side.D" />
          </Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item {...NoLabelFormLayout} style={{ marginTop: 50 }}>
        <Button onClick={onCancel}>
          <FormattedMessage id="app.button.cancel" />
        </Button>
        <Button type="primary" onClick={submit} style={{ marginLeft: '20px' }}>
          <FormattedMessage id="app.button.confirm" />
        </Button>
      </Form.Item>
    </Form>
  );
}

export default AddPodModal;
