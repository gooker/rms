import React, { memo, useState } from 'react';
import { Form, Input, Select, Modal, Radio, Row, Col, InputNumber, Button } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { find } from 'lodash';
import { getCurrentLogicAreaData } from '@/utils/mapUtil';
import { dealResponse, formatMessage, getFormLayout } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';

const toteTaskType = [
  { label: '入库', code: 'STATION_TO_POD' },
  { label: '拣货', code: 'POD_TO_STATION' },
];

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(6, 16);

const SimulationTaskComponent = (props) => {
  const { visible, onClose, updateRecord, workstationList } = props;
  const [formRef] = Form.useForm();
  const [executing, setExecuting] = useState(false);

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

  function saveTasks() {
    formRef
      .validateFields()
      .then((values) => {
        setExecuting(true);
        console.log(values);
        setExecuting(false);
      })
      .catch(() => {});
  }

  return (
    <Modal
      destroyOnClose
      style={{ top: 30 }}
      onCancel={onClose}
      onOk={saveTasks}
      visible={visible}
      width={500}
      title={
        <>
          {Object.keys(updateRecord).length > 0 ? (
            <FormattedMessage id="app.button.add" />
          ) : (
            <FormattedMessage id="app.button.edit" />
          )}
          <FormattedMessage id="app.simulateTask" />
        </>
      }
      bodyStyle={{ height: `300px`, overflow: 'auto' }}
    >
      <div style={{ marginTop: 10 }}>
        <Form labelWrap form={formRef} {...formItemLayout}>
          <Form.Item
            name={'toteTaskType'}
            label={formatMessage({ id: 'app.task.type' })}
            rules={[{ required: true }]}
          >
            <Select style={{ width: '250px' }}>
              {toteTaskType.map((item) => (
                <Select.Option key={item?.code} value={item?.code}>
                  {item?.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name={'callType'}
            label={formatMessage({ id: 'app.simulateTask.callType' })}
            rules={[{ required: true }]}
            initialValue={'Auto'}
          >
            <Radio.Group>
              <Radio value={'Auto'}>
                <FormattedMessage id="app.simulateTask.type.Auto" />
              </Radio>
              <Radio value={'Appoint'}>
                <FormattedMessage id="app.simulateTask.type.Appoint" />
              </Radio>
            </Radio.Group>
          </Form.Item>

          <Form.List name="workStationCallParms">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Row
                    key={key}
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
                        {...restField}
                        label={formatMessage({
                          id: 'app.common.priority',
                        })}
                        initialValue={[]}
                        name={[name, 'priorities']}
                        fieldKey={[fieldKey, 'priorities']}
                      >
                        <Select allowClear mode="tags" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'workStationCodes']}
                        fieldKey={[fieldKey, 'workStationCodes']}
                        initialValue={
                          updateRecord?.workstationArray
                            ? covertWorkstationArrayToFormData(updateRecord.workstationArray)
                            : []
                        }
                        label={formatMessage({ id: 'app.map.workStation' })}
                      >
                        <Select
                          mode="multiple"
                          placeholder={formatMessage({
                            id: 'monitor.automaticLatentWorkStationTask.defaultAllStation',
                          })}
                          style={{ width: '80%' }}
                        >
                          {workstationList.map((record, index) => (
                            <Select.Option value={record.stopCellId} key={index}>
                              {record.stopCellId}-{record.angle}°
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Button
                        type="danger"
                        icon={<DeleteOutlined />}
                        onClick={() => remove(name)}
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

          {/* <Form.Item {...formItemLayoutNoLabel}>
            <Button type={'primary'} onClick={saveTasks} loading={executing} disabled={executing}>
              <SendOutlined /> <FormattedMessage id={'app.button.execute'} />
            </Button>
          </Form.Item> */}
        </Form>
      </div>
    </Modal>
  );
};
export default connect(({ monitor }) => ({
  workstationList: getCurrentLogicAreaData('monitor')?.workstationList || [],
}))(memo(SimulationTaskComponent));
