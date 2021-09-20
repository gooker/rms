// @待废弃
import React from 'react';
import intl from 'react-intl-universal';
import { Radio } from 'antd';

class DirectionSelector extends React.PureComponent {
  onChange = (ev) => {
    this.props.onChange(ev.target.value);
  };

  render() {
    const { value } = this.props;
    return (
      <Radio.Group
        onChange={this.onChange}
        value={value}
        options={[
          {
            label: intl.formatMessage({ id: 'app.selectDirAngle.upper' }),
            value: 0,
          },
          {
            label: intl.formatMessage({ id: 'app.selectDirAngle.right' }),
            value: 90,
          },
          {
            label: intl.formatMessage({ id: 'app.selectDirAngle.Below' }),
            value: 180,
          },
          {
            label: intl.formatMessage({ id: 'app.selectDirAngle.left' }),
            value: 270,
          },
        ]}
        optionType="button"
      />
    );
  }
}
export default DirectionSelector;
