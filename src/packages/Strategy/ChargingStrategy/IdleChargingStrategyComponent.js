/* TODO: I18N */
import React, { memo, useEffect, useState } from 'react';
import { Modal } from 'antd';
import { isNull } from '@/utils/util';
import { fetchChargingStrategyById } from '@/services/resourceService';

const IdleChargingStrategy = (props) => {
  const { title, visible, data } = props;
  const { onOk, onCancel } = props;

  const [configuration, setConfiguration] = useState([]);

  useEffect(() => {
    if (visible) {
      const configurations = fetchChargingStrategyById({ id: data.id });
      setConfiguration(configurations);
    } else {
      setConfiguration([]);
    }
  }, [visible]);

  function confirm() {
    onOk(configuration);
    onCancel();
  }

  return (
    <Modal
      destroyOnClose
      title={title}
      visible={visible}
      width={800}
      maskClosable={false}
      onOk={confirm}
      onCancel={onCancel}
      style={{ maxWidth: 1000, top: '5%', position: 'relative' }}
      bodyStyle={{ height: '88vh', flex: 1, overflow: 'auto' }}
    >
      <IdleChargingStrategy onCancel={onCancel} />
    </Modal>
  );
};
export default memo(IdleChargingStrategy);
