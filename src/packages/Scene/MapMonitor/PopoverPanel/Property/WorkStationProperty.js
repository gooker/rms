import React, { memo, useEffect, useState } from 'react';
import { InputNumber, Switch, Tag } from 'antd';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';
import { fetchWorkStationInstrument } from '@/services/monitorService';
import { WorkStationStatePolling } from '@/workers/WebWorkerManager';
import { covertData2ChartsData } from '@/packages/Scene/MapMonitor/Modal/WorkStationReport/workStationEchart';
import { dealResponse, formatMessage, isNull, isStrictNull } from '@/utils/util';
import { StationStateColor } from '@/config/consts';
import styles from '../../monitorLayout.module.less';
import { CarOutlined } from '_@ant-design_icons@4.7.0@@ant-design/icons';

const WorkStationProperty = (props) => {
  const {
    data,
    data: { $$formData },
    dispatch,
    mapContext,
    workStationView: { workStationOB, workStationPolling, workStationTaskHistoryData },
  } = props;
  const [checked, setChecked] = useState(false);
  const [color, setColor] = useState('#1da1a3');
  const [vehicleIds, setVehicleIds] = useState([]);

  useEffect(() => {
    async function init() {
      setChecked(data.showEmployee ?? false);
      setColor(data?.employeeColor || '#1da1a3');
      // 1.获取状态任务数
      // 2.获取分车带数
      await checkWorkStation();
    }
    init();
  }, [data]);

  // 工作站点击
  async function checkWorkStation() {
    const { stopCellId, direction } = data;
    const curentWorkStation = {
      name: data?.name,
      angle: data?.angle,
      direction,
      stopCellId,
      showEmployee: data?.showEmployee,
      employeeColor: data?.employeeColor,
    };
    if (!isNull(stopCellId) && !isNull(direction)) {
      const taskHistoryResponse = await fetchWorkStationInstrument({
        stopCellId,
        stopDirection: direction,
      });
      if (!dealResponse(taskHistoryResponse)) {
        const { vehicleIds = [] } = taskHistoryResponse;
        // setVehicleIds([1, 2, 3, 5]);

        dispatch({
          type: 'monitorView/saveWorkStationView',
          payload: {
            workStationOB: curentWorkStation,
          },
        });
      }
    }
  }

  function showStationReport() {
    dispatch({
      type: 'monitor/saveCategoryModal',
      payload: 'WorkStation',
    });
  }

  // 动作操作
  function operateStatus(status) {}

  function markerWorkStation(vehicles, checked, stationOB) {
    const { stopCellId, color, direction } = stationOB;
    const currentStopCellId = `${stopCellId}`;

    // 更新地图显示
    mapContext.markWorkStation(currentStopCellId, checked, color);
    mapContext.markWorkStationVehicle(vehicles, checked, color, currentStopCellId);

    let _currenyWorkStations = [...workStationPolling];
    if (checked) {
      _currenyWorkStations.push(`${currentStopCellId}-${direction}`);
    } else {
      _currenyWorkStations.splice(
        _currenyWorkStations.indexOf(`${currentStopCellId}-${direction}`),
        1,
      );
    }
    dispatch({
      type: 'monitorView/saveWorkStationView',
      payload: {
        workStationOB: stationOB,
        workStationPolling: [..._currenyWorkStations],
      },
    });
    // 根据_currenyWorkStations 决定轮询是开启还是关闭
    workStationPollingCallback(_currenyWorkStations);
  }

  /***轮询标记****/
  function workStationPollingCallback(pollingData) {
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
    WorkStationStatePolling.start(params, (response) => {
      const currentResponse = [...response];
      const _workStationTaskHistoryData = { ...workStationTaskHistoryData };
      currentResponse.map((data, index) => {
        if (!dealResponse(data)) {
          const stopCellId = data?.stopCellId; // 轮询返回结果 前端加上的
          const { vehicleIds, taskCountMap } = data;
          const taskHistoryData = covertData2ChartsData(taskCountMap);
          _workStationTaskHistoryData[stopCellId] = { vehicleIds, taskHistoryData };
        }
      });
      dispatch({
        type: 'monitorView/saveWorkStationView',
        payload: {
          workStationTaskHistoryData: _workStationTaskHistoryData,
        },
      });
      // 根据返回数据刷新小车标记
      Object.keys(_workStationTaskHistoryData).forEach((stopId) => {
        const { vehicleIds } = _workStationTaskHistoryData[stopId];
        mapContext?.markWorkStationVehicle(vehicleIds, true, null, stopId);
      });
    });
  }

  function closePolling() {
    WorkStationStatePolling.terminate();
  }
  /**轮询结束***/

  return (
    <>
      <div>
        <FormattedMessage id={'app.map.workStation'} />
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
            <div>{data.name || $$formData?.station}</div>
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
            <CarOutlined /> <FormattedMessage id={'monitor.workstation.allocateAMRnum'} />
            <div>{vehicleIds?.length > 0}</div>
          </div>

          {!isStrictNull(vehicleIds) && vehicleIds.length > 0 && (
            <div>
              <div className={styles.allocatedContent}>
                {vehicleIds.map((item, index) => {
                  return <span key={index}>{item}</span>;
                })}
              </div>
              <div className={styles.markedContent}>
                <div className={styles.marked}>
                  <input
                    disabled={checked || !vehicleIds || vehicleIds.length === 0}
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
                        markerWorkStation(vehicleIds, value, {
                          ...workStationOB,
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
          {/* 开启结束暂停 */}
          <div className={styles.rightSideVehicleContentOperation}>
            <div className={styles.rightSideVehicleContentOperationItem2}>
              <div
                onClick={() => {
                  operateStatus('start');
                }}
                style={{ background: data?.status === 'start' ? '#ff8400' : '' }}
              >
                <img
                  alt={'vehicle'}
                  src={require('@/packages/Scene/MapMonitor/category/start.png').default}
                />
              </div>
              <div>
                <FormattedMessage id={'app.button.turnOn'} />
              </div>
            </div>
            <div className={styles.rightSideVehicleContentOperationItem2}>
              <div
                onClick={() => {
                  operateStatus('paused');
                }}
                style={{ background: data?.status === 'paused' ? '#ff8400' : '' }}
              >
                <img
                  alt={'vehicle'}
                  src={require('@/packages/Scene/MapMonitor/category/paused.png').default}
                />
              </div>
              <div>
                <FormattedMessage id={'app.triggerState.pause'} />
              </div>
            </div>
            <div className={styles.rightSideVehicleContentOperationItem2}>
              <div
                onClick={() => {
                  operateStatus('end');
                }}
                style={{ background: data?.status === 'end' ? '#ff8400' : '' }}
              >
                <img
                  alt={'vehicle'}
                  src={require('@/packages/Scene/MapMonitor/category/end.png').default}
                />
              </div>
              <div>
                <FormattedMessage id={'app.triggerState.end'} />
              </div>
            </div>
          </div>

          {/* 报表 */}
          <div className={styles.rightSideVehicleContentOperation}>
            <div className={styles.rightSideVehicleContentOperationItem2}>
              <div onClick={showStationReport}>
                <img
                  alt={'station'}
                  style={{ width: 25, height: 25 }}
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
  workStationView: monitorView.workStationView,
}))(memo(WorkStationProperty));
