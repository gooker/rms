import React, { memo, useEffect, useState } from 'react';
import { message, Popconfirm } from 'antd';
import { connect } from '@/utils/RmsDva';
import { withRouter } from 'react-router-dom';
import { find } from 'lodash';
import FormattedMessage from '@/components/FormattedMessage';
import {
  fetchMaintain,
  fetchManualMode,
  fetchVehicleInfo,
  fetchVehicleRunningInfo,
  getAlertCentersByTaskIdOrVehicleId,
} from '@/services/commonService';
import { goToCharge, goToRest } from '@/services/taskService';
import { vehicleRemoteControl } from '@/services/monitorService';
import {
  dealResponse,
  formatMessage,
  isStrictNull,
  renderBattery,
  renderVehicleState,
} from '@/utils/util';
import { AppCode } from '@/config/config';
import styles from '../../monitorLayout.module.less';
import style from './index.module.less';

const checkedColor = '#ff8400';
const VehicleCategory = {
  LatentLifting: 'latent',
  Tote: 'tote',
  Sorter: 'sorter',
};

const VehicleElementProp = (props) => {
  const { data, type, dispatch, history, selectVehicle, showRoute, allVehicles } = props;
  const [vehicleInfo, setVehicleInfo] = useState({});
  const [vehicleId, setVehicleId] = useState(null);
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
    const [response, alertResponse] = await Promise.all([
      fetchVehicleInfo(data.id, data.vehicleType),
      getAlertCentersByTaskIdOrVehicleId({ vehicleId: JSON.parse(data.id) }),
    ]);

    const filterVehicleInfo = find(
      allVehicles,
      (item) => item.vehicleId === data.id && item?.vehicle?.id === data.uniqueId,
    );
    if (!dealResponse(response)) {
      const { vehicle = {}, vehicleInfo = {}, vehicleWorkStatusDTO = {} } = filterVehicleInfo;

      setVehicleInfo({ ...vehicleInfo, ...vehicleWorkStatusDTO });
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
  }

  function goToVehicleDetail() {
    const route = `/ResourceManage/Vehicle/VehicleRealTime`;
    history.push({ pathname: route, search: `uniqueId=${data.uniqueId}` });
  }

  function checkTaskDetail(taskId, vehicleType) {
    dispatch({
      type: 'task/fetchTaskDetailByTaskId',
      payload: { taskId, vehicleType },
    });
  }

  function showVehiclealert() {
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
      dispatch({ type: 'monitor/saveVehicleRunningInfoList', payload: 'newInfoList' });
    }
    dispatch({ type: 'monitor/saveCategoryModal', payload: 'VehicleRunInfo' });
  }

  function goCharge() {
    goToCharge({ vehicleId: vehicleId, vehicleType: data.vehicleType }).then((response) => {
      if (dealResponse(response)) {
        message.error(formatMessage({ id: 'monitor.controller.goCharge.fail' }));
      } else {
        message.success(formatMessage({ id: 'monitor.controller.goCharge.success' }));
      }
    });
  }

  function toRest() {
    goToRest({ vehicleId: vehicleId, vehicleType: data.vehicleType }).then((response) => {
      if (dealResponse(response)) {
        message.error(formatMessage({ id: 'monitor.controller.toRest.fail' }));
      } else {
        message.success(formatMessage({ id: 'monitor.controller.toRest.success' }));
      }
    });
  }

  // 发送小车Hex命令
  async function sendVehicleHexCommand(hexCommand, actionContent) {
    const params = {
      vehicleId,
      rawCommandHex: hexCommand,
    };
    const response = await vehicleRemoteControl(type, params);
    if (dealResponse(response)) {
      message.error(
        formatMessage(
          { id: 'monitor.controller.Vehicle.tip.customCommandSendFail' },
          { actionContent },
        ),
      );
    } else {
      message.success(
        formatMessage(
          { id: 'monitor.controller.Vehicle.tip.customCommandSendSuccess' },
          { actionContent },
        ),
      );
    }
  }

  // 维护小车
  async function mainTainVehicle() {
    const params = {
      sectionId: window.localStorage.getItem('sectionId'),
      vehicleId,
      disabled: !mainTain,
    };
    const response = await fetchMaintain(type, params);
    if (dealResponse(response)) {
      message.error(formatMessage({ id: 'app.message.operateFailed' }));
    } else {
      message.success(formatMessage({ id: 'app.message.operateSuccess' }));
      setMainTain(!mainTain);
    }
  }

  // 切换小车手动模式
  async function switchManualMode() {
    const params = {
      sectionId: window.localStorage.getItem('sectionId'),
      vehicleId,
      manualMode: !manualMode,
    };
    const response = await fetchManualMode(type, params);
    if (dealResponse(response)) {
      message.error(message.error(formatMessage({ id: 'app.message.operateFailed' })));
    } else {
      message.success(formatMessage({ id: 'app.message.operateSuccess' }));
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

  return (
    <>
      <div>
        <FormattedMessage id={'app.common.prop'} />
      </div>
      <div>
        {/* 小车详情 */}
        <div>
          {/* 小车*/}
          <div className={styles.rightSideContentDetail}>
            <div>
              <img
                alt={'vehicle'}
                style={{ width: 45, height: 'auto' }}
                src={require(`../../category/${VehicleCategory[type]}_category.svg`).default}
              />
              <span>
                <FormattedMessage id={'app.vehicle'} />
              </span>
            </div>
            <div className={style.rightSideline} onClick={goToVehicleDetail}>
              {vehicleInfo?.vehicleId}
            </div>
          </div>

          {/* 电量 */}
          <div className={styles.rightSideContentDetail}>
            <div>
              <img
                alt={'vehicle'}
                style={{ width: 35, height: 35 }}
                src={require('@/packages/Scene/icons/electricity.png').default}
              />
              <span>
                <FormattedMessage id={'vehicle.electricity'} />
              </span>
            </div>
            <div>{vehicleInfo?.battery && renderBattery(vehicleInfo?.battery)}</div>
          </div>

          {/* 小车状态 */}
          <div className={styles.rightSideContentDetail}>
            <div>
              <img
                alt={'vehicle'}
                style={{ width: 25, height: 25 }}
                src={require('@/packages/Scene/icons/state.png').default}
              />
              <span>
                <FormattedMessage id={'app.common.status'} />
              </span>
            </div>
            <div>{renderVehicleState(vehicleInfo?.vehicleStatus)}</div>
          </div>

          {/* 潜伏货架 */}
          <div className={styles.rightSideContentDetail}>
            <div>
              <img
                alt={'vehicle'}
                style={{ width: 25, height: 25 }}
                src={require('@/packages/Scene/icons/pod.png').default}
              />
              <span>
                <FormattedMessage id={'app.pod'} />
              </span>
            </div>
            <div>{vehicleInfo?.upliftPodId}</div>
          </div>

          {/* 任务 */}
          <div className={styles.rightSideContentDetail}>
            <div>
              <img
                alt={'vehicle'}
                style={{ width: 25, height: 25 }}
                src={require('@/packages/Scene/icons/task.png').default}
              />
              <span>
                <FormattedMessage id={'app.task'} />
              </span>
            </div>
            <div
              style={{ cursor: 'pointer', color: '#fff' }}
              className={style.rightSideline}
              onClick={() => {
                checkTaskDetail(vehicleInfo?.currentTaskId, type);
              }}
            >
              {!isStrictNull(vehicleInfo?.currentTaskId)
                ? `*${vehicleInfo?.currentTaskId.substr(vehicleInfo?.currentTaskId.length - 6, 6)}`
                : null}
              {}
            </div>
          </div>

          {/* 异常 */}
          <div className={styles.rightSideContentDetail}>
            <div>
              <img
                alt={'vehicle'}
                style={{ width: 25, height: 25 }}
                src={require('@/packages/Scene/icons/error.png').default}
              />
              <span>
                <FormattedMessage id={'app.vehicle.exception'} />
              </span>
            </div>
            <div
              className={style.rightSideline}
              style={{ color: '#ff0000' }}
              onClick={showVehiclealert}
            >
              {vehicleAlarmList?.length}
            </div>
          </div>
        </div>

        {/* 操作区域*/}
        <div style={{ marginTop: 30 }}>
          {/* 充电、休息 */}
          <div className={styles.rightSideVehicleContentOperation}>
            <div className={styles.rightSideVehicleContentOperationItem} onClick={goCharge}>
              <img alt={'vehicle'} src={require('@/packages/Scene/icons/charger.png').default} />
              <div>
                <FormattedMessage id={'monitor.right.charge'} />
              </div>
            </div>
            <div className={styles.rightSideVehicleContentOperationItem} onClick={toRest}>
              <img alt={'vehicle'} src={require('@/packages/Scene/icons/rest.png').default} />
              <div>
                <FormattedMessage id={'monitor.right.goRest'} />
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
              title={
                mainTain
                  ? formatMessage({ id: 'monitor.controller.Vehicle.tip.cancelMaintain' })
                  : formatMessage({ id: 'monitor.controller.Vehicle.tip.confirmMaintain' })
              }
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
              title={
                manualMode
                  ? formatMessage({ id: 'monitor.controller.Vehicle.tip.turnOffManualMode' })
                  : formatMessage({ id: 'monitor.controller.Vehicle.tip.turnOnManualMode' })
              }
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
              title={formatMessage({ id: 'monitor.controller.Vehicle.tip.resetAMR' })}
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
                <img alt={'vehicle'} src={require('@/packages/Scene/icons/reset.png').default} />
                <div>
                  <FormattedMessage id={'app.button.reset'} />
                </div>
              </div>
            </Popconfirm>

            <Popconfirm
              title={formatMessage({ id: 'monitor.controller.Vehicle.tip.rebootAMR' })}
              onConfirm={() =>
                sendVehicleHexCommand('02 60 00 00', formatMessage({ id: 'monitor.reboot' }))
              }
              okText={formatMessage({ id: 'app.button.confirm' })}
              cancelText={formatMessage({ id: 'app.button.cancel' })}
            >
              <div className={styles.rightSideVehicleContentOperationItem}>
                <img alt={'vehicle'} src={require('@/packages/Scene/icons/reboot.png').default} />
                <div>
                  <FormattedMessage id={'monitor.reboot'} />
                </div>
              </div>
            </Popconfirm>

            <div className={styles.rightSideVehicleContentOperationItem} onClick={showRunInfo}>
              <img alt={'vehicle'} src={require('@/packages/Scene/icons/runTime.png').default} />
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
  allVehicles: monitor?.allVehicles,
}))(withRouter(memo(VehicleElementProp)));
