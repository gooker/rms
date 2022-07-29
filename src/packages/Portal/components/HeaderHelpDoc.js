import React, { memo, useState } from 'react';
import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { formatMessage } from '@/utils/util';
import styles from './Header.module.less';
import HelpDocViewerModal from '@/packages/Portal/components/HelpDocViewerModal';

const HeaderHelpDoc = () => {
  const [visible, setVisible] = useState(false);

  function viewPageHelpDoc() {
    const { pathname } = window.location;
    setVisible(pathname !== '/');
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
        onCancel={() => {
          setVisible(false);
        }}
      />
    </>
  );
};
export default memo(HeaderHelpDoc);
