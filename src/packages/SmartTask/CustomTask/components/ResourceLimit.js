import React, { Fragment, memo } from 'react';
import { Form, InputNumber, Select, Switch } from 'antd';
import { formatMessage } from '@/utils/util';

const ResourceLimit = (props) => {
  const { data, hidden, prefix, loadSpecification = [] } = props;

  function getFormItemName(name) {
    if (Array.isArray(prefix)) {
      return [...prefix, name];
    }
    return name;
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
      >
        <Switch />
      </Form.Item>
    </Fragment>
  );
};
export default memo(ResourceLimit);
