import React, { memo, useState } from 'react';
import { Button, Checkbox, Form, InputNumber, Radio, Select, Switch } from 'antd';
import { advancedLatnetHandling } from '@/services/monitorService';

import { dealResponse, formatMessage, getFormLayout } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../../monitorLayout.module.less';
import { SendOutlined } from '@ant-design/icons';

const inputWidth = { width: '100%' };
const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(5, 18);

const AdvancedCarryComponent = (props) => {
  const { dispatch, functionArea, vehicleList } = props;
  const [formRef] = Form.useForm();
  const [executing, setExecuting] = useState(false);
  const [currentVehicleAction, setCurrentVehicleAction] = useState(null);

  function close() {
    dispatch({ type: 'monitor/saveCategoryModal', payload: null });
  }

  function startCarry() {
    formRef
      .validateFields()
      .then((values) => {
        setExecuting(true);
        const params = {
          ...values,
          targetDirection: values.targetDirection === 5 ? null : values.targetDirection,
        };
        if (params.vehicleAction !== 'DOWN_POD') {
          params.isBackToRestCellId = false;
        }

        advancedLatnetHandling({ ...params }).then((response) => {
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
    <>
      <Form form={formRef} labelWrap className={styles.advancedForm} {...formItemLayout}>
        <Form.Item
          name={'loadId'}
          label={formatMessage({ id: 'object.load' })}
          rules={[{ required: true }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          name={'targetCellId'}
          label={formatMessage({ id: 'app.common.targetCell' })}
          rules={[{ required: true }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          name={'vehicleId'}
          label={formatMessage({ id: 'vehicle.id' })}
          rules={[{ required: true }]}
        >
          <Select allowClear showSearch style={{ width: 200 }}>
            {vehicleList.map(({ vehicleId, vehicleType, uniqueId }) => (
              <Select.Option key={`${vehicleId}-${vehicleType}`} value={uniqueId}>
                {`${vehicleId}-${vehicleType}`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name={'targetDirection'} label={formatMessage({ id: 'app.pod.direction' })}>
          <Radio.Group
            options={[
              { label: formatMessage({ id: 'app.pod.side.A' }), value: 0 },
              { label: formatMessage({ id: 'app.pod.side.B' }), value: 1 },
              { label: formatMessage({ id: 'app.pod.side.C' }), value: 2 },
              { label: formatMessage({ id: 'app.pod.side.D' }), value: 3 },
              {
                label: formatMessage({
                  id: 'monitor.pod.noRotation',
                }),
                value: 5, // 拿到值处理-为null
              },
            ]}
          />
        </Form.Item>

        <Form.Item
          name={'direction'}
          label={formatMessage({
            id: 'customTask.form.operatorDirection',
          })}
        >
          <Radio.Group
            options={[
              {
                label: formatMessage({
                  id: 'monitor.direction.topSide',
                }),
                value: 0,
              },
              {
                label: formatMessage({
                  id: 'monitor.direction.rightSide',
                }),
                value: 1,
              },
              {
                label: formatMessage({
                  id: 'monitor.direction.bottomSide',
                }),
                value: 2,
              },
              {
                label: formatMessage({
                  id: 'monitor.direction.leftSide',
                }),
                value: 3,
              },
            ]}
          />
        </Form.Item>

        <Form.Item
          name={'vehicleAction'}
          label={formatMessage({
            id: 'monitor.advancedCarry.arrivalStatus',
          })}
          getValueFromEvent={(e) => {
            setCurrentVehicleAction(e.target.value);
            return e.target.value;
          }}
        >
          <Radio.Group
            options={[
              {
                label: formatMessage({
                  id: 'monitor.advancedCarry.putDown',
                }),
                value: 'DOWN_POD',
              },
              {
                label: formatMessage({
                  id: 'monitor.advancedCarry.notPutDown',
                }),
                value: 'CARRY_POD',
              },
            ]}
          />
        </Form.Item>

        {currentVehicleAction === 'DOWN_POD' && (
          <Form.Item
            name={'isBackToRestCellId'}
            initialValue={false}
            valuePropName={'checked'}
            label={formatMessage({
              id: 'monitor.advancedCarry.toRestPoint',
            })}
          >
            <Switch
              checkedChildren={formatMessage({
                id: 'app.common.true',
              })}
              unCheckedChildren={formatMessage({
                id: 'app.common.false',
              })}
            />
          </Form.Item>
        )}

        <Form.Item
          name={'rotateCellId'}
          label={formatMessage({
            id: 'editor.cellType.rotation',
          })}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          name={'backZone'}
          label={formatMessage({ id: 'monitor.advancedCarry.backZone' })}
        >
          <Checkbox.Group>
            {functionArea?.map((item) => (
              <Checkbox key={item} value={item}>
                {item}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>

        <Form.Item
          name={'scopeCodes'}
          label={formatMessage({
            id: 'monitor.advancedCarry.scopeCode',
          })}
        >
          <Select mode="tags" style={{ width: '70%' }} />
        </Form.Item>

        <Form.Item {...formItemLayoutNoLabel}>
          <Button onClick={startCarry} loading={executing} disabled={executing} type="primary">
            <SendOutlined /> <FormattedMessage id={'app.button.execute'} />
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
export default memo(AdvancedCarryComponent);
