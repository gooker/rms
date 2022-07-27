import React, { Component } from 'react';
import { Button, Card } from 'antd';
import { dealResponse } from '@/utils/util';
import TimeZone from '@/components/TimeZone';
import FormattedMessage from '@/components/FormattedMessage';
import { fetchSystemTimeZone, setSystemTimeZone } from '@/services/commonService';

class SystemTimezone extends Component {
  state = {
    timeZone: null,
    loading: false,
  };

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    const timeZone = await fetchSystemTimeZone();
    if (!dealResponse(timeZone)) {
      this.setState({ timeZone: timeZone.systemTimeZone });
    }
  };

  submit = () => {
    const { timeZone } = this.state;
    this.setState({ loading: true });
    setSystemTimeZone(timeZone).then((res) => {
      if (!dealResponse(res, true)) {
        this.setState({ timeZone });
      }
      this.setState({ loading: false });
    });
  };

  render() {
    const { timeZone, loading } = this.state;
    return (
      <Card>
        <div style={{ textAlign: 'end', marginBottom: '10px' }}>
          <Button onClick={this.getData}>
            <FormattedMessage id='app.button.refresh' />
          </Button>
          <Button
            type='primary'
            loading={loading}
            onClick={this.submit}
            style={{ marginLeft: '10px' }}
          >
            <FormattedMessage id='app.button.submit' />
          </Button>
        </div>
        <TimeZone
          value={timeZone}
          defaultValue={timeZone}
          onChange={(value) => {
            this.setState({ timeZone: value });
          }}
        />
      </Card>
    );
  }
}
export default SystemTimezone;
