import React, { memo } from 'react';
import { Tabs } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import ProgramingZone from '../Programing/ProgramingZoneTab';
import ProgramingCell from '../Programing/ProgramingCellTab';
import ProgramingRelation from '../Programing/ProgramingRelationTab';
import styles from '../../popoverPanel.module.less';
import commonStyles from '@/common.module.less';

const { TabPane } = Tabs;

const ProgramingPanel = (props) => {
  const { height } = props;

  return (
    <div style={{ height, width: 350 }} className={commonStyles.categoryPanel}>
      {/* 标题栏 */}
      <div>
        <FormattedMessage id={'app.map.programing'} />
      </div>

      {/* Tab栏 */}
      <div className={styles.programTabs}>
        <Tabs defaultActiveKey='cell'>
          <TabPane tab={<FormattedMessage id={'app.map.cell'} />} key='cell'>
            <ProgramingCell />
          </TabPane>
          <TabPane tab={<FormattedMessage id={'app.map.route'} />} key='relation'>
            <ProgramingRelation />
          </TabPane>
          <TabPane tab={<FormattedMessage id={'app.map.zone'} />} key='zone'>
            <ProgramingZone />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};
export default memo(ProgramingPanel);
