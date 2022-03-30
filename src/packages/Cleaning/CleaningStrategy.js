import React, { memo, useEffect, useState } from 'react';
import {
  Form,
  Button,
  Input,
  Switch,
  Spin,
  Row,
  Checkbox,
  Select,
  Col,
  TimePicker,
  InputNumber,
  message,
} from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getCleanStrategy, saveCleanLatentStrategy } from '@/services/api';
import { fetchAllScopeActions } from '@/services/monitor';
import { dealResponse, formatMessage, getFormLayout, isNull, isStrictNull } from '@/utils/util';
import { getCurrentLogicAreaData } from '@/utils/mapUtil';
import DesignArea from './components/DesignArea';
import CleaningDays from './components/CleaningDays';
import FormattedMessage from '@/components/FormattedMessage';
import commonStyles from '@/common.module.less';
import styles from './index.module.less';

const { formItemLayoutNoLabel } = getFormLayout(6, 16);
const tailFormItemLayout = { wrapperCol: { offset: 1, span: 23 } };
const { RangePicker } = TimePicker;
const Days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

const CleaningStrategy = (props) => {
  const [formRef] = Form.useForm();
  const [executing, setExecuting] = useState(false);
  const [cleaningData, setCleaningData] = useState({});
  const [scope, setScope] = useState([]);
  const [functionArea, setFunctionArea] = useState([]);

  const [isOvertimeSkipFlag, setIsOvertimeSkipFlag] = useState(false);
  const [normalScopeFLag, setNormalScopeFLag] = useState(false);
  const [freeScopeFLag, setFreeScopeFLag] = useState(false);

  const [pastMinuts, setPastMinuts] = useState(null);
  const [percentage, setPercentage] = useState(null);
  const [useAgvStandByPercent, setUseAgvStandByPercent] = useState(false); // 第一条策略
  const [useIdleHours, setUseIdleHours] = useState(false); //空闲时段-允许默认时间段

  useEffect(() => {
    async function init() {
      getStrategy();
      await getScope();
    }
    init();
  }, []);

  async function getScope() {
    try {
      const areasData = await fetchAllScopeActions();
      // 获取scope
      if (dealResponse(areasData)) {
        message.error(formatMessage({ id: 'app.mapRecorder.fail' }));
      } else {
        const currentLogicArea = getCurrentLogicAreaData('monitor');
        const scopeMap = currentLogicArea?.routeMap || {};

        const functionAreaSet = new Set();
        areasData.forEach(({ sectionCellIdMap }) => {
          if (sectionCellIdMap) {
            Object.values(sectionCellIdMap).forEach((item) => {
              functionAreaSet.add(item);
            });
          }
        });
        setScope(Object.values(scopeMap));
        setFunctionArea([...functionAreaSet]);
      }
    } catch (error) {}
  }

  // 获取保存后的策略
  async function getStrategy() {
    setExecuting(true);
    // 获取清扫策略
    const cleaningRes = await getCleanStrategy();
    if (!dealResponse(cleaningRes)) {
      const currentCleaningRes = { ...cleaningRes };
      // 转换禁止和空闲时段数据
      currentCleaningRes.forbidTime = generateTime(cleaningRes?.forbidTime);
      currentCleaningRes.freeTime = generateTime(cleaningRes?.freeTime);
      setCleaningData(currentCleaningRes || {});
      setIsOvertimeSkipFlag(cleaningRes?.timeOutJump && cleaningRes?.timeOutJump > 0);
      setNormalScopeFLag(!isNull(cleaningRes?.normalScopeCode));
      setFreeScopeFLag(!isNull(cleaningRes?.freeTimeScopeCode));

      setPastMinuts(cleaningRes?.agvStandbyMinute);
      setPercentage(cleaningRes?.agvStandbyPercent);
      setUseAgvStandByPercent(cleaningRes?.useAgvStandByPercent);
      setUseIdleHours(cleaningRes?.useIdleHours);
    } else {
      message.error(formatMessage({ id: 'cleaningCenter.data.fail' }));
    }
    setExecuting(false);
  }

  function generateTime(dateTimes) {
    const fieldsValue = dateTimes?.map(({ startTime, endTime, weeks }) => {
      return {
        weeks,
        time: [startTime && moment(startTime, 'HH:mm'), endTime && moment(endTime, 'HH:mm')],
      };
    });
    return fieldsValue || [];
  }

  function transformTime(dateTimes) {
    let result = [];
    if (dateTimes != null) {
      dateTimes.map((record) => {
        const { time, weeks = [] } = record;
        if (time != null && !isStrictNull(time[0]) && !isStrictNull(time[1]) && weeks.length > 0) {
          let obj = { weeks };
          obj.endTime = time[1] ? time[1].format('HH:mm') : null;
          obj.startTime = time[0] ? time[0].format('HH:mm') : null;
          result.push(obj);
        }
      });
    }
    return result;
  }

  function validateAreas(area) {
    if (area.filter(Boolean).length === 0) {
      return Promise.resolve();
    }

    // 判断day或者times有没有空白
    for (let i = 0; i < area.length; i++) {
      const currentItem = area[i];
      if (isStrictNull(currentItem.day) || isStrictNull(currentItem.times)) {
        message.error(formatMessage({ id: 'cleaningCenter.cleanAreas.cycleRequired' }));
        return;
      }
    }

    return Promise.resolve();
  }

  function onSubmit() {
    formRef
      .validateFields()
      .then((value) => {
        const currentValue = { ...value };
        if (validateAreas(value.cleanAreas)) {
          const { forbidTime, freeTime, cleanAreas } = value;
          if (!isOvertimeSkipFlag) {
            currentValue.timeOutJump = null;
          }
          if (!normalScopeFLag) {
            currentValue.normalScopeCode = null;
          }
          if (!freeScopeFLag) {
            currentValue.freeTimeScopeCode = null;
          }
          currentValue.forbidTime = transformTime(forbidTime);
          currentValue.freeTime = transformTime(freeTime);

          currentValue.cleanAreas = cleanAreas?.map((record) => {
            const { cleanPriority } = record;
            return { ...record, cleanPriority: cleanPriority ?? 5 };
          });

          currentValue.agvStandbyMinute = pastMinuts;
          currentValue.agvStandbyPercent = percentage;
          currentValue.useAgvStandByPercent = useAgvStandByPercent;
          currentValue.useIdleHours = useIdleHours;
          console.log(currentValue);
          return;
          saveStrategy(currentValue);
        }
      })
      .catch((err) => {});
  }

  async function saveStrategy(values) {
    setExecuting(true);
    let _id = cleaningData?.id;
    const saveRes = await saveCleanLatentStrategy({ ...values, id: _id }, _id);
    if (dealResponse(saveRes)) {
      message.error(formatMessage({ id: 'app.message.operateFailed' }));
    } else {
      message.success(formatMessage({ id: 'app.message.operateSuccess' }));
      this.getStrategy();
    }

    setExecuting(false);
  }

  return (
    <div className={commonStyles.commonPageStyle}>
      <Spin spinning={executing}>
        <div className={styles.cleanStrategy}>
          <Form labelWrap form={formRef}>
            <Form.Item
              name={'isOpenStrategy'}
              label={formatMessage({ id: 'app.notification.isOpen' })}
              valuePropName={'checked'}
              initialValue={cleaningData?.isOpenStrategy || false}
            >
              <Switch />
            </Form.Item>
            <Row>
              <Input.Group compact>
                <Form.Item
                  name={'isOvertimeSkipFlag'}
                  valuePropName={'checked'}
                  initialValue={isOvertimeSkipFlag || false}
                  getValueFromEvent={(v) => {
                    setIsOvertimeSkipFlag(v.target.checked);
                    return v.target.checked;
                  }}
                >
                  <Checkbox>
                    <FormattedMessage id={'cleaninCenter.overtimeskip'} />
                  </Checkbox>
                </Form.Item>

                {isOvertimeSkipFlag && (
                  <Form.Item
                    name={'timeOutJump'}
                    initialValue={cleaningData?.timeOutJump || 10}
                    rules={[
                      {
                        pattern: /^[0-9]*$/,
                        message: formatMessage({
                          id: 'lockManage.robot.number.required',
                        }),
                      },
                    ]}
                  >
                    <Input suffix={formatMessage({ id: 'app.time.seconds' })} />
                  </Form.Item>
                )}
              </Input.Group>
            </Row>

            <Row>
              <Input.Group compact>
                <Form.Item
                  name={'normalScopeFLag'}
                  valuePropName={'checked'}
                  initialValue={normalScopeFLag}
                  getValueFromEvent={(v) => {
                    setNormalScopeFLag(v.target.checked);
                    return v.target.checked;
                  }}
                >
                  <Checkbox>
                    <FormattedMessage id={'cleaninCenter.normalScopeCode'} />
                  </Checkbox>
                </Form.Item>

                {normalScopeFLag && (
                  <Form.Item name={'normalScopeCode'} initialValue={cleaningData?.normalScopeCode}>
                    <Select style={{ width: '250px' }}>
                      {scope?.map((item) => (
                        <Select.Option key={item?.code} value={item?.code}>
                          {item?.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}
              </Input.Group>
            </Row>
            <Row>
              <Input.Group compact>
                <Form.Item
                  name={'freeScopeFLag'}
                  valuePropName={'checked'}
                  initialValue={freeScopeFLag}
                  getValueFromEvent={(e) => {
                    const value = e.target.checked;
                    setFreeScopeFLag(value);
                    return value;
                  }}
                >
                  <Checkbox>
                    <FormattedMessage id={'cleaninCenter.freeTimeScopeCode'} />
                  </Checkbox>
                </Form.Item>
                {freeScopeFLag && (
                  <Form.Item
                    name={'freeTimeScopeCode'}
                    initialValue={cleaningData?.freeTimeScopeCode}
                  >
                    <Select style={{ width: '250px' }}>
                      {scope.map((item) => (
                        <Select.Option key={item?.code} value={item?.code}>
                          {item?.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}
              </Input.Group>
            </Row>
            {/* 清扫区域设置 */}
            <Form.Item label={formatMessage({ id: 'cleaninCenter.cleanAreas.set' })}>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                <Form.List name="cleanAreas" initialValue={cleaningData?.cleanAreas || [{}]}>
                  {(fields, { add, remove }, { errors }) => (
                    <>
                      {fields.map((field, index) => (
                        <Row
                          key={`${field.key}`}
                          style={{
                            border: '1px solid #e0dcdc',
                            padding: '10px',
                            borderRadius: '5px',
                            marginBottom: '20px',
                            marginLeft: 20,
                            display: 'flex',
                            flexWrap: 'wrap',
                            width: '480px',
                          }}
                        >
                          <Col span={22}>
                            <Form.Item noStyle {...field} key={[field.fieldKey, 'area']}>
                              <DesignArea functionArea={functionArea} />
                            </Form.Item>
                            <Form.Item noStyle {...field} key={[field.fieldKey, 'day']}>
                              <CleaningDays />
                            </Form.Item>

                            <Form.Item
                              valuePropName={'checked'}
                              name={[field.name, 'isOnlyCleanLostCode']}
                              fieldKey={[field.fieldKey, 'isOnlyCleanLostCode']}
                            >
                              <Checkbox>
                                <FormattedMessage id={'cleaninCenter.onlyCleanlostcode'} />
                              </Checkbox>
                            </Form.Item>

                            <Form.Item
                              valuePropName={'checked'}
                              name={[field.name, 'isOnlyFreeTimeClean']}
                              fieldKey={[field.fieldKey, 'isOnlyFreeTimeClean']}
                            >
                              <Checkbox>
                                <FormattedMessage id={'cleaninCenter.onlyClean.free'} />
                              </Checkbox>
                            </Form.Item>

                            <Form.Item
                              {...field}
                              label={<FormattedMessage id="cleaninCenter.cleanPriority" />}
                              initialValue={5}
                              name={[field.name, 'cleanPriority']}
                              fieldKey={[field.fieldKey, 'cleanPriority']}
                            >
                              <InputNumber style={{ marginLeft: 10 }} />
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
                      <Form.Item noStyle >
                        <Button block type="dashed" onClick={() => add()}>
                          <PlusOutlined /> <FormattedMessage id="app.button.add" />
                        </Button>
                        {/* <Form.ErrorList errors={errors} /> */}
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </div>
            </Form.Item>

            {/* 禁止时段 */}
            <Form.Item label={formatMessage({ id: 'cleaninCenter.forbidTime' })}>
              <Form.List name={'forbidTime'} initialValue={cleaningData?.forbidTime || []}>
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
                            icon={<DeleteOutlined />}
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
            </Form.Item>

            {/* 空闲时段 */}
            <Form.Item label={formatMessage({ id: 'cleaninCenter.freeTime' })}>
              <div className={styles.strategyRow} style={{ marginLeft: 20 }}>
                <div className={styles.checkBox}>
                  <Checkbox
                    checked={useAgvStandByPercent}
                    onChange={(ev) => {
                      setUseAgvStandByPercent(ev.target.checked);
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <FormattedMessage id="app.chargeStrategy.past" />
                  <InputNumber
                    style={{ margin: '0 10px' }}
                    value={pastMinuts}
                    onChange={setPastMinuts}
                  />
                  <FormattedMessage id="app.chargeStrategy.minute" />{' '}
                  <FormattedMessage id="app.chargeStrategy.percentageOfFreeAgv" />
                  <InputNumber
                    style={{ margin: '0 10px' }}
                    value={percentage}
                    onChange={setPercentage}
                  />
                  %
                </div>
              </div>

              <div className={styles.strategyRow}>
                <div
                  className={styles.checkBox}
                  style={{ alignItems: 'flex-start', marginLeft: 20 }}
                >
                  <Checkbox
                    checked={useIdleHours}
                    onChange={(ev) => {
                      setUseIdleHours(ev.target.checked);
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <FormattedMessage id="app.chargeStrategy.idleTimeRangeTip" />
                  <Form.List name={'freeTime'} initialValue={cleaningData?.freeTime || []}>
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, fieldKey, ...restField }) => (
                          <Row
                            key={key}
                            style={{
                              border: '1px solid #e0dcdc',
                              padding: '25px 10px 0 0',
                              borderRadius: '5px',
                              margin: '10px 0 20px 0',
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
                                icon={<DeleteOutlined />}
                                onClick={() => remove(name)}
                              />
                            </Col>
                          </Row>
                        ))}
                        <Form.Item style={{ marginTop: 10 }}>
                          <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                            <FormattedMessage id="app.button.add" />
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </div>
              </div>
            </Form.Item>

            <Form.Item {...formItemLayoutNoLabel}>
              <Row
                style={{
                  position: 'fixed',
                  height: 60,
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  right: 30,
                  bottom: 30,
                }}
              >
                <Button type="primary" loading={executing} onClick={onSubmit}>
                  <FormattedMessage id="app.button.save" />
                </Button>
              </Row>
            </Form.Item>
          </Form>
        </div>
      </Spin>
    </div>
  );
};
export default memo(CleaningStrategy);
