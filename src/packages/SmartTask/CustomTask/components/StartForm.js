import React, { memo } from 'react';
import { Checkbox, Form, Input } from 'antd';
import { formatMessage, getFormLayout } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import RobotSelector from '../components/RobotSelector';
import style from '../customTask.module.less';

const { formItemLayout } = getFormLayout(6, 18);

const StartForm = (props) => {
  const { code, type, hidden } = props;

  return (
    <>
      <Form.Item
        hidden
        {...formItemLayout}
        name={[code, 'customType']}
        initialValue={type}
        label={formatMessage({ id: 'app.common.type' })}
      >
        <Input disabled style={{ width: 300 }} />
      </Form.Item>
      <Form.Item
        hidden
        {...formItemLayout}
        name={[code, 'code']}
        initialValue={code}
        label={formatMessage({ id: 'app.common.code' })}
        rules={[{ required: true }]}
      >
        <Input style={{ width: 300 }} />
      </Form.Item>

      {/* --------------------------------------------------------------- */}
      {/* 分小车: 当前执行任务的指定robot资源-->小车/小车组/无 */}
      <Form.Item
        hidden={hidden}
        {...formItemLayout}
        name={[code, 'robot']}
        initialValue={{ type: 'AUTO', code: [] }}
        label={<FormattedMessage id='customTask.form.robot' />}
      >
        <RobotSelector subTaskCode={code} />
      </Form.Item>

      {/* 约束 */}
      <Form.Item
        hidden={hidden}
        {...formItemLayout}
        label={formatMessage({ id: 'customTask.form.limit' })}
      >
        <div className={style.limitDiv}>
          <Form.Item
            noStyle
            name={[code, 'isLimitStandBy']}
            initialValue={true}
            valuePropName={'checked'}
          >
            <Checkbox>
              <FormattedMessage id={'customTask.form.limit.podWithStandbyAgv'} />
            </Checkbox>
          </Form.Item>
        </div>
      </Form.Item>

      {/* 备注 */}
      <Form.Item
        hidden={hidden}
        {...formItemLayout}
        name={[code, 'remark']}
        label={formatMessage({ id: 'app.common.remark' })}
      >
        <Input style={{ width: 500 }} />
      </Form.Item>
    </>
  );
};
export default memo(StartForm);
