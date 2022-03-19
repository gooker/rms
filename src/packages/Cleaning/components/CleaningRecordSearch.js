import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, DatePicker, Icon } from 'antd';
import styles from '../index.module.less';
import { convertToUserTimezone } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';

const { RangePicker } = DatePicker;
// @Form.create({
//   onValuesChange(props, _, allValues) {
//     const { searchHandle } = props;
//     if (searchHandle) {
//       searchHandle(allValues);
//     }
//   },
// })
class CleaningRecordSearch extends Component {
  search = () => {
    const { form, searchData } = this.props;
    form.validateFields((error, values) => {
      const params = { current: 1, size: 10, ...values };
      if (values.cleaningDate != null && values.cleaningDate[0] && values.cleaningDate[1]) {
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
  };
  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className={styles.tableListForm}>
        <Form>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <Form.Item label={<FormattedMessage id="app.lock.cellId" />}>
                {getFieldDecorator('cellId')(<Input allowClear />)}
              </Form.Item>
            </Col>
            <Col md={8} sm={24}>
              <Form.Item
                label={<FormattedMessage id="cleaninCenter.cleaningtime" />}
                style={{ width: '100%' }}
              >
                {getFieldDecorator(
                  'cleaningDate',
                  {},
                )(<RangePicker showTime style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>

            <Col md={2} sm={24} style={{ textAlign: 'end' }}>
              <Form.Item>
                <Button type="primary" onClick={this.search}>
                  <Icon type="search" /> <FormattedMessage id="form.taskSearch" />
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
export default CleaningRecordSearch;
