import React, { memo, useEffect } from 'react';
import { Row, Col, Form, Button } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import SelectCarType from './SelectCarType';
import TimePickerSelector from '../../components/timePicker';

const NoLabelFormLayout = { wrapperCol: { offset: 10, span: 12 } };

const LogSearchForm = (props) => {
  const { search } = props;

  const [form] = Form.useForm();

  useEffect(() => {
    function init() {}
    init();
  }, []);

  function submitSearch() {
    form.validateFields().then((values) => {
      search(values);
    });
  }

  // 分车数据
  const OptionsData = [
    {
      code: 'AGV',
      name: <FormattedMessage id="app.customTask.form.SPECIFY_AGV" />,
      value: {},
    },
    {
      code: 'AGV_GROUP',
      name: <FormattedMessage id="app.customTask.form.SPECIFY_GROUP" />,
      value: {}, //modelTypes?.AGV_GROUP.options ?? {},
    },
    {
      code: 'AGV_TYPE',
      name: <FormattedMessage id="app.common.type" />,
      value: {}, //modelTypes?.AGV_GROUP.options ?? {},
    },
  ];

  return (
    <Form form={form}>
      <Form.Item hidden name={'startTime'} />
      <Form.Item hidden name={'endTime'} />
      <Row gutter={24}>
        {/* 日期 */}
        <Col>
          <Form.Item
            name={'timeNum'}
            label={<FormattedMessage id="app.form.dateRange" />}
            getValueFromEvent={(value) => {
              const { setFieldsValue } = form;
              setFieldsValue({
                startTime: value.startTime,
                endTime: value.endTime,
                type: value.dateType,
                timeNum: value.timeDate,
              });
              return value.timeDate;
            }}
          >
            <TimePickerSelector defaultType={'hour'} defaultTime={7}  />
            {/* disabledChangeType={true} */}
          </Form.Item>
        </Col>

        <Col>
          {/* 分小车 */}
          <Form.Item name={'robot'} label={'小车'} initialValue={{ type: 'AGV', code: [] }}>
            <SelectCarType data={OptionsData} />
          </Form.Item>
          ,
        </Col>

        <Col>
          <Form.Item {...NoLabelFormLayout}>
            <Row justify="end">
              <Button type="primary" onClick={submitSearch}>
                <FormattedMessage id="app.button.search" />
              </Button>
            </Row>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item {...NoLabelFormLayout}>
            <Row justify="end">
              <Button>
                <FormattedMessage id="app.button.save" />
              </Button>
            </Row>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
export default memo(LogSearchForm);
