import React, { memo, useState } from 'react';
import { Form, Button, Select, InputNumber, Radio } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { latentPodToWorkStation } from '@/services/monitor';
import { dealResponse, formatMessage, getFormLayout } from '@/utils/util';
import { getCurrentLogicAreaData } from '@/utils/mapUtil';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../monitorLayout.module.less';

const width = 500;
const height = 400;
const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(6, 16);

const LatentWorkStationTask = (props) => {
  const { dispatch, workstationList } = props;
  const [formRef] = Form.useForm();
  const [executing, setExecuting] = useState(false);

  function close() {
    dispatch({ type: 'monitor/saveCategoryModal', payload: null });
  }

  function callRackToWorkstation() {
    formRef
      .validateFields()
      .then((values) => {
        setExecuting(true);
        const { workstation, ...otherParams } = values;
        const currentworkstation = workstation.split('-');
        const currentParams = {
          ...otherParams,
          stopCellId: currentworkstation[0],
          direction: currentworkstation[1],
        };
        latentPodToWorkStation({ ...currentParams }).then((response) => {
          if (
            !dealResponse(response, true, formatMessage({ id: 'app.message.sendCommandSuccess' }))
          ) {
            close();
          }
        });
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
        <FormattedMessage id={'monitor.right.workStationTask'} />
        <CloseOutlined onClick={close} style={{ cursor: 'pointer' }} />
      </div>
      <div className={styles.monitorModalBody} style={{ paddingTop: 20 }}>
        <Form form={formRef} {...formItemLayout}>
          <Form.Item
            name={'podId'}
            label={formatMessage({ id: 'app.pod' })}
            rules={[{ required: true }]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            name={'targetDirection'}
            label={formatMessage({ id: 'app.pod.direction' })}
            rules={[{ required: true }]}
          >
            <Radio.Group
              optionType="button"
              buttonStyle="solid"
              options={[
                { label: formatMessage({ id: 'app.pod.side.A' }), value: '0' },
                { label: formatMessage({ id: 'app.pod.side.B' }), value: '1' },
                { label: formatMessage({ id: 'app.pod.side.C' }), value: '2' },
                { label: formatMessage({ id: 'app.pod.side.D' }), value: '3' },
              ]}
            />
          </Form.Item>

          <Form.Item
            name={'workstation'}
            label={formatMessage({ id: 'app.map.workStation' })}
            rules={[{ required: true }]}
          >
            <Select style={{ width: '80%' }}>
              {workstationList.map((record, index) => {
                return (
                  <Select.Option value={`${record.stopCellId}-${record.direction}`} key={index}>
                    {record.stopCellId}-{record.angle}°
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item name={'robotId'} label={formatMessage({ id: 'app.agv.id' })}>
            <InputNumber />
          </Form.Item>

          <Form.Item {...formItemLayoutNoLabel}>
            <Button
              onClick={callRackToWorkstation}
              loading={executing}
              disabled={executing}
              type="primary"
            >
              <FormattedMessage id={'app.button.execute'} />
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default connect(({ monitor }) => ({
  workstationList: getCurrentLogicAreaData('monitor')?.workstationList || [],
}))(memo(LatentWorkStationTask));
