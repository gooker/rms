import React, { Component } from 'react';
import FormattedMessage from '@/components/FormattedMessage';
import { Button, Input } from 'antd';
import { getRandomString, isStrictNull } from '@/utils/util';

export default class PasteModal extends Component {
  state = {
    value: '',
  };

  onChange = (e) => {
    this.setState({ value: e.target.value });
  };

  submit = () => {
    const { value } = this.state;
    const { onPaste } = this.props;
    try {
      const serializeValue = JSON.parse(value);
      if (Array.isArray(serializeValue)) {
        const result = serializeValue.map((record) => ({
          ...record,
          id: getRandomString(10),
          flag: 0,
        }));
        onPaste(result);
      }
    } catch (e) {
      console.log('格式错误');
      return false;
    }
  };

  render() {
    const { value } = this.state;
    return (
      <div>
        <Input.TextArea allowClear style={{ height: 200 }} onChange={this.onChange} />
        <div style={{ marginTop: 20, textAlign: 'end' }}>
          <Button type="primary" disabled={isStrictNull(value)} onClick={this.submit}>
            <FormattedMessage id="app.button.confirm" />
          </Button>
        </div>
      </div>
    );
  }
}
