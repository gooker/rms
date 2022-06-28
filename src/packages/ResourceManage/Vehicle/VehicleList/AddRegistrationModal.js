/* TODO: I18N */
import React, { memo, useState } from 'react';
import { AutoComplete, Button, Col, Form, Input, InputNumber, Modal, Radio, Row, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { dealResponse, formatMessage, getFormLayout } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { connect } from '@/utils/RmsDva';
import { findVehicle } from '@/services/resourceService';

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(5, 17);
const AddRegistrationModal = (props) => {
  const { dispatch, visible, allAdaptors } = props;
  const [findType, setFindType] = useState('bonjour');
  const [formRef] = Form.useForm();
  function onSubmit() {
    formRef
      .validateFields()
      .then((values) => {
        const { infos, vehicleAdapter, type } = values;
        let params = {};
        if (type === 'ip') {
          params.ip = values.ip;
          params.port = values.port;
        } else {
          infos.map(({ key, value }) => {
            params[key] = value;
          });
        }

        sendfindVehicle({ vehicleAdapter, type, params, isSimulator: false });
      })
      .catch(() => {});
  }

  async function sendfindVehicle(param) {
    const response = await findVehicle(param);
    if (!dealResponse(response, 1)) {
      await dispatch({ type: 'vehicleList/fetchInitialData' });
      dispatch({ type: 'vehicleList/updateAddRegistrationModalShown', payload: false });
    }
  }

  return (
    <Modal
      visible={visible}
      title={formatMessage({id:'app.button.addFound'})}
      maskClosable={false}
      onCancel={() => {
        dispatch({ type: 'vehicleList/updateAddRegistrationModalShown', payload: false });
      }}
      onOk={onSubmit}
    >
      <Form form={formRef} {...formItemLayout}>
        <Form.Item
          name={'type'}
          label={'方式'}
          rules={[{ required: true }]}
          initialValue={findType}
          getValueFromEvent={(e) => {
            setFindType(e.target.value);
            return e.target.value;
          }}
        >
          <Radio.Group optionType="button" buttonStyle="solid">
            <Radio.Button value={'bonjour'}>查找</Radio.Button>
            <Radio.Button value={'ip'}>扫描网段</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name={'vehicleAdapter'}
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

        {findType === 'ip' ? (
          <>
            <Form.Item name={'ip'} label={'IP'} rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item
              name={'port'}
              label={<FormattedMessage id={'vehicle.port'} />}
              rules={[{ required: true }]}
            >
              <InputNumber />
            </Form.Item>
          </>
        ) : (
          <Form.List name={'infos'} initialValue={[{ key: null, value: null }]}>
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item
                    {...(index === 0 ? formItemLayout : formItemLayoutNoLabel)}
                    label={index === 0 ? '查找信息' : ''}
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
        )}
      </Form>
    </Modal>
  );
};
export default connect(({ vehicleList }) => ({
  allAdaptors: vehicleList.allAdaptors,
  visible: vehicleList.addRegistrationModalShown,
}))(memo(AddRegistrationModal));
