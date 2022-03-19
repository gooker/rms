import React, { Component, useState, useEffect, forwardRef } from 'react';
import {
  Form,
  Row,
  Col,
  Checkbox,
  Card,
  InputNumber,
  Input,
  Select,
  TimePicker,
  Button,
  message,
  Spin,
  Switch,
} from 'antd';
import {
  fetchActiveMap,
  // fetchGetAllScopeActions,
  saveCleanLatentStrategy,
  getCleanStrategy,
} from '@/services/api';

import moment from 'moment';
import { dealResponse, isNull, analysisMapData, isStrictNull, formatMessage } from '@/utils/util';
// import DynamicForm from '../ChargeCenter/Components/DynamicForm';
// import { DynamicFormCol } from '../ChargeCenter/Components/DynamicForm';
import DesignArea from './components/DesignArea';
import CleaningDay from './components/CleaningDays';
import FormattedMessage from '@/components/FormattedMessage';

const formlayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const { Option } = Select;
const Days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

@Form.create()
class CleaningCenter extends Component {
  state = {
    loading: false,
    iconLoading: false, //保存按钮
    cleaningData: {},
    isOvertimeSkipFlag: false,
    normalScopeFLag: false,
    freeScopeFLag: false,
    scope: [],
    functionArea: [], //区域
  };

  async componentDidMount() {
    try {
      // this.getStrategy();
      // const response = await Promise.all([fetchActiveMap(), fetchGetAllScopeActions()]);
      //
      // // 获取scope
      // const [originalMapData, areasData] = response;
      // if (dealResponse(originalMapData) || dealResponse(areasData)) {
      //   message.error(formatMessage({ id: 'app.mapRecorder.fail' }));
      // } else {
      //   let scopeMap = {};
      //   if (originalMapData) {
      //     const { currentLogicArea } = analysisMapData(originalMapData);
      //     scopeMap = currentLogicArea?.routeMap || {};
      //   }
      //
      //   const functionAreaSet = new Set();
      //   areasData.forEach(({ sectionCellIdMap }) => {
      //     if (sectionCellIdMap) {
      //       Object.values(sectionCellIdMap).forEach((item) => {
      //         functionAreaSet.add(item);
      //       });
      //     }
      //   });
      //
      //   this.setState({ scope: Object.values(scopeMap), functionArea: [...functionAreaSet] });
      // }
    } catch (error) {
      // message.error(error);
    }
  }
  onSubmit = () => {
    const {
      form: { validateFields },
    } = this.props;
    const { isOvertimeSkipFlag, normalScopeFLag, freeScopeFLag } = this.state;
    validateFields((error, value) => {
      if (error) {
        const messageErr = Object.values(error);
        let _message = null;
        messageErr?.map((err, index) => {
          if (index === 0) {
            _message = err.errors[index].message;
          }
        });
        message.error(_message);
        return;
      }
      const currentValue = { ...value };
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
      currentValue.forbidTime = this.transformTime(forbidTime);
      currentValue.freeTime = this.transformTime(freeTime);
      currentValue.cleanAreas = this.transformDayAndTime(cleanAreas);

      this.saveStrategy(currentValue);
    });
  };
  // 保存时候转换
  transformDayAndTime = (cleanAreas) => {
    let result = [];
    if (cleanAreas && cleanAreas.length > 0) {
      cleanAreas.map((record) => {
        const { daytime, area = [], ...others } = record;
        let obj = { area, ...others };
        if (daytime != null) {
          obj.day = daytime[0] ? daytime[0] : null;
          obj.times = daytime[1] ? daytime[1] : null;
        }
        result.push(obj);
      });
    }
    return result;
  };
  transformTime = (dateTimes) => {
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
  };
  // end

  // 获取数据时候转换 禁止和空闲时段
  generateTime = (dateTimes) => {
    const fieldsValue = dateTimes?.map(({ startTime, endTime, weeks }) => {
      return {
        weeks,
        time: [startTime && moment(startTime, 'HH:mm'), endTime && moment(endTime, 'HH:mm')],
      };
    });
    return fieldsValue || [];
  };

  // 清扫天数和次数
  generateCleanAreas = (cleanDays) => {
    let daytime = [];
    if (cleanDays && cleanDays.length > 0) {
      cleanDays.map((record) => {
        const { day, times, ...others } = record;
        daytime.push({ ...others, daytime: [day, times] });
      });
    }
    return daytime;
  };

  //保存清扫策略
  saveStrategy = async (values) => {
    this.setState({ iconLoading: true });
    const { cleaningData } = this.state;
    let _id = cleaningData?.id;
    const saveRes = await saveCleanLatentStrategy({ ...values, id: _id }, _id);
    if (dealResponse(saveRes)) {
      message.error(formatMessage({ id: 'app.operate.fail' }));
    } else {
      message.success(formatMessage({ id: 'app.car.operationSucceeded' }));
      this.getStrategy();
    }
    this.setState({ iconLoading: false });
  };

