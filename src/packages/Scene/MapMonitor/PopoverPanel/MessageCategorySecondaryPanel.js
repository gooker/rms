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
      _top = offsetTop;
      // _top - 115 + height 表示弹窗在地图范围由上而下占据总高度
      const _height = pixHeight - (_top - 115 + height);
      if (_height <= 0) {
        _top = 5;
      } else {
        _top = _top - 115;
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
    <div style={{ height, width: 60, top }} className={styles.popoverPanel}>
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
