/* TODO: I18N */
import React, { memo } from 'react';
import { Modal, Form, Select, Input } from 'antd';
import { isNull, formatMessage, getFormLayout, dealResponse } from '@/utils/util';
import { saveLoad } from '@/services/resourceService';
import AngleSelector from '@/components/AngleSelector';

const storageSpace = [
  { name: '货位', code: '1' },
  { name: '地面货位', code: '2' },
  { name: '货架货位', code: '3' },
  { name: '载具', code: '4' },
];

const { formItemLayout } = getFormLayout(5, 16);

function AddLoadModal(props) {
  const { visible, onCancel, onOk, updateRecord, allLoadSpec } = props;
  const [formRef] = Form.useForm();

  function onSave() {
    formRef
      .validateFields()
      .then(async (values) => {
        let id = null;
        if (isNull()) {
          id = updateRecord.id;
        }
        const response = await saveLoad({ ...values, id });
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
          label={'ID'}
          name="loadId"
          rules={[{ required: true }]}
          initialValue={updateRecord?.loadId}
        >
          <Input allowClear />
        </Form.Item>

        <Form.Item
          label={formatMessage({ id: 'app.common.name' })}
          name="name"
          rules={[{ required: true }]}
          initialValue={updateRecord?.name}
        >
          <Input allowClear />
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

        <Form.Item
          label={'载具规格'}
          name="loadSpecificationCode"
          rules={[{ required: true }]}
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
          label={formatMessage({ id: 'app.map.cell' })}
          name="cellId"
          initialValue={updateRecord?.cellId}
        >
          <Input allowClear />
        </Form.Item>

        <Form.Item
          label={'位置'}
          name="cargoStorageSpace"
          initialValue={updateRecord?.cargoStorageSpace}
        >
          <Select allowClear style={{ width: '100%' }}>
            {storageSpace?.map(({ code, name }) => (
              <Select.Option key={code} value={code}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default memo(AddLoadModal);
