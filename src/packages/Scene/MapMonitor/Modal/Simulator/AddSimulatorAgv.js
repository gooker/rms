import React, { memo, useEffect, useState } from 'react';
import { connect } from '@/utils/RmsDva';
import { Button, Checkbox, Divider, Form, InputNumber, message, Row } from 'antd';
import { dealResponse, formatMessage, getFormLayout } from '@/utils/util';
import { getCurrentLogicAreaData } from '@/utils/mapUtil';
import { addSimulationAgvs } from '@/services/monitor';
import FormattedMessage from '@/components/FormattedMessage';
import { AGVSubTypeMap } from '@/config/consts';
import styles from '../../monitorLayout.module.less';
import { PlusOutlined } from '@ant-design/icons';

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(6, 18);
const { formItemLayout: formItemLayout2 } = getFormLayout(8, 16);

function AddSimulatorAgv(props) {
  const { robotType, robotTypes, submit, logicId, onCancel, agvAdapter } = props;
  const [executing, setExecuting] = useState(false);
  const [isIncrement, setIsIncrement] = useState(false); // 用于标记批量添加小车时候是否是增量添加
  const [selectedSubType, setSelectedSubType] = useState('Normal');
  const [subTypes, setSubTypes] = useState([]);
  const [formRef] = Form.useForm();
  const [formRef2] = Form.useForm();

  useEffect(() => {
    const subTypeEnum = AGVSubTypeMap[robotType];
    if (subTypeEnum) {
      setSubTypes(subTypeEnum);
    }
  }, []);

  function addAGV() {
    formRef
      .validateFields()
      .then((value) => {
        setExecuting(true);
        const params = { agvAdapter, isSimulator: true, agvStatusDTO: { ...value } };
        submit && submit(params);
        setExecuting(false);
      })
      .catch(() => {});
  }

  function batchAddAGV() {
    formRef2
      .validateFields()
      .then((values) => {
        const params = {
          logicId,
          robotType,
          robotSize: values.robotSize,
          addFlag: isIncrement,
          robotModel: selectedSubType,
          currentDirection: values?.batchcurrentDirection,
        };
        addSimulationAgvs(params).then((res) => {
          if (dealResponse(res)) {
            message.error(formatMessage({ id: 'monitor.simulator.addAMR.failed' }));
          } else {
            message.success(formatMessage({ id: 'monitor.simulator.addAMR.success' }));
            onCancel(false);
          }
        });
      })
      .catch(() => {});
  }

  return (
    <div style={{ marginTop: 20 }}>
      {/* <Form.Item {...formItemLayout} label={formatMessage({ id: 'app.agvType' })}>
        <Select disabled value={robotType} style={{ width: '130px' }}>
          {robotTypes.map((record) => (
            <Select.Option value={record} key={record}>
              {record}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {subTypes && subTypes.length > 0 && (
        <Form.Item
          {...formItemLayout}
          label={formatMessage({ id: 'monitor.simulator.AMRSubType' })}
        >
          <Select
            value={selectedSubType}
            onChange={(value) => {
              setSelectedSubType(value);
            }}
            style={{ width: '130px' }}
          >
            {subTypes.map((item) => (
              <Select.Option value={item.value} key={item.value}>
                <FormattedMessage id={item.label} />
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )} */}

      <Form form={formRef} {...formItemLayout} labelWrap>
        <div className={styles.rightSimulator}>
          <Divider orientation="left" style={{ margin: '12px 0' }}>
            <FormattedMessage id="monitor.simulator.addAMR" />
          </Divider>
          <Form.Item
            name={'vehicleId'}
            label={formatMessage({ id: 'app.agv.id' })}
            rules={[{ required: true }]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            name={'cellId'}
            label={formatMessage({ id: 'app.map.cell' })}
            rules={[{ required: true }]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            name={'angle'}
            initialValue={0}
            label={formatMessage({ id: 'app.direction' })}
            rules={[{ required: true }]}
          >
            <InputNumber min={0} max={359} />
          </Form.Item>

          <Form.Item {...formItemLayoutNoLabel}>
            <Button loading={executing} disabled={executing} onClick={addAGV}>
              <PlusOutlined /> <FormattedMessage id="app.button.add" />
            </Button>
          </Form.Item>
        </div>
      </Form>

      {/* 批量添加 */}
      <Form form={formRef2} {...formItemLayout2} labelWrap>
        <div className={styles.rightSimulator}>
          <Divider orientation="left" style={{ margin: '12px 0' }}>
            <FormattedMessage id="monitor.operation.batchAdd" />
          </Divider>
          <Form.Item
            required
            label={formatMessage({ id: 'monitor.simulator.AMRCount' })}
            rules={[{ required: true }]}
          >
            <Row align={'middle'}>
              <Form.Item noStyle name={'robotSize'} rules={[{ required: true }]}>
                <InputNumber />
              </Form.Item>
              <span style={{ marginLeft: 20 }}>
                <Checkbox
                  checked={isIncrement}
                  onChange={(ev) => {
                    setIsIncrement(ev.target.checked);
                  }}
                >
                  <FormattedMessage id="monitor.simulator.incrementAdd" />
                </Checkbox>
              </span>
            </Row>
          </Form.Item>

          <Form.Item
            name={'batchcurrentDirection'}
            label={formatMessage({ id: 'app.direction' })}
            rules={[{ required: true }]}
          >
            <InputNumber min={0} max={359} />
          </Form.Item>
          <Form.Item {...formItemLayoutNoLabel}>
            <Button onClick={batchAddAGV}>
              <PlusOutlined /> <FormattedMessage id="app.button.add" />
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
}
export default connect(({ monitor }) => ({
  logicId: getCurrentLogicAreaData('monitor')?.id,
}))(memo(AddSimulatorAgv));
