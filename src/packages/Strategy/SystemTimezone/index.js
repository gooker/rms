import React, { Component } from 'react';
import { Card, Button } from 'antd';
import TimeZone from '@/components/TimeZone';
import FormattedMessage from '@/components/FormattedMessage';
import { fetchSystemParamByKey, updateSystemParams } from '@/services/api';
import { dealResponse } from '@/utils/util';

class SystemTimezone extends Component {
  state = {
    timeZone: null,
  };

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    const timeZone = await fetchSystemParamByKey('client_timezone_id');
    this.setState({ timeZone });
  };

  submit = () => {
    const { timeZone } = this.state;
    updateSystemParams({
      client_timezone_id: timeZone,
    }).then((res) => {
      if (!dealResponse(res, true)) {
        this.getData();
      }
    });
  };

  render() {
    const { timeZone } = this.state;
    return (
      <Card>
        <div style={{ textAlign: 'end', marginBottom: '10px' }}>
          <Button onClick={this.getData}>
            <FormattedMessage id="app.button.refresh" />
          </Button>
          <Button type="primary" onClick={this.submit} style={{ marginLeft: '10px' }}>
            <FormattedMessage id="app.button.submit" />
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
