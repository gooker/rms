import React from 'react';
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

class ControlledRangePicker extends React.Component {
  state = {
    value: [],
  };

  handlePanelChange = (value) => {
    this.handleChange(value);
  };

  renderDatePick = (model, value) => {
    if (model === 'hour') {
      return (
        <RangePicker
          style={{ width: '100%' }}
          value={value}
          showTime
          onChange={this.handleChange}
          size="small"
        />
      );
    } else if (model === 'month') {
      return (
        <RangePicker
          style={{ width: '100%' }}
          value={value}
          showTime
          format="YYYY-MM"
          mode={['month', 'month']}
          onPanelChange={this.handlePanelChange}
          size="small"
        />
      );
    } else {
      return (
        <RangePicker
          style={{ width: '100%' }}
          value={value}
          onChange={this.handleChange}
          size="small"
        />
      );
    }
  };

  handleChange = (value) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };

  render() {
    const { datePattern } = this.props;
    const { value } = this.props;
    return this.renderDatePick(datePattern, value);
  }
}
export default ControlledRangePicker;
