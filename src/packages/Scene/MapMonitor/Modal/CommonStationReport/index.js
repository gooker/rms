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
  trafficHistoryLineOption,
} from './commonStationEchart';
import { commonStationCallback } from './stationUtil';
import { formatMessage, isStrictNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../../monitorLayout.module.less';

let taskHistoryLine = null;
let trafficHistoryLine = null;
let waitingHistoryLine = null;
const clientHeightBase = 1.3;
const clientWidthBase = 3;

const CommonStationReport = (props) => {
  const {
    dispatch,
    commonPoint,
    dataSource = {},
    waitingData = {},
    trafficData = {},
    refresh,
    stationRateData = [],
  } = props;
  const { name, angle, stopCellId } = commonPoint;
  const monitorScreenDOM = document.body;

  const [currentRealRate, setCurrentRealRate] = useState({}); // 当前站点的速率和等待时间等

  // eslint-disable-next-line no-unused-vars
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function close() {
    dispatch({ type: 'monitor/saveCategoryModal', payload: null });
    // dispatch({ type: 'monitor/saveCategoryPanel', payload: null });
  }

  useEffect(() => {
    async function init() {
      await commonStationCallback(commonPoint, dispatch);
      initChart();
    }
    init();
  }, []);

  // commonPoint 的变化触发显重新拉取数据，dataSource的变化触发图表数据更新
  useEffect(refreshChart, [commonPoint, dataSource, waitingData, trafficData]);

  function initChart() {
    // 到站次数
    taskHistoryLine = echarts.init(document.getElementById('commonPointTaskHistory'));
    taskHistoryLine.setOption(taskHistoryLineOption(), true);

    // 货物流量
    trafficHistoryLine = echarts.init(document.getElementById('commonPointTrafficHistory'));
    trafficHistoryLine.setOption(trafficHistoryLineOption(), true);

    // 最后30次空等时间
    waitingHistoryLine = echarts.init(document.getElementById('commonPointWaitingHistory'));
    waitingHistoryLine.setOption(waitingHistoryLineOption(), true);

    return () => {
      taskHistoryLine.dispose();
      taskHistoryLine = null;

      trafficHistoryLine.dispose();
      trafficHistoryLine = null;

      waitingHistoryLine.dispose();
      waitingHistoryLine = null;
    };
  }

  function refreshChart() {
    if (!taskHistoryLine || !waitingHistoryLine || !trafficHistoryLine) return;

    if (stationRateData && stationRateData.length > 1) {
      const currentRate = stationRateData.find((item) => {
        return item.stationCellId === stopCellId;
      });
      setCurrentRealRate(currentRate);
    }

    const commonPointTaskHistoryData = dataSource[`${stopCellId}`];
    const commonPointWaitingData = waitingData[`${stopCellId}`]; //
    const commonPointTrafficData = trafficData[`${stopCellId}`]; // todo 要更改

    if (commonPointTaskHistoryData) {
      const { taskHistoryData } = commonPointTaskHistoryData;
      const { xAxis, series } = taskHistoryData;
      const newTaskHistoryLineOption = taskHistoryLine.getOption();
      newTaskHistoryLineOption.xAxis = xAxis;
      newTaskHistoryLineOption.series = series;
      taskHistoryLine.setOption(newTaskHistoryLineOption, true);
    }

    if (commonPointWaitingData) {
      const { xAxis, series } = commonPointWaitingData;
      const newWaitingHistoryLineOption = waitingHistoryLine.getOption();
      newWaitingHistoryLineOption.xAxis = xAxis;
      newWaitingHistoryLineOption.series = series;
      waitingHistoryLine.setOption(newWaitingHistoryLineOption, true);
    }

    if (commonPointTrafficData) {
      const { xAxis, series } = commonPointTrafficData;
      const newTrafficHistoryLineOption = trafficHistoryLine.getOption();
      newTrafficHistoryLineOption.xAxis = xAxis;
      newTrafficHistoryLineOption.series = series;
      trafficHistoryLine.setOption(newTrafficHistoryLineOption, true);
    }
  }

  const _left = getModalSize('width') < 550 ? 550 / 2 : getModalSize('width') / 2;

  return (
    <div
      style={{
        display: 'flex',
        top: '10%',
        width: `${getModalSize('width')}px`,
        height: `${getModalSize('height')}px`,
        left: `calc(50% - ${_left}px)`,
        minWidth: '550px',
      }}
      className={styles.monitorModal}
    >
      <div className={styles.monitorModalHeader}>
        <div>
          <span>{name ? `[${name}]` : formatMessage({ id: 'app.map.station' })}</span>
          <span>{`-${stopCellId}-${angle}`}</span>

          <Button
            onClick={() => {
              commonStationCallback(commonPoint, dispatch);
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
        style={{ display: 'flex', flexFlow: 'column nowrap', height: `calc(100% - 45px-102px)` }}
      >
        <div id="commonPointTaskHistory" style={{ flex: '0 45%', minHeight: 215 }} />
        <div id="commonPointTrafficHistory" style={{ flex: '0 48%', minHeight: 215 }} />
        <div id="commonPointWaitingHistory" style={{ flex: '0 40%', minHeight: 215 }} />
      </div>
      <div style={{ padding: '15px 0px 15px 15px', borderTop: '1px solid #333', marginTop: 12 }}>
        <Row className={styles.tool}>
          <Col span={11} offset={1}></Col>
          <Col span={12}>
            {!isStrictNull(currentRealRate?.goodsRate) && (
              <div>
                <span style={{ fontSize: '16px', color: LineChartsAxisColor }}>
                  <FormattedMessage id="app.monitor.modal.workstation.label.speedCargo" />:
                </span>
                <span
                  style={{ fontSize: '16px', marginLeft: '8px', fontWeight: 500, color: DataColor }}
                >
                  {currentRealRate.goodsRate || 0}{' '}
                  <FormattedMessage id="app.monitor.modal.workstation.label.count" />
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
  commonPoint: monitorView.commonStationView?.commonPointOB,
  waitingData: monitorView.commonStationView?.commonPointWaitingData,
  dataSource: monitorView.commonStationView?.commonPointTaskHistoryData,
  trafficData: monitorView.commonStationView?.commonPointTrafficData,
}))(memo(CommonStationReport));
