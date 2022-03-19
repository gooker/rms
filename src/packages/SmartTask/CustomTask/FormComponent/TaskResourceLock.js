import React from 'react';
import { Select } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';

import styles from '../customTask.module.less';

const { Option } = Select;
const LockTime = {
  BeginTaskStart: 'app.customTask.form.beginTaskStart',
  AfterTaskEnd: 'app.customTask.form.afterTaskEnd',
  BeginActionStart: 'app.customTask.form.BeginActionStart',
  AfterActionEnd: 'app.customTask.form.AfterActionEnd',
  NOLOCK: 'app.customTask.form.noLock', // 不锁
  DONRUNLOCK: 'app.customTask.form.dontUnLock', // 不解锁
};

const TaskResourceLock = (props) => {
  const { dataSource, value, onChange } = props;
  const currentValue = value ? { ...value } : {};

  function onLockTimeChange(changedValue, field, lockTime) {
    currentValue[field][lockTime] = changedValue;
    onChange(currentValue);
  }

  function renderBody() {
    if (dataSource) {
      return Object.keys(dataSource).map((field) => {
        const content = dataSource[field];
        return (
          <div key={field} className={styles.taskResourceLockBodyRow}>
            <span style={{ flex: 1 }}>{content.label}</span>
            <span style={{ flex: 2 }}>
              <Select
                value={currentValue[field]?.LOCK}
                onChange={(lockTime) => onLockTimeChange(lockTime, field, 'LOCK')}
              >
                <Option value={'BeginTaskStart'}>
                  <FormattedMessage id={LockTime.BeginTaskStart} />
                </Option>
                <Option value={'BeginActionStart'}>
                  <FormattedMessage id={LockTime.BeginActionStart} />
                </Option>
                <Option value={'NO'}>
                  <FormattedMessage id={LockTime.NOLOCK} />
                </Option>
              </Select>
            </span>
            <span style={{ flex: 2 }}>
              <Select
                value={currentValue[field]?.UNLOCK}
                onChange={(lockTime) => onLockTimeChange(lockTime, field, 'UNLOCK')}
              >
                <Option value={'AfterTaskEnd'}>
                  <FormattedMessage id={LockTime.AfterTaskEnd} />
                </Option>
                <Option value={'AfterActionEnd'}>
                  <FormattedMessage id={LockTime.AfterActionEnd} />
                </Option>
                <Option value={'NO'}>
                  <FormattedMessage id={LockTime.DONRUNLOCK} />
                </Option>
              </Select>
            </span>
          </div>
        );
      });
    }
    return null;
  }

  return (
    <div className={styles.taskResourceLock}>
      <div className={styles.taskResourceLockTitle}>
        <span style={{ flex: 1 }}>
          <FormattedMessage id="app.customTask.form.resourceType" />
        </span>
        <span style={{ flex: 2 }}>
          <FormattedMessage id="app.customTask.form.lockTime" />
        </span>
        <span style={{ flex: 2 }}>
          <FormattedMessage id="app.customTask.form.unLockTime" />
        </span>
      </div>
      <div>{renderBody()}</div>
    </div>
  );
};
export default TaskResourceLock;
