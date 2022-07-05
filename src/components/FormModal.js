import React, { memo } from 'react';
import { Modal } from 'antd';

const FormModal = (props) => {
  const { children, ...rest } = props;
  return (
    <Modal
      closable={false}
      maskClosable={false}
      style={{ top: 30 }}
      bodyStyle={{ maxHeight: '80vh', overflow: 'auto' }}
      {...rest}
    >
      {children}
    </Modal>
  );
};
export default memo(FormModal);
