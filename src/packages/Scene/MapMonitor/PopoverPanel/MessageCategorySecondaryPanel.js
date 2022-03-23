import React, { memo, useState, useEffect } from 'react';
import { Tooltip } from 'antd';
import { connect } from '@/utils/RmsDva';
import { hasAppPermission } from '@/utils/Permission';
import { MessageCategoryTools } from '../enums';
import styles from '../monitorLayout.module.less';

const MessageCategorySecondaryPanel = (props) => {
  const {
    height,
    offsetTop,
    dispatch,
    type,
    pixHeight,
    podToWorkstationInfo,
    latentStopMessageList,
  } = props;
  const [top, setTop] = useState(5);

  useEffect(() => {
    let _top = 5;
    if (offsetTop) {
      _top = offsetTop - height / 2;
      const _height = _top + height - pixHeight;
      if (_height > 0) {
        _top = _top - _height;
      }
      if (_top < 5) {
        _top = 5;
      }
    }
    setTop(_top);
  }, [height, offsetTop, type]);

  function renderIcon(icon, style) {
    if (typeof icon === 'string') {
      return <img alt={icon} src={require(`../category/${icon}`).default} style={style} />;
    } else {
      return <span style={style}>{icon}</span>;
    }
  }

  function onClick(category) {
    dispatch({ type: 'monitor/saveCategoryModal', payload: category });
  }

  return (
    <div style={{ height, width: 60, top: top }} className={styles.popoverPanel}>
      {MessageCategoryTools.map(({ label, icon, value, style }) => {
        return (
          <Tooltip key={value} placement="left" title={label}>
            <div
              role={'category'}
              style={{ position: 'relative' }}
              onClick={() => {
                onClick(value);
              }}
            >
              {renderIcon(icon, style)}
              {value === 'podToWorkstationInfoMessage' && podToWorkstationInfo.length > 0 && (
                <div className={styles.categoryBadge} style={{ background: '#1870bd' }}>
                  <span>
                    {podToWorkstationInfo.length > 99 ? '99+' : podToWorkstationInfo.length}
                  </span>
                </div>
              )}
              {value === 'stopMessage' && latentStopMessageList.length > 0 && (
                <div className={styles.categoryBadge} style={{ background: '#1870bd' }}>
                  <span>
                    {latentStopMessageList.length > 99 ? '99+' : latentStopMessageList.length}
                  </span>
                </div>
              )}
            </div>
          </Tooltip>
        );
      }).filter(Boolean)}
    </div>
  );
};
export default connect(({ monitor }) => ({
  podToWorkstationInfo: monitor.podToWorkstationInfo || [],
  latentStopMessageList: monitor.latentStopMessageList || [],
}))(memo(MessageCategorySecondaryPanel));
