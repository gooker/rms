import React, { Component } from 'react';
import { Form, InputNumber } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import { isNull } from '@/utils/util';

class CleaningDay extends Component {
  state = {
    day: null,
    times: null,
  };
  componentDidMount() {
    const { value } = this.props;
    if (isNull(value)) return;
    this.setState({ day: value[0], times: value[1] });
  }
  render() {
    const { day, times } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div
        style={{
          height: '40px',
          lineHeight: '40px',
          display: 'flex',
          flex: 1,
          flexFlow: 'row nowrap',
        }}
      >
        <Form.Item>
          {getFieldDecorator('day', {
            initialValue: day,
          })(<InputNumber style={{ marginLeft: 10 }} />)}
        </Form.Item>
        <span style={{ lineHeight: '40px' }}>
          <FormattedMessage id="cleaninCenter.day" />{' '}
          <FormattedMessage id="cleaninCenter.cleaning" />
          {/* <FormattedMessage id="cleaninCenter.inside" /> */}
        </span>

        <Form.Item>
          {getFieldDecorator('times', {
            initialValue: times,
          })(<InputNumber style={{ marginLeft: 10 }} />)}
        </Form.Item>

        <span style={{ lineHeight: '40px' }}>
          {' '}
          <FormattedMessage id="cleaninCenter.times" />
        </span>
      </div>
    );
  }
}
export default CleaningDay;
