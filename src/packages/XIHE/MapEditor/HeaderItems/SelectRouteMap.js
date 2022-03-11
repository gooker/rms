import React, { memo, useState } from 'react';
import { Menu, Dropdown } from 'antd';
import { EditOutlined, PlusOutlined, DownOutlined } from '@ant-design/icons';
import { find } from 'lodash';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';
import { formatMessage } from '@/utils/util';
import styles from './index.module.less';
import CreateRouteMapModal from '@/packages/XIHE/MapEditor/components/CreateRouteMapModal';
import CreateLogicAreaModal from '@/packages/XIHE/MapEditor/components/CreateLogicAreaModal';

const SelectRouteMap = (props) => {
  const { dispatch, routeMapList, currentRouteMap } = props;

  const [editing, setEditing] = useState(null);
  const [visible, setVisible] = useState(false);

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
                    setVisible(true);
                    setEditing(routeMapList[key]);
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
        <FormattedMessage id="editor.addRouteMap" />
      </Menu.Item>,
    );
    return result;
  }

  function switchRouteMap(record) {
    if (record.key === 'add') {
      setVisible(true);
      setEditing(null);
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
    <>
      <Dropdown overlay={routeMapMenu}>
        <span className={styles.action}>
          <span style={{ fontSize: 15, fontWeight: 600 }}>
            {currentRouteMapData?.name || formatMessage({ id: 'app.map.routeArea' })}
          </span>
          <DownOutlined style={{ marginLeft: 4 }} />
        </span>
      </Dropdown>

      <CreateRouteMapModal
        visible={visible}
        data={editing}
        close={() => {
          setVisible(false);
        }}
      />
    </>
  );
};
export default connect(({ editor }) => {
  const { currentMap, currentLogicArea, currentRouteMap } = editor;
  const logicAreaList = currentMap?.logicAreaList || [];
  const currentLogicAreaData = find(logicAreaList, { id: currentLogicArea });
  const routeMapList = currentLogicAreaData?.routeMap || {};
  return { routeMapList, currentRouteMap };
})(memo(SelectRouteMap));
