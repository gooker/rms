import React, { memo, useEffect, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import Dictionary from '@/utils/Dictionary';
import FormattedMessage from '@/components/FormattedMessage';
import modalStyles from '../../monitorLayout.module.less';
import styles from './vehicleRunInfo.module.less';

/**
 * vehicleRunningStatus: Normal(正常), Warning(警告), Error(异常), Stopping(完成)
 */
const width = 500;
const height = 300;
const { green, red, yellow, blue } = Dictionary('color');
const MessageColor = {
  Normal: green,
  Warning: yellow,
  Error: red,
  Stopping: blue,
};

const VehicleRunninInfo = (props) => {
  const { runningInfoList, dispatch } = props;

  const [infoList, setInfoList] = useState([]);

  useEffect(() => {
    setInfoList(runningInfoList);
  }, []);

  function close() {
    dispatch({ type: 'monitor/saveCategoryModal', payload: null });
    dispatch({ type: 'monitorView/saveVehicleRunningInfoList', payload: [] });
  }

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        left: `calc(50% - ${width / 2}px)`,
      }}
      className={modalStyles.monitorModal}
    >
      <div className={modalStyles.monitorModalHeader}>
        <FormattedMessage id={'monitor.runTime.info'} />
        <CloseOutlined onClick={close} style={{ cursor: 'pointer' }} />
      </div>
      <div className={modalStyles.monitorModalBody} style={{ paddingTop: 20 }}>
        {infoList.map((item, index) => (
          <div key={index} className={styles.vehicleInfoRow}>
            <div className={styles.vehicleInfoTitle}>
              <span
                className={styles.vehicleRunningState}
                style={{ background: MessageColor[item.type] }}
              />
              <span className={styles.vehicleInfoTitleContent}>{item.title}</span>
            </div>
            <div className={styles.vehicleInfoMessage}>{item.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default connect(({ monitorView }) => ({
  runningInfoList: monitorView.vehicleRunningInfoList ?? [],
}))(memo(VehicleRunninInfo));