  // 获取保存后的策略
  getStrategy = async () => {
    this.setState({ loading: true });
    // 获取清扫策略
    const cleaningRes = await getCleanStrategy();
    if (!dealResponse(cleaningRes)) {
      const currentCleaningRes = { ...cleaningRes };
      // 转换禁止和空闲时段数据
      currentCleaningRes.forbidTime = this.generateTime(cleaningRes?.forbidTime);
      currentCleaningRes.freeTime = this.generateTime(cleaningRes?.freeTime);
      currentCleaningRes.cleanAreas = this.generateCleanAreas(cleaningRes?.cleanAreas);
      this.setState({
        cleaningData: currentCleaningRes || {},
        isOvertimeSkipFlag: cleaningRes?.timeOutJump && cleaningRes?.timeOutJump > 0,
        normalScopeFLag: !isNull(cleaningRes?.normalScopeCode),
        freeScopeFLag: !isNull(cleaningRes?.freeTimeScopeCode),
      });
    } else {
      message.error(formatMessage({ id: 'cleaningCenter.data.fail' }));
    }
    this.setState({ loading: false });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const {
      loading,
      iconLoading,
      cleaningData,
      isOvertimeSkipFlag,
      normalScopeFLag,
      freeScopeFLag,
      scope,
      functionArea,
    } = this.state;
    return (
      <Spin spinning={loading}>
        <div
          style={{ padding: '20px', display: 'flex', overflow: 'auto', flexFlow: 'column wrap' }}
        >
          <Card>
            {/*
            <Form>
            <Row gutter={10}>
              <div style={{ margin: '15px 0px', display: 'flex', flexFlow: 'row nowrap' }}>
                <span>
                  <FormattedMessage id={'cleaninCenter.isOpen'} />:
                </span>
                <span style={{ margin: '0px 10px' }}>
                  {getFieldDecorator('isOpenStrategy', {
                    valuePropName: 'checked',
                    initialValue: cleaningData?.isOpenStrategy || false,
                  })(<Switch />)}
                </span>
              </div>
              <Row>
                <Input.Group compact>
                  <Form.Item>
                    {getFieldDecorator('isOvertimeSkipFlag', {
                      valuePropName: 'checked',
                      initialValue: isOvertimeSkipFlag || false,
                    })(
                      <Checkbox
                        onChange={(v) => {
                          this.setState({ isOvertimeSkipFlag: v.target.checked });
                        }}
                      >
                        <FormattedMessage id={'cleaninCenter.overtimeskip'} />
                      </Checkbox>,
                    )}
                  </Form.Item>

                  <Form.Item hidden={!isOvertimeSkipFlag}>
                    {getFieldDecorator('timeOutJump', {
                      initialValue: cleaningData?.timeOutJump || 10,
                      rules: [
                        {
                          pattern: /^[0-9]*$/,
                          message: formatMessage({
                            id: 'app.chargeManagement.timeIntervalRulesMessage',
                          }),
                        },
                      ],
                    })(<Input suffix={formatMessage({ id: 'app.chargeManagement.seconds' })} />)}
                  </Form.Item>
                </Input.Group>
              </Row>
              <Row>
                <Input.Group compact>
                  <Form.Item>
                    {getFieldDecorator('normalScopeFLag', {
                      valuePropName: 'checked',
                      initialValue: normalScopeFLag,
                    })(
                      <Checkbox
                        onChange={(v) => {
                          this.setState({ normalScopeFLag: v.target.checked });
                        }}
                      >
                        <FormattedMessage id={'cleaninCenter.normalScopeCode'} />
                      </Checkbox>,
                    )}
                  </Form.Item>

                  <Form.Item hidden={!normalScopeFLag}>
                    {getFieldDecorator('normalScopeCode', {
                      initialValue: cleaningData?.normalScopeCode,
                    })(
                      <Select style={{ width: '250px' }}>
                        {scope &&
                          scope.map((item) => (
                            <Option key={item?.code} value={item?.code}>
                              {item?.name}
                            </Option>
                          ))}
                      </Select>,
                    )}
                  </Form.Item>
                </Input.Group>
              </Row>
              <Row>
                <Input.Group compact>
                  <Form.Item>
                    {getFieldDecorator('freeScopeFLag', {
                      valuePropName: 'checked',
                      initialValue: freeScopeFLag,
                    })(
                      <Checkbox
                        onChange={(v) => {
                          this.setState({ freeScopeFLag: v.target.checked });
                        }}
                      >
                        <FormattedMessage id={'cleaninCenter.freeTimeScopeCode'} />
                      </Checkbox>,
                    )}
                  </Form.Item>

                  <Form.Item hidden={!freeScopeFLag}>
                    {getFieldDecorator('freeTimeScopeCode', {
                      initialValue: cleaningData?.freeTimeScopeCode,
                    })(
                      <Select style={{ width: '250px' }}>
                        {scope &&
                          scope.map((item) => (
                            <Option key={item?.code} value={item?.code}>
                              {item?.name}
                            </Option>
                          ))}
                      </Select>,
                    )}
                  </Form.Item>
                </Input.Group>
              </Row>
              <Row>
                <Col span={24} style={{ paddingRight: 10 }}>
                  <FormattedMessage id={'cleaninCenter.cleanAreas.set'} />
                </Col>
                <Col span={24}>
                  {getFieldDecorator('cleanAreas', {
                    initialValue: cleaningData?.cleanAreas || [],
                    rules: [
                      {
                        validator: async (rules, value, callBack) => {
                          let flag = true;
                          Array.isArray(value) &&
                            value?.forEach((element) => {
                              const { daytime } = element;
                              if (
                                isStrictNull(daytime) ||
                                isStrictNull(daytime[0]) ||
                                isStrictNull(daytime[1])
                              ) {
                                flag = false;
                                callBack(
                                  formatMessage({ id: 'cleaningCenter.cleanAreas.cycleRequired' }),
                                );
                              }
                            });
                          if (flag) {
                            callBack();
                          }
                        },
                      },
                    ],
                  })(
                    <DynamicForm
                      Formstyle={{ display: 'flex', flexWrap: 'wrap' }}
                      Rowstyle={{ display: 'flex', flexWrap: 'wrap', width: '480px' }}
                      data={cleaningData?.cleanAreas || []}
                    >
                      <DynamicFormCol field="area">
                        <DesignArea functionArea={functionArea} />
                      </DynamicFormCol>
                      <DynamicFormCol field="daytime">
                        <CleaningDay />
                      </DynamicFormCol>
                      <DynamicFormCol
                        field="isOnlyCleanLostCode"
                        valuePropName={{ valuePropName: 'checked' }}
                      >
                        <Checkbox>
                          <FormattedMessage id={'cleaninCenter.onlyCleanlostcode'} />
                        </Checkbox>
                      </DynamicFormCol>
                      <DynamicFormCol
                        field="isOnlyFreeTimeClean"
                        valuePropName={{ valuePropName: 'checked' }}
                      >
                        <Checkbox>
                          <FormattedMessage id={'cleaninCenter.onlyClean.free'} />
                        </Checkbox>
                      </DynamicFormCol>
                      <DynamicFormCol
                        field="cleanPriority"
                        col={{ span: 21 }}
                        formlayout={formlayout}
                        label={<FormattedMessage id="cleaninCenter.cleanPriority" />}
                        defaultValue={5}
                      >
                        <InputNumber style={{ marginLeft: 10 }} />
                      </DynamicFormCol>
                    </DynamicForm>,
                  )}
                </Col>
              </Row>
              <Row>
                <Col span={15} style={{ marginTop: 20 }}>
                  <div style={{ paddingBottom: 10 }}>
                    <FormattedMessage id={'cleaninCenter.forbidTime'} />
                  </div>
                  <div>
                    {getFieldDecorator('forbidTime', {
                      initialValue: cleaningData?.forbidTime || [],
                    })(
                      <DynamicForm data={cleaningData?.forbidTime || []}>
                        <DynamicFormCol field="time">
                          <TimeRangePick />
                        </DynamicFormCol>
                        <DynamicFormCol field="weeks">
                          <Checkbox.Group style={{ width: '100%', display: 'flex' }}>
                            {Days.map((item) => (
                              <Col key={item} span={3}>
                                <Checkbox value={item}>{item.slice(0, 3)}</Checkbox>
                              </Col>
                            ))}
                          </Checkbox.Group>
                        </DynamicFormCol>
                      </DynamicForm>,
                    )}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={15} style={{ marginTop: 20 }}>
                  <div style={{ paddingBottom: 10 }}>
                    <FormattedMessage id={'cleaninCenter.freeTime'} />
                  </div>

                  <div style={{ margin: '15px 0px', display: 'flex', flexFlow: 'row nowrap' }}>
                    <div style={{ lineHeight: '24px' }}>
                      {getFieldDecorator('useAgvStandByPercent', {
                        valuePropName: 'checked',
                        initialValue: cleaningData?.useAgvStandByPercent,
                      })(<Checkbox />)}
                    </div>
                    <div style={{ flex: 1, marginLeft: 25 }}>
                      <span>
                        <FormattedMessage id="app.freeTimeRule.pass" />
                      </span>
                      <span style={{ margin: '0px 10px' }}>
                        {getFieldDecorator('agvStandbyMinute', {
                          initialValue: cleaningData?.agvStandbyMinute,
                        })(<InputNumber min={0} size="small" />)}
                      </span>
                      <span>
                        <FormattedMessage id="app.freeTimeRule.min" />
                      </span>
                      <span style={{ margin: '0px 10px' }}>
                        <FormattedMessage id="app.freeTimeRule.agvStandbyPercent" />
                      </span>
                      <span>
                        {getFieldDecorator('agvStandbyPercent', {
                          initialValue: cleaningData?.agvStandbyPercent,
                        })(<InputNumber max={100} min={1} size="small" />)}
                      </span>
                      %
                    </div>
                  </div>

                  <div
                    style={{
                      margin: '15px 0px',
                      display: 'flex',
                      flexFlow: 'row nowrap',
                      lineHeight: '24px',
                    }}
                  >
                    <div style={{ lineHeight: '24px' }}>
                      {getFieldDecorator('useIdleHours', {
                        valuePropName: 'checked',
                        initialValue: cleaningData?.useIdleHours,
                      })(<Checkbox />)}
                    </div>
                    <div style={{ flex: 1, marginLeft: 25 }}>
                      <FormattedMessage id="app.freeTimeRule.tip" />
                    </div>
                  </div>

                  <div>
                    {getFieldDecorator('freeTime', {
                      initialValue: cleaningData?.freeTime || [],
                    })(
                      <DynamicForm data={cleaningData?.freeTime || []}>
                        <DynamicFormCol field="time">
                          <TimeRangePick />
                        </DynamicFormCol>
                        <DynamicFormCol field="weeks">
                          <Checkbox.Group style={{ width: '100%', display: 'flex' }}>
                            {Days.map((item) => (
                              <Col key={item} span={3}>
                                <Checkbox value={item}>{item.slice(0, 3)}</Checkbox>
                              </Col>
                            ))}
                          </Checkbox.Group>
                        </DynamicFormCol>
                      </DynamicForm>,
                    )}
                  </div>
                </Col>
              </Row>
            </Row>
            */}
            <Row
              style={{
                position: 'fixed',
                height: 60,
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                right: 20,
                bottom: 30,
              }}
            >
              <Button type="primary" loading={iconLoading} onClick={this.onSubmit}>
                <FormattedMessage id="form.save" />
              </Button>
            </Row>
            {/* </Form> */}
          </Card>
        </div>
      </Spin>
    );
  }
}
export default CleaningCenter;

