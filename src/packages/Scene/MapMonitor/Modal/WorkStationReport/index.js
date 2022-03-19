import React, { memo, useState, useEffect } from 'react';
import { Row, Col, Button } from 'antd';
import echarts from 'echarts';
import { CloseOutlined } from '@ant-design/icons';
import { useMap } from '@umijs/hooks';
import { connect } from '@/utils/RmsDva';
import {
  waitingHistoryLineOption,
  taskHistoryLineOption,
  LineChartsAxisColor,
  DataColor,
} from './workStationEchart';
import { formatMessage, isStrictNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { workStationCallback } from './workstationUtil';
import styles from '../../monitorLayout.module.less';

let taskHistoryLine = null;
let waitingHistoryLine = null;
const clientHeightBase = 1.3;
const clientWidthBase = 3;

const WorkStationReport = (props) => {
  const {
    workStation,
    dataSource = {},
    waitingData = {},
    stationRateData = [],
    dispatch,
  } = props;

  function close() {
    dispatch({ type: 'monitor/saveCategoryModal', payload: null });
    // dispatch({ type: 'monitor/saveCategoryPanel', payload: null });
  }

  const { name, angle, stopCellId} = workStation;
  const monitorScreenDOM = document.body;

  const [currentRealRate, setCurrentRealRate] = useState({}); // 当前站点的速率和等待时间等

  const [map, { get: getModalSize, setAll }] = useMap([
    ['height', monitorScreenDOM.clientHeight / clientHeightBase],
    ['width', monitorScreenDOM.clientWidth / clientWidthBase],
  ]);

  useEffect(() => {
    const { clientHeight, clientWidth } = monitorScreenDOM;
    setAll([
      ['height', clientHeight / clientHeightBase],
      ['width', clientWidth / clientWidthBase],
    ]);
  }, []);

  useEffect(() => {
    async function init() {
      await workStationCallback(workStation, dispatch);
      initChart();
    }
    init();
  }, []);

  // workStation 的变化触发显重新拉取数据，dataSource的变化触发图表数据更新
  useEffect(refreshChart, [workStation, dataSource, waitingData]);

  function initChart() {
    // 到站次数
    taskHistoryLine = echarts.init(document.getElementById('workStationTaskHistory'));
    taskHistoryLine.setOption(taskHistoryLineOption(), true);

    // 最后30次空等时间
    waitingHistoryLine = echarts.init(document.getElementById('waitingHistory'));
    waitingHistoryLine.setOption(waitingHistoryLineOption(), true);

    return () => {
      taskHistoryLine?.dispose();
      taskHistoryLine = null;

      waitingHistoryLine?.dispose();
      waitingHistoryLine = null;
    };
  }

  function refreshChart() {
    if (!taskHistoryLine || !waitingHistoryLine) return;

    if (stationRateData && stationRateData.length > 1) {
      const currentRate = stationRateData.find((item) => {
        return item.stationCellId === stopCellId;
      });
      setCurrentRealRate(currentRate);
    }

    const workStationTaskHistoryData = dataSource[`${stopCellId}`];
    const workStationWaitingData = waitingData[`${stopCellId}`];

    if (workStationTaskHistoryData) {
      const { taskHistoryData } = workStationTaskHistoryData;
      const { xAxis, series } = taskHistoryData;
      const newTaskHistoryLineOption = taskHistoryLine.getOption();
      newTaskHistoryLineOption.xAxis = xAxis;
      newTaskHistoryLineOption.series = series;
      taskHistoryLine.setOption(newTaskHistoryLineOption, true);
    }

    if (workStationWaitingData) {
      const { xAxis, series } = workStationWaitingData;
      const newWaitingHistoryLineOption = waitingHistoryLine.getOption();
      newWaitingHistoryLineOption.xAxis = xAxis;
      newWaitingHistoryLineOption.series = series;
      waitingHistoryLine.setOption(newWaitingHistoryLineOption, true);
    }
  }

  

  return (
    <div
      style={{
        display: 'flex',
        top: '10%',
        left: `calc(50% - ${getModalSize('width') / 2}px)`,
        width: `${getModalSize('width')}px`,
        height: `${getModalSize('height')}px`,
      }}
      className={styles.monitorModal}
    >
      <div className={styles.monitorModalHeader}>
        <div>
          <span>{name ? `[${name}]` : formatMessage({ id: 'app.map.workstation' })}</span>
          <span>{`-${stopCellId}-${angle}`}</span>

          <Button
            onClick={() => {
              workStationCallback(workStation, dispatch);
            }}
            style={{ marginLeft: 15 }}
            type="link"
            size={'small'}
          >
            <FormattedMessage id="app.button.refresh" />
          </Button>
        </div>

        <div
          style={{
            textAlign: 'end',
          }}
        >
          <CloseOutlined onClick={close} style={{ cursor: 'pointer' }} />
        </div>
      </div>
      <div
        className={styles.monitorModalBody}
        style={{ paddingTop: 20, display: 'flex', flexFlow: 'column nowrap' }}
      >
        <div id="workStationTaskHistory" style={{ flex: '0 45%' }} />
        <div id="waitingHistory" style={{ flex: '0 40%' }} />
      </div>
      <div style={{ padding: '15px 0px 15px 15px', borderTop: '1px solid #333' }}>
        <Row className={styles.tool}>
          <Col span={24}>
            {!isStrictNull(currentRealRate?.goodsRate) && (
              <div>
                <span style={{ fontSize: '16px', color: LineChartsAxisColor }}>
                  <FormattedMessage id="monitor.workstation.label.speedCargo" />:
                </span>
                <span
                  style={{ fontSize: '16px', marginLeft: '8px', fontWeight: 500, color: DataColor }}
                >
                  {currentRealRate.goodsRate || 0}{' '}
                  <FormattedMessage id="monitor.workstation.label.count" />
                </span>
              </div>
            )}
            {!isStrictNull(currentRealRate?.agvRate) && (
              <div>
                <span style={{ fontSize: '16px', color: LineChartsAxisColor }}>
                  <FormattedMessage id="monitor.workstation.label.arrivalRate" />:
                </span>
                <span
                  style={{ fontSize: '16px', marginLeft: '8px', fontWeight: 500, color: DataColor }}
                >
                  {currentRealRate?.agvRate || 0}
                  {''}
                  <FormattedMessage id={'monitor.workstation.label.rate'} />
                </span>
              </div>
            )}
            {currentRealRate?.agvAndTaskProportion && (
              <div>
                <span style={{ fontSize: '16px', color: LineChartsAxisColor }}>
                  <FormattedMessage id="monitor.workstation.label.num" />:
                </span>
                <span
                  style={{ fontSize: '16px', marginLeft: '8px', fontWeight: 500, color: DataColor }}
                >
                  {currentRealRate?.agvAndTaskProportion}
                </span>
              </div>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default connect(({ monitor, monitorView }) => ({
  stationRateData: monitor?.stationRealRate,
  mapContext: monitor.mapContext,
  workStation: monitorView.workStationView?.workStationOB,
  waitingData: monitorView.workStationView?.workStationWaitingData,
  dataSource: monitorView.workStationView?.workStationTaskHistoryData,
}))(memo(WorkStationReport));
