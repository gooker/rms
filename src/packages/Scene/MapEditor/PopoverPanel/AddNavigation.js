import React, { memo } from 'react';
import { Form, Switch, InputNumber, Button, Input, Select } from 'antd';
import { formatMessage, getFormLayout } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '@/packages/Scene/popoverPanel.module.less';
import { connect } from '@/utils/RmsDva';

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(7, 14);
const AddNavigation = (props) => {
  const { dispatch, mapContext, navigationCellType } = props;
  const [formRef] = Form.useForm();

  function submit() {
    formRef.validateFields().then((values) => {
      dispatch({ type: 'editor/addNavigation', payload: values }).then((result) => {
        if (result) {
          formRef.resetFields();
          mapContext.updateCells({
            type: 'add',
            payload: result,
          });
        }
      });
    });
  }

  return (
    <div className={styles.formWhiteLabel}>
      <Form labelWrap form={formRef} {...formItemLayout}>
        <Form.Item
          name={'navigationCellType'}
          label={formatMessage({ id: 'editor.navigationCellType' })}
          initialValue={navigationCellType[0].code}
        >
          <Select style={{ width: 133 }}>
            {navigationCellType.map(({ code, name }, index) => (
              <Select.Option key={index} value={code}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name={'code'}
          label={formatMessage({ id: 'app.common.code' })}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
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
        <Form.Item
          name={'syncAsController'}
          label={formatMessage({ id: 'editor.batchAddCell.syncAsController' })}
          initialValue={true}
          valuePropName={'checked'}
        >
          <Switch />
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
  navigationCellType: global.navigationCellType,
}))(memo(AddNavigation));
