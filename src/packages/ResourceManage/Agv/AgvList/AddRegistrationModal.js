/* TODO: I18N */
import React, { memo, useEffect, useState } from 'react';
import {
  Form,
  Radio,
  Modal,
  Select,
  Input,
  Row,
  Col,
  AutoComplete,
  Space,
  Button,
  Switch,
  InputNumber,
  Checkbox,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { getFormLayout, formatMessage, dealResponse } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { connect } from '@/utils/RmsDva';
import { findRobot } from '@/services/resourceManageAPI';

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(5, 17);
const AddRegistrationModal = (props) => {
  const { dispatch, visible, allAdaptors } = props;
  const [formRef] = Form.useForm();
  function onSubmit() {
    formRef
      .validateFields()
      .then((values) => {
        console.log(values);
        const { infos, agvAdapter, type } = values;
        const params = {};
        infos.map(({ key, value }) => {
          params[key] = value;
        });
        sendfindRobot({ agvAdapter, type,params });
      })
      .catch(() => {});
  }

  async function sendfindRobot(param) {
    const response = await findRobot(param);
    if (!dealResponse(response)) {
      await dispatch({ type: 'agvList/fetchInitialData' });
      dispatch({ type: 'agvList/updateAddRegistrationModalShown', payload: false });
    }
  }

  return (
    <Modal
      visible={visible}
      title={'添加发现'}
      maskClosable={false}
      onCancel={() => {
        dispatch({ type: 'agvList/updateAddRegistrationModalShown', payload: false });
      }}
      onOk={onSubmit}
    >
      <Form form={formRef} {...formItemLayout}>
        <Form.Item
          name={'type'}
          label={'方式'}
          rules={[{ required: true }]}
          initialValue={'bonjour'}
        >
          <Radio.Group optionType="button" buttonStyle="solid">
            <Radio.Button value={'bonjour'}>查找</Radio.Button>
            <Radio.Button value={'ip'}>扫描网段</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name={'agvAdapter'}
          label={<FormattedMessage id={'app.configInfo.header.adapter'} />}
          rules={[{ required: true }]}
        >
          <Select>
            {Object.values(allAdaptors).map(({ adapterType }) => {
              const { id, name } = adapterType;
              return (
                <Select.Option key={id} value={id}>
                  {name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.List name={'infos'} initialValue={[{ key: null, value: null }]}>
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  {...(index === 0 ? formItemLayout : formItemLayoutNoLabel)}
                  label={index === 0 ? <FormattedMessage id="environmentManager.apis" /> : ''}
                  required={true}
                  key={field.key}
                >
                  <Row gutter={10}>
                    <Col span={9}>
                      <Form.Item
                        noStyle
                        {...field}
                        name={[field.name, 'key']}
                        rules={[{ required: true }]}
                      >
                        <AutoComplete
                          placeholder={formatMessage({
                            id: 'key',
                          })}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={11}>
                      <Form.Item
                        noStyle
                        {...field}
                        name={[field.name, 'value']}
                        rules={[{ required: true }]}
                      >
                        <Input
                          placeholder={formatMessage({
                            id: 'value',
                          })}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={4} style={{ textAlign: 'center' }}>
                      {fields.length > 1 ? (
                        <MinusCircleOutlined
                          onClick={() => remove(field.name)}
                          style={{ fontSize: 16 }}
                        />
                      ) : null}
                    </Col>
                  </Row>
                </Form.Item>
              ))}
              <Form.Item {...formItemLayoutNoLabel}>
                <Button type="dashed" onClick={() => add()} style={{ width: '60%' }}>
                  <PlusOutlined />
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};
export default connect(({ agvList }) => ({
  allAdaptors: agvList.allAdaptors,
  visible: agvList.addRegistrationModalShown,
}))(memo(AddRegistrationModal));
