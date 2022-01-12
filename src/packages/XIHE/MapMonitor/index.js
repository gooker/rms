import React, { memo, useEffect } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { connect } from '@/utils/dva';
import MonitorMapContainer from './components/MonitorMapContainer';
import MonitorBodyRight from './components/MonitorBodyRight';
import MonitorHeader from './components/MonitorHeader';
import commonStyles from '@/common.module.less';
import styles from './monitorLayout.module.less';

const MapMonitor = (props) => {
  const { dispatch, socketClient, currentMap } = props;

  useEffect(() => {
    socketClient.applyMonitorRegistration();
    dispatch({ type: 'monitor/initMonitorPage' });
    return () => {
      socketClient.cancelMonitorRegistration();
    };
  }, []);

  return (
    <div id={'mapMonitorPage'} className={commonStyles.commonPageStyleNoPadding}>
      <div className={classnames(commonStyles.mapLayoutHeader, styles.monitorHeader)}>
        {currentMap === undefined ? (
          <LoadingOutlined style={{ fontSize: 20 }} spin />
        ) : (
          <MonitorHeader />
        )}
      </div>
      <div className={commonStyles.mapLayoutBody}>
        <MonitorMapContainer />
        <MonitorBodyRight />
      </div>
    </div>
  );
};
export default connect(({ editor, global }) => ({
  socketClient: global.socketClient,
  currentMap: editor.currentMap,
}))(memo(MapMonitor));
