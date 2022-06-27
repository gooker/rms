import React, { Fragment, memo } from 'react';
import { Form, Input, InputNumber, Select, Switch } from 'antd';
import { formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import VehicleSelector from '../components/VehicleSelector';
import TitleCard from '@/components/TitleCard';
import { connect } from '@/utils/RmsDva';

const StartForm = (props) => {
  const { code, type, hidden, loadSpecification, storageSpecification } = props;

  function validateVehicle(_, value) {
    if (value.type === 'AUTO') {
      return Promise.resolve();
    } else {
      if (value.code.length > 0) {
        return Promise.resolve();
      }
      return Promise.reject(new Error(formatMessage({ id: 'customTask.require.vehicle' })));
    }
  }

  return (
    <>
      <Form.Item
        hidden
        name={[code, 'customType']}
        initialValue={type}
        label={formatMessage({ id: 'app.common.type' })}
      >
        <Input disabled style={{ width: 300 }} />
      </Form.Item>
      <Form.Item
        hidden
        name={[code, 'code']}
        initialValue={code}
        label={formatMessage({ id: 'app.common.code' })}
        rules={[{ required: true }]}
      >
        <Input style={{ width: 300 }} />
      </Form.Item>

      {/* --------------------------------------------------------------- */}
      {/* 分小车: 当前执行任务的指定vehicle资源-->小车/小车组/无 */}
      <Form.Item
        hidden={hidden}
        required
        name={[code, 'vehicle']}
        initialValue={{ type: 'AUTO', code: [] }}
        label={<FormattedMessage id='customTask.form.vehicle' />}
        rules={[{ validator: validateVehicle }]}
      >
        <VehicleSelector />
      </Form.Item>

      {/* 资源约束：customLimit */}
      <TitleCard
        hidden={hidden}
        width={640}
        title={<FormattedMessage id={'customTask.form.resourceLimit'} />}
      >
        <Fragment>
          {/* 可接小车电量约束 */}
          <Form.Item
            hidden={hidden}
            name={[code, 'customLimit', 'vehicleBatteryLimit']}
            label={formatMessage({ id: 'customTask.form.resourceLimit.vehicleBattery' })}
          >
            <InputNumber allowClear style={{ width: 90 }} />
          </Form.Item>
          {/* 车身可用容器数量约束 */}
          <Form.Item
            hidden={hidden}
            name={[code, 'customLimit', 'canUseContainerCountLimit']}
            label={formatMessage({
              id: 'customTask.form.resourceLimit.availableContainerCountLimit',
            })}
          >
            <InputNumber allowClear style={{ width: 90 }} />
          </Form.Item>
          {/* 容器规格约束 */}
          <Form.Item
            hidden={hidden}
            name={[code, 'customLimit', 'canUseContainerLimit']}
            label={formatMessage({ id: 'customTask.form.resourceLimit.containerTypeLimit' })}
            initialValue={[]}
          >
            <Select allowClear mode={'multiple'}></Select>
          </Form.Item>
          {/* 载具规格约束 */}
          <Form.Item
            hidden={hidden}
            name={[code, 'customLimit', 'canUseLoadTypeLimit']}
            label={formatMessage({ id: 'customTask.form.resourceLimit.loadTypeLimit' })}
            initialValue={[]}
          >
            <Select allowClear mode={'multiple'}></Select>
          </Form.Item>
          {/* 是否要求的载具ID必须有待命车辆持有 */}
          <Form.Item
            hidden={hidden}
            name={[code, 'customLimit', 'isLimitStandBy']}
            label={formatMessage({ id: 'customTask.form.resourceLimit.isLimitStandBy' })}
            initialValue={false}
            valuePropName={'checked'}
          >
            <Switch />
          </Form.Item>
          {/* 是否可以使用工作中的载具 */}
          <Form.Item
            hidden={hidden}
            name={[code, 'customLimit', 'canUseWorkLimit']}
            label={formatMessage({ id: 'customTask.form.resourceLimit.loadWorkLimit' })}
            initialValue={false}
            valuePropName={'checked'}
          >
            <Switch />
          </Form.Item>
        </Fragment>
      </TitleCard>

      {/* 备注 */}
      <Form.Item
        hidden={hidden}
        name={[code, 'remark']}
        label={formatMessage({ id: 'app.common.remark' })}
      >
        <Input style={{ width: 500 }} />
      </Form.Item>
    </>
  );
};
export default connect(({ customTask }) => ({
  loadSpecification: customTask.loadSpecification,
  storageSpecification: customTask.storageSpecification,
}))(memo(StartForm));
