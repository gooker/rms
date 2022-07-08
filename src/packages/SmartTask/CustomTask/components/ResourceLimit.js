import React, { Fragment, memo } from 'react';
import { Form, InputNumber, Select, Switch } from 'antd';
import { formatMessage } from '@/utils/util';

const ResourceLimit = (props) => {
  const { data, hidden, prefix, suffix, loadSpecification = [], isRequired } = props;

  function getFormItemName(name) {
    const namePath = [];
    const _prefix = Array.isArray(prefix) ? prefix : [];
    const _suffix = Array.isArray(suffix) ? suffix : [];
    namePath.push(..._prefix);
    namePath.push(name);
    namePath.push(..._suffix);
    return namePath;
  }

  return (
    <Fragment>
      {/* 可接小车电量约束 */}
      <Form.Item
        colon={false}
        hidden={hidden}
        name={getFormItemName('vehicleBatteryLimit')}
        label={formatMessage({ id: 'customTask.form.resourceLimit.vehicleBattery' })}
        initialValue={data ? data.vehicleBatteryLimit : null}
        rules={[{ required: isRequired }]}
      >
        <InputNumber allowClear style={{ width: 90 }} />
      </Form.Item>

      {/* 车身可用容器数量约束 */}
      <Form.Item
        colon={false}
        hidden={hidden}
        name={getFormItemName('canUseContainerCountLimit')}
        label={formatMessage({
          id: 'customTask.form.resourceLimit.availableContainerCountLimit',
        })}
        initialValue={data ? data.canUseContainerCountLimit : null}
        rules={[{ required: isRequired }]}
      >
        <InputNumber allowClear style={{ width: 90 }} />
      </Form.Item>

      {/* 车辆容器规格约束 */}
      <Form.Item
        colon={false}
        hidden={hidden}
        name={getFormItemName('canUseContainerLimit')}
        label={formatMessage({ id: 'customTask.form.resourceLimit.containerTypeLimit' })}
        initialValue={data ? data.canUseContainerLimit : []}
        rules={[{ required: isRequired }]}
      >
        <Select allowClear mode={'multiple'}></Select>
      </Form.Item>

      {/* 载具规格约束 */}
      <Form.Item
        colon={false}
        hidden={hidden}
        name={getFormItemName('canUseLoadTypeLimit')}
        label={formatMessage({ id: 'customTask.form.resourceLimit.loadTypeLimit' })}
        initialValue={data ? data.canUseLoadTypeLimit : []}
        rules={[{ required: isRequired }]}
      >
        <Select allowClear mode={'multiple'}>
          {loadSpecification?.map(({ id, name }) => (
            <Select.Option key={id} value={id}>
              {name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {/* 拥有指定载具的待命车辆才可接 */}
      <Form.Item
        colon={false}
        hidden={hidden}
        name={getFormItemName('isLimitStandBy')}
        label={formatMessage({ id: 'customTask.form.resourceLimit.isLimitStandBy' })}
        initialValue={data ? data.isLimitStandBy : false}
        valuePropName={'checked'}
        rules={[{ required: isRequired }]}
      >
        <Switch />
      </Form.Item>

      {/* 只使用工作中的载具 */}
      <Form.Item
        colon={false}
        hidden={hidden}
        name={getFormItemName('canUseWorkLimit')}
        label={formatMessage({ id: 'customTask.form.resourceLimit.loadWorkLimit' })}
        initialValue={data ? data.canUseWorkLimit : false}
        valuePropName={'checked'}
        rules={[{ required: isRequired }]}
      >
        <Switch />
      </Form.Item>
    </Fragment>
  );
};
export default memo(ResourceLimit);
