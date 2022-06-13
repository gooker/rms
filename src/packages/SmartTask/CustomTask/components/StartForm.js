import React, { memo } from 'react';
import { Checkbox, Form, Input } from 'antd';
import { formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import VehicleSelector from '../components/VehicleSelector';
import style from '../customTask.module.less';

const StartForm = (props) => {
  const { code, type, hidden } = props;

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
        name={[code, 'robot']}
        initialValue={{ type: 'AUTO', code: [] }}
        label={<FormattedMessage id='customTask.form.vehicle' />}
        rules={[{ validator: validateVehicle }]}
      >
        <VehicleSelector />
      </Form.Item>

      {/* 资源约束 */}
      <Form.Item hidden={hidden} label={formatMessage({ id: 'customTask.form.resourceLimit' })}>
        <div className={style.limitDiv}>
          <Form.Item
            noStyle
            name={[code, 'isLimitStandBy']}
            initialValue={true}
            valuePropName={'checked'}
          >
            <Checkbox>
              <FormattedMessage id={'customTask.form.resourceLimit.podWithStandbyVehicle'} />
            </Checkbox>
          </Form.Item>
        </div>
      </Form.Item>

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
export default memo(StartForm);
