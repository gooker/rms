import React, { memo, useState } from 'react';
import { Form, Button, Input, Select, Row, Col, Radio, InputNumber } from 'antd';
import { CloseOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { find } from 'lodash';
import { agvEmptyRun } from '@/services/monitor';
import { connect } from '@/utils/RmsDva';
import { dealResponse, formatMessage, getFormLayout } from '@/utils/util';
import { getCurrentLogicAreaData } from '@/utils/mapUtil';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../monitorLayout.module.less';

const width = 500;
const height = 300;
const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(6, 16);

const AutomaticToteWorkstationTask = (props) => {
  const { dispatch, allAGVs, workstationList } = props;
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
        const agv = find(allAGVs, { robotId: values.robotId });
        if (agv) {
          agvEmptyRun(agv.robotType, { ...values }).then((response) => {
            if (
              !dealResponse(response, true, formatMessage({ id: 'app.message.sendCommandSuccess' }))
            ) {
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
          <Form.Item
            name={'workstation'}
            label={formatMessage({ id: 'app.monitorOperation.workstation' })}
          >
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
            name={'robotId'}
            label={formatMessage({ id: 'app.agv.id' })}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
{/* 
          <Form.List name="toteAGVTaskActionDTOS">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Row
                    key={field.key}
                    style={{
                      border: '1px solid #e0dcdc',
                      padding: '25px 10px 0 0',
                      borderRadius: '5px',
                      marginBottom: '20px',
                    }}
                  >
                    <Col span={22}>
                      <Form.Item
                        {...field}
                        label={formatMessage({
                          id: 'app.monitorOperation.toteWorkStation.action',
                        })}
                        initialValue={'FETCH'}
                        name={[field.name, 'toteAGVTaskActionType']}
                        fieldKey={[field.fieldKey, 'toteAGVTaskActionType']}
                      >
                        <Radio.Group>
                          <Radio.Button value="FETCH">
                            <FormattedMessage id="app.monitorOperation.toteWorkStation.fetch" />
                          </Radio.Button>
                          <Radio.Button value="PUT">
                            <FormattedMessage id="app.monitorOperation.toteWorkStation.put" />
                          </Radio.Button>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item
                        {...field}
                        label={formatMessage({
                          id: 'app.monitorOperation.toteWorkStation.toteCode',
                        })}
                        name={[field.name, 'toteCode']}
                        fieldKey={[field.fieldKey, 'toteCode']}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        label={formatMessage({
                          id: 'app.monitorOperation.toteWorkStation.toteWeight',
                        })}
                        name={[field.name, 'weight']}
                        fieldKey={[field.fieldKey, 'weight']}
                      >
                        <InputNumber />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        label={formatMessage({
                          id: 'app.monitorOperation.toteWorkStation.binCode',
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
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    <FormattedMessage id="app.workStationMap.add" />
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List> */}

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
export default connect(({ monitor }) => ({
  allAGVs: monitor.allAGVs,
  workstationList: getCurrentLogicAreaData('monitor')?.workstationList || [],
}))(memo(AutomaticToteWorkstationTask));
