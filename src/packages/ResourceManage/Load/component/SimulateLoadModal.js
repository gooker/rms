/* TODO: I18N */
import React, { memo, useEffect } from 'react';
import { Modal, Form, Select, Input, InputNumber } from 'antd';
import { isNull, formatMessage, getFormLayout, dealResponse } from '@/utils/util';
import { simulationLoad } from '@/services/resourceService';
import AngleSelector from '@/components/AngleSelector';
import styles from '../load.module.less';

const { formItemLayout } = getFormLayout(5, 16);

function SimulateLoadModal(props) {
  const { visible, onCancel, onOk, updateRecord, allLoadSpec } = props;
  const [formRef] = Form.useForm();

  useEffect(() => {
    if (!visible) {
      formRef.resetFields();
    }
  }, [visible]);

  function onSave() {
    formRef
      .validateFields()
      .then(async (values) => {
        let id = null;
        if (isNull(updateRecord)) {
          id = updateRecord.id;
        }
        const response = await simulationLoad({ ...values, id });
        if (!dealResponse(response)) {
          onCancel();
          onOk();
        }
      })
      .catch(() => {});
  }
  return (
    <Modal
      destroyOnClose
      visible={visible}
      width={'500px'}
      title={
        isNull(updateRecord)
          ? formatMessage({ id: 'app.button.add' })
          : formatMessage({ id: 'app.button.edit' })
      }
      onCancel={onCancel}
      onOk={onSave}
    >
      <Form {...formItemLayout} form={formRef}>
        <Form.Item
          label={'载具数'}
          name="loadNum"
          rules={[{ required: true }]}
          initialValue={updateRecord?.loadId}
        >
          <InputNumber
            allowClear
            style={{
              width: 100,
              textAlign: 'center',
            }}
          />
        </Form.Item>

        <Form.Item label={'载具码'} required={true}>
          <Input.Group compact className={styles['site-input-group-wrapper']}>
            <Form.Item
              noStyle
              label={'开始载具码'}
              name="startLoadId"
              initialValue={updateRecord?.startLoadId}
              rules={[{ required: true }]}
            >
              <InputNumber
                style={{
                  width: 100,
                  textAlign: 'center',
                }}
                placeholder="开始载具码"
              />
            </Form.Item>

            <Input
              style={{
                width: 30,
                borderLeft: 0,
                borderRight: 0,
                pointerEvents: 'none',
                background: '#fff',
              }}
              placeholder="~"
              disabled
            />
            <Form.Item
              noStyle
              label={'结束载具码'}
              name="endLoadId"
              initialValue={updateRecord?.endLoadId}
              rules={[{ required: true }]}
            >
              <InputNumber
                className={styles['site-input-right']}
                style={{
                  width: 120,
                  textAlign: 'center',
                }}
                placeholder="结束载具码"
              />
            </Form.Item>
          </Input.Group>
        </Form.Item>

        <Form.Item
          label={'载具规格'}
          name="loadSpecificationCode"
          // rules={[{ required: true }]}
          initialValue={updateRecord?.loadSpecificationCode}
        >
          <Select allowClear style={{ width: '100%' }}>
            {allLoadSpec?.map(({ id, code, name }) => (
              <Select.Option key={id} value={code}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={formatMessage({ id: 'app.common.angle' })}
          name="angle"
          rules={[{ required: true }]}
          initialValue={updateRecord?.angle}
        >
          <AngleSelector
            disabled
            width={'100%'}
            addonLabel={{
              0: formatMessage({ id: 'app.direction.rightSide' }),
              90: formatMessage({ id: 'app.direction.topSide' }),
              180: formatMessage({ id: 'app.direction.leftSide' }),
              270: formatMessage({ id: 'app.direction.bottomSide' }),
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default memo(SimulateLoadModal);
