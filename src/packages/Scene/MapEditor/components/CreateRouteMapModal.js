import React, { memo, useEffect } from 'react';
import { Button, Col, Form, Input, Select, Modal, Popconfirm, Row } from 'antd';
import { connect } from '@/utils/RmsDva';
import { formatMessage, getFormLayout, isNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { getCurrentLogicAreaData } from '@/utils/mapUtil';

const { formItemLayout } = getFormLayout(4, 20);

const CreateRouteMapModal = (props) => {
  const [formRef] = Form.useForm();

  const { dispatch, data, visible, close, existRouteMaps } = props;
  const isUpdate = !!data;

  useEffect(() => {
    if (!isNull(data)) {
      formRef.setFieldsValue({ name: data.name });
    }
  }, [data]);

  function closeModal() {
    formRef.resetFields();
    close();
  }

  const submit = () => {
    formRef.validateFields().then((value) => {
      if (!isNull(data)) {
        const payload = { scopeCode: data.code, scopeName: value.name };
        dispatch({ type: 'editor/fetchUpdateScope', payload }).then(closeModal);
      } else {
        const { code, name, desc, copy } = value;
        let payload = { code, name, desc };
        if (copy) {
          payload = { ...existRouteMaps[copy], ...payload };
        }
        dispatch({ type: 'editor/fetchCreateScope', payload }).then(closeModal);
      }
    });
  };

  function confirmDelete() {
    dispatch({ type: 'editor/fetchDeleteScope', payload: data.code }).then(closeModal);
  }

  function validateScopeName() {
    const existScopeNames = Object.values(existRouteMaps).map((item) => item.name);
    return {
      validator(_, value) {
        if (!value) {
          return Promise.reject();
        }
        if (value && !existScopeNames.includes(value)) {
          return Promise.resolve();
        }
        return Promise.reject(new Error(formatMessage({ id: 'app.selectScopeMap.duplicateName' })));
      },
    };
  }

  function validateScopeCode() {
    const existScopeCodes = Object.keys(existRouteMaps);
    return {
      validator(_, value) {
        if (!value) {
          return Promise.reject();
        }
        if (value && !existScopeCodes.includes(value)) {
          return Promise.resolve();
        }
        return Promise.reject(new Error(formatMessage({ id: 'app.selectScopeMap.duplicate' })));
      },
    };
  }

  const selectOptions = Object.keys(existRouteMaps)
    .map((routeMapKey) => ({ label: existRouteMaps[routeMapKey].name, value: routeMapKey }))
    .map(({ label, value }) => (
      <Select.Option key={value} value={value}>
        {label}
      </Select.Option>
    ));
  const title = `${
    isUpdate ? formatMessage({ id: 'app.button.edit' }) : formatMessage({ id: 'app.button.add' })
  }${formatMessage({ id: 'app.map.routeArea' })}`;

  return (
    <Modal
      destroyOnClose
      title={title}
      visible={visible}
      onCancel={closeModal}
      width={450}
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
            <Button onClick={closeModal}>
              <FormattedMessage id="app.button.cancel" />
            </Button>
          </Col>

          {/* 删除逻辑区 */}
          {!isNull(data) && data.id !== 0 ? (
            <Col>
              <Popconfirm
                title={formatMessage({ id: 'app.message.doubleConfirm' })}
                onConfirm={confirmDelete}
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
          label={formatMessage({ id: 'app.common.name' })}
          rules={[{ required: true }, validateScopeName()]}
        >
          <Input style={{ width: 300 }} />
        </Form.Item>

        {isNull(data) && (
          <>
            {/* 编码 */}
            <Form.Item
              name={'code'}
              label={formatMessage({ id: 'app.common.code' })}
              rules={[{ required: true }, validateScopeCode()]}
            >
              <Input style={{ width: 300 }} />
            </Form.Item>

            {/* 描述 */}
            <Form.Item name={'desc'} label={formatMessage({ id: 'app.common.description' })}>
              <Input style={{ width: 300 }} />
            </Form.Item>

            {/* 复制 */}
            <Form.Item name={'copy'} label={formatMessage({ id: 'app.button.copy' })}>
              <Select allowClear style={{ width: 300 }}>
                {selectOptions}
              </Select>
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};
export default connect(({ editor }) => {
  const currentLogicAreaData = getCurrentLogicAreaData();
  return {
    existRouteMaps: currentLogicAreaData?.routeMap || {},
  };
})(memo(CreateRouteMapModal));
