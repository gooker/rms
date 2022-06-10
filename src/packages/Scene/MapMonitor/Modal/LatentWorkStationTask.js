import React, { memo, useState } from 'react';
import { Button, Form, InputNumber, Radio, Select } from 'antd';
import { CloseOutlined, SendOutlined, SyncOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { latentPodToWorkStation } from '@/services/monitorService';
import { dealResponse, formatMessage, getDirByAngle, getFormLayout, getMapModalPosition } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { MonitorSelectableSpriteType } from '@/config/consts';
import styles from '../monitorLayout.module.less';

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(6, 16);

const LatentWorkStationTask = (props) => {
  const { dispatch, selections, currentMap } = props;
  const [formRef] = Form.useForm();
  const [executing, setExecuting] = useState(false);
  const workstationList = getWorkstationList();

  function close() {
    dispatch({ type: 'monitor/saveCategoryModal', payload: null });
  }

  function getWorkstationList() {
    const result = [];
    currentMap.logicAreaList.forEach(({ workstationList }) => {
      workstationList.forEach(({ station, name }) => {
        result.push({ value: station, label: name });
      });
    });
    return result;
  }

  function callPodToWorkstation() {
    formRef
      .validateFields()
      .then((values) => {
        setExecuting(true);
        const { workstation, ...otherParams } = values;
        const currentWorkstation = workstation.split('-');
        const currentParams = {
          ...otherParams,
          stopCellId: currentWorkstation[0],

          // 注意：这里的direction不是角度，是0、1、2、3
          direction: getDirByAngle(parseInt(currentWorkstation[1], 10)),
        };
        latentPodToWorkStation({ ...currentParams }).then((response) => {
          if (!dealResponse(response, formatMessage({ id: 'app.message.sendCommandSuccess' }))) {
            close();

            // 取消选择
            selections.map((item) => item.onUnSelect());
            dispatch({
              type: 'monitor/saveSelections',
              payload: { selections: [] },
            });
          }
        });
        setExecuting(false);
      })
      .catch(() => {});
  }

  function autoFillForm() {
    const vehicle = selections.filter(
      (item) => item.type === MonitorSelectableSpriteType.Vehicle,
    )[0];
    const pod = selections.filter((item) => item.type === MonitorSelectableSpriteType.LatentPod)[0];
    const station = selections.filter((item) =>
      [MonitorSelectableSpriteType.WorkStation, MonitorSelectableSpriteType.Station].includes(
        item.type,
      ),
    )[0];

    formRef.resetFields();
    formRef.setFieldsValue({
      vehicleId: vehicle.vehicleId,
      podId: pod.id,
      workstation: station.code,
    });
  }

  return (
    <div style={getMapModalPosition(500, 400)} className={styles.monitorModal}>
      <div className={styles.monitorModalHeader}>
        <FormattedMessage id={'monitor.right.workStationTask'} />
        <CloseOutlined onClick={close} style={{ cursor: 'pointer' }} />
      </div>
      <div className={styles.monitorModalBody} style={{ paddingTop: 20 }}>
        <Form form={formRef} {...formItemLayout}>
          <Form.Item name={'vehicleId'} label={formatMessage({ id: 'vehicle.id' })}>
            <InputNumber />
          </Form.Item>

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
                  <Select.Option value={record.value} key={index}>
                    {record.label}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item {...formItemLayoutNoLabel}>
            <Button
              onClick={autoFillForm}
              disabled={selections.length === 0}
              style={{ marginRight: 15 }}
            >
              <SyncOutlined /> <FormattedMessage id={'monitor.autoFill'} />
            </Button>

            <Button
              onClick={callPodToWorkstation}
              loading={executing}
              disabled={executing}
              type="primary"
            >
              <SendOutlined /> <FormattedMessage id={'app.button.execute'} />
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default connect(({ monitor }) => ({
  currentMap: monitor.currentMap,
  selections: monitor.selections,
}))(memo(LatentWorkStationTask));
