import React, { memo } from 'react';
import FormattedMessage from '@/components/FormattedMessage';
import { formatMessage } from '@/utils/util';
import { Modal, Button } from 'antd';

const RequestPayloadModal = (props) => {
  const { visible, data, onCancel } = props;

  return (
    <Modal
      destroyOnClose
      visible={visible}
      width={500}
      title={formatMessage({ id: 'operation.log.requestParam' })}
      onCancel={onCancel}
      style={{ top: 30 }}
      bodyStyle={{ height: '500px', overflow: 'auto' }}
      footer={[
        <Button key="back" onClick={onCancel}>
          <FormattedMessage id="app.button.close" />
        </Button>,
      ]}
    >
      <pre>{JSON.stringify(data, null, 4)} </pre>
    </Modal>
  );
};
export default memo(RequestPayloadModal);
