import React, { memo } from 'react';
import { Menu, Dropdown } from 'antd';
import { find } from 'lodash';
import { DownOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { formatMessage } from '@/utils/util';
import styles from './index.module.less';

const SelectRouteMap = (props) => {
  const { dispatch, routeMapList, currentRouteMap } = props;

  function renderRouteMapMenu() {
    const result = [];
    if (routeMapList && Object.keys(routeMapList).length > 0) {
      Object.keys(routeMapList).forEach((key) => {
        result.push(<Menu.Item key={key}>{routeMapList[key].name}</Menu.Item>);
      });
    }
    return result;
  }

  function switchRouteMap(record) {
    dispatch({
      type: 'monitor/saveCurrentRouteMap',
      payload: record.key,
    });
  }

  const routeMapMenu = (
    <Menu
      selectedKeys={[currentRouteMap]}
      onClick={(record) => {
        switchRouteMap(record);
      }}
    >
      {renderRouteMapMenu()}
    </Menu>
  );

  const currentRouteMapData = routeMapList[currentRouteMap];
  return (
    <Dropdown overlay={routeMapMenu}>
      <span className={styles.action}>
        <span style={{ fontSize: 15, fontWeight: 600 }}>
          {currentRouteMapData?.name || formatMessage({ id: 'mapEditor.routeMap' })}
        </span>
        <DownOutlined style={{ marginLeft: 4 }} />
      </span>
    </Dropdown>
  );
};
export default connect(({ monitor }) => {
  const { currentMap, currentLogicArea, currentRouteMap } = monitor;
  const logicAreaList = currentMap?.logicAreaList || [];
  const currentLogicAreaData = find(logicAreaList, { id: currentLogicArea });
  const routeMapList = currentLogicAreaData?.routeMap || {};
  return { routeMapList, currentRouteMap };
})(memo(SelectRouteMap));
