import React, { memo } from 'react';
import { Modal } from 'antd';
import { formatMessage } from '@/utils/util';
import style from './Header.module.less';

const HelpDocViewerModal = (props) => {
  const { visible, onCancel, iframeSrc } = props;


  return (
    <Modal
      title={formatMessage({ id: 'app.helpDoc' })}
      visible={visible}
      onCancel={onCancel}
      width={'80vw'}
      style={{ top: 30, maxWidth: 1000 }}
      bodyStyle={{ height: '80vh', overflow: 'hidden', padding: 0 }}
      footer={null}
    >
      <div className={style.iframeContainer}>
        <iframe seamless src={iframeSrc} width={'100%'} height={'100%'} frameBorder={0} />
      </div>
    </Modal>
  );
};
export default memo(HelpDocViewerModal);
