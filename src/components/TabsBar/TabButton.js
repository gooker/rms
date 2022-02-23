import React, { memo } from 'react';
import { CloseCircleFilled } from '@ant-design/icons';
import styles from './tabsBar.module.less';

const TabButton = (props) => {
  const { menuKey, active, label, onClick, onDelete } = props;

  return (
    <div className={styles.tabButton} style={{ background: active ? '#fff' : '#9f9f9f' }}>
      <div
        onClick={() => {
          onClick(menuKey);
        }}
      >
        {label}
      </div>
      {menuKey !== '/' && (
        <CloseCircleFilled
          style={{ marginLeft: 5 }}
          onClick={(ev) => {
            ev.stopPropagation();
            onDelete(menuKey);
          }}
        />
      )}
    </div>
  );
};
export default memo(TabButton);
