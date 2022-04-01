import React, { memo, useState, useEffect } from 'react';
import { message, Tooltip } from 'antd';
import { connect } from '@/utils/RmsDva';
import EventManager from '@/utils/EventManager';
import { EmergencyCategoryTools, MonitorOperationType } from '../enums';
import styles from '../monitorLayout.module.less';
import { formatMessage, isNull } from '@/utils/util';

const key = 'updatable';
const subscribeType = 'moveUp';
const functionId = 'createEStop';

const EmergencyStopPanel = (props) => {
  const { dispatch, height, offsetTop, pixHeight, mapContext } = props;
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
  }, [height, offsetTop, pixHeight]);

  function renderIcon(icon, style) {
    if (typeof icon === 'string') {
      return <img alt={icon} src={require(`../category/${icon}`).default} style={style} />;
    } else {
      return <span style={style}>{icon}</span>;
    }
  }

  function onClick(category) {
    if (category === 'dragEmergency') {
      // 给予用户操作指引
      message.info({
        content: formatMessage({ id: 'monitor.estop.creationTip' }),
        duration: 0,
        key,
      });

      window.$$dispatch({
        type: 'monitor/saveOperationType',
        payload: MonitorOperationType.Choose,
      });

      function callback({ start, end }) {
        EventManager.unsubscribe(subscribeType, functionId);
        message.destroy(key);

        // 转换坐标确定选择区域
        const viewport = mapContext.pixiUtils.viewport;
        const globalStart = viewport.toWorld(start.x, start.y);
        const globalEnd = viewport.toWorld(end.x, end.y);
        dispatch({
          type: 'monitor/saveMonitorEStop',
          payload: { start: globalStart, end: globalEnd },
        }).then((estop) => {
          if (!isNull(estop)) {
            mapContext.renderEmergencyStopArea([estop]);
          }
        });
      }
      EventManager.subscribe(subscribeType, callback, functionId);
    } else {
      window.$$dispatch({ type: 'monitor/saveCategoryModal', payload: category });
    }
  }

  return (
    <div style={{ height, width: 60, top: top }} className={styles.popoverPanel}>
      {EmergencyCategoryTools.map(({ label, icon, value, style }) => {
        return (
          <Tooltip key={value} placement="left" title={label}>
            <div
              role={'category'}
              onClick={() => {
                onClick(value);
              }}
            >
              {renderIcon(icon, style)}
            </div>
          </Tooltip>
        );
      }).filter(Boolean)}
    </div>
  );
};
export default connect(({ monitor }) => ({
  mapContext: monitor.mapContext,
}))(memo(EmergencyStopPanel));
