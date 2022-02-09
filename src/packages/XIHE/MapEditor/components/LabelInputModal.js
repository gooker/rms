import React, { memo } from 'react';
import { Form, Input, Button } from 'antd';
import { connect } from '@/utils/RmsDva';
import { formatMessage, getFormLayout, getRandomString } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(4, 20);

const LabelInputModal = (props) => {
  const { mapContext, dispatch, onCancel, getSelectionWorldCoordinator } = props;
  const [formRef] = Form.useForm();

  function closeModal() {
    onCancel();
    dispatch({ type: 'editor/updateMaskInputVisible', payload: false });
  }

  // 文字标记
  function onsubmit() {
    formRef
      .validateFields()
      .then(({ text, color }) => {
        // 确定选择区域部分数据
        const { worldStartX, worldStartY, worldEndX, worldEndY } = getSelectionWorldCoordinator();
        const width = Math.abs(worldStartX - worldEndX);
        const height = Math.abs(worldStartY - worldEndY);
        const x = worldStartX + width / 2;
        const y = worldStartY + height / 2;
        const code = `LABEL_${getRandomString(6)}`;
        mapContext.renderLabel({
          code,
          x,
          y,
          text,
          color: color.replace('#', '0x'),
          width,
          height,
        });
        dispatch({
          type: 'editor/insertLabel',
          payload: { code, x, y, text, color, width, height },
        });
        closeModal();
      })
      .catch((reason) => {
        console.log(reason);
      });
  }

  return (
    <Form form={formRef} {...formItemLayout}>
      <Form.Item
        name={'text'}
        label={<FormattedMessage id={'app.common.text'} />}
        rules={[
          {
            required: true,
            message: formatMessage(
              { id: 'app.message.ruleRequired' },
              { label: formatMessage({ id: 'app.common.text' }) },
            ),
          },
        ]}
      >
        <Input style={{ width: '90%' }} />
      </Form.Item>
      <Form.Item
        name={'color'}
        initialValue={'#1890ff'}
        label={<FormattedMessage id={'app.common.color'} />}
        rules={[
          {
            required: true,
            message: formatMessage(
              { id: 'app.message.ruleRequired' },
              { label: formatMessage({ id: 'app.common.color' }) },
            ),
          },
        ]}
      >
        <input type={'color'} />
      </Form.Item>
      <Form.Item {...formItemLayoutNoLabel}>
        <Button type={'primary'} onClick={onsubmit}>
          <FormattedMessage id={'app.button.confirm'} />
        </Button>
        <Button style={{ marginLeft: 15 }} onClick={closeModal}>
          <FormattedMessage id={'app.button.cancel'} />
        </Button>
      </Form.Item>
    </Form>
  );
};
export default connect(({ editor }) => ({
  mapContext: editor.mapContext,
}))(memo(LabelInputModal));
