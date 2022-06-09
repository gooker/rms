import React, { memo, useState } from 'react';
import { Button, Col, Form, Input, InputNumber, Radio, Row, Select } from 'antd';
import { CloseOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { find } from 'lodash';
import { connect } from '@/utils/RmsDva';
import { emptyRun } from '@/services/taskService';
import { getCurrentLogicAreaData } from '@/utils/mapUtil';
import { dealResponse, formatMessage, getFormLayout } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../monitorLayout.module.less';

const width = 500;
const height = 500;
const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(6, 16);

const AutomaticToteWorkstationTask = (props) => {
  const { dispatch, allVehicles, workstationList } = props;
  const [formRef] = Form.useForm();
  const [executing, setExecuting] = useState(false);

  function close() {
    dispatch({ type: 'monitor/saveCategoryModal', payload: null });
  }

  function doEmptyRun() {
    formRef
      .validateFields()
      .then((values) => {
        setExecuting(true);
        const vehicle = find(allVehicles, { vehicleId: values.vehicleId });
        if (vehicle) {
          emptyRun({ ...values }).then((response) => {
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
        <FormattedMessage id={'monitor.right.stationTask'} />
        <CloseOutlined onClick={close} style={{ cursor: 'pointer' }} />
      </div>
      <div className={styles.monitorModalBody} style={{ paddingTop: 20 }}>
        <Form form={formRef} {...formItemLayout}>
          <Form.Item name={'workstation'} label={formatMessage({ id: 'app.map.workStation' })}>
            <Select style={{ width: '80%' }}>
              {workstationList.map((record, index) => {
                return (
                  <Select.Option value={index} key={index}>
                    {record.stopCellId}-{record.angle}°
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item
            name={'vehicleId'}
            label={formatMessage({ id: 'vehicle.id' })}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.List name="toteVehicleTaskActionDTOS">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Row
                    key={field.key}
                    style={{
                      border: '1px solid #e0dcdc',
                      padding: '10px',
                      borderRadius: '5px',
                      marginBottom: '20px',
                      marginLeft: 20,
                    }}
                  >
                    <Col span={22}>
                      <Form.Item
                        {...field}
                        label={formatMessage({
                          id: 'app.taskDetail.action',
                        })}
                        initialValue={'FETCH'}
                        name={[field.name, 'toteVehicleTaskActionType']}
                        fieldKey={[field.fieldKey, 'toteVehicleTaskActionType']}
                      >
                        <Radio.Group>
                          <Radio.Button value="FETCH">
                            <FormattedMessage id="app.taskDetail.action.fetch" />
                          </Radio.Button>
                          <Radio.Button value="PUT">
                            <FormattedMessage id="app.taskDetail.action.put" />
                          </Radio.Button>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item
                        {...field}
                        label={formatMessage({
                          id: 'lockManage.toteCode',
                        })}
                        name={[field.name, 'toteCode']}
                        fieldKey={[field.fieldKey, 'toteCode']}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        label={formatMessage({
                          id: 'monitor.automaticLatentWorkStationTask.toteWeight',
                        })}
                        name={[field.name, 'weight']}
                        fieldKey={[field.fieldKey, 'weight']}
                      >
                        <InputNumber />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        label={formatMessage({
                          id: 'app.taskDetail.binCode',
                        })}
                        name={[field.name, 'binCode']}
                        fieldKey={[field.fieldKey, 'binCode']}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Button
                        type="danger"
                        icon={<DeleteOutlined />}
                        onClick={() => remove(field.name)}
                      />
                    </Col>
                  </Row>
                ))}
                <Form.Item>
                  <Button block type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    <FormattedMessage id="app.button.add" />
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item {...formItemLayoutNoLabel}>
            <Button onClick={doEmptyRun} loading={executing} disabled={executing}>
              <FormattedMessage id={'app.button.execute'} />
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default connect(({ monitor }) => ({
  allVehicles: monitor.allVehicles,
  workstationList: getCurrentLogicAreaData('monitor')?.workstationList || [],
}))(memo(AutomaticToteWorkstationTask));
