import React, { memo, useState } from 'react';
import { Button, Form, Input, InputNumber, Select } from 'antd';
import { formatMessage, getFormLayout } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '@/packages/Scene/popoverPanel.module.less';
import { connect } from '@/utils/RmsDva';
import { NavigationType, NavigationTypeView } from '@/config/config';

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(6, 18);
const AddNavigation = (props) => {
  const { dispatch, mapContext } = props;
  const [formRef] = Form.useForm();
  const [type, setType] = useState(NavigationTypeView[0].code);

  function submit() {
    formRef.validateFields().then((values) => {
      dispatch({ type: 'editor/addNavigation', payload: values }).then((result) => {
        if (result) {
          formRef.resetFields();
          mapContext.updateCells({ type: 'add', payload: [result] });
        }
      });
    });
  }

  return (
    <div className={styles.formWhiteLabel}>
      <Form labelWrap form={formRef} {...formItemLayout}>
        <Form.Item
          name={'navigationCellType'}
          label={formatMessage({ id: 'editor.navigationType' })}
          initialValue={type}
          getValueFromEvent={(value) => {
            setType(value);
            return value;
          }}
        >
          <Select style={{ width: 133 }}>
            {NavigationTypeView.map(({ code, name }, index) => (
              <Select.Option key={index} value={code} disabled={code !== NavigationType.M_QRCODE}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* 牧星点位不要code, code就是Number ID*/}
        {type !== NavigationType.M_QRCODE && (
          <Form.Item
            name={'code'}
            label={formatMessage({ id: 'app.common.code' })}
            rules={[{ required: true }]}
          >
            <Input style={{ width: 133 }} />
          </Form.Item>
        )}

        <Form.Item
          name={'x'}
          label={formatMessage({ id: 'editor.cell.abscissa' })}
          rules={[{ required: true }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          name={'y'}
          label={formatMessage({ id: 'editor.cell.ordinate' })}
          rules={[{ required: true }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item {...formItemLayoutNoLabel}>
          <Button type="primary" onClick={submit}>
            <FormattedMessage id="app.button.generate" />
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default connect(({ editor, global }) => ({
  mapContext: editor.mapContext,
}))(memo(AddNavigation));
