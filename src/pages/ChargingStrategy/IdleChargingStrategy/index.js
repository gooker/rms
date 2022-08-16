import React, { memo, useEffect, useState } from 'react';
import moment from 'moment';
import { Button, Card, Checkbox, Col, Form, InputNumber, message, Row, TimePicker } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { formatMessage, isStrictNull, dealResponse } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { saveIdleHoursStrategy, fetchIdleHourChargeStrategy } from '@/services/resourceService';

import styles from './idleChargingStrategy.module.less';

const tailFormItemLayout = { wrapperCol: { offset: 1, span: 23 } };
const { RangePicker } = TimePicker;
const Days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

const IdleChargingStrategy = (props) => {
  const { idleHoursStrategyId, chargeStrategyId, form, onSave } = props;

  const [pastMinuts, setPastMinuts] = useState(null);
  const [percentage, setPercentage] = useState(null);
  const [useVehicleStandByPercent, setUseVehicleStandByPercent] = useState(false); // 第一条策略
  const [useIdleHours, setUseIdleHours] = useState(false); // 第二条策略

  useEffect(() => {
    if (!isStrictNull(idleHoursStrategyId)) {
      fetchIdleHourChargeStrategy({ Id: idleHoursStrategyId }).then((response) => {
        if (!dealResponse(response)) {
          const { idleHoursQuantumDTOS } = response;
          setPastMinuts(response.vehicleStandbyMinute);
          setPercentage(response.vehicleStandbyPercent);
          setUseVehicleStandByPercent(response.useVehicleStandByPercent);
          setUseIdleHours(response.useIdleHours);

          const fieldsValue = idleHoursQuantumDTOS?.map(({ startTime, endTime, weeks }) => {
            return {
              weeks,
              time: [startTime && moment(startTime, 'HH:mm'), endTime && moment(endTime, 'HH:mm')],
            };
          });
          form.setFieldsValue({ idleHoursQuantumDTOS: fieldsValue || [] });
        }
      });
    }
  }, []);

  function submit() {
    form.validateFields().then((values) => {
      const { idleHoursQuantumDTOS } = values;
      let result = null;
      if (idleHoursQuantumDTOS != null) {
        result = idleHoursQuantumDTOS.map((record) => {
          const { time, weeks } = record;
          const obj = { weeks };
          if (time != null) {
            obj.startTime = time[0] ? time[0].format('HH:mm') : null;
            obj.endTime = time[1] ? time[1].format('HH:mm') : null;
          }
          return obj;
        });
      }

      const requestBody = {
        id: idleHoursStrategyId,
        chargeStrategyId,
        idleHoursQuantumDTOS: result,
        vehicleStandbyMinute: pastMinuts,
        vehicleStandbyPercent: percentage,
        useVehicleStandByPercent,
        useIdleHours,
      };
      saveIdleHoursStrategy(requestBody).then((response) => {
        if (!dealResponse(response)) {
          message.success(formatMessage({ id: 'app.chargeStrategy.idle.save.success' }));
          onSave(response.id);
        }
      });
    });
  }

  return (
    <Card bordered={true} title={formatMessage({ id: 'app.chargeStrategy.idleHoursRules' })}>
      <div className={styles.strategyRow}>
        <div className={styles.checkBox}>
          <Checkbox
            checked={useVehicleStandByPercent}
            onChange={(ev) => {
              setUseVehicleStandByPercent(ev.target.checked);
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <FormattedMessage id="app.chargeStrategy.past" />
          <InputNumber style={{ margin: '0 10px' }} value={pastMinuts} onChange={setPastMinuts} />
          <FormattedMessage id="app.chargeStrategy.minute" />{' '}
          <FormattedMessage id="app.chargeStrategy.percentageOfFreeVehicle" />
          <InputNumber style={{ margin: '0 10px' }} value={percentage} onChange={setPercentage} />%
        </div>
      </div>
      <div className={styles.strategyRow}>
        <div className={styles.checkBox} style={{ alignItems: 'flex-start' }}>
          <Checkbox
            checked={useIdleHours}
            onChange={(ev) => {
              setUseIdleHours(ev.target.checked);
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <FormattedMessage id="app.chargeStrategy.idleTimeRangeTip" />
          <Form form={form}>
            <Form.List name={'idleHoursQuantumDTOS'}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Row
                      key={key}
                      style={{
                        border: '1px solid #e0dcdc',
                        padding: '25px 10px 0 0',
                        borderRadius: '5px',
                        marginBottom: '20px',
                      }}
                    >
                      <Col span={21}>
                        {/* 时间区间 */}
                        <Form.Item
                          {...tailFormItemLayout}
                          {...restField}
                          name={[name, 'time']}
                          fieldKey={[fieldKey, 'time']}
                        >
                          <RangePicker format={'HH:mm'} />
                        </Form.Item>

                        {/* 天 */}
                        <Form.Item
                          {...tailFormItemLayout}
                          {...restField}
                          name={[name, 'weeks']}
                          fieldKey={[fieldKey, 'weeks']}
                        >
                          <Checkbox.Group style={{ width: '100%', display: 'flex' }}>
                            {Days.map((item) => (
                              <Col key={item} span={3}>
                                <Checkbox value={item}>{item.slice(0, 3)}</Checkbox>
                              </Col>
                            ))}
                          </Checkbox.Group>
                        </Form.Item>
                      </Col>
                      <Col span={3} style={{ textAlign: 'center' }}>
                        <Button
                          type="danger"
                          icon={<MinusOutlined />}
                          onClick={() => remove(name)}
                        />
                      </Col>
                    </Row>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      <FormattedMessage id="app.button.add" />
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form>
        </div>
      </div>
    </Card>
  );
};
export default memo(IdleChargingStrategy);
