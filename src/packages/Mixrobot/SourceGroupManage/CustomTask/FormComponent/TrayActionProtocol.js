import React from 'react';
import { Radio } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../customTask.less';

// upAction downAction
const TrayActionProtocol = (props) => {
  const { value, onChange } = props;
  const currentValue = value ? { ...value } : {};

  function onProtocolChange(changedValue, field) {
    currentValue[field] = changedValue.target.value;
    onChange(currentValue);
  }

  function renderBody() {
    return (
      <div className={styles.taskResourceLockBodyRow}>
        <span>
          <Radio.Group
            size="small"
            buttonStyle="solid"
            value={currentValue?.upAction}
            onChange={(protocol) => onProtocolChange(protocol, 'upAction')}
          >
            <Radio.Button value="D0">
              <FormattedMessage id="app.customTask.form.lift" />
            </Radio.Button>
            <Radio.Button value="D10">
              <FormattedMessage id="app.customTask.form.blindLift" />
            </Radio.Button>
          </Radio.Group>
        </span>
        <span>
          <Radio.Group
            size="small"
            buttonStyle="solid"
            value={currentValue?.downAction}
            onChange={(protocol) => onProtocolChange(protocol, 'downAction')}
          >
            <Radio.Button value="D1">
              <FormattedMessage id="app.customTask.form.down" />
            </Radio.Button>
            <Radio.Button value="D11">
              <FormattedMessage id="app.customTask.form.blindDown" />
            </Radio.Button>
          </Radio.Group>
        </span>
      </div>
    );
  }

  return (
    <div style={{ width: 400 }}>
      <div className={styles.taskResourceLockTitle}>
        <span>
          <FormattedMessage id="app.customTask.form.trayLiftProtocol" />
        </span>
        <span>
          <FormattedMessage id="app.customTask.form.trayDownProtocol" />
        </span>
      </div>
      <div>{renderBody()}</div>
    </div>
  );
};
export default TrayActionProtocol;
