import React, { memo } from 'react';
import { Checkbox, DatePicker, Select, Form, Button, Row, Col } from 'antd';
import { formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../WaitingKpi.module.less';
import { SearchOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

const SearchConditionForm = (props) => {
  const { action, loading, isBaseHour } = props;
  const [formRef] = Form.useForm();

  function validate() {
    formRef.validateFields().then((values) => {
      action(values);
    });
  }

  const MomentRangeFormat = isBaseHour ? 'YYYY-MM-DD HH:00:00' : 'YYYY-MM-DD HH:mm:ss';
  return (
    <Form ref={formRef}>
      <Row gutter={10}>
        <Col>
          <Form.Item name={'dateRange'} rules={[{ required: true }]}>
            <RangePicker
              style={{ width: '375px' }}
              format={MomentRangeFormat}
              showTime={{ format: 'HH' }}
              renderExtraFooter={() => (
                <Checkbox checked={isBaseHour} disabled>
                  <FormattedMessage id="app.report.baseHour" />
                </Checkbox>
              )}
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name={'targetCells'} rules={[{ required: true }]}>
            <Select
              allowClear
              mode="tags"
              maxTagCount={4}
              notFoundContent={null}
              style={{ width: '281px' }}
              placeholder={formatMessage({ id: 'app.common.targetCell' })}
            />
          </Form.Item>
        </Col>
        <Col>
          <Button type="primary" onClick={validate} loading={loading}>
            <SearchOutlined /> {' '}<FormattedMessage id="app.button.search" />
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
export default memo(SearchConditionForm);
