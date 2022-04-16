import React, { memo } from 'react';
import { Form, Input, Button } from 'antd';
import { connect } from '@/utils/RmsDva';
import { ZoneMarkerType } from '@/config/consts';
import { formatMessage, getFormLayout, getRandomString } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { LeftCategory } from '@/packages/Scene/MapEditor/editorEnums';
import { getSelectionWorldCoordinator } from '@/utils/mapUtil';

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(4, 20);

const ZoneMarkerModal = (props) => {
  const { onCancel } = props;
  const { mapContext, dispatch, leftActiveCategory } = props;

  const [formRef] = Form.useForm();

  function closeModal() {
    onCancel();
    dispatch({ type: 'editorView/updateZoneMarkerVisible', payload: false });
  }

  // 文字标记
  // 线框背景
  function confirm() {
    formRef.validateFields().then(({ text, color }) => {
      const { worldStartX, worldStartY, worldEndX, worldEndY } = getSelectionWorldCoordinator(
        document.getElementById('editorPixi'),
        document.getElementById('mapSelectionMask'),
        mapContext.pixiUtils.viewport,
      );
      if (leftActiveCategory === LeftCategory.Rectangle) {
        // 锚点在正中心
        const type = ZoneMarkerType.RECT;
        const code = `${type}_${getRandomString(6)}`;
        const width = Math.abs(worldStartX - worldEndX);
        const height = Math.abs(worldStartY - worldEndY);
        const x = worldStartX;
        const y = worldStartY;
        mapContext.drawRectArea({ code, x, y, width, height, color, text }, true);
        dispatch({
          type: 'editor/insertZoneMarker',
          payload: { code, x, y, width, height, color, type, text },
        });
      }

      if (leftActiveCategory === LeftCategory.Circle) {
        const type = ZoneMarkerType.CIRCLE;
        const code = `${type}_${getRandomString(6)}`;
        const width = Math.abs(worldStartX - worldEndX);
        const x = worldStartX + width / 2;
        const y = worldStartY + width / 2;
        const radius = width / 2;
        mapContext.drawCircleArea({ code, x, y, radius, color, text }, true);
        dispatch({
          type: 'editor/insertZoneMarker',
          payload: { code, x, y, radius, color, type, text },
        });
      }
      onCancel();
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
        <Button type={'primary'} onClick={confirm}>
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
  leftActiveCategory: editor.leftActiveCategory,
}))(memo(ZoneMarkerModal));
