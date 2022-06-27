/* TODO: I18N */
import React, { memo, useEffect, useState } from 'react';
import { AutoComplete, Form, Input, InputNumber, Modal, Select } from 'antd';
import { dealResponse, formatMessage, getFormLayout, getRandomString, isNull } from '@/utils/util';
import { fetchResourceGroup, simulationLoad } from '@/services/resourceService';
import AngleSelector from '@/components/AngleSelector';
import styles from '../load.module.less';
import { fetchActiveMap } from '@/services/commonService';
import { find } from 'lodash';

const { formItemLayout } = getFormLayout(5, 16);

function SimulateLoadModal(props) {
  const { visible, onCancel, onOk, updateRecord, allLoadSpec } = props;
  const [formRef] = Form.useForm();

  const [allGroups, setAllGroups] = useState([]);

  useEffect(() => {
    if (!visible) {
      formRef.resetFields();
    } else {
      init();
    }
  }, [visible]);

  async function init() {
    const data = await fetchActiveMap();
    if (!dealResponse(data)) {
      const response = await fetchResourceGroup({ mapId: data?.id });
      if (!dealResponse(response)) {
        setAllGroups(response ?? []);
      }
    }
  }

  function onSave() {
    formRef
      .validateFields()
      .then(async (values) => {
        // 处理bindLoadGroupCode/bindStorageGroupCode
        const { bindLoadGroupName, bindStorageGroupName } = values;
        const params = { ...values };
        const loadGroups = allGroups?.filter(({ groupType }) => groupType === 'LOAD');
        const storageGroups = allGroups?.filter(({ groupType }) => groupType === 'STORE');

        const loadgroup = find(loadGroups, { groupName: bindLoadGroupName });
        const storagegroup = find(storageGroups, { groupName: bindStorageGroupName });

        params.bindLoadGroupCode = !isNull(loadgroup)
          ? loadgroup.code
          : `${bindLoadGroupName}_${getRandomString(6)}`;

        params.bindStorageGroupCode = !isNull(storagegroup)
          ? storagegroup.code
          : `${bindStorageGroupName}_${getRandomString(6)}`;

        const response = await simulationLoad({ ...params });
        if (!dealResponse(response, 1)) {
          init();
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
        <Form.Item hidden name={'id'} initialValue={updateRecord?.id} />
        {/* <Form.Item
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
        </Form.Item> */}

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
          rules={[{ required: true }]}
          initialValue={updateRecord?.loadSpecificationCode}
        >
          <Select allowClear style={{ width: '100%' }}>
            {allLoadSpec?.map((item) => (
              <Select.Option key={item?.id} value={item?.code}>
                {`${item.length}*${item.width}*${item.height}`}
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

        <Form.Item
          name={'bindLoadGroupName'}
          label={formatMessage({ id: 'resource.load.group' })}
          rules={[{ required: true }]}
        >
          <AutoComplete
            options={allGroups
              ?.filter(({ groupType }) => groupType === 'LOAD')
              ?.map(({ groupName }) => {
                return { value: groupName };
              })}
            allowClear
          />
        </Form.Item>

        <Form.Item
          name={'bindStorageGroupName'}
          label={formatMessage({ id: 'resource.storage.group' })}
          rules={[{ required: true }]}
        >
          <Select>
            {allGroups
              ?.filter(({ groupType }) => groupType === 'STORE')
              ?.map(({ groupName, id }) => (
                <Select.Option key={id} value={groupName}>
                  {groupName}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default memo(SimulateLoadModal);
