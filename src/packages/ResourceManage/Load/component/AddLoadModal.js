import React, { memo, useEffect } from 'react';
import { Modal, Form, Select, Input } from 'antd';
import { isNull, formatMessage, getFormLayout, dealResponse, isStrictNull } from '@/utils/util';
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
  const { visible, onCancel, onOk, updateRecord, allLoadSpec, allData } = props;
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
        const response = await saveLoad({ ...values });
        if (!dealResponse(response)) {
          onCancel();
          onOk();
        }
      })
      .catch(() => {});
  }

  function validateDuplicate(_, value) {
    const ids = allData?.map(({ loadId }) => loadId);
    if (!value || !ids.includes(value) || !isStrictNull(updateRecord)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error(formatMessage({ id: 'app.form.id.duplicate' })));
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
        <Form.Item hidden name={'id'} initialValue={updateRecord?.id} />
        <Form.Item
          label={'ID'}
          name="loadId"
          rules={[{ required: true }, { validator: validateDuplicate }]}
          initialValue={updateRecord?.loadId}
        >
          <Input allowClear disabled={!isNull(updateRecord)} />
        </Form.Item>

        {/* <Form.Item
          label={formatMessage({ id: 'app.common.name' })}
          name="name"
          rules={[{ required: true }]}
          initialValue={updateRecord?.name}
        >
          <Input allowClear />
        </Form.Item> */}
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
          label={formatMessage({ id: 'resource.load.specification' })}
          name="loadSpecificationCode"
          rules={[{ required: true }]}
          initialValue={updateRecord?.loadSpecificationCode}
        >
          <Select allowClear style={{ width: '100%' }}>
            {allLoadSpec?.map((item) => (
              <Select.Option key={item?.id} value={item?.code}>
                {`${item.name} (${item.length} * ${item.width} * ${item.height})`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* <Form.Item
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
        </Form.Item> */}

        <Form.Item
          label={formatMessage({ id: 'app.map.cell' })}
          name="cellId"
          initialValue={updateRecord?.cellId}
        >
          <Input allowClear />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default memo(AddLoadModal);
