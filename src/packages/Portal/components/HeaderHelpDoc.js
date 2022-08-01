import React, { memo, useState } from 'react';
import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { formatMessage, isStrictNull } from '@/utils/util';
import styles from './Header.module.less';
import HelpDocViewerModal from '@/packages/Portal/components/HelpDocViewerModal';
import { connect } from '@/utils/RmsDva';

const HeaderHelpDoc = ({ currentLang }) => {
  const [visible, setVisible] = useState(false);
  const [iframeSrc, setIframeSrc] = useState(null);

  function viewPageHelpDoc() {
    const { pathname } = window.location;
    if (pathname === '/') {
      // TODO: 展示完整的帮助文档
    } else {
      let fileName = pathname.split('/').at(-1);
      if (isStrictNull(currentLang)) {
        currentLang = 'en-US';
      }
      const langShortName = currentLang.split('-').at(0);
      if (langShortName !== 'zh') {
        fileName = `${fileName}_${langShortName}`;
      }
      fileName = `${fileName}.html`;

      // TODO: 这里需要调用一次接口，判断帮助文档是否存在
      const url = `http://localhost:5000/static/${fileName}`;
      setIframeSrc(url);
      setVisible(true);
    }
  }

  return (
    <>
      <Tooltip
        title={formatMessage({ id: 'app.header.helpDoc' })}
        color={'#ffffff'}
        overlayInnerStyle={{ color: '#000000' }}
      >
        <span className={styles.action} onClick={viewPageHelpDoc}>
          <QuestionCircleOutlined />
        </span>
      </Tooltip>

      <HelpDocViewerModal
        visible={visible}
        iframeSrc={iframeSrc}
        onCancel={() => {
          setVisible(false);
        }}
      />
    </>
  );
};
export default connect(({ global }) => ({
  currentLang: global.globalLocale,
}))(memo(HeaderHelpDoc));
