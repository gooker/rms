import React, { memo, useEffect } from 'react';
import { connect } from '@/utils/RmsDva';
import GroupManageMapContainer from './components/GroupManageMapContainer';
import commonStyles from '@/common.module.less';

const GroupManagement = (props) => {
  const { mapRendered, dispatch } = props;

  useEffect(() => {
    dispatch({ type: 'mapViewGroup/initMap' });
    return () => {
      dispatch({
        type: 'mapViewGroup',
        payload: {
          mapContext: false,
        },
      });
    };
  }, []);

  useEffect(() => {
    renderGroupManageLoad();
  }, [mapRendered]);

  async function renderGroupManageLoad() {
    if (mapRendered) {
      // 获取分组信息
      dispatch({ type: 'mapViewGroup/fetchStorageConfigurations' });
      // 获取json 渲染form
      dispatch({ type: 'mapViewGroup/fetchGetCustomGroupJson' });
    }
  }

  return (
    <div id={'mapGroupManagePage'} className={commonStyles.commonPageStyleNoPadding}>
      <div className={commonStyles.mapLayoutBody}>
        <GroupManageMapContainer />
        {/* <GroupManageBodyRight /> */}
      </div>
    </div>
  );
};
export default connect(({ mapViewGroup }) => ({
  mapContext: mapViewGroup.mapContext,
  mapRendered: mapViewGroup.mapRendered,
}))(memo(GroupManagement));
