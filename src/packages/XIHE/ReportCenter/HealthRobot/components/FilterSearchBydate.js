import React, { memo, useState } from 'react';
import { Row, Col, Form, Button, Select } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import DatePickerSelector from '../../components/DatePickerSelector';
import { isNull } from 'lodash';

const formLayout = { labelCol: { span: 6 }, wrapperCol: { span: 14 } };

const FilterSearchBytime = (props) => {
  const { refreshCharts, showCellId, showAgvId } = props;

  const [formRef] = Form.useForm();
  const [togglesDate, setTogglesDate] = useState(0);

  return (
    <div>
      {togglesDate === 1 ? (
        <>
          <Form form={formRef} {...formLayout}>
            <Form.Item hidden name={'startByTime'} />
            <Form.Item hidden name={'endByTime'} />
            <Row>
              <Col flex="auto">
                <Form.Item
                  label={<FormattedMessage id="app.form.dateRange" />}
                  name="timeRange"
                  getValueFromEvent={(value) => {
                    formRef.setFieldsValue({
                      startByTime: isNull(value) ? null : value[0].format('YYYY-MM-DD HH:mm:ss'),
                      endByTime: isNull(value) ? null : value[1].format('YYYY-MM-DD HH:mm:ss'),
                    });
                    return value;
                  }}
                >
                  <DatePickerSelector />
                </Form.Item>
              </Col>

              {showCellId && (
                <Col span={6}>
                  <Form.Item name={'cellId'} label={<FormattedMessage id="app.map.cell" />}>
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      maxTagTextLength={5}
                      maxTagCount={4}
                      allowClear
                    />
                  </Form.Item>
                </Col>
              )}
              {showAgvId && (
                <Col span={6}>
                  <Form.Item name={'agvId'} label={<FormattedMessage id="app.agv" />}>
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      maxTagTextLength={5}
                      maxTagCount={4}
                      allowClear
                    />
                  </Form.Item>
                </Col>
              )}
              <Col span={6}>
                <Button
                  onClick={() => {
                    formRef.validateFields().then((values) => {
                      refreshCharts(values);
                    });
                  }}
                >
                  <FormattedMessage id={'app.button.check'} />
                </Button>
              </Col>
            </Row>
          </Form>

          <Row>
            <Col span={24} style={{ padding: '10px 0', borderTop: '1px solid #e8e8e8' }}>
              <Button
                type="text"
                onClick={() => {
                  setTogglesDate(0);
                }}
              >
                <UpOutlined />
                <FormattedMessage id="app.reportCenter.packUp" />
              </Button>
            </Col>
          </Row>
        </>
      ) : (
        <Row>
          <Col span={24}>
            <Button
              type="text"
              style={{ padding: '10px 0' }}
              onClick={() => {
                setTogglesDate(1);
              }}
            >
              <DownOutlined />
              <FormattedMessage id="app.reportCenter.expand" />
            </Button>
          </Col>
        </Row>
      )}
    </div>
  );
};
export default memo(FilterSearchBytime);
