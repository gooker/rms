import React, { memo } from 'react';
import { Button, Col, Row, Select } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../customTask.module.less';

const TaskResourceLock = (props) => {
  const { dataSource, value, onChange } = props;
  const currentValue = Array.isArray(value) ? [...value] : [];

  function onLockTimeChange(index, fieldIndex, value) {
    currentValue[index][fieldIndex] = value;
    onChange(currentValue);
  }

  function addConfigRow() {
    currentValue.push([]);
    onChange(currentValue);
  }

  function minusConfigRow(__index) {
    onChange(currentValue.filter((item, index) => index !== __index));
  }

  function renderBody() {
    return currentValue.map((item, index) => {
      return (
        <Row key={index} className={styles.taskResourceLockBodyRow} gutter={10}>
          <Col span={6}>
            <Select
              value={currentValue[index][0]}
              onChange={(type) => onLockTimeChange(index, 0, type)}
            >
              {Object.keys(dataSource).map((type) => (
                <Select.Option key={type} value={type}>
                  <FormattedMessage id={`customTask.lock.${type}`} />
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={9}>
            <Select
              value={currentValue[index][1]}
              onChange={(lockTime) => onLockTimeChange(index, 1, lockTime)}
            >
              <Select.Option value={'BeginTaskStart'}>
                <FormattedMessage id={'customTask.lock.BeginTaskStart'} />
              </Select.Option>
              <Select.Option value={'BeginActionStart'}>
                <FormattedMessage id={'customTask.lock.BeginActionStart'} />
              </Select.Option>
              <Select.Option value={'NO'}>
                <FormattedMessage id={'customTask.lock.LOCK.NO'} />
              </Select.Option>
            </Select>
          </Col>
          <Col span={9}>
            <Select
              value={currentValue[index][2]}
              onChange={(lockTime) => onLockTimeChange(index, 2, lockTime)}
            >
              <Select.Option value={'AfterTaskEnd'}>
                <FormattedMessage id={'customTask.lock.AfterTaskEnd'} />
              </Select.Option>
              <Select.Option value={'AfterActionEnd'}>
                <FormattedMessage id={'customTask.lock.AfterActionEnd'} />
              </Select.Option>
              <Select.Option value={'NO'}>
                <FormattedMessage id={'customTask.lock.UNLOCK.NO'} />
              </Select.Option>
            </Select>
          </Col>
          <Button
            style={{ position: 'absolute', right: -38 }}
            icon={<MinusOutlined />}
            onClick={() => {
              minusConfigRow(index);
            }}
          />
        </Row>
      );
    });
  }

  return (
    <div className={styles.taskResourceLock}>
      <div className={styles.taskResourceLockTitle}>
        <span style={{ flex: 2 }}>
          <FormattedMessage id='customTask.lock.resourceType' />
        </span>
        <span style={{ flex: 3 }}>
          <FormattedMessage id='customTask.lock.LOCK' />
        </span>
        <span style={{ flex: 3 }}>
          <FormattedMessage id='customTask.lock.UNLOCK' />
        </span>
      </div>
      <div>{renderBody()}</div>
      <Button type={'dashed'} onClick={addConfigRow} style={{ width: '100%', marginTop: 8 }}>
        <PlusOutlined />
      </Button>
    </div>
  );
};
export default connect(({ customTask }) => ({
  dataSource: customTask.modelLocks ?? {},
}))(memo(TaskResourceLock));
