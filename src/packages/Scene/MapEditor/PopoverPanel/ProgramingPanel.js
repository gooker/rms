import React, { memo, useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { connect } from '@/utils/RmsDva';
import { getCurrentRouteMapData } from '@/utils/mapUtil';
import FormattedMessage from '@/components/FormattedMessage';
import ProgramingCell from '../Programing/ProgramingCellTab';
import ProgramingRelation from '../Programing/ProgramingRelationTab';
import styles from '../../popoverPanel.module.less';
import commonStyles from '@/common.module.less';

const { TabPane } = Tabs;

const ProgramingPanel = (props) => {
  const { height, currentMap, currentLogicArea, currentRouteMap } = props;
  const [programing, setPrograming] = useState([]);

  useEffect(() => {
    setPrograming(getCurrentRouteMapData()?.programing || []);
  }, [currentMap, currentLogicArea, currentRouteMap]);

  return (
    <div style={{ height, width: 350 }} className={commonStyles.categoryPanel}>
      {/* 标题栏 */}
      <div>
        <FormattedMessage id={'app.map.programing'} />
      </div>

      {/* Tab栏 */}
      <div className={styles.programTabs}>
        <Tabs defaultActiveKey="cell">
          <TabPane tab={<FormattedMessage id={'app.map.cell'} />} key="cell">
            <ProgramingCell programing={programing} />
          </TabPane>
          <TabPane tab={<FormattedMessage id={'app.map.route'} />} key="relation">
            <ProgramingRelation programing={programing} />
          </TabPane>
          {/*<TabPane tab={<FormattedMessage id={'app.map.zone'} />} key='zone'>*/}
          {/*  <ProgramingZone programing={programing} />*/}
          {/*</TabPane>*/}
        </Tabs>
      </div>
    </div>
  );
};
export default connect(({ editor }) => {
  const { currentMap, currentLogicArea, currentRouteMap } = editor;
  return { currentMap, currentLogicArea, currentRouteMap };
})(memo(ProgramingPanel));
