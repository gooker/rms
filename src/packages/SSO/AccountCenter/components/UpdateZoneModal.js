import React, { Component } from 'react';
import { Button } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import TimeZone from '@/components/TimeZone';
import { isStrictNull } from '@/utils/util';

export default class UpdateZoneModal extends Component {
  state = {
    currentValue: null,
  };
  render() {
    const { currentValue } = this.state;
    const { zoneValue, onSubmit } = this.props;
    return (
      <div>
        <TimeZone
          defaultValue={zoneValue}
          onChange={(value) => {
            this.setState({
              currentValue: value,
            });
          }}
        />
        <Button
          disabled={isStrictNull(currentValue)}
          type="primary"
          onClick={() => {
            const { currentValue } = this.state;
            if (onSubmit) {
              onSubmit(currentValue);
            }
          }}
          style={{ width: '100%' }}
        >
          <FormattedMessage id="app.button.submit" />
        </Button>
      </div>
    );
  }
}
