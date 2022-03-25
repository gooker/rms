import React, { memo, useState } from 'react';
import { Form, Input, Select, Modal, Radio, Row, Col, InputNumber, Button } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { find } from 'lodash';
import { dealResponse, formatMessage, getFormLayout } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';

const toteTaskType = [
  { label: '入库', code: 'STATION_TO_POD' },
  { label: '拣货', code: 'POD_TO_STATION' },
];

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(6, 16);

const SimulationTaskComponent = (props) => {
  const { visible, onClose, updateVisible } = props;
  const [formRef] = Form.useForm();
  const [executing, setExecuting] = useState(false);

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
      width={450}
      title={
        <>
          {Object.keys(updateVisible).length > 0 ? (
            <FormattedMessage id="app.button.add" />
          ) : (
            <FormattedMessage id="app.button.edit" />
          )}
          <FormattedMessage id="app.simulateTask" />
        </>
      }
      bodyStyle={{ height: `600px`, overflow: 'auto' }}
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
                        name={[field.name, 'toteAGVTaskActionType']}
                        fieldKey={[field.fieldKey, 'toteAGVTaskActionType']}
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
export default memo(SimulationTaskComponent);
