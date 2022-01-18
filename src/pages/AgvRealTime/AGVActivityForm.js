import React, { Component } from 'react';
import { Form, DatePicker, Col, Select, Row, Collapse } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { formatMessage } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';
import { GMT2UserTimeZone } from '@/utils/utils';
import Dictionary from '@/utils/Dictionary';
import { connect } from '@/utils/RcsDva';

const { Option } = Select;
const { Panel } = Collapse;
const { RangePicker } = DatePicker;

@connect(({ global }) => ({
  allTaskTypes: global.allTaskTypes,
}))
class AGVActivityForm extends Component {
  onValuesChange = (changedValues, allValues) => {
    const { onChange } = this.props;
    if (onChange) {
      if (allValues && allValues.createDate != null) {
        allValues.createTimeStart = GMT2UserTimeZone(allValues.createDate[0]).format(
          'YYYY-MM-DD HH:mm:ss',
        );
        allValues.createTimeEnd = GMT2UserTimeZone(allValues.createDate[1]).format(
          'YYYY-MM-DD HH:mm:ss',
        );
        delete allValues.createDate;
      }
      if (allValues && !allValues.createDate) {
        delete allValues.createDate;
      }
      onChange(allValues || {});
    }
  };

  render() {
    const { defaultValue, mode, disabled, agvType, allTaskTypes } = this.props;
    return (
      <Form
        layout="inline"
        onValuesChange={this.onValuesChange}
        style={{ width: '100%', padding: 0, display: 'block' }}
      >
        {mode === 'unexpanded' ? (
          <Row style={{ padding: '12px 16px' }}>
            <Col span={13}>
              <Form.Item
                label={formatMessage({ id: 'app.activity.searchTime' })}
                name="createDate"
                initialValue={defaultValue ? defaultValue.createDate : null}
              >
                <RangePicker
                  disabled={disabled}
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                />
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
                      <RangePicker
                        showTime={{ format: 'HH:mm' }}
                        format="YYYY-MM-DD HH:mm"
                        disabled={disabled}
                      />
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
                        disabled={disabled}
                        allowClear
                        mode="multiple"
                        maxTagTextLength={2}
                        maxTagCount={1}
                        options={(() => {
                          const specificAgvTaskTypes = allTaskTypes?.[agvType] || {};
                          return Object.keys(specificAgvTaskTypes).map((type) => ({
                            label: specificAgvTaskTypes[type],
                            value: type,
                            key: type,
                          }));
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
                        disabled={disabled}
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
                </Row>
              </Panel>
            </Collapse>
          </Row>
        )}
      </Form>
    );
  }
}
export default AGVActivityForm;
