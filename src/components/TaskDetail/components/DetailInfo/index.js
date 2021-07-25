import React, { Component } from 'react';
import { Modal, Row, Button } from 'antd';
import { FormattedMessage } from '@/utils/Lang';

export default class DetailInfo extends Component {
  render() {
    const { visibleDetail, onClose, children, propsWidth } = this.props;
    return (
      <Modal
        destroyOnClose
        style={{ top: 30 }}
        closable={false}
        width={propsWidth}
        onCancel={onClose}
        footer={null}
        visible={visibleDetail}
      >
        <Row type="flex" justify="end">
          <Button type="primary" onClick={onClose}>
            <FormattedMessage id="app.taskDetail.close" />
          </Button>
        </Row>
        <div style={{ marginTop: 10 }}>{children}</div>
      </Modal>
    );
  }
}
