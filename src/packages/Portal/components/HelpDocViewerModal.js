import React, { memo, useEffect, useState } from 'react';
import { Modal } from 'antd';
import { connect } from '@/utils/RmsDva';
import { formatMessage, isStrictNull } from '@/utils/util';
import HelpDocPortal from './HelpDocPortal';
import style from './Header.module.less';

const HelpDocViewerModal = (props) => {
  const { visible, onCancel } = props;
  const [iframeSrc, setIframeSrc] = useState(null);

  useEffect(() => {
    const { pathname } = window.location;
    if (visible && pathname !== '/') {
      let currentLang = props.currentLang;
      let fileName = pathname.split('/').at(-1);
      if (isStrictNull(currentLang)) {
        currentLang = 'en-US';
      }
      const langShortName = currentLang.split('-').at(0);
      if (langShortName !== 'zh') {
        fileName = `${fileName}_${langShortName}`;
      }
      fileName = `${fileName}.html`;

      // TODO: 帮助文档地址需要后续提供
      const url = `http://localhost:5000/static/${fileName}`;
      setIframeSrc(url);
    }
  }, [visible]);

  return (
    <Modal
      title={formatMessage({ id: 'app.helpDoc' })}
      visible={visible}
      onCancel={onCancel}
      width={'100vw'}
      style={{ top: 30, maxWidth: 1400, padding: 0 }}
      bodyStyle={{ height: '80vh', overflow: 'hidden', padding: 0 }}
      footer={null}
    >
      <div className={style.helpDocContainer}>
        <HelpDocPortal />
      </div>
    </Modal>
  );
};
export default connect(({ global }) => ({
  currentLang: global.globalLocale,
}))(memo(HelpDocViewerModal));
