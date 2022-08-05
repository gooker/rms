import React, { memo, useState } from 'react';
import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { formatMessage } from '@/utils/util';
import HelpDocViewerModal from './HelpDocViewerModal';
import styles from './Header.module.less';

const HeaderHelpDoc = () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Tooltip
        title={formatMessage({ id: 'app.header.helpDoc' })}
        color={'#ffffff'}
        overlayInnerStyle={{ color: '#000000' }}
      >
        <span
          className={styles.action}
          onClick={() => {
            setVisible(true);
          }}
        >
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