{
  /*
const TimeRangePick = forwardRef((props, ref) => {
  const { value } = props;
  const [startDate, setStartDate] = useState(value ? value[0] : null);
  const [endDate, setEndDate] = useState(value ? value[1] : null);
  useEffect(() => {
    const { onChange } = props;
    if (onChange) {
      onChange([startDate, endDate]);
    }
  }, [startDate, endDate]);
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flex: 1,
      }}
      ref={ref}
    >
      <div>
        <TimePicker
          placeholder={formatMessage({ id: 'app.taskDetail.startTime' })}
          value={startDate}
          disabledHours={() => {
            const result = [];
            if (endDate != null && endDate.hours) {
              for (let index = 0; index < 23; index++) {
                if (index > endDate.hours()) {
                  result.push(index);
                }
              }
              return result;
            }
            return [];
          }}
          disabledMinutes={(selectedHour) => {
            const result = [];
            if (endDate != null && endDate.hours) {
              if (selectedHour == endDate.hours()) {
                for (let index = 0; index < 60; index++) {
                  if (index > endDate.minutes()) {
                    result.push(index);
                  }
                }
                return result;
              } else {
                return [];
              }
            }
          }}
          onChange={(value) => {
            setStartDate(value);
          }}
          format="HH:mm"
        />
      </div>
      <div style={{ padding: '0 10px' }}>-</div>
      <div>
        <TimePicker
          placeholder={formatMessage({ id: 'app.taskDetail.endTime' })}
          value={endDate}
          disabledHours={() => {
            const result = [];
            if (startDate != null && startDate.hours) {
              for (let index = 0; index < 23; index++) {
                if (index < startDate.hours()) {
                  result.push(index);
                }
              }
              return result;
            }
            return [];
          }}
          disabledMinutes={(selectedHour) => {
            const result = [];
            if (startDate != null && startDate.hours) {
              if (selectedHour == startDate.hours()) {
                for (let index = 0; index < 60; index++) {
                  if (index < startDate.minutes()) {
                    result.push(index);
                  }
                }
                return result;
              } else {
                return [];
              }
            }
          }}
          onChange={(value) => {
            setEndDate(value);
          }}
          format="HH:mm"
        />
      </div>
    </div>
  );
});
*/
}
