import React, { memo } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Drawer } from 'antd';
import { connect } from '@/utils/RmsDva';
import { getMapModalPosition, getPlateFormType } from '@/utils/util';
import DashboardComponent from './components/DashboardComponent';
import styles from '../monitorLayout.module.less';
import style from './dashboard.module.less';
import FormattedMessage from '@/components/FormattedMessage';

const Dashboard = (props) => {
  const { dispatch } = props;
  window.currentPlatForm = getPlateFormType();

  function close() {
    dispatch({ type: 'monitorView/saveDashBoardVisible', payload: false });
  }

  // pc
  if (window.currentPlatForm.isPc) {
    return (
      <Drawer
        visible={true}
        mask={false}
        closable={false}
        placement="right"
        width={310}
        style={{ top: 84, height: `calc(100% - 84px)` }}
        bodyStyle={{ height: '100%', display: 'flex', flexFlow: 'column nowrap', padding: 0 }}
        onClose={close}
        className={style.dashDrawer}
      >
        <div className={style.drawerHeader}>
          <FormattedMessage id="monitor.dashboard" />
          <CloseOutlined onClick={close} style={{ cursor: 'pointer' }} />
        </div>
        <div style={{ flex: 1, overflow: 'auto', margin: '10px 0 30px 0px ' }}>
          <DashboardComponent />
        </div>
      </Drawer>
    );
  }

  return (
    <div style={getMapModalPosition(400)} className={styles.monitorModal}>
      <div className={styles.monitorModalHeader}>
        <FormattedMessage id='monitor.dashboard' />
        <CloseOutlined onClick={close} style={{ cursor: 'pointer' }} />
      </div>
      <div className={styles.monitorModalBody} style={{ paddingTop: 20 }}>
        <DashboardComponent />
      </div>
    </div>
  );
};
export default connect(({ monitor }) => ({
  currentMap: monitor.currentMap,
}))(memo(Dashboard));
