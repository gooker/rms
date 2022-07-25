import React, { memo, useState } from 'react';
import { Button, Form, Input, InputNumber, Select } from 'antd';
import { formatMessage, getFormLayout } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '@/packages/Scene/popoverPanel.module.less';
import { connect } from '@/utils/RmsDva';
import { NavigationType, NavigationTypeView } from '@/config/config';

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(8, 16);
const AddNavigation = (props) => {
  const { dispatch, mapContext, shownCellCoordinateType } = props;
  const [formRef] = Form.useForm();
  const [type, setType] = useState(NavigationTypeView[0].code);

  function submit() {
    formRef.validateFields().then((values) => {
      dispatch({ type: 'editor/addNavigation', payload: values }).then((result) => {
        if (result) {
          formRef.resetFields();
          const cellToRender = {
            ...result,
            x: result.nx,
            y: result.ny,
            coordinateType: shownCellCoordinateType,
            coordinate: { x: result.x, y: result.y, nx: result.nx, ny: result.ny },
          };
          mapContext.updateCells({ type: 'add', payload: [cellToRender] });
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
        <Form.Item
          name={'code'}
          label={formatMessage({ id: 'app.common.code' })}
          rules={[{ required: true }]}
        >
          <Input style={{ width: 133 }} />
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
        <Form.Item {...formItemLayoutNoLabel}>
          <Button type="primary" onClick={submit}>
            <FormattedMessage id="app.button.generate" />
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default connect(({ editor, editorView }) => ({
  mapContext: editor.mapContext,
  shownCellCoordinateType: editorView.shownCellCoordinateType,
}))(memo(AddNavigation));
