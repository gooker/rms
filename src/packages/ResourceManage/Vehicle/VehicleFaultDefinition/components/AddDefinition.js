import React, { memo, useEffect, useState } from 'react';
import { Modal, Form, Input, Switch, Select, Row, Col, Button } from 'antd';
import { connect } from '@/utils/RmsDva';
import {
  isNull,
  formatMessage,
  getFormLayout,
  dealResponse,
  isStrictNull,
  convertMapToArrayMap,
} from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { saveVehicleDefinition } from '@/services/resourceService';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import commonStyle from '@/common.module.less';
import { isPlainObject } from 'lodash';

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(6, 17);

function AddDefinition(props) {
  const { visible, onCancel, onOk, updateRecord, allData, allAdaptors } = props;
  const [formRef] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible) {
      formRef.resetFields();
    }
  }, [visible]);

  function onSave() {
    formRef
      .validateFields()
      .then(async (values) => {
        setLoading(true);
        const params = { ...values };
        const { adapterVehicleType, additionalInfo } = values;
        const [adapterType, vehicleType] = adapterVehicleType.split('@');
        params.adapterType = adapterType;
        params.vehicleType = vehicleType;
        let newAdditionalInfo = {};
        if (Array.isArray(additionalInfo)) {
          additionalInfo.forEach((item) => {
            if (isPlainObject(item)) {
              const { key, value } = item;
              newAdditionalInfo[key] = value;
            }
          });
        }
        params.additionalInfo = newAdditionalInfo;
        console.log(params.additionalInfo);

        delete params.adapterVehicleType;
        const response = await saveVehicleDefinition({ ...params });
        if (!dealResponse(response, 1)) {
          onCancel();
          onOk();
        }
        setLoading(false);
      })
      .catch(() => {});
  }

  function validatCodeDuplicate(_, value) {
    const errorCodes = allData?.map(({ errorCode }) => errorCode);
    if (!value || !errorCodes.includes(value) || !isStrictNull(updateRecord)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error(formatMessage({ id: 'app.form.code.duplicate' })));
  }

  function validateNameDuplicate(_, value) {
    const errorNames = allData
      .filter(({ id }) => id !== updateRecord?.id)
      .map(({ errorName }) => errorName);
    if (!value || !errorNames.includes(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error(formatMessage({ id: 'app.form.name.duplicate' })));
  }

  function convertAdditionalInfos() {
    if (!isStrictNull(updateRecord)) {
      return convertMapToArrayMap(updateRecord.additionalInfo);
    } else {
      return [{}];
    }
  }

  function getVehicleTasksByType() {
    if (!isStrictNull(updateRecord)) {
      return `${updateRecord.adapterType}@${updateRecord.vehicleType}`;
    }
  }

  return (
    <Modal
      destroyOnClose
      visible={visible}
      width={'580px'}
      title={
        isNull(updateRecord)
          ? formatMessage({ id: 'app.button.add' })
          : formatMessage({ id: 'app.button.edit' })
      }
      onCancel={onCancel}
      onOk={onSave}
      okButtonProps={{ disabled: loading, loading }}
    >
      <Form {...formItemLayout} form={formRef}>
        <Form.Item hidden name={'id'} initialValue={updateRecord?.id} />
        <Form.Item
          label={formatMessage({ id: 'app.fault.code' })}
          name="errorCode"
          rules={[{ required: true }, { validator: validatCodeDuplicate }]}
          initialValue={updateRecord?.errorCode}
        >
          <Input allowClear disabled={!isNull(updateRecord)} />
        </Form.Item>
        <Form.Item
          label={formatMessage({ id: 'app.fault.name' })}
          name="errorName"
          rules={[{ required: true }, { validator: validateNameDuplicate }]}
          initialValue={updateRecord?.errorName}
        >
          <Input allowClear />
        </Form.Item>

        <Form.Item
          label={formatMessage({ id: 'app.vehicleType' })}
          name="adapterVehicleType"
          rules={[{ required: true }]}
          initialValue={getVehicleTasksByType()}
        >
          <Select allowClear value={updateRecord?.vehicleType}>
            {Object.values(allAdaptors).map(({ adapterType }) => {
              const { code, name, vehicleTypes } = adapterType;
              return (
                <Select.OptGroup key={code} label={name}>
                  {vehicleTypes.map((item, index) => (
                    <Select.Option key={index} value={`${code}@${item.code}`}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select.OptGroup>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item
          label={formatMessage({ id: 'app.fault.level' })}
          name="level"
          rules={[{ required: true }]}
          initialValue={updateRecord?.level}
        >
          <Select allowClear>
            <Select.Option key="INFO" value="INFO">
              INFO
            </Select.Option>
            <Select.Option key="WARN" value="WARN">
              WARN
            </Select.Option>
            <Select.Option key="ERROR" value="ERROR">
              ERROR
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label={formatMessage({ id: 'app.fault.type' })}
          name="errorType"
          initialValue={updateRecord?.errorType}
        >
          <Input allowClear />
        </Form.Item>
        <Form.Item
          label={<FormattedMessage id="app.fault.autoRecover" />}
          name="autoRecover"
          initialValue={updateRecord?.autoRecover ?? false}
          valuePropName={'checked'}
        >
          <Switch allowClear />
        </Form.Item>

        <Form.List name="additionalInfo" initialValue={convertAdditionalInfos()}>
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  key={field.key}
                  required={true}
                  {...(index === 0 ? formItemLayout : formItemLayoutNoLabel)}
                  label={index === 0 ? formatMessage({ id: 'app.fault.additionalData' }) : ''}
                >
                  <Row gutter={10}>
                    <Col span={22}>
                      <Row gutter={24}>
                        <Col span={9}>
                          <Form.Item noStyle {...field} name={[field.name, 'key']}>
                            <Input />
                          </Form.Item>
                        </Col>

                        <Col span={15}>
                          <Form.Item noStyle {...field} name={[field.name, 'value']}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={2} className={commonStyle.flexCenter}>
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
                <Button block type="dashed" onClick={() => add()} style={{ width: '50%' }}>
                  <PlusOutlined />
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
}

export default connect(({ global }) => ({
  allAdaptors: global.allAdaptors,
}))(memo(AddDefinition));
