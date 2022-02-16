import React, { memo, useState } from 'react';
import { Form, Button, InputNumber, Row, Col, Select, Checkbox, Input } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { fetchPodToCell } from '@/services/monitor';
import { connect } from '@/utils/RmsDva';
import { find } from 'lodash';
import { dealResponse, formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { getCurrentLogicAreaData } from '@/utils/mapUtil';
import styles from '../monitorLayout.module.less';

const width = 500;
const height = 600;

const AutomaticLatentWorkstationTask = (props) => {
  const { dispatch, workstationList, latentAutomaticTaskForm, latentAutomaticTaskConfig } = props;
  const [formRef] = Form.useForm();
  const [executing, setExecuting] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  function close() {
    dispatch({ type: 'monitor/saveCategoryModal', payload: null });
  }

  function emptyRun() {
    formRef
      .validateFields()
      .then((values) => {
        setExecuting(true);
        fetchPodToCell({ ...values }).then((response) => {
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
  function covertWorkstationArrayToFormData(workstationArray) {
    const workStation = [];
    if (workstationArray.length !== workstationList.length) {
      workstationArray.forEach((record) => {
        const { stopCellId } = record;
        const workStationData = find(workstationList, { stopCellId });
        workStationData &&
          workStation.push(`${workStationData.stopCellId}-${workStationData.angle}`);
      });
    }
    return workStation;
  }

  function addAutomaticTaskConfig() {}

  function cancelEditConfig() {}

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
        <Form form={formRef} layout="vertical">
          <Form.Item
            name={'workStation'}
            initialValue={
              latentAutomaticTaskForm?.workstationArray
                ? covertWorkstationArrayToFormData(latentAutomaticTaskForm.workstationArray)
                : []
            }
            label={formatMessage({ id: 'app.monitorOperation.workstation' })}
          >
            <Select
              mode="multiple"
              placeholder={formatMessage({
                id: 'app.monitorOperation.automaticLatentWorkStationTask.defaultAllStation',
              })}
              style={{ width: '80%' }}
            >
              {workstationList.map((record, index) => (
                <Select.Option value={`${record.stopCellId}-${record.angle}`} key={index}>
                  {record.stopCellId}-{record.angle}°
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name={'randomPodFace'}
            initialValue={
              latentAutomaticTaskForm?.randomPodFace
                ? latentAutomaticTaskForm.randomPodFace.split('')
                : []
            }
            label={formatMessage({ id: 'app.monitorOperation.targetDirection' })}
            rules={[{ required: latentAutomaticTaskConfig.length === 0 }]}
          >
            <Checkbox.Group
              options={[
                { label: formatMessage({ id: 'app.pod.side.A' }), value: 'A' },
                { label: formatMessage({ id: 'app.pod.side.B' }), value: 'B' },
                { label: formatMessage({ id: 'app.pod.side.C' }), value: 'C' },
                { label: formatMessage({ id: 'app.pod.side.D' }), value: 'D' },
              ]}
            />
          </Form.Item>

          <Form.Item
            name={'maxPodNum'}
            label={formatMessage({
              id: 'app.monitorOperation.automaticLatentWorkStationTask.maxPodNum',
            })}
            rules={[
              {
                required: latentAutomaticTaskConfig.length === 0,
              },
            ]}
            initialValue={
              latentAutomaticTaskForm?.maxPodNum ? latentAutomaticTaskForm?.maxPodNum : null
            }
          >
            <Input suffix={<FormattedMessage id="app.report.unit" />} />
          </Form.Item>

          <Form.Item
            name={'callIntervalMill'}
            label={formatMessage({
              id: 'app.monitorOperation.automaticLatentWorkStationTask.callIntervalMill',
            })}
            rules={[
              {
                required: true,
              },
            ]}
            initialValue={
              latentAutomaticTaskForm?.callIntervalMill
                ? latentAutomaticTaskForm?.callIntervalMill
                : 3000
            }
          >
            <Input suffix={'ms'} />
          </Form.Item>

          <Form.Item
            name={'delayReleaseSecondMill'}
            label={formatMessage({
              id: 'app.monitorOperation.automaticLatentWorkStationTask.delayReleaseSecondMill',
            })}
            rules={[
              {
                required: true,
              },
            ]}
            initialValue={
              latentAutomaticTaskForm?.delayReleaseSecondMill
                ? latentAutomaticTaskForm?.delayReleaseSecondMill
                : 3000
            }
          >
            <Input suffix={'ms'} />
          </Form.Item>
          <Form.Item>
            <Row type="flex" gutter={10}>
              <Col span={12}>
                <Button type="primary" onClick={addAutomaticTaskConfig}>
                  {isEdit
                    ? formatMessage({
                        id: 'app.monitorOperation.automaticLatentWorkStationTask.updateConfiguration',
                      })
                    : formatMessage({
                        id: 'app.monitorOperation.automaticLatentWorkStationTask.addConfiguration',
                      })}
                </Button>
              </Col>
              <Col span={12}>
                {isEdit && (
                  <Button onClick={cancelEditConfig}>
                    <FormattedMessage id="app.monitorOperation.automaticLatentWorkStationTask.cancel" />
                  </Button>
                )}
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default connect(({ monitor }) => ({
  workstationList: getCurrentLogicAreaData('monitor')?.workstationList || [],
  latentAutomaticTaskForm: monitor.latentAutomaticTaskForm, // 表单数据
  latentAutomaticTaskUsage: monitor.latentAutomaticTaskUsage, // 操作日志
  latentAutomaticTaskConfig: monitor.latentAutomaticTaskConfig || [], // 表格数据
}))(memo(AutomaticLatentWorkstationTask));
