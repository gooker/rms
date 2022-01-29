import React, { Component } from 'react';
import FormattedMessage from '@/components/FormattedMessage';
import { Row, Input, Button } from 'antd';
import { isStrictNull } from '@/utils/util';

export default class PasteModal extends Component {
  state = {
    value: '',
  };

  onChange = (e) => {
    this.setState({ value: e.target.value });
  };
  submit = () => {
    const { value } = this.state;
    const { onAddEnvironment } = this.props;
    try {
      const serializeValue = JSON.parse(value);
      if (Array.isArray(serializeValue)) {
        const result = serializeValue.map((record) => {
          return {
            additionalInfos: record.additionalInfos,
            appCode: record.appCode,
            envName: record.envName,
            flag: 0,
          };
        });
        onAddEnvironment(...result);
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
        <Row>
          <Input.TextArea allowClear rows={5} onChange={this.onChange} />
        </Row>
        <Row style={{ marginTop: 20 }}>
          <Button type="primary" disabled={isStrictNull(value)} onClick={this.submit}>
            <FormattedMessage id="app.button.confirm" />
          </Button>
        </Row>
      </div>
    );
  }
}
