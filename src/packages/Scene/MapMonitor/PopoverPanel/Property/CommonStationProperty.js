import React, { memo, useState, useEffect } from 'react';
import { Tag, Switch, InputNumber, Popover, Row, Col } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';
import { fetchCommonPointInstrument } from '@/services/monitor';
import { CommonStationStatePolling } from '@/workers/CommonStationPollingManager';
import {
  transformCommonTrafficData,
  transitionRobots,
} from '../../Modal/CommonStationReport/commonStationEchart';
import { isStrictNull, formatMessage, isNull, dealResponse } from '@/utils/util';
import { StationStateColor } from '@/config/consts';
import styles from '../../monitorLayout.module.less';

const CommonStationProperty = (props) => {
  const {
    data,
    data: { $$formData },
    dispatch,
    mapContext,
    commonStationView: { commonPointOB, commonPointPolling, commonPointTaskHistoryData },
  } = props;
  const [checked, setChecked] = useState(false);
  const [color, setColor] = useState('#efa283');
  const [robotIds, setRobotIds] = useState([]);
  const [agvTypes, setAgvTypes] = useState({});
  const [popVisible, setPopVisible] = useState(false);

  useEffect(() => {
    async function init() {
      setChecked(data.showEmployee ?? false);
      setColor(data?.employeeColor || '#efa283');
      // 1.获取状态任务数
      // 2.获取分车带数
      await checkStation();
    }
    init();
  }, [data]);

  // 通用站点 点击
  async function checkStation() {
    const { stopCellId, angle } = $$formData;
    const curentStation = {
      name: data?.name,
      angle,
      stopCellId,
      showEmployee: data?.showEmployee,
      employeeColor: data?.employeeColor,
    };
    if (!isNull(stopCellId) && !isNull(angle)) {
      const taskResponse = await fetchCommonPointInstrument({
        stopCellId,
        stopDirection: angle,
      });
      if (!dealResponse(taskResponse)) {
        const taskCountData = { ...taskResponse };
        const robotIdMap = transitionRobots(taskCountData);
        const robotIds = [];
        Object.values(robotIdMap).map((ids) => {
          robotIds.push(...ids);
        });
        setRobotIds([1, 2, 4]);
        setAgvTypes({
          LatentLifting: [1, 2, 4],
        });
        dispatch({
          type: 'monitorView/saveCommonStationView',
          payload: {
            commonPointOB: curentStation,
          },
        });
      }
    }
  }

  function showStationReport() {
    dispatch({
      type: 'monitor/saveCategoryModal',
      payload: 'station',
    });
  }

  // 动作操作
  function operateStatus(status) {}

  // 标记
  function markerStation(agvs, checked, commonOB) {
    const { stopCellId, color, angle: direction } = commonOB;
    const currentStopCellId = `${stopCellId}`;

    // 更新地图显示
    mapContext.markCommonPoint(currentStopCellId, checked, color);
    mapContext.markCommonPointAgv(agvs, checked, color, currentStopCellId);

    let _currenyPollingData = [...commonPointPolling];
    if (checked) {
      _currenyPollingData.push(`${currentStopCellId}-${direction}`);
    } else {
      _currenyPollingData.splice(
        _currenyPollingData.indexOf(`${currentStopCellId}-${direction}`),
        1,
      );
    }
    dispatch({
      type: 'monitorView/saveWorkStationView',
      payload: {
        commonPointOB: commonOB,
        commonPointPolling: [..._currenyPollingData],
      },
    });
    // 根据_currenyWorkStations 决定轮询是开启还是关闭
    commonStationPollingCallback(_currenyPollingData);
  }

  /***轮询标记****/

  function commonStationPollingCallback(pollingData) {
    closePolling();
    if (pollingData?.length > 0) {
      const promises = [];
      // 收集请求队列
      pollingData.forEach((workStationID) => {
        const [stopCellId, direction] = workStationID.split('-');
        promises.push({ stopCellId, stopDirection: direction });
      });
      openPolling(promises);
    }
  }

  function openPolling(params) {
    CommonStationStatePolling.start(params, (response) => {
      const currentResponse = [...response];
      const _commonPointTaskHistoryData = { ...commonPointTaskHistoryData };
      currentResponse.map((data, index) => {
        if (!dealResponse(data)) {
          const stopCellId = data?.stopCellId; // 轮询返回结果 前端加上的
          const TaskCountData = { ...data };
          const robotIdMap = transitionRobots(TaskCountData);
          const taskHistoryData = transformCommonTrafficData(TaskCountData);
          _commonPointTaskHistoryData[stopCellId] = {
            robotIdMap,
            taskHistoryData,
          };
        }
      });
      dispatch({
        type: 'monitorView/saveWorkStationView',
        payload: {
          commonPointTaskHistoryData: _commonPointTaskHistoryData,
        },
      });
      // 根据返回数据刷新小车标记
      Object.keys(_commonPointTaskHistoryData).forEach((stopId) => {
        const { robotIdMap } = _commonPointTaskHistoryData[stopId];
        const robotIds = [];
        Object.values(robotIdMap).map((ids) => {
          robotIds.push(...ids);
        });
        mapContext.markCommonPointAgv(robotIds, true, null, stopId);
      });
    });
  }

  function closePolling() {
    CommonStationStatePolling.terminate();
  }
  /**轮询结束***/

  function renderAgvTypesContent() {
    if (robotIds?.length > 0) {
      return (
        <div>
          {Object.entries(agvTypes).map(([type, value]) => {
            if (agvTypes[type]) {
              return (
                <>
                  <Row key={`${type}-${value}`}>
                    <Col>{formatMessage({ id: `app.agvType.${type}` })}:</Col>
                    <Col style={{ marginLeft: 10 }}>
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

  return (
    <>
      <div>
        <FormattedMessage id={'app.map.station'} />
        <FormattedMessage id={'app.common.prop'} />
      </div>
      <div>
        <div>
          {/* 站点*/}
          <div className={styles.rightSideContentDetail}>
            <div>
              <img
                alt={'station'}
                style={{ width: 45, height: 'auto' }}
                src={require('../../category/workStationTask_category.png').default}
              />
              <span>
                <FormattedMessage id={'app.map.station'} />
              </span>
            </div>
            <div>{data?.name || $$formData?.station}</div>
          </div>

          {/* 状态 */}
          <div className={styles.rightSideContentDetail}>
            <div>
              <img
                alt={'station'}
                style={{ width: 25, height: 25 }}
                src={require('@/packages/Scene/icons/state.png').default}
              />
              <span>
                <FormattedMessage id={'app.common.status'} />
              </span>
            </div>
            <div>
              {!isStrictNull(data.status) && (
                <Tag color={StationStateColor[data.status]}>
                  <FormattedMessage id={`monitor.station.status.${data.status}`} />
                </Tag>
              )}
            </div>
          </div>

          {/* 任务数 */}
          <div className={styles.rightSideContentDetail}>
            <div>
              <img
                alt={'station'}
                style={{ width: 25, height: 25 }}
                src={require('@/packages/Scene/icons/task.png').default}
              />
              <span>
                <FormattedMessage id={'app.task'} />
              </span>
            </div>
            <div style={{ cursor: 'pointer', color: '#fff' }}>
              {!isStrictNull(data.taskNum) ? data.taskNum : null}
              {}
            </div>
          </div>

          {/* 分车数 */}
          <div className={styles.rightSideContentDetail}>
            <div>
              <img
                alt={'station'}
                style={{ width: 35 }}
                src={require('../../category/latent_category.svg').default}
              />
              <span>
                <FormattedMessage id={'monitor.workstation.allocateAMRnum'} />
              </span>
            </div>
            <Popover
              content={
                <Row style={{ maxWidth: 250, wordBreak: 'break-all' }}>
                  {renderAgvTypesContent()}
                </Row>
              }
              placement="bottom"
              trigger="click"
              visible={popVisible}
              onVisibleChange={(visible) => {
                setPopVisible(visible);
              }}
              style={{ minWidth: 260 }}
              title={<FormattedMessage id="monitor.workstation.label.serviceAMR" />}
            >
              <div>{robotIds?.length}</div>
            </Popover>
          </div>

          {!isStrictNull(robotIds) && robotIds.length > 0 && (
            <div>
              <div className={styles.allocatedContent}>
                {robotIds.map((item, index) => {
                  if (index < 10) {
                    return <span key={item}>{item}</span>;
                  } else if (index === 10) {
                    return (
                      <Tag
                        key={`${item}${index}`}
                        color="rgba(1,137,255,0.6)"
                        onClick={() => {
                          setPopVisible(true);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <FormattedMessage id="monitor.station.more" />
                      </Tag>
                    );
                  }
                })}
              </div>

              {/* 标记 */}
              <div className={styles.markedContent}>
                <div className={styles.marked}>
                  <input
                    disabled={checked || !robotIds || robotIds.length === 0}
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
                        markerStation(robotIds, value, {
                          ...commonPointOB,
                          color,
                          flag: value,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 分车上限 */}
          <div className={styles.rightSideContentDetail}>
            <div style={{ width: 60 }}>
              <img
                alt={'station'}
                style={{ width: 25, height: 25 }}
                src={require('../../category/max.png').default}
              />
              <span>
                <FormattedMessage id={'monitor.workstation.allocateAMRnum.limit'} />
              </span>
            </div>
            <div style={{ cursor: 'pointer', color: '#fff' }}>
              <InputNumber value={data?.maxCount} min={0} />
            </div>
          </div>
        </div>

        {/* 操作区域*/}
        <div style={{ marginTop: 30 }}>
          {/* 开启结束暂停 查看报表 */}
          <div className={styles.rightSideAgvContentOperation}>
            <div className={styles.rightSideAgvContentOperationItem2}>
              <div
                onClick={() => {
                  operateStatus('start');
                }}
                style={{ background: data?.status === 'start' ? '#ff8400' : '' }}
              >
                <img
                  alt={'agv'}
                  src={require('@/packages/Scene/MapMonitor/category/start.png').default}
                />
              </div>
              <div>
                <FormattedMessage id={'app.button.turnOn'} />
              </div>
            </div>
            <div className={styles.rightSideAgvContentOperationItem2}>
              <div
                onClick={() => {
                  operateStatus('paused');
                }}
                style={{ background: data?.status === 'paused' ? '#ff8400' : '' }}
              >
                <img
                  alt={'agv'}
                  src={require('@/packages/Scene/MapMonitor/category/paused.png').default}
                />
              </div>
              <div>
                <FormattedMessage id={'app.common.status.pause'} />
              </div>
            </div>
            <div className={styles.rightSideAgvContentOperationItem2}>
              <div
                onClick={() => {
                  operateStatus('end');
                }}
                style={{ background: data?.status === 'end' ? '#ff8400' : '' }}
              >
                <img
                  alt={'agv'}
                  src={require('@/packages/Scene/MapMonitor/category/end.png').default}
                />
              </div>
              <div>
                <FormattedMessage id={'app.common.status.end'} />
              </div>
            </div>
          </div>

          <div className={styles.rightSideAgvContentOperation}>
            <div className={styles.rightSideAgvContentOperationItem2}>
              <div onClick={showStationReport}>
                <img
                  alt={'station'}
                  style={{ width: 35 }}
                  src={require('@/packages/Scene/MapMonitor/category/report_category.svg').default}
                />
              </div>
              <div>
                <FormattedMessage id={'app.common.report'} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(({ monitor, monitorView }) => ({
  mapContext: monitor.mapContext,
  categoryModal: monitor.categoryModal,
  categoryPanel: monitor.categoryPanel,
  commonStationView: monitorView.commonStationView,
}))(memo(CommonStationProperty));
