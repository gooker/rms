import React, { memo, useEffect, useState } from 'react';
import { message, Popconfirm } from 'antd';
import { connect } from '@/utils/RmsDva';
import { withRouter } from 'react-router-dom';
import FormattedMessage from '@/components/FormattedMessage';
import {
  fetchAgvInfo,
  getAlertCentersByTaskIdOrAgvId,
  fetchMaintain,
  fetchManualMode,
} from '@/services/api';
import { agvTryToCharge, agvToRest, agvRemoteControl } from '@/services/monitor';
import {
  isStrictNull,
  renderAgvState,
  renderBattery,
  dealResponse,
  formatMessage,
} from '@/utils/util';
import { AppCode } from '@/config/config';
import styles from '../../monitorLayout.module.less';
import style from './index.module.less';

const checkedColor = '#ff8400';

const AGVElementProp = (props) => {
  const { data, type, dispatch, history, selectAgv, showRoute } = props;
  const [agvInfo, setAgvInfo] = useState({});
  const [agvId, setAgvId] = useState(null);
  const [mainTain, setMainTain] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [pathChecked, setPathChecked] = useState(false);
  const [agvAlarmList, setAgvAlarmList] = useState([]);

  useEffect(() => {
    async function init() {
      setAgvId(JSON.parse(data.id));
      console.log('1-----', data.id, selectAgv);
      if (selectAgv.includes(data.id) && showRoute) {
        setPathChecked(true);
      } else {
        setPathChecked(false);
      }
      // 1.获取小车属性
      await fetcgAgvInfo();
    }
    init();
  }, [data]);

  async function fetcgAgvInfo() {
    const [response, alertResponse] = await Promise.all([
      fetchAgvInfo(type, data.id),
      getAlertCentersByTaskIdOrAgvId({ agvId: JSON.parse(data.id) }),
    ]);
    if (dealResponse(response)) {
      message.error(formatMessage({ id: 'app.message.fetchDataFailed' }));
    } else {
      const { mongodbAGV = {}, redisAGV = {} } = response;
      setAgvInfo({ ...mongodbAGV, ...redisAGV });
      setMainTain(mongodbAGV?.disabled);
      setManualMode(mongodbAGV?.manualMode);
    }

    if (!dealResponse(alertResponse)) {
      // 数据
      const newTaskAlarm = [];
      alertResponse.map(({ alertItemList }) => {
        if (Array.isArray(alertItemList)) {
          alertItemList.map((item) => {
            newTaskAlarm.push({ ...item });
          });
        }
      });

      setAgvAlarmList(newTaskAlarm);
      dispatch({
        type: 'monitorView/saveAgvAlarmList',
        payload: newTaskAlarm,
      });
    }
  }

  function goToAgvDetail() {
    const route = `/${AppCode[type]}/agv/agvRealTime`;
    history.push({ pathname: route, search: `agvId=${agvId}` });
  }

  function checkTaskDetail(taskId, agvType) {
    dispatch({
      type: 'task/fetchTaskDetailByTaskId',
      payload: { taskId, taskAgvType: agvType },
    });
  }

  function showAgvalert() {
    dispatch({
      type: 'monitor/saveCategoryModal',
      payload: 'AgvAlert',
    });
  }

  function goCharge() {
    agvTryToCharge(type, { agvId }).then((response) => {
      if (dealResponse(response)) {
        message.error(formatMessage({ id: 'monitor.controller.goCharge.fail' }));
      } else {
        message.success(formatMessage({ id: 'monitor.controller.goCharge.success' }));
      }
    });
  }

  function toRest() {
    agvToRest(type, { robotId: agvId }).then((response) => {
      if (dealResponse(response)) {
        message.error(formatMessage({ id: 'monitor.controller.toRest.fail' }));
      } else {
        message.success(formatMessage({ id: 'monitor.controller.toRest.success' }));
      }
    });
  }

  // 发送小车Hex命令
  async function sendAgvHexCommand(hexCommand, actionContent) {
    const params = {
      robotId: agvId,
      rawCommandHex: hexCommand,
    };
    const response = agvRemoteControl(type, params);
    if (dealResponse(response)) {
      message.error(
        formatMessage(
          { id: 'monitor.controller.AGV.tip.customCommandSendFail' },
          { actionContent },
        ),
      );
    } else {
      message.success(
        formatMessage(
          { id: 'monitor.controller.AGV.tip.customCommandSendSuccess' },
          { actionContent },
        ),
      );
    }
  }

  // 维护小车
  async function mainTainAgv() {
    const params = {
      sectionId: window.localStorage.getItem('sectionId'),
      agvId,
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
      agvId,
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

  function agvPthchanged() {
    let allSelectedAGVs = [...selectAgv];
    showRoutePollingCallback(false);
    if (pathChecked) {
      allSelectedAGVs.splice(allSelectedAGVs.indexOf(`${agvId}`), 1);
      setPathChecked(false);
    } else {
      allSelectedAGVs.push(`${agvId}`);
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
      payload: { selectAgv: allSelectedAGVs },
    });

    if (allSelectedAGVs?.length > 0) {
      showRoutePollingCallback(true, allSelectedAGVs); // 开启轮询
    }
  }

  // 触发显示路径的轮询
  function showRoutePollingCallback(flag, agvs) {
    dispatch({
      type: 'monitorView/routePolling',
      payload: { flag, agvs },
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
                alt={'agv'}
                style={{ width: 45, height: 'auto' }}
                src={require('../../category/latent_category.svg').default}
              />
              <span>
                <FormattedMessage id={'app.agv'} />
              </span>
            </div>
            <div className={style.rightSideline} onClick={goToAgvDetail}>
              {agvInfo?.robotId}
            </div>
          </div>

          {/* 电量 */}
          <div className={styles.rightSideContentDetail}>
            <div>
              <img
                alt={'agv'}
                style={{ width: 35, height: 35 }}
                src={require('@/packages/XIHE/icons/electricity.png').default}
              />
              <span>
                <FormattedMessage id={'app.agv.electricity'} />
              </span>
            </div>
            <div>{agvInfo?.battery && renderBattery(agvInfo?.battery)}</div>
          </div>

          {/* 小车状态 */}
          <div className={styles.rightSideContentDetail}>
            <div>
              <img
                alt={'agv'}
                style={{ width: 25, height: 25 }}
                src={require('@/packages/XIHE/icons/state.png').default}
              />
              <span>
                <FormattedMessage id={'app.common.status'} />
              </span>
            </div>
            <div>{renderAgvState(agvInfo?.agvStatus)}</div>
          </div>

          {/* 潜伏货架 */}
          <div className={styles.rightSideContentDetail}>
            <div>
              <img
                alt={'agv'}
                style={{ width: 25, height: 25 }}
                src={require('@/packages/XIHE/icons/pod.png').default}
              />
              <span>
                <FormattedMessage id={'app.pod'} />
              </span>
            </div>
            <div>{agvInfo?.upliftPodId}</div>
          </div>

          {/* 任务 */}
          <div className={styles.rightSideContentDetail}>
            <div>
              <img
                alt={'agv'}
                style={{ width: 25, height: 25 }}
                src={require('@/packages/XIHE/icons/task.png').default}
              />
              <span>
                <FormattedMessage id={'app.task'} />
              </span>
            </div>
            <div
              style={{ cursor: 'pointer', color: '#fff' }}
              className={style.rightSideline}
              onClick={() => {
                checkTaskDetail(agvInfo?.currentTaskId, type);
              }}
            >
              {!isStrictNull(agvInfo?.currentTaskId)
                ? `*${agvInfo?.currentTaskId.substr(agvInfo?.currentTaskId.length - 6, 6)}`
                : null}
              {}
            </div>
          </div>

          {/* 异常 */}
          <div className={styles.rightSideContentDetail}>
            <div>
              <img
                alt={'agv'}
                style={{ width: 25, height: 25 }}
                src={require('@/packages/XIHE/icons/error.png').default}
              />
              <span>
                <FormattedMessage id={'app.agv.exception'} />
              </span>
            </div>
            <div
              className={style.rightSideline}
              style={{ color: '#ff0000' }}
              onClick={showAgvalert}
            >
              {agvAlarmList?.length}
            </div>
          </div>
        </div>

        {/* 操作区域*/}
        <div style={{ marginTop: 30 }}>
          {/* 充电、休息 */}
          <div className={styles.rightSideAgvContentOperation}>
            <div className={styles.rightSideAgvContentOperationItem} onClick={goCharge}>
              <img alt={'agv'} src={require('@/packages/XIHE/icons/charger.png').default} />
              <div>
                <FormattedMessage id={'monitor.right.charge'} />
              </div>
            </div>
            <div className={styles.rightSideAgvContentOperationItem} onClick={toRest}>
              <img alt={'agv'} src={require('@/packages/XIHE/icons/rest.png').default} />
              <div>
                <FormattedMessage id={'monitor.right.goRest'} />
              </div>
            </div>
            <div style={{ width: 80 }} />
          </div>

          {/* 路径、维护、手动 */}
          <div className={styles.rightSideAgvContentOperation}>
            <div className={styles.rightSideAgvContentOperationItem2} onClick={agvPthchanged}>
              <div style={{ background: pathChecked ? checkedColor : '' }}>
                <img alt={'agv'} src={require('@/packages/XIHE/icons/path.png').default} />
              </div>
              <div>
                <FormattedMessage id={'monitor.path'} />
              </div>
            </div>

            {/* 维护 */}
            <Popconfirm
              title={
                mainTain
                  ? formatMessage({ id: 'monitor.controller.AGV.tip.cancelMaintain' })
                  : formatMessage({ id: 'monitor.controller.AGV.tip.confirmMaintain' })
              }
              onConfirm={mainTainAgv}
              okText={formatMessage({ id: 'app.button.confirm' })}
              cancelText={formatMessage({ id: 'app.button.cancel' })}
            >
              <div className={styles.rightSideAgvContentOperationItem2}>
                <div style={{ background: mainTain ? checkedColor : '' }}>
                  <img alt={'agv'} src={require('@/packages/XIHE/icons/maintain.png').default} />
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
                  ? formatMessage({ id: 'monitor.controller.AGV.tip.turnOffManualMode' })
                  : formatMessage({ id: 'monitor.controller.AGV.tip.turnOnManualMode' })
              }
              onConfirm={switchManualMode}
              okText={formatMessage({ id: 'app.button.confirm' })}
              cancelText={formatMessage({ id: 'app.button.cancel' })}
            >
              <div className={styles.rightSideAgvContentOperationItem2}>
                <div style={{ background: manualMode ? checkedColor : '' }}>
                  <img alt={'agv'} src={require('@/packages/XIHE/icons/manual.png').default} />
                </div>
                <div>
                  <FormattedMessage id={'monitor.manual'} />
                </div>
              </div>
            </Popconfirm>
          </div>

          {/* 重置、重启、运行时 */}
          <div className={styles.rightSideAgvContentOperation}>
            <Popconfirm
              title={formatMessage({ id: 'monitor.controller.AGV.tip.resetAMR' })}
              onConfirm={() =>
                sendAgvHexCommand(
                  type === AppCode.ForkLifting ? '02' : '80',
                  formatMessage({ id: 'app.button.reset' }),
                )
              }
              okText={formatMessage({ id: 'app.button.confirm' })}
              cancelText={formatMessage({ id: 'app.button.cancel' })}
            >
              <div className={styles.rightSideAgvContentOperationItem}>
                <img alt={'agv'} src={require('@/packages/XIHE/icons/reset.png').default} />
                <div>
                  <FormattedMessage id={'app.button.reset'} />
                </div>
              </div>
            </Popconfirm>

            <Popconfirm
              title={formatMessage({ id: 'monitor.controller.AGV.tip.rebootAMR' })}
              onConfirm={() =>
                sendAgvHexCommand('02 60 00 00', formatMessage({ id: 'monitor.reboot' }))
              }
              okText={formatMessage({ id: 'app.button.confirm' })}
              cancelText={formatMessage({ id: 'app.button.cancel' })}
            >
              <div className={styles.rightSideAgvContentOperationItem}>
                <img alt={'agv'} src={require('@/packages/XIHE/icons/reboot.png').default} />
                <div>
                  <FormattedMessage id={'monitor.reboot'} />
                </div>
              </div>
            </Popconfirm>

            <div className={styles.rightSideAgvContentOperationItem}>
              <img alt={'agv'} src={require('@/packages/XIHE/icons/runTime.png').default} />
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
export default connect(({ monitorView }) => ({
  selectAgv: monitorView.selectAgv ?? [],
  showRoute: monitorView.routeView?.showRoute,
}))(withRouter(memo(AGVElementProp)));
