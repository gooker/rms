import React, { memo, useState, useEffect } from 'react';
import { Row, Col, Tag, Spin, Switch, Button } from 'antd';
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
import styles from '../../monitorLayout.module.less';

let taskHistoryLine = null;
let waitingHistoryLine = null;
const clientHeightBase = 1.3;
const clientWidthBase = 3;

const WorkStationReport = (props) => {
  const {
    workStation,
    dataSource = {},
    waiting = {},
    stationRateData = [],
    dispatch,
    marker,
    refresh,
  } = props;

  function close() {
    dispatch({ type: 'monitor/saveCategoryModal', payload: null });
    dispatch({ type: 'monitor/saveCategoryPanel', payload: null });
    dispatch({
      type: 'monitor/saveStationElement',
      payload: {
        type: null,
      },
    });
  }

  const { name, angle, stopCellId, flag: showEmployee, color: employeeColor } = workStation;
  const monitorScreenDOM = document.body;

  const [agvs, setAgvs] = useState(null);
  const [checked, setChecked] = useState(false);
  const [color, setColor] = useState(employeeColor ?? '#1da1a3');
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

  useEffect(initChart, []);
  useEffect(initChart, []);

  // workStation 的变化触发显重新拉取数据，dataSource的变化触发图表数据更新
  useEffect(refreshChart, [workStation, dataSource, waiting]);

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
    setAgvs(null);
    setChecked(showEmployee);

    if (stationRateData && stationRateData.length > 1) {
      const currentRate = stationRateData.find((item) => {
        return item.stationCellId === stopCellId;
      });
      setCurrentRealRate(currentRate);
    }

    const workStationTaskHistoryData = dataSource[`${stopCellId}`];
    const workStationWaitingData = waiting[`${stopCellId}`];

    if (workStationTaskHistoryData) {
      const { robotIds, taskHistoryData } = workStationTaskHistoryData;
      setAgvs(robotIds);
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

  function renderTool() {
    if (agvs) {
      if (agvs.length > 0) {
        return agvs.map((id) => (
          <Tag key={id} color="rgba(1,137,255,0.6)">
            {id}
          </Tag>
        ));
      }
      return (
        <span style={{ color: 'rgb(3, 137, 255)' }}>
          <FormattedMessage id="monitor.tip.noTask" />
        </span>
      );
    }
    return <Spin />;
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
              refresh(workStation);
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
          <Col span={11} offset={1}>
            <div>
              <span style={{ fontSize: '16px', color: LineChartsAxisColor }}>
                <FormattedMessage id="monitor.workstation.label.serviceAMR" />:
              </span>
              <span
                style={{ fontSize: '16px', marginLeft: '8px', fontWeight: 500, color: DataColor }}
              >
                {agvs ? agvs.length : 0}
                {formatMessage({ id: 'monitor.workstation.label.piece' })}
              </span>
            </div>
            <div style={{ marginTop: 4, display: 'flex', flexFlow: 'row wrap' }}>
              {renderTool()}
            </div>
            <div style={{ marginTop: 4, display: 'flex' }}>
              <input
                disabled={checked || !agvs || agvs.length === 0}
                type="color"
                value={color}
                onChange={(e) => {
                  setColor(e.target.value);
                }}
              />

              <div style={{ marginLeft: '5px' }}>
                <Switch
                  checked={checked}
                  checkedChildren={formatMessage({
                    id: 'monitor.workstation.label.marked',
                  })}
                  unCheckedChildren={formatMessage({
                    id: 'monitor.workstation.label.unmarked',
                  })}
                  onChange={(value) => {
                    setChecked(value);
                    marker(agvs, value, { ...workStation, color, flag: value });
                  }}
                />
              </div>
            </div>
          </Col>
          <Col span={11}>
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
export default connect(({ monitor }) => ({
  stationRateData: monitor?.stationRealRate,
  mapContext: monitor.mapContext,
}))(memo(WorkStationReport));
