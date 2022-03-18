import React, { memo, useState } from 'react';
import { Form, Button, Input, Select } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { find } from 'lodash';
import { agvEmptyRun } from '@/services/monitor';
import { connect } from '@/utils/RmsDva';
import { dealResponse, formatMessage, getFormLayout } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../monitorLayout.module.less';

const width = 500;
const height = 400;
const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(6, 16);

const PickCargo = (props) => {
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
        if (agv) {
          agvEmptyRun(agv.robotType, { ...values }).then((response) => {
            if (!dealResponse(response, formatMessage({ id: 'app.message.sendCommandSuccess' }))) {
              close();
            }
          });
        }
        setExecuting(false);
      })
      .catch(() => {});
  }

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        left: `calc(50% - ${width / 2}px)`,
      }}
      className={styles.monitorModal}
    >
      <div className={styles.monitorModalHeader}>
        <FormattedMessage id={'monitor.right.pickCargo'} />
        <CloseOutlined onClick={close} style={{ cursor: 'pointer' }} />
      </div>
      <div className={styles.monitorModalBody} style={{ paddingTop: 20 }}>
        <Form form={formRef} {...formItemLayout}>
          <Form.Item
            name={'robotId'}
            label={formatMessage({ id: 'app.agv.id' })}
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
            <Button onClick={emptyRun} loading={executing} disabled={executing}>
              <FormattedMessage id={'app.button.execute'} />
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
})(memo(PickCargo));
