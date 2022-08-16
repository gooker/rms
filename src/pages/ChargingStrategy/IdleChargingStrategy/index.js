import React, { memo, useEffect } from 'react';
import moment from 'moment';
import { Button, Card, Checkbox, Col, Form, InputNumber, Row, TimePicker } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { formatMessage, isStrictNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { fetchIdleHourChargeStrategy } from '@/services/resourceService';

import styles from './idleChargingStrategy.module.less';

const tailFormItemLayout = { wrapperCol: { offset: 1, span: 23 } };
const { RangePicker } = TimePicker;
const Days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

const IdleChargingStrategy = (props) => {
  const { idleDetail, onChangeIdleStrategy, form } = props;

  useEffect(() => {
    if (!isStrictNull(idleDetail)) {
      const { idleHoursQuantumDTOS } = idleDetail;
      const fieldsValue = idleHoursQuantumDTOS?.map(({ startTime, endTime, weeks }) => {
        return {
          weeks,
          time: [startTime && moment(startTime, 'HH:mm'), endTime && moment(endTime, 'HH:mm')],
        };
      });
      form.setFieldsValue({ idleHoursQuantumDTOS: fieldsValue || [] });
    }
  }, []);

  return (
    <Card bordered={true} title={formatMessage({ id: 'app.chargeStrategy.idleHoursRules' })}>
      <div className={styles.strategyRow}>
        <div className={styles.checkBox}>
          <Checkbox
            checked={idleDetail?.useVehicleStandByPercent}
            onChange={(ev) => {
              onChangeIdleStrategy(ev.target.checked, 'useVehicleStandByPercent');
            }}
          />
        </div>
        <div>
          <FormattedMessage id="app.chargeStrategy.past" />
          <InputNumber
            style={{ margin: '0 10px' }}
            value={idleDetail?.pastMinuts}
            onChange={(ev) => {
              onChangeIdleStrategy(ev, 'pastMinuts');
            }}
          />
          <FormattedMessage id="app.chargeStrategy.minute" />{' '}
          <FormattedMessage id="app.chargeStrategy.percentageOfFreeVehicle" />
          <InputNumber
            style={{ margin: '0 10px' }}
            value={idleDetail?.percentage}
            onChange={(ev) => {
              onChangeIdleStrategy(ev, 'percentage');
            }}
          />
          %
        </div>
      </div>
      <div className={styles.strategyRow}>
        <div className={styles.checkBox} style={{ alignItems: 'flex-start' }}>
          <Checkbox
            checked={idleDetail?.useIdleHours}
            onChange={(ev) => {
              onChangeIdleStrategy(ev.target.checked, 'useIdleHours');
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
                        <Row>
                          <Col span={12}>
                            {/* 时间区间 */}
                            <Form.Item
                              {...tailFormItemLayout}
                              {...restField}
                              name={[name, 'time']}
                              fieldKey={[fieldKey, 'time']}
                            >
                              <RangePicker format={'HH:mm'} />
                            </Form.Item>
                          </Col>
                          <Col flex="1">
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
                        </Row>
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
