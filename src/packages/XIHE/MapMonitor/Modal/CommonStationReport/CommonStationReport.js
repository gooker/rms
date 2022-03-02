import React, { memo, useState, useEffect } from 'react';
import { Row, Col, Tag, Spin, Switch, Button, Popover } from 'antd';
import echarts from 'echarts';
import { CloseOutlined } from '@ant-design/icons';
import { useMap } from '@umijs/hooks';
import { connect } from '@/utils/RmsDva';
import {
  waitingHistoryLineOption,
  taskHistoryLineOption,
  LineChartsAxisColor,
  DataColor,
  transformType,
  trafficHistoryLineOption,
} from './commonStationEchart';
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
    marker,
    dataSource = {},
    waiting = {},
    traffic = {},
    refresh,
    stationRateData = [],
  } = props;
  const { name, angle, stopCellId, flag: showEmployee, color: employeeColor } = commonPoint;
  const monitorScreenDOM = document.body;

  const [agvs, setAgvs] = useState(null);
  const [checked, setChecked] = useState(false);
  const [color, setColor] = useState(employeeColor ?? '#efa283');
  const [agvTypes, setAgvTypes] = useState({});
  const [currentRealRate, setCurrentRealRate] = useState({}); // 当前站点的速率和等待时间等
  const [popVisible, setPopVisible] = useState(false);

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
    dispatch({ type: 'monitor/saveCategoryPanel', payload: null });
    dispatch({
      type: 'monitor/saveStationElement',
      payload: {
        type: null,
      },
    });
  }

  useEffect(initChart, []);

  // commonPoint 的变化触发显重新拉取数据，dataSource的变化触发图表数据更新
  useEffect(refreshChart, [commonPoint, dataSource, waiting, traffic]);

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
    setAgvs(null);
    setChecked(showEmployee);

    if (stationRateData && stationRateData.length > 1) {
      const currentRate = stationRateData.find((item) => {
        return item.stationCellId === stopCellId;
      });
      setCurrentRealRate(currentRate);
    }

    const commonPointTaskHistoryData = dataSource[`${stopCellId}`];
    const commonPointWaitingData = waiting[`${stopCellId}`]; //
    const commonPointTrafficData = traffic[`${stopCellId}`]; // todo 要更改

    if (commonPointTaskHistoryData) {
      const { robotIdMap, taskHistoryData } = commonPointTaskHistoryData;
      const robotIds = [];
      Object.values(robotIdMap).map((ids) => {
        robotIds.push(...ids);
      });
      setAgvs(robotIds);
      setAgvTypes(robotIdMap);
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

  function renderPopContent() {
    if (agvs && agvs.length > 0) {
      return (
        <div>
          {Object.entries(agvTypes).map(([type, value]) => {
            if (agvTypes[type]) {
              return (
                <>
                  <Row key={Math.floor(Math.random() * 100)}>
                    <Col>
                      {formatMessage({ id: `app.monitor.modal.AGV.${transformType[type]}` })}:
                    </Col>
                    <Col>
                      {value.length > 0
                        ? value.map((id) => {
                            return (
                              <Tag key={id} color="blue">
                                {id}
                              </Tag>
                            );
                          })
                        : '--'}
                    </Col>
                  </Row>
                </>
              );
            }
          })}
        </div>
      );
    } else {
      return (
        <span style={{ color: 'rgb(3, 137, 255)' }}>
          <FormattedMessage id="monitor.tip.noTask" />
        </span>
      );
    }
  }

  function renderTool() {
    if (agvs) {
      if (agvs.length > 0) {
        return agvs.map((id, index) => {
          if (index < 5) {
            return (
              <Tag key={id} color="rgba(1,137,255,0.6)">
                {id}
              </Tag>
            );
          } else if (index === 5) {
            return (
              <Tag
                key={`${id}${index}`}
                color="rgba(1,137,255,0.6)"
                onClick={() => {
                  setPopVisible(true);
                }}
                style={{ cursor: 'pointer' }}
              >
                ...
                <FormattedMessage id="app.monitor.modal.more" />
              </Tag>
            );
          }
        });
      }
      return (
        <span style={{ color: 'rgb(3, 137, 255)' }}>
          <FormattedMessage id="monitor.tip.noTask" />
        </span>
      );
    }
    return <Spin />;
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
              refresh(commonPoint);
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
          <Col span={11} offset={1}>
            <div>
              <span style={{ fontSize: '16px', color: LineChartsAxisColor }}>
                <FormattedMessage id="monitor.workstation.label.serviceAMR" />:
              </span>
              <Popover
                content={
                  <Row style={{ maxWidth: 250, wordBreak: 'break-all' }}>{renderPopContent()}</Row>
                }
                trigger="click"
                visible={popVisible}
                onVisibleChange={(visible) => {
                  setPopVisible(visible);
                }}
                style={{ minWidth: 260 }}
                title={<FormattedMessage id="monitor.workstation.label.serviceAMR" />}
              >
                <span
                  style={{
                    fontSize: '16px',
                    marginLeft: '8px',
                    fontWeight: 500,
                    color: DataColor,
                  }}
                >
                  {agvs ? agvs.length : 0}
                  {formatMessage({ id: 'monitor.workstation.label.piece' })}
                </span>
              </Popover>
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
                    marker(agvs, value, { ...commonPoint, flag: value, color });
                  }}
                />
              </div>
            </div>
          </Col>
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
export default connect(({ monitor }) => ({
  stationRateData: monitor?.stationRealRate,
}))(memo(CommonStationReport));
