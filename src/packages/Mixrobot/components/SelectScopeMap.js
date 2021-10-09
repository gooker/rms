import React, { memo } from 'react';
import { connect } from '@/utils/dva';
import { Menu } from 'antd';
import { find } from 'lodash';
import { PlusOutlined, DownOutlined, EditOutlined } from '@ant-design/icons';
import { formatMessage } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';
import HeaderDropdown from '@/components/HeaderDropdown';

const SelectScopeMap = (props) => {
  const { dispatch, routeMapList, currentRouteMap } = props;

  function renderRouteMapMenu() {
    const result = [];
    if (routeMapList && Object.keys(routeMapList).length > 0) {
      Object.keys(routeMapList).forEach((key) => {
        result.push(
          <Menu.Item key={key}>
            <div style={{ display: 'flex', flexFlow: 'row nowrap' }}>
              <div>{routeMapList[key].name}</div>
              <div style={{ flex: 1, textAlign: 'end' }}>
                <EditOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch({
                      type: 'editor/updateModalVisit',
                      payload: {
                        type: 'createScopeMap',
                        value: true,
                        extraData: routeMapList[key],
                      },
                    });
                  }}
                />
              </div>
            </div>
          </Menu.Item>,
        );
      });
    }
    result.push(
      // 添加路线区
      <Menu.Item key="add">
        <PlusOutlined />
        <FormattedMessage id="app.selectScopeMap.addRouteArea" />
      </Menu.Item>,
    );
    return result;
  }

  function switchRouteMap(record) {
    if (record.key === 'add') {
      dispatch({
        type: 'editor/updateModalVisit',
        payload: {
          type: 'createScopeMap',
          value: true,
        },
      });
    } else {
      dispatch({
        type: 'editor/saveCurrentRouteMap',
        payload: record.key,
      });
    }
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
    <HeaderDropdown overlay={routeMapMenu}>
      <span>
        <span style={{ fontSize: 15, fontWeight: 600 }}>
          {currentRouteMapData?.name || formatMessage({ id: 'app.selectScopeMap.routeArea' })}
        </span>
        <DownOutlined style={{ marginLeft: 4 }} />
      </span>
    </HeaderDropdown>
  );
};
export default connect(({ editor }) => {
  const { currentMap, currentLogicArea, currentRouteMap } = editor;
  const logicAreaList = currentMap?.logicAreaList || [];
  const currentLogicAreaData = find(logicAreaList, { id: currentLogicArea });
  const routeMapList = currentLogicAreaData?.routeMap || {};
  return { routeMapList, currentRouteMap };
})(memo(SelectScopeMap));
