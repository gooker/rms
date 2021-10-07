import React, { memo } from 'react';
import { connect } from '@/utils/dva';
import { Menu, Row, Spin } from 'antd';
import { RightOutlined, DownOutlined } from '@ant-design/icons';
import HeaderDropdown from '@/components/HeaderDropdown';
import { formatMessage } from '@/utils/utils';
import { getCurrentLogicAreaData, getCurrentRouteMapData } from '@/utils/mapUtils';
import styles from '@/packages/Mixrobot/MapMonitor/monitor.module.less';

const MapMonitorLeftTool = (props) => {
  const { dispatch, currentMap, logicAreaList, currentLogicArea, currentRouteMap } = props;

  const getLogicListMenu = () => {
    let result = [];
    if (logicAreaList) {
      result = logicAreaList.map((record) => {
        return (
          <Menu.Item key={record.id}>
            <Row>{record.name}</Row>
          </Menu.Item>
        );
      });
    }
    return result;
  };

  const getRouteMapMenu = () => {
    const result = [];
    const routeMap = currentLogicArea?.routeMap;
    if (routeMap) {
      Object.keys(routeMap).forEach((key) => {
        result.push(
          <Menu.Item key={routeMap[key].code}>
            <Row>{routeMap[key].name}</Row>
          </Menu.Item>,
        );
      });
    }
    return result;
  };

  return (
    <div className={styles.monitorLeftTool}>
      <span className={styles.action}>
        {currentMap?.name ? currentMap.name : <Spin size="small" />}
      </span>
      <RightOutlined style={{ opacity: '0.4' }} />

      {/* 切换逻辑区 */}
      <HeaderDropdown
        overlay={
          <Menu
            className={styles.menu}
            style={{ color: '#FFF' }}
            selectedKeys={`${currentLogicArea?.id}`}
            onClick={(record) => {
              dispatch({
                type: 'monitor/saveCurrentLogicArea',
                payload: parseInt(record.key, 10),
              });
            }}
          >
            {getLogicListMenu()}
          </Menu>
        }
      >
        <span className={styles.action}>
          <span style={{ fontSize: 15, fontWeight: 600 }} className={styles.name}>
            {currentLogicArea?.name || formatMessage({ id: 'app.selectLogicArea.logicArea' })}
          </span>
          <DownOutlined style={{ marginLeft: 10, color: '#FFF' }} />
        </span>
      </HeaderDropdown>
      <RightOutlined style={{ opacity: '0.4' }} />

      {/* 切换路线区 */}
      <HeaderDropdown
        icon={<DownOutlined style={{ marginLeft: 4, color: '#FFF' }} />}
        overlay={
          <Menu
            onClick={(record) => {
              dispatch({
                type: 'monitor/saveCurrentRouteMap',
                payload: record.key,
              });
            }}
            className={styles.menu}
            selectedKeys={[`${currentRouteMap?.code}`]}
          >
            {getRouteMapMenu()}
          </Menu>
        }
      >
        <span className={`${styles.action} ${styles.account}`}>
          <span style={{ fontSize: 15, fontWeight: 600 }} className={styles.name}>
            {currentRouteMap?.name || formatMessage({ id: 'app.selectScopeMap.routeArea' })}
          </span>
          <DownOutlined style={{ marginLeft: 10, color: '#FFF' }} />
        </span>
      </HeaderDropdown>
    </div>
  );
};
export default connect(({ monitor }) => {
  const { currentMap } = monitor;
  return {
    currentMap,
    currentLogicArea: getCurrentLogicAreaData('monitor'),
    currentRouteMap: getCurrentRouteMapData('monitor'),
    logicAreaList: currentMap?.logicAreaList || [],
  };
})(memo(MapMonitorLeftTool));
