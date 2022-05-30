import React, { memo, useState } from 'react';
import { Button, Form, Input, Select } from 'antd';
import { CloseOutlined, SendOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { formatMessage, getFormLayout, getMapModalPosition } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../monitorLayout.module.less';

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(5, 16);

const SorterPick = (props) => {
  const { dispatch, commonStations } = props;
  const [formRef] = Form.useForm();
  const [executing, setExecuting] = useState(false);

  function close() {
    dispatch({ type: 'monitor/saveCategoryModal', payload: null });
  }

  function emptyRun() {
    formRef
      .validateFields()
      .then((values) => {
        setExecuting(true);
        //
        setExecuting(false);
      })
      .catch(() => {});
  }

  return (
    <div style={getMapModalPosition(550, 330)} className={styles.monitorModal}>
      <div className={styles.monitorModalHeader}>
        <FormattedMessage id={'monitor.right.sorterPick'} />
        <CloseOutlined onClick={close} style={{ cursor: 'pointer' }} />
      </div>
      <div className={styles.monitorModalBody} style={{ paddingTop: 20 }}>
        <Form form={formRef} {...formItemLayout}>
          <Form.Item
            name={'vehicleId'}
            label={formatMessage({ id: 'app.vehicle.id' })}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name={'targetStation'} label={formatMessage({ id: 'app.map.station' })}>
            <Select>
              {commonStations.map(({ label, value }) => (
                <Select.Option key={value} value={value}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name={'actionType'}
            label={formatMessage({ id: 'monitor.operate.actionType' })}
          >
            <Select>
              <Select.Option value={'WAIT_TASK'}>
                <FormattedMessage id={'monitor.operate.actionType.WAIT_TASK'} />
              </Select.Option>
              <Select.Option value={'CONVEYOR'}>
                <FormattedMessage id={'monitor.operate.actionType.CONVEYOR.pick'} />
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item {...formItemLayoutNoLabel}>
            <Button type={'primary'} onClick={emptyRun} loading={executing} disabled={executing}>
              <SendOutlined /> <FormattedMessage id={'app.button.execute'} />
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default connect(({ monitor }) => {
  const commonStations = [];
  const currentMap = monitor.currentMap;
  if (currentMap) {
    currentMap.logicAreaList.forEach(({ commonList }) => {
      if (Array.isArray(commonList)) {
        commonList.forEach(({ name, station }) => {
          commonStations.push({ label: name, value: station });
        });
      }
    });
  }
  return { commonStations };
})(memo(SorterPick));
