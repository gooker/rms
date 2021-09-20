import React, { memo, useEffect } from 'react';
import { connect } from '@/utils/dva';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal, Select, Form, Input, Button } from 'antd';
import { formatMessage, FormattedMessage } from '@/utils/Lang';
import MapModal from './MapModal/Index';
import { getCurrentLogicAreaData } from '@/utils/mapUtils';

const { Option } = Select;

const layout = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };
const tailLayout = { wrapperCol: { offset: 6, span: 16 } };

const CreateRouteMap = (props) => {
  const [form] = Form.useForm();

  const { dispatch, existRouteMaps, createScopeMapVisible, extraData } = props;
  useEffect(() => {
    if (createScopeMapVisible && extraData) {
      form.setFieldsValue({ name: extraData.name });
    }
  }, [createScopeMapVisible, extraData]);

  function confirmDelete() {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      title: formatMessage({ id: 'app.selectScopeMap.delete.warn' }),
      content: formatMessage({ id: 'app.selectScopeMap.delete.confirm' }),
      okText: formatMessage({ id: 'app.lock.sure' }),
      cancelText: formatMessage({ id: 'app.lock.cancel' }),
      onOk: () => {
        dispatch({ type: 'editor/fetchDeleteScope', payload: extraData.code }).then(onCancel);
      },
    });
  }

  const submit = () => {
    form.validateFields().then((value) => {
      if (extraData) {
        const payload = { scopeCode: extraData.code, scopeName: value.name };
        dispatch({ type: 'editor/fetchUpdateScope', payload }).then(onCancel);
      } else {
        const { code, name, desc, copy } = value;
        let payload = { code, name, desc };
        if (copy) {
          payload = { ...existRouteMaps[copy], ...payload };
        }
        dispatch({ type: 'editor/fetchCreateScope', payload }).then(onCancel);
      }
    });
  };

  const onCancel = () => {
    dispatch({
      type: 'editor/updateModalVisit',
      payload: {
        type: 'createScopeMap',
        value: false,
      },
    });
  };

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
      <Option key={value} value={value}>
        {label}
      </Option>
    ));

  const modalTitle = extraData ? (
    <FormattedMessage id="app.selectScopeMap.updateRouteArea" />
  ) : (
    <FormattedMessage id="app.selectScopeMap.addRouteArea" />
  );
  return (
    <MapModal
      destroyOnClose
      title={modalTitle}
      visible={createScopeMapVisible}
      onCancel={onCancel}
      width={600}
    >
      <Form form={form}>
        {/* "名称" */}
        <Form.Item
          {...layout}
          name={'name'}
          label={formatMessage({ id: 'app.selectScopeMap.name' })}
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'app.selectScopeMap.name.require' }),
            },
            validateScopeName(),
          ]}
        >
          <Input style={{ width: 300 }} />
        </Form.Item>

        {!extraData && (
          <>
            {/* "代号" */}
            <Form.Item
              {...layout}
              name={'code'}
              label={formatMessage({ id: 'app.selectScopeMap.code' })}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'app.selectScopeMap.code.require' }),
                },
                validateScopeCode(),
              ]}
            >
              <Input style={{ width: 300 }} />
            </Form.Item>

            {/* "描述" */}
            <Form.Item
              {...layout}
              name={'desc'}
              label={formatMessage({ id: 'app.selectScopeMap.description' })}
            >
              <Input style={{ width: 300 }} />
            </Form.Item>

            {/* 复制 */}
            <Form.Item
              {...layout}
              name={'copy'}
              label={formatMessage({ id: 'app.selectScopeMap.copy' })}
            >
              <Select allowClear style={{ width: 300 }}>
                {selectOptions}
              </Select>
            </Form.Item>
          </>
        )}
        <Form.Item {...tailLayout}>
          {/* 保存 */}
          <Button type="primary" onClick={submit}>
            <FormattedMessage id="app.leftContent.save" />
          </Button>

          {/* 取消 */}
          <Button onClick={onCancel} style={{ marginLeft: 20 }}>
            <FormattedMessage id="app.leftContent.cancel" />
          </Button>

          {/* 删除 */}
          {extraData && extraData.code !== 'DEFAULT' && (
            <Button type="danger" onClick={confirmDelete} style={{ marginLeft: 20 }}>
              <FormattedMessage id="form.delete" />
            </Button>
          )}
        </Form.Item>
      </Form>
    </MapModal>
  );
};
export default connect(({ editor }) => {
  const currentLogicAreaData = getCurrentLogicAreaData();
  return {
    existRouteMaps: currentLogicAreaData?.routeMap || {},
    createScopeMapVisible: editor.visible.createScopeMap,
    extraData: editor.visible.extraData,
  };
})(memo(CreateRouteMap));
