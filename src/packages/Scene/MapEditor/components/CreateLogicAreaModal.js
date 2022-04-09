import React, { useEffect, memo } from 'react';
import { Input, Row, Form, Modal, Button, InputNumber, Col, Popconfirm } from 'antd';
import { connect } from '@/utils/RmsDva';
import { formatMessage, getFormLayout, isNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';

const { formItemLayout } = getFormLayout(6, 18);

const CreateLogicAreaModal = (props) => {
  const [formRef] = Form.useForm();
  const { dispatch, data, visible, close, currentMap } = props;
  const isUpdate = !!data;

  useEffect(() => {
    if (visible) {
      if (!isNull(data)) {
        formRef.setFieldsValue({
          name: data?.name,
          rangeStart: data?.rangeStart,
          rangeEnd: data?.rangeEnd,
        });
      } else {
        const maxRange = currentMap.logicAreaList.at(-1).rangeEnd;
        formRef.setFieldsValue({
          rangeStart: maxRange + 1,
        });
      }
    } else {
      formRef.resetFields();
    }
  }, [visible]);

  const onDelete = () => {
    dispatch({
      type: 'editor/fetchDeleteLogicArea',
      payload: data.id,
    }).then(close);
  };

  const submit = () => {
    formRef
      .validateFields()
      .then((value) => {
        const payload = { ...value, id: isUpdate ? data.id : null };
        if (isUpdate) {
          dispatch({ type: 'editor/fetchUpdateLogicDetail', payload }).then(close);
        } else {
          dispatch({ type: 'editor/fetchCreateLogicArea', payload }).then(close);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const title = `${
    isUpdate ? formatMessage({ id: 'app.button.edit' }) : formatMessage({ id: 'app.button.add' })
  }${formatMessage({ id: 'app.map.logicArea' })}`;

  return (
    <Modal
      destroyOnClose
      title={title}
      visible={visible}
      onCancel={close}
      width={500}
      footer={[
        <Row key={'xxx'} gutter={12} justify={'end'}>
          {/* 保存 */}
          <Col>
            <Button type="primary" onClick={submit}>
              <FormattedMessage id="app.button.save" />
            </Button>
          </Col>

          {/* 取消 */}
          <Col>
            <Button onClick={close}>
              <FormattedMessage id="app.button.cancel" />
            </Button>
          </Col>

          {/* 删除逻辑区 */}
          {!isNull(data) && data.id !== 0 ? (
            <Col>
              <Popconfirm
                title={formatMessage({ id: 'app.createLogicArea.deleteLogicArea.confirm' })}
                onConfirm={onDelete}
              >
                <Button type="danger">
                  <FormattedMessage id="app.button.delete" />
                </Button>
              </Popconfirm>
            </Col>
          ) : null}
        </Row>,
      ]}
    >
      <Form form={formRef} {...formItemLayout}>
        {/* 名称 */}
        <Form.Item
          name={'name'}
          rules={[{ required: true }]}
          label={formatMessage({ id: 'app.common.name' })}
        >
          <Input style={{ width: 300 }} />
        </Form.Item>

        {/* 范围起始值 */}
        <Form.Item
          name={'rangeStart'}
          rules={[{ required: true }]}
          label={formatMessage({ id: 'editor.logic.rangeStart' })}
        >
          <InputNumber style={{ width: 300 }} min={1} />
        </Form.Item>

        {/* 范围结束值 */}
        <Form.Item
          name={'rangeEnd'}
          rules={[{ required: true }]}
          label={formatMessage({ id: 'editor.logic.rangeEnd' })}
        >
          <InputNumber style={{ width: 300 }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default connect(({ editor }) => ({
  currentMap: editor.currentMap,
}))(memo(CreateLogicAreaModal));
