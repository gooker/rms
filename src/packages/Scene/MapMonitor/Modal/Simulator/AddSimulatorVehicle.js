import React, { memo, useState } from 'react';
import { connect } from '@/utils/RmsDva';
import { Button, Checkbox, Divider, Form, InputNumber, Row } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { dealResponse, formatMessage, getFormLayout } from '@/utils/util';
import { getCurrentLogicAreaData } from '@/utils/mapUtil';
import { addSimulationVehicles } from '@/services/monitorService';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../../monitorLayout.module.less';
import { findVehicle } from '@/services/resourceService';
import AngleSelector from '@/components/AngleSelector';

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(8, 16);
const { formItemLayout: formItemLayout2, formItemLayoutNoLabel: formItemLayoutNoLabel2 } =
  getFormLayout(8, 16);

function AddSimulatorVehicle(props) {
  const { logicId, onCancel } = props;
  const [vehicleAdapter, vehicleType] = props.vehicleType.split('@');

  const [formRef] = Form.useForm();
  const [formRef2] = Form.useForm();
  const [executing, setExecuting] = useState(false);
  const [isIncrement, setIsIncrement] = useState(false); // 用于标记批量添加小车时候是否是增量添加

  function addVehicle() {
    formRef
      .validateFields()
      .then(async (value) => {
        setExecuting(true);
        const params = {
          vehicleAdapter,
          isSimulator: true,
          vehicleStatusDTO: { ...value, vehicleType },
        };
        const response = await findVehicle(params);
        if (!dealResponse(response, true)) {
          onCancel();
        }
        setExecuting(false);
      })
      .catch(() => {});
  }

  function batchAddVehicle() {
    formRef2
      .validateFields()
      .then((values) => {
        const params = {
          logicId,
          vehicleType,
          vehicleSize: values.vehicleSize,
          addFlag: isIncrement,
          currentDirection: values?.batchcurrentDirection,
        };
        addSimulationVehicles(params).then((res) => {
          if (!dealResponse(res, true)) {
            onCancel();
          }
        });
      })
      .catch(() => {});
  }

  return (
    <div style={{ marginTop: 20 }}>
      <Form labelWrap form={formRef} {...formItemLayout}>
        <div className={styles.rightSimulator}>
          <Divider orientation='left' style={{ margin: '12px 0' }}>
            <FormattedMessage id='monitor.simulator.addAMR' />
          </Divider>

          <Form.Item
            name={'vehicleId'}
            label={formatMessage({ id: 'vehicle.id' })}
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
            <AngleSelector allowInput={false} beforeWidth={90} />
          </Form.Item>

          <Form.Item {...formItemLayoutNoLabel}>
            <Button loading={executing} disabled={executing} onClick={addVehicle}>
              <PlusOutlined /> <FormattedMessage id="app.button.add" />
            </Button>
          </Form.Item>
        </div>
      </Form>

      {/* 批量添加 */}
      <Form labelWrap form={formRef2} {...formItemLayout2}>
        <div className={styles.rightSimulator}>
          <Divider orientation='left' style={{ margin: '12px 0' }}>
            <FormattedMessage id='monitor.operation.batchAdd' />
          </Divider>
          <Form.Item
            required
            label={formatMessage({ id: 'monitor.simulator.AMRCount' })}
            rules={[{ required: true }]}
          >
            <Row align={'middle'}>
              <Form.Item noStyle name={'vehicleSize'} rules={[{ required: true }]}>
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
          <Form.Item {...formItemLayoutNoLabel2}>
            <Button onClick={batchAddVehicle}>
              <PlusOutlined /> <FormattedMessage id='app.button.add' />
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
}
export default connect(({ monitor }) => ({
  logicId: getCurrentLogicAreaData('monitor')?.id,
}))(memo(AddSimulatorVehicle));
