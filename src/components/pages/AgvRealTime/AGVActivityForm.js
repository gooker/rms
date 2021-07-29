import React, { Component } from 'react';
import { Form, DatePicker, Col, Select, Row, Collapse } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { formatMessage, FormattedMessage } from '@/utils/Lang';
import { dateFormat } from '@/utils/utils';
import Dictionary from '@/utils/Dictionary';

const { Option } = Select;
const { Panel } = Collapse;
const { RangePicker } = DatePicker;
class AGVActivityForm extends Component {
  onValuesChange = (changedValues, allValues) => {
    const { onChange } = this.props;
    if (onChange) {
      if (allValues && allValues.createDate != null) {
        allValues.createTimeStart = dateFormat(allValues.createDate[0], 1).format(
          'YYYY-MM-DD HH:mm:ss',
        );
        allValues.createTimeEnd = dateFormat(allValues.createDate[1], 1).format(
          'YYYY-MM-DD HH:mm:ss',
        );
        delete allValues.createDate;
      }
      if (allValues && !allValues.createDate) delete allValues.createDate;
      onChange(allValues || {});
    }
  };
  render() {
    const { defaultValue, mode } = this.props;

    return (
      <div>
        <Form
          layout="inline"
          onValuesChange={this.onValuesChange}
          style={{width: '100%', padding: 0,display:"block" }}
        >
          {mode === 'unexpanded' ? (
            <Row style={{ padding: '12px 16px' }}>
              <Col span={13}>
                <Form.Item
                  label={formatMessage({ id: 'app.activity.searchTime' })}
                  name="createDate"
                  initialValue={defaultValue ? defaultValue.createDate : null}
                >
                  <RangePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" />
                </Form.Item>
              </Col>
            </Row>
          ) : (
            <Row>
              <Collapse
                style={{ width: '100%' }}
                bordered={false}
                expandIconPosition="right"
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
              >
                <Panel
                  style={{
                    borderBottom: '1px solid transparent',
                    width: '100% !important',
                  }}
                  header={
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Form.Item
                        label={formatMessage({ id: 'app.activity.searchTime' })}
                        name="createDate"
                        initialValue={defaultValue ? defaultValue.createDate : null}
                      >
                        <RangePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" />
                      </Form.Item>
                    </span>
                  }
                  key="1"
                >
                  <Row>
                    <Col span={12}>
                      <Form.Item
                        label={formatMessage({ id: 'app.task.type' })}
                        name="agvTaskType"
                        initialValue={defaultValue ? defaultValue.agvTaskType : []}
                      >
                        <Select
                          mode="multiple"
                          allowClear
                          maxTagTextLength={2}
                          maxTagCount={1}
                          options={(function () {
                            const data = [];
                            const toteAgvTaskType = Dictionary('agvTaskType');
                            for (const key in toteAgvTaskType) {
                              if (toteAgvTaskType.hasOwnProperty(key)) {
                                const element = toteAgvTaskType[key];
                                data.push({
                                  label: formatMessage({ id: element }),
                                  value: key,
                                  key: key,
                                });
                              }
                            }
                            return data;
                          })()}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label={formatMessage({ id: 'app.task.state' })}
                        name="taskStatus"
                        initialValue={defaultValue ? defaultValue.activitySearchParams : []}
                      >
                        <Select
                          mode="multiple"
                          allowClear
                          maxTagTextLength={2}
                          maxTagCount={1}
                        >
                          <Option key="New" value="New">
                            <FormattedMessage id="app.activity.TaskNew" />
                          </Option>
                          <Option key="Executing" value="Executing">
                            <FormattedMessage id="app.activity.TaskExecuting" />
                          </Option>
                          <Option key="Finished" value="Finished">
                            <FormattedMessage id="app.activity.TaskFinished" />
                          </Option>
                          <Option key="Error" value="Error">
                            <FormattedMessage id="app.activity.TaskError" />
                          </Option>
                          <Option key="Cancel" value="Cancel">
                            <FormattedMessage id="app.button.cancel" />
                          </Option>
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col></Col>
                  </Row>
                </Panel>
              </Collapse>
            </Row>
          )}
        </Form>
      </div>
    );
  }
}

export default AGVActivityForm;
