import React, { memo, useEffect, useState } from 'react';
import { Popconfirm } from 'antd';
import { withRouter } from 'react-router-dom';
import FormattedMessage from '@/components/FormattedMessage';

import {
  fetchManualMode,
  fetchVehicleInfo,
  fetchVehicleRunningInfo,
  getAlertCentersByTaskIdOrVehicleId,
} from '@/services/commonService';
import { goToCharge, goToRest } from '@/services/taskService';
import { vehicleRemoteControl } from '@/services/monitorService';
import { updateVehicleMaintain } from '@/services/resourceService';
import { dealResponse, formatMessage, isNull, renderBattery, renderVehicleState } from '@/utils/util';
import { connect } from '@/utils/RmsDva';
import { AppCode } from '@/config/config';
import styles from '../../monitorLayout.module.less';
import { LoadingOutlined } from '@ant-design/icons';

const checkedColor = '#ff8400';

const VehicleElementProp = (props) => {
  const { data, dispatch, history, selectVehicle, showRoute } = props;

  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('');
  const [vehicleId, setVehicleId] = useState(null);
  const [currentVehicleInfo, setCurrentVehicleInfo] = useState({});
  const [mainTain, setMainTain] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [pathChecked, setPathChecked] = useState(false);
  const [vehicleAlarmList, setVehicleAlarmList] = useState([]);

  useEffect(() => {
    async function init() {
      setVehicleId(JSON.parse(data.id));
      if (selectVehicle.includes(data.uniqueId) && showRoute) {
        setPathChecked(true);
      } else {
        setPathChecked(false);
      }
      // 1.获取小车属性
      await getVehicleInfo();
    }
    init();
  }, [data]);

  async function getVehicleInfo() {
    setLoading(true);
    const { vehicleType } = data;
    const [response, alertResponse] = await Promise.all([
      fetchVehicleInfo(data.id, vehicleType),
      getAlertCentersByTaskIdOrVehicleId({ vehicleId: JSON.parse(data.id), vehicleType }),
    ]);

    if (!dealResponse(response)) {
      const { vehicle = {} } = response;
      setCurrentVehicleInfo(response);
      setType(vehicle?.vehicleType);
      setMainTain(vehicle?.maintain); // 维护
      setManualMode(vehicle?.manualMode); // 是否手动
    }

    if (alertResponse && !dealResponse(alertResponse)) {
      const newTaskAlarm = [];
      alertResponse.map(({ alertItemList }) => {
        if (Array.isArray(alertItemList)) {
          alertItemList.map((item) => {
            newTaskAlarm.push({ ...item });
          });
        }
      });
      setVehicleAlarmList(newTaskAlarm);
      dispatch({ type: 'monitorView/saveVehicleAlarmList', payload: newTaskAlarm });
    }
    setLoading(false);
  }

  function goToVehicleDetail() {
    const route = `/ResourceManage/vehicle/realTime`;
    history.push({ pathname: route, search: `uniqueId=${data.uniqueId}` });
  }

  function checkTaskDetail(taskId, vehicleType) {
    dispatch({
      type: 'task/fetchTaskDetailByTaskId',
      payload: { taskId, vehicleType },
    });
  }

  function showVehicleAlert() {
    dispatch({
      type: 'monitor/saveCategoryModal',
      payload: 'VehicleAlert',
    });
  }

  // 运行时
  async function showRunInfo() {
    const response = await fetchVehicleRunningInfo({ vehicleId: vehicleId });
    if (!dealResponse(response)) {
      const newInfoList = [];
      Object.values(response).forEach(
        ({ vehicleRunningStatus, vehicleInfoTypeI18n, detailFormat }) => {
          newInfoList.push({
            type: vehicleRunningStatus,
            title: vehicleInfoTypeI18n,
            message: detailFormat,
          });
        },
      );
      dispatch({ type: 'monitor/saveVehicleRunningInfoList', payload: newInfoList });
    }
    dispatch({ type: 'monitor/saveCategoryModal', payload: 'VehicleRunInfo' });
  }

  function goCharge() {
    goToCharge({ vehicleId: vehicleId, vehicleType: data.vehicleType }).then((response) =>
      dealResponse(response, true),
    );
  }

  function toRest() {
    goToRest({ vehicleId: vehicleId, vehicleType: data.vehicleType }).then((response) => {
      dealResponse(response, true);
    });
  }

  // 发送小车Hex命令
  async function sendVehicleHexCommand(hexCommand) {
    const params = {
      vehicleId,
      rawCommandHex: hexCommand,
    };
    const response = await vehicleRemoteControl(type, params);
    dealResponse(response, true);
  }

  // 维护小车
  async function mainTainVehicle() {
    const params = {
      disabled: !mainTain,
      vehicleInfos: [
        {
          adapterType: currentVehicleInfo?.adapterType?.adapterType,
          vehicleId,
        },
      ],
    };
    const response = await updateVehicleMaintain(params);
    if (!dealResponse(response, 1)) {
      setMainTain(!mainTain);
    }
  }

  // 切换小车手动模式
  async function switchManualMode() {
    const params = {
      vehicleId,
      manualMode: !manualMode,
    };
    const response = await fetchManualMode(type, params);
    if (!dealResponse(response, 1)) {
      setManualMode(!manualMode);
    }
  }

  function vehiclePthchanged() {
    let allSelectedVehicleUniqueIds = [...selectVehicle];
    showRoutePollingCallback(false);
    if (pathChecked) {
      allSelectedVehicleUniqueIds.splice(
        allSelectedVehicleUniqueIds.indexOf(`${data.uniqueId}`),
        1,
      );
      setPathChecked(false);
    } else {
      allSelectedVehicleUniqueIds.push(`${data.uniqueId}`);
      setPathChecked(true);
      dispatch({
        type: 'monitorView/saveRouteView',
        payload: {
          showRoute: true,
        },
      });
    }
    dispatch({
      type: 'monitorView/saveViewState',
      payload: { selectVehicle: allSelectedVehicleUniqueIds },
    });

    if (allSelectedVehicleUniqueIds?.length > 0) {
      showRoutePollingCallback(true, allSelectedVehicleUniqueIds); // 开启轮询
    }
  }

  // 触发显示路径的轮询
  function showRoutePollingCallback(flag, ids) {
    dispatch({
      type: 'monitorView/routePolling',
      payload: { flag, ids },
    });
  }

  // 车辆实时信息展示
  function renderVehicle() {
    if (loading) {
      return <LoadingOutlined />;
    }
    return currentVehicleInfo?.vehicleId;
  }

  function renderBatteryState() {
    if (loading) {
      return <LoadingOutlined />;
    }
    const battery = currentVehicleInfo?.vehicleInfo?.battery;
    return !isNull(battery) && renderBattery(battery);
  }

  function renderVehicleStatus() {
    if (loading) {
      return <LoadingOutlined />;
    }
    const status = currentVehicleInfo?.vehicleWorkStatusDTO?.vehicleStatus;
    return status && renderVehicleState(status);
  }

  function renderVehicleLoad() {
    if (loading) {
      return <LoadingOutlined />;
    }
    return currentVehicleInfo?.vehicleInfo?.loadUniqueIds ?? '-';
  }

  function renderTask() {
    if (loading) {
      return <LoadingOutlined />;
    }
    const taskId = currentVehicleInfo?.taskId;
    return !isNull(taskId) ? `*${taskId.substr(currentVehicleInfo.taskId.length - 6, 6)}` : '-';
  }

  return (
    <>
      {/* 内容头 */}
      <div>
        <FormattedMessage id={'app.common.prop'} />
      </div>
      {/* 内容体 */}
      <div>
        {/* 车辆实时信息 */}
        <div style={{ padding: '0 8px' }}>
          <div
            className={styles.rightSideContentDetail}
            onClick={goToVehicleDetail}
            style={{ cursor: 'pointer' }}
          >
            <img
              alt={'vehicle'}
              style={{ width: 35 }}
              src={require('../../category/vehicle.svg')?.default}
            />
            <div style={{ textDecoration: 'underline' }}>{renderVehicle()}</div>
          </div>

          {/* 电量 */}
          <div className={styles.rightSideContentDetail}>
            <img
              alt={'electricity'}
              src={require('@/packages/Scene/icons/electricity.png').default}
            />
            <div>{renderBatteryState()}</div>
          </div>

          {/* 小车状态 */}
          <div className={styles.rightSideContentDetail}>
            <img alt={'vehicle'} src={require('@/packages/Scene/icons/state.png').default} />
            <div>{renderVehicleStatus()}</div>
          </div>

          {/* 载具 */}
          <div className={styles.rightSideContentDetail}>
            <img alt={'vehicle'} src={require('@/packages/Scene/icons/pod.png').default} />
            <div>{renderVehicleLoad()}</div>
          </div>

          {/* 任务 */}
          <div className={styles.rightSideContentDetail}>
            <img alt={'vehicle'} src={require('@/packages/Scene/icons/task.png').default} />
            <div
              style={{ cursor: 'pointer', color: '#fff' }}
              onClick={() => {
                checkTaskDetail(currentVehicleInfo?.taskId, type);
              }}
            >
              {renderTask()}
            </div>
          </div>

          {/* 异常 */}
          <div className={styles.rightSideContentDetail}>
            <img alt={'vehicle'} src={require('@/packages/Scene/icons/error.png').default} />
            <div
              style={{ color: '#ff0000', textDecoration: 'underline', cursor: 'pointer' }}
              onClick={showVehicleAlert}
            >
              {vehicleAlarmList?.length}
            </div>
          </div>
        </div>

        {/* 操作区域 */}
        <div style={{ marginTop: 30 }}>
          {/* 充电、休息 */}
          <div className={styles.rightSideVehicleContentOperation}>
            <div className={styles.rightSideVehicleContentOperationItem} onClick={goCharge}>
              <div>
                <img alt={'vehicle'} src={require('@/packages/Scene/icons/charger.png').default} />
              </div>
              <div>
                <FormattedMessage id={'monitor.right.charge'} />
              </div>
            </div>
            <div className={styles.rightSideVehicleContentOperationItem} onClick={toRest}>
              <div>
                <img alt={'vehicle'} src={require('@/packages/Scene/icons/rest.png').default} />
              </div>
              <div>
                <FormattedMessage id={'monitor.right.goPark'} />
              </div>
            </div>
            <div style={{ width: 65 }} />
          </div>

          {/* 路径、维护、手动 */}
          <div className={styles.rightSideVehicleContentOperation}>
            <div
              className={styles.rightSideVehicleContentOperationItem2}
              onClick={vehiclePthchanged}
            >
              <div style={{ background: pathChecked ? checkedColor : '' }}>
                <img alt={'vehicle'} src={require('@/packages/Scene/icons/path.png').default} />
              </div>
              <div>
                <FormattedMessage id={'monitor.path'} />
              </div>
            </div>

            {/* 维护 */}
            <Popconfirm
              title={formatMessage({ id: 'app.message.doubleConfirm' })}
              onConfirm={mainTainVehicle}
              okText={formatMessage({ id: 'app.button.confirm' })}
              cancelText={formatMessage({ id: 'app.button.cancel' })}
            >
              <div className={styles.rightSideVehicleContentOperationItem2}>
                <div style={{ background: mainTain ? checkedColor : '' }}>
                  <img
                    alt={'vehicle'}
                    src={require('@/packages/Scene/icons/maintain.png').default}
                  />
                </div>
                <div>
                  <FormattedMessage id={'monitor.maintain'} />
                </div>
              </div>
            </Popconfirm>

            {/* 手动*/}
            <Popconfirm
              title={formatMessage({ id: 'app.message.doubleConfirm' })}
              onConfirm={switchManualMode}
              okText={formatMessage({ id: 'app.button.confirm' })}
              cancelText={formatMessage({ id: 'app.button.cancel' })}
            >
              <div className={styles.rightSideVehicleContentOperationItem2}>
                <div style={{ background: manualMode ? checkedColor : '' }}>
                  <img alt={'vehicle'} src={require('@/packages/Scene/icons/manual.png').default} />
                </div>
                <div>
                  <FormattedMessage id={'monitor.manual'} />
                </div>
              </div>
            </Popconfirm>
          </div>

          {/* 重置、重启、运行时 */}
          <div className={styles.rightSideVehicleContentOperation}>
            <Popconfirm
              title={formatMessage({ id: 'app.message.doubleConfirm' })}
              onConfirm={() =>
                sendVehicleHexCommand(
                  type === AppCode.ForkLifting ? '02' : '80',
                  formatMessage({ id: 'app.button.reset' }),
                )
              }
              okText={formatMessage({ id: 'app.button.confirm' })}
              cancelText={formatMessage({ id: 'app.button.cancel' })}
            >
              <div className={styles.rightSideVehicleContentOperationItem}>
                <div>
                  <img alt={'vehicle'} src={require('@/packages/Scene/icons/reset.png').default} />
                </div>
                <div>
                  <FormattedMessage id={'app.button.reset'} />
                </div>
              </div>
            </Popconfirm>

            <Popconfirm
              title={formatMessage({ id: 'app.message.doubleConfirm' })}
              onConfirm={() => sendVehicleHexCommand('02 60 00 00')}
              okText={formatMessage({ id: 'app.button.confirm' })}
              cancelText={formatMessage({ id: 'app.button.cancel' })}
            >
              <div className={styles.rightSideVehicleContentOperationItem}>
                <div>
                  <img alt={'vehicle'} src={require('@/packages/Scene/icons/reboot.png').default} />
                </div>
                <div>
                  <FormattedMessage id={'monitor.reboot'} />
                </div>
              </div>
            </Popconfirm>

            <div className={styles.rightSideVehicleContentOperationItem} onClick={showRunInfo}>
              <div>
                <img alt={'vehicle'} src={require('@/packages/Scene/icons/runTime.png').default} />
              </div>
              <div>
                <FormattedMessage id={'monitor.runTime'} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default connect(({ monitorView, monitor }) => ({
  selectVehicle: monitorView.selectVehicle ?? [],
  showRoute: monitorView.routeView?.showRoute,
}))(withRouter(memo(VehicleElementProp)));
