import React, { Component } from 'react';
import { Input, Modal } from 'antd';
import { formatMessage } from '@/utils/util';

export default class SetSeedNameModal extends Component {
  state = {
    enableSetting: false,
    name: null,
  };

  handleSettingName = () => {
    const { onOk } = this.props;
    const { name, enableSetting } = this.state;
    if (enableSetting) {
      onOk(name);
    }
  };

  handleCloseModal = () => {
    const { onCancel } = this.props;
    this.setState({ name: null }, onCancel);
  };

  onInputChanged = (ev) => {
    const name = ev.target.value;
    this.setState({
      name,
      enableSetting: name.trim() !== '',
    });
  };

  render() {
    const { visible } = this.props;
    const { enableSetting } = this.state;
    return (
      <Modal
        title={formatMessage({ id: 'app.report.naming' })}
        visible={visible}
        onOk={this.handleSettingName}
        okText={formatMessage({ id: 'app.button.confirm' })}
        okButtonProps={{ disabled: !enableSetting }}
        onCancel={this.handleCloseModal}
        destroyOnClose={true}
      >
        <Input allowClear onPressEnter={this.handleSettingName} onChange={this.onInputChanged} />
      </Modal>
    );
  }
}
