import React, { useEffect, memo } from 'react';
import { Input, Row, Form, Modal, Button, InputNumber, Col, Popconfirm } from 'antd';
import { connect } from '@/utils/dva';
import { formatMessage, FormattedMessage } from '@/utils/Lang';

const layout = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };
const tailLayout = { wrapperCol: { offset: 6, span: 16 } };

const CreateLogicArea = (props) => {
  const [form] = Form.useForm();
  const { dispatch, extraData, createLogicAreaVisit } = props;
  const isUpdate = !!extraData;

  useEffect(() => {
    if (createLogicAreaVisit) {
      form.setFieldsValue({
        name: extraData?.name,
        rangeStart: extraData?.rangeStart,
        rangeEnd: extraData?.rangeEnd,
      });
    }
  }, [createLogicAreaVisit]);

  const onCancel = () => {
    dispatch({
      type: 'editor/updateModalVisit',
      payload: {
        type: 'createLogicAreaVisit',
        value: false,
      },
    });
  };

  const onDelete = () => {
    dispatch({
      type: 'editor/fetchDeleteLogicArea',
      payload: extraData.id,
    }).then(onCancel);
  };

  const submit = () => {
    form.validateFields().then((value) => {
      const payload = { ...value, id: isUpdate ? extraData.id : null };
      if (isUpdate) {
        dispatch({ type: 'editor/fetchUpdateLogicDetail', payload }).then(onCancel);
      } else {
        dispatch({ type: 'editor/fetchCreateLogicArea', payload }).then(onCancel);
      }
    });
  };

  const title = isUpdate
    ? formatMessage({ id: 'app.createLogicArea.updateLogicArea' })
    : formatMessage({ id: 'app.selectLogicArea.addLogicArea' });

  return (
    <Modal
      destroyOnClose
      title={title}
      visible={createLogicAreaVisit}
      onCancel={onCancel}
      width={600}
      footer={null}
    >
      <Form form={form}>
        {/* 名称 */}
        <Form.Item
          {...layout}
          name={'name'}
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'app.createLogicArea.name.require' }),
            },
          ]}
          label={formatMessage({ id: 'app.createLogicArea.name' })}
        >
          <Input style={{ width: 300 }} />
        </Form.Item>

        {/* 范围起始值 */}
        <Form.Item
          {...layout}
          name={'rangeStart'}
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'app.createLogicArea.rangeStart.require' }),
            },
          ]}
          label={formatMessage({ id: 'app.createLogicArea.rangeStart' })}
        >
          <InputNumber style={{ width: 300 }} />
        </Form.Item>

        {/* 范围结束值 */}
        <Form.Item
          {...layout}
          name={'rangeEnd'}
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'app.createLogicArea.rangeEnd.require' }),
            },
          ]}
          label={formatMessage({ id: 'app.createLogicArea.rangeEnd' })}
        >
          <InputNumber style={{ width: 300 }} />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Row gutter={12}>
            {/* 保存 */}
            <Col>
              <Button type="primary" onClick={submit}>
                <FormattedMessage id="app.leftContent.save" />
              </Button>
            </Col>

            {/* 取消 */}
            <Col>
              <Button onClick={onCancel}>
                <FormattedMessage id="app.leftContent.cancel" />
              </Button>
            </Col>

            {/* 删除逻辑区 */}
            {extraData != null && extraData.id !== 0 ? (
              <Col>
                <Popconfirm
                  title={formatMessage({ id: 'app.createLogicArea.deleteLogicArea.confirm' })}
                  onConfirm={onDelete}
                >
                  <Button type="danger">
                    <FormattedMessage id="app.createLogicArea.deleteLogicArea" />
                  </Button>
                </Popconfirm>
              </Col>
            ) : null}
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default connect(({ editor }) => ({
  currentMap: editor.currentMap,
  extraData: editor.visible.extraData,
  createLogicAreaVisit: editor.visible.createLogicAreaVisit,
}))(memo(CreateLogicArea));
