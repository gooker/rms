import React, { memo } from 'react';
import { connect } from '@/utils/RcsDva';
import { Modal, Input, Form } from 'antd';

const I18NEditorModal = (props) => {
  const { dispatch, visible, i18nKey } = props;

  function onCancel() {
    dispatch({
      type: 'global/updateI18NRow',
      payload: { visible: false, key: null },
    });
  }

  function onOk() {
    // 提交表单
    onCancel();
  }

  return (
    <Modal title={i18nKey} visible={visible} onCancel={onCancel} onOk={onOk}>
      <Form>
        <Form.Item label={'zh-CN'} name={'zh-CN'}>
          <Input />
        </Form.Item>
        <Form.Item label={'en-US'} name={'en-US'}>
          <Input />
        </Form.Item>
        <Form.Item label={'ko-KR'} name={'ko-KR'}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default connect(({ global }) => ({
  visible: global?.I18NRow?.visible ?? false,
  i18nKey: global?.I18NRow?.key ?? null,
}))(memo(I18NEditorModal));
