import React from 'react';
import { connect } from '@/utils/RmsDva';
import { find } from 'lodash';
import { Row, Switch, Button, Col } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../groupManage.module.less';

const SwitchMapView = (props) => {
  const {
    dispatch,
    mapContext,
    currentLogicArea,
    logicAreas = [],
    currentRouteMap,
    routeMapList,
    height,
    width,
  } = props;

  function switchLogicArea(id) {
    dispatch({
      type: 'mapViewGroup/saveCurrentLogicArea',
      payload: parseInt(id, 10),
    });
  }

  function switchRouteMap(code) {
    dispatch({
      type: 'mapViewGroup/saveCurrentRouteMap',
      payload: code,
    });
  }

  function switchPrioritiesShown(checked) {
    const shownPriorities = checked ? [10, 20, 100, 1000] : [];
    dispatch({ type: 'mapViewGroup/saveShownPriorities', payload: shownPriorities });
    mapContext.filterRelations(shownPriorities, 'mapViewGroup');
    mapContext.refresh();
  }

  return (
    <div style={{ height, width }} className={styles.categoryPanel}>
      <div>
        <FormattedMessage id={'app.map.logicArea'} />
      </div>
      <div>
        {/* 逻辑区切换 */}
        <h4 style={{ marginTop: 15 }}>
          <FormattedMessage id="app.map.logicArea" />
        </h4>
        <Row gutter={10} style={{ display: 'flex', flexFlow: 'row wrap' }}>
          {logicAreas.map(({ id, name }) => (
            <Col key={id}>
              <Button
                size="small"
                type={id === currentLogicArea ? 'primary' : 'default'}
                onClick={() => {
                  switchLogicArea(id);
                }}
              >
                {name}
              </Button>
            </Col>
          ))}
        </Row>

        {/* 路线区切换 */}
        <h4 style={{ marginTop: 15 }}>
          <FormattedMessage id="app.map.routeArea" />
        </h4>
        <Row style={{ display: 'flex', flexFlow: 'row wrap' }}>
          {routeMapList.map(({ code, name }) => (
            <Col key={code}>
              <Button
                size="small"
                style={{ margin: '0 10px 10px 0' }}
                type={code === currentRouteMap ? 'primary' : 'default'}
                onClick={() => {
                  switchRouteMap(code);
                }}
              >
                {name}
              </Button>
            </Col>
          ))}
        </Row>

        {/* 优先级 */}
        <h4 style={{ marginTop: 5 }}>
          <FormattedMessage id="editor.view.priorityDisplay" />
        </h4>
        <Switch values={props.shownPriorities} onChange={switchPrioritiesShown} />
      </div>
    </div>
  );
};
export default connect(({ mapViewGroup }) => {
  const { currentMap, currentLogicArea, currentRouteMap, shownPriorities, mapContext } =
    mapViewGroup;
  const logicAreaList = currentMap?.logicAreaList || [];
  const currentLogicAreaData = find(logicAreaList, { id: currentLogicArea });
  const routeMapList = currentLogicAreaData?.routeMap || {};
  return {
    mapContext,
    shownPriorities,
    currentRouteMap,
    currentLogicArea,
    routeMapList: Object.values(routeMapList),
    logicAreas: currentMap?.logicAreaList?.map(({ id, name }) => ({ id, name })) || [],
  };
})(SwitchMapView);
