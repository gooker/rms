import React, { memo, useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { find } from 'lodash';
import { connect } from '@/utils/RmsDva';
import { dealResponse, formatMessage } from '@/utils/util';
import { fetchScopeProgram } from '@/services/XIHE';
import FormattedMessage from '@/components/FormattedMessage';
import ProgramingZone from './ProgramingZone';
import ProgramingCell from '../../../XIHE/ProgramingCell';
import ProgramingRelation from './ProgramingRelation';
import styles from '../../../XIHE/popoverPanel.module.less';
import commonStyles from '@/common.module.less';

const { TabPane } = Tabs;

const ProgramingPanel = (props) => {
  const { height, currentMap, currentLogicArea, currentRouteMap, scopeActions } = props;
  const [scopeProgram, setScopeProgram] = useState([]); // 已保存的地图编程数据
  const scopeLoad = getScopeLoad();

  useEffect(refresh, [currentMap, currentLogicArea]);

  function refresh() {
    fetchScopeProgram({
      mapId: currentMap.id,
      logicId: currentLogicArea,
    }).then((response) => {
      if (
        !dealResponse(
          response,
          false,
          null,
          formatMessage({ id: 'app.message.fetchScopeProgramFail' }),
        )
      ) {
        setScopeProgram(response);
      }
    });
  }

  // 获取指定编程数据
  function getScopeLoad() {
    return find(scopeProgram, {
      routeCode: currentRouteMap,
      scopeCode: 'GLO',
    });
  }

  // 获取不同类型的可配置动作
  function getActions(groupName) {
    const actions = find(scopeActions, { groupName });
    if (actions) {
      return actions.actionList;
    }
    return [];
  }

  return (
    <div style={{ height, width: 350 }} className={commonStyles.categoryPanel}>
      {/* 标题栏 */}
      <div>
        <FormattedMessage id={'app.map.programing'} />
      </div>

      {/* Tab栏 */}
      <div className={styles.programTabs}>
        <Tabs defaultActiveKey="zone">
          <TabPane tab={<FormattedMessage id={'app.map.zone'} />} key="zone">
            <ProgramingZone scopeLoad={scopeLoad} actions={getActions('zone')} />
          </TabPane>
          <TabPane tab={<FormattedMessage id={'app.map.cell'} />} key="cell">
            <ProgramingCell scopeLoad={scopeLoad} actions={getActions('cell')} />
          </TabPane>
          <TabPane tab={<FormattedMessage id={'app.map.route'} />} key="relation">
            <ProgramingRelation scopeLoad={scopeLoad} actions={getActions('relation')} />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};
export default connect(({ editor }) => ({
  currentMap: editor.currentMap,
  scopeActions: editor.scopeActions,
  currentLogicArea: editor.currentLogicArea,
  currentRouteMap: editor.currentRouteMap,
}))(memo(ProgramingPanel));
