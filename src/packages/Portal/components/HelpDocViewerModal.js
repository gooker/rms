import React, { memo, useEffect } from 'react';
import { Modal } from 'antd';
import { formatMessage, isStrictNull } from '@/utils/util';
import { connect } from '@/utils/RmsDva';

const basePath = '/Users/czhou/Desktop';

const HelpDocViewerModal = (props) => {
  const { visible, onCancel } = props;
  let currentLang = props.currentLang;

  useEffect(() => {
    if (visible) {
      const { pathname } = window.location;
      let fileName = pathname.split('/').at(-1);
      if (isStrictNull(currentLang)) {
        currentLang = 'en-US';
      }
      const langShortName = currentLang.split('-').at(0);
      if (langShortName !== 'zh') {
        fileName = `${fileName}_${langShortName}`;
      }
      fileName = `${fileName}.html`;

      fetch(`${basePath}/${fileName}`)
        .then((response) => response.text())
        .then((response) => {
          console.log(response);
        });
      console.log(fileName);
    }
  }, [visible]);

  return (
    <Modal
      title={formatMessage({ id: 'app.helpDoc' })}
      visible={visible}
      onCancel={onCancel}
      width={'80vw'}
      style={{ top: 30, maxWidth: 1000 }}
      bodyStyle={{ maxHeight: '80vh', overflow: 'auto' }}
      footer={null}
    >
      1111
    </Modal>
  );
};
export default connect(({ global }) => ({
  currentLang: global.globalLocale,
}))(memo(HelpDocViewerModal));
