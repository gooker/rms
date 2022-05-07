import React, { memo } from 'react';
import { Form, Row, Col, Input, Button, DatePicker, Icon } from 'antd';
import styles from '../index.module.less';
import { convertToUserTimezone, isNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';

const { RangePicker } = DatePicker;
const CleaningRecordSearch = (props) => {
  const { form, searchData } = props;
  function search() {
    form.validateFields((error, values) => {
      const params = { current: 1, size: 10, ...values };
      if (!isNull(values.cleaningDate) && values.cleaningDate[0] && values.cleaningDate[1]) {
        params.cleaningTimeStart = convertToUserTimezone(values.cleaningDate[0], 1).format(
          'YYYY-MM-DD HH:mm:ss',
        );
        params.cleaningTimeEnd = convertToUserTimezone(values.cleaningDate[1], 1).format(
          'YYYY-MM-DD HH:mm:ss',
        );
        delete params.cleaningDate;
      }
      searchData(params);
    });
  }

  return (
    <div className={styles.tableListForm}>
      <Form>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <Form.Item label={<FormattedMessage id="app.map.cell" />} name="cellId">
              <Input allowClear />
            </Form.Item>
          </Col>
          <Col md={12} sm={24}>
            <Form.Item
              label={<FormattedMessage id="cleaninCenter.cleaningtime" />}
              name="cleaningDate"
              style={{ width: '100%' }}
            >
              <RangePicker showTime style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col md={2} sm={24} style={{ textAlign: 'end' }}>
            <Form.Item>
              <Button type="primary" onClick={search}>
                <Icon type="search" /> <FormattedMessage id="app.button.search" />
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
export default memo(CleaningRecordSearch);
