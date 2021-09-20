import React, { memo, useState } from 'react';
import { connect } from '@/utils/dva';
import { Divider } from 'antd';
import { useMount } from '@umijs/hooks';
import { hasPermission } from '@/utils/Permission';
import { fetchSystemParamFormData } from '@/services/api';
import {
  DashboardOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import { dealResponse, isStrictNull } from '@/utils/utils';
import styles from '../monitor.less';

const MapMonitorRightTool = (props) => {
  const { dispatch, dashBoardVisible, drawerVisible } = props;
  const [exhibitionEnabled, setExhibitionEnabled] = useState(false);

  useMount(() => {
    // 获取系统参数中DashBoard配置
    fetchSystemParamFormData().then((res) => {
      if (!dealResponse(res)) {
        const systemDir = {};
        res.forEach(({ tabContent }) => {
          tabContent.forEach(({ group }) => {
            group.forEach((formItem) => {
              const { key, defaultValue } = formItem;
              systemDir[key] = defaultValue;
            });
          });
        });
        // 是否显示 DashBoard 按钮
        setExhibitionEnabled(!isStrictNull(systemDir.exhibitionEnabled));
      }
    });
  });

  return (
    <div className={styles.monitorRightTool}>
      {(() => {
        if (exhibitionEnabled && hasPermission('/map/monitor/exhibition')) {
          return (
            <span className={styles.trigger}>
              {dashBoardVisible ? (
                <SettingOutlined
                  onClick={() => {
                    dispatch({ type: 'monitor/saveDashBoardVisible', payload: false });
                    dispatch({ type: 'monitor/saveDrawerVisible', payload: true });
                  }}
                />
              ) : (
                <DashboardOutlined
                  onClick={() => {
                    dispatch({ type: 'monitor/saveDashBoardVisible', payload: true });
                    dispatch({ type: 'monitor/saveDrawerVisible', payload: true });
                  }}
                />
              )}
            </span>
          );
        }
      })()}
      <Divider type="vertical" />

      {/* 右侧栏切换 */}
      <span
        className={styles.trigger}
        onClick={() => {
          dispatch({ type: 'monitor/saveDrawerVisible', payload: !drawerVisible });
        }}
      >
        {drawerVisible ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </span>
    </div>
  );
};
export default connect(({ monitor }) => ({
  drawerVisible: monitor.drawerVisible,
  dashBoardVisible: monitor.dashBoardVisible,
}))(memo(MapMonitorRightTool));
