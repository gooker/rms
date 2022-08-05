import React, { memo } from 'react';
import { Modal } from 'antd';

const CommonModal = (props) => {
  const { children, ...rest } = props;
  return (
    <Modal
      destroyOnClose
      closable={false}
      maskClosable={false}
      keyboard={false}
      style={{ top: 30 }}
      bodyStyle={{ maxHeight: '80vh', overflow: 'auto' }}
      {...rest}
    >
      {children}
    </Modal>
  );
};
export default memo(CommonModal);
