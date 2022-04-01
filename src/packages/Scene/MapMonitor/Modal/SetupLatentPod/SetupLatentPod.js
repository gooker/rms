import React, { memo } from 'react';
import { Tabs } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import MoveLatentPod from './MoveLatentPod';
import AddLatentPod from './AddLatentPod';
import ResizeLatentPod from './ResizeLatentPod';
import { formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../../monitorLayout.module.less';

const { TabPane } = Tabs;
const width = 600;
const height = 600;

const SetupLatentPod = (props) => {
  const { dispatch } = props;
  function close() {
    dispatch({ type: 'monitor/saveCategoryModal', payload: null });
  }
  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        left: `calc(50% - ${width / 2}px)`,
      }}
      className={styles.monitorModal}
    >
      <div className={styles.monitorModalHeader}>
        <FormattedMessage id={'app.map.latentPod'} />
        <CloseOutlined onClick={close} style={{ cursor: 'pointer' }} />
      </div>
      <div className={styles.monitorModalBody} style={{ paddingTop: 20}}>
        <Tabs defaultActiveKey="1">
          {/* 移动货架 */}
          <TabPane tab={formatMessage({ id: 'monitor.operation.movePod' })} key="1">
            <MoveLatentPod />
          </TabPane>

          {/* 设置货架 */}
          <TabPane tab={formatMessage({ id: 'monitor.operation.setupPod' })} key="2">
            <AddLatentPod />
          </TabPane>

          {/* 修改货架尺寸*/}
          <TabPane tab={formatMessage({ id: 'monitor.operation.resizePod' })} key="3">
            <ResizeLatentPod />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};
export default memo(SetupLatentPod);
