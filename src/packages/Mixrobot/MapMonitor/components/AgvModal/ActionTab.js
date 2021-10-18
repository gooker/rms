import React, { useEffect, useState } from 'react';
import { connect } from '@/utils/dva';
import { formatMessage } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';
import { Button, Form, Switch, Popconfirm, message, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import {
  fetchAGVToRest,
  fetchGoCharge,
  fetchForceStandBy,
  fetchMoveoutAGVs,
  fetchSendAgvHexCommand,
  fetchAgvInfoByAgvId,
  fetchMaintain,
  fetchSwitchManualMode,
} from './AgvModalApi';
import { dealResponse } from '@/utils/utils';
import { ApiNameSpace } from '@/config/config';
import { AGVState } from '@/config/consts';
import { hasPermission, Permission } from '@/utils/Permission';

const FormItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 19 } };

const ActionTab = (props) => {
  const { agv, selectAgv, sectionId, dispatch } = props;
  const { agvId, agvType } = JSON.parse(agv);

  const [loading, setLoading] = useState(true);
  const [mongodbAGV, setMongodbAGV] = useState({});
  const [mainTain, setMainTain] = useState(true);
  const [manualMode, setManualMode] = useState(false);

  useEffect(() => {
    fetchData();
  }, [agv]);

  async function fetchData() {
    setLoading(true);
    const response = await fetchAgvInfoByAgvId({ sectionId, agvId }, ApiNameSpace[agvType]);
    if (dealResponse(response)) {
      setMongodbAGV({});
    } else {
      setMongodbAGV(response.mongodbAGV);
      setMainTain(response.mongodbAGV.disabled);
      setManualMode(response.mongodbAGV.manualMode);
    }
    setLoading(false);
  }

  // 切换路径显示
  function switchTaskPathShown() {
    dispatch({
      type: 'monitor/fetchUpdateSelectAgv',
      payload: { agvId },
    });
  }

  // 小车退出错误状态
  async function forceAgvStandBy() {
    const params = { sectionId, agvId };
    const response = fetchForceStandBy(params, ApiNameSpace[agvType]);
    if (dealResponse(response)) {
      message.error(formatMessage({ id: 'app.monitor.modal.AGV.tip.forceStandbyFail' }));
    } else {
      message.success(formatMessage({ id: 'app.monitor.modal.AGV.tip.forceStandbySuccess' }));
      fetchData();
    }
  }

  // 将小车移出地图(在已离线情况下)
  async function removeAgvFromMap() {
    const params = [agvId];
    const response = fetchMoveoutAGVs(params, ApiNameSpace[agvType]);
    if (dealResponse(response)) {
      message.error(formatMessage({ id: 'app.monitor.modal.AGV.tip.moveoutFail' }));
    } else {
      message.success(formatMessage({ id: 'app.monitor.modal.AGV.tip.moveoutSuccess' }));
    }
  }

  // 发送小车Hex命令
  async function sendAgvHexCommand(hexCommand, actionContent) {
    const params = {
      sectionId,
      robotIds: [agvId],
      rawCommandHex: hexCommand,
    };
    const response = fetchSendAgvHexCommand(params, ApiNameSpace[agvType]);
    if (dealResponse(response)) {
      message.error(
        formatMessage({ id: 'app.monitor.modal.AGV.tip.customCommandSendFail' }, { actionContent }),
      );
    } else {
      message.success(
        formatMessage(
          { id: 'app.monitor.modal.AGV.tip.customCommandSendSuccess' },
          { actionContent },
        ),
      );
    }
  }

  // 维护小车
  async function mainTainAgv() {
    const params = {
      sectionId,
      agvId,
      disabled: !mainTain,
    };
    const response = fetchMaintain(params, ApiNameSpace[agvType]);
    if (dealResponse(response)) {
      message.error(
        !mainTain
          ? formatMessage({ id: 'app.monitor.modal.AGV.tip.maintainFail' })
          : formatMessage({ id: 'app.monitor.modal.AGV.tip.unMaintainFail' }),
      );
    } else {
      message.success(
        !mainTain
          ? formatMessage({ id: 'app.monitor.modal.AGV.tip.maintainSuccess' })
          : formatMessage({ id: 'app.monitor.modal.AGV.tip.unMaintainSuccess' }),
      );
      setMainTain(!mainTain);
    }
  }

  // 切换小车手动模式
  async function switchManualMode() {
    const params = {
      sectionId,
      agvId,
      manualMode: !manualMode,
    };
    const response = fetchSwitchManualMode(params, ApiNameSpace[agvType]);
    if (dealResponse(response)) {
      message.error(
        !manualMode
          ? formatMessage({ id: 'app.monitor.modal.AGV.tip.turnOnManualModeFail' })
          : formatMessage({ id: 'app.monitor.modal.AGV.tip.turnOffManualModeFail' }),
      );
    } else {
      message.success(
        !manualMode
          ? formatMessage({ id: 'app.monitor.modal.AGV.tip.turnOnManualModeSuccess' })
          : formatMessage({ id: 'app.monitor.modal.AGV.tip.turnOffManualModeSuccess' }),
      );
      setManualMode(!manualMode);
    }
  }

  function toRest() {
    const params = { sectionId, robotId: agvId };
    fetchAGVToRest(params, ApiNameSpace[agvType]).then((response) => {
      if (dealResponse(response)) {
        message.error(formatMessage({ id: 'app.monitor.modal.controller.toRest.fail' }));
      } else {
        message.success(formatMessage({ id: 'app.monitor.modal.controller.toRest.success' }));
      }
    });
  }

  function goCharge() {
    const params = { sectionId, agvId };
    fetchGoCharge(params, ApiNameSpace[agvType]).then((response) => {
      if (dealResponse(response)) {
        message.error(formatMessage({ id: 'app.monitor.modal.controller.goCharge.fail' }));
      } else {
        message.success(formatMessage({ id: 'app.monitor.modal.controller.goCharge.success' }));
      }
    });
  }

  if (loading) {
    return <FormattedMessage id="app.monitor.modal.AGV.tip.loading" />;
  }
  return (
    <Form>
      {/* 任务路径 */}
      <Form.Item
        {...FormItemLayout}
        label={formatMessage({ id: 'app.monitor.modal.AGV.label.taskPath' })}
      >
        <Switch
          checked={selectAgv.includes(`${agvId}`)}
          checkedChildren={formatMessage({ id: 'app.mapView.label.temporaryBlock.show' })}
          unCheckedChildren={formatMessage({ id: 'app.mapView.label.temporaryBlock.hide' })}
          onChange={switchTaskPathShown}
        />
        <Tooltip
          placement="bottomRight"
          title={formatMessage({ id: 'app.monitor.modal.AGV.tip.taskPath' })}
        >
          <QuestionCircleOutlined
            style={{ fontSize: 17, marginLeft: 10, cursor: 'pointer', color: '#8f969c' }}
          />
        </Tooltip>
      </Form.Item>

      {/* 小车充电 */}
      <Permission id="/map/monitor/action/tote/charger">
        <Form.Item
          {...FormItemLayout}
          label={formatMessage({ id: 'app.monitor.modal.controller.goCharge' })}
        >
          <Button onClick={goCharge}>
            <FormattedMessage id={'app.monitor.modal.controller.charge'} />
          </Button>
        </Form.Item>
      </Permission>

      {/* 小车回休息区 */}
      <Permission id="/map/monitor/action/tote/toRestArea">
        <Form.Item
          {...FormItemLayout}
          label={formatMessage({ id: 'app.monitor.modal.controller.toRest' })}
        >
          <Button onClick={toRest}>
            <FormattedMessage id={'app.monitor.modal.controller.toRest'} />
          </Button>
        </Form.Item>
      </Permission>

      {/* 重启小车, 叉车暂时不支持重启 */}
      {agvType !== Config.AGVType.ForkLifting &&
        hasPermission('/map/monitor/agvModal/operation/rebootAMR') && (
          <Form.Item
            {...FormItemLayout}
            label={formatMessage({ id: 'app.monitor.modal.AGV.label.rebootAMR' })}
          >
            <Popconfirm
              title={formatMessage({ id: 'app.monitor.modal.AGV.tip.rebootAMR' })}
              onConfirm={() =>
                sendAgvHexCommand(
                  '02 60 00 00',
                  formatMessage({ id: 'app.monitor.modal.AGV.label.rebootAMR' }),
                )
              }
              okText={formatMessage({ id: 'app.monitor.action.confirm' })}
              cancelText={formatMessage({ id: 'app.monitor.action.return' })}
            >
              <Button>
                <FormattedMessage id="app.monitor.action.reboot" />
              </Button>
            </Popconfirm>
          </Form.Item>
        )}

      {/* 重置小车 */}
      <Permission id="/map/monitor/agvModal/operation/resetAMR">
        <Form.Item
          {...FormItemLayout}
          label={formatMessage({ id: 'app.monitor.modal.AGV.label.resetAMR' })}
        >
          <Popconfirm
            title={formatMessage({ id: 'app.monitor.modal.AGV.tip.resetAMR' })}
            onConfirm={() =>
              sendAgvHexCommand(
                agvType === Config.AGVType.ForkLifting ? '02' : '80',
                formatMessage({ id: 'app.monitor.modal.AGV.label.resetAMR' }),
              )
            }
            okText={formatMessage({ id: 'app.monitor.action.confirm' })}
            cancelText={formatMessage({ id: 'app.monitor.action.return' })}
          >
            <Button>
              <FormattedMessage id="app.monitor.action.reset" />
            </Button>
          </Popconfirm>
          <Tooltip
            placement="bottomRight"
            title={formatMessage({ id: 'app.monitor.modal.AGV.tip.resetAMRDesc' })}
          >
            <QuestionCircleOutlined
              style={{ fontSize: 17, marginLeft: 10, cursor: 'pointer', color: '#8f969c' }}
            />
          </Tooltip>
        </Form.Item>
      </Permission>

      {/* 维护小车 */}
      <Permission id="/map/monitor/agvModal/operation/maintainAMR">
        <Form.Item
          {...FormItemLayout}
          label={formatMessage({ id: 'app.monitor.modal.AGV.label.maintainAMR' })}
        >
          <Popconfirm
            title={
              mainTain
                ? formatMessage({ id: 'app.monitor.modal.AGV.tip.cancelMaintain' })
                : formatMessage({ id: 'app.monitor.modal.AGV.tip.confirmMaintain' })
            }
            onConfirm={mainTainAgv}
            okText={formatMessage({ id: 'app.monitor.action.confirm' })}
            cancelText={formatMessage({ id: 'app.monitor.action.return' })}
          >
            <Button>
              {mainTain
                ? formatMessage({ id: 'app.monitor.modal.AGV.tip.unmaintainAMR' })
                : formatMessage({ id: 'app.monitor.modal.AGV.tip.maintainAMR' })}
            </Button>
          </Popconfirm>
          <Tooltip
            placement="bottomRight"
            title={formatMessage({ id: 'app.monitor.modal.AGV.tip.maintainAMRDesc' })}
          >
            <QuestionCircleOutlined
              style={{ fontSize: 17, marginLeft: 10, cursor: 'pointer', color: '#8f969c' }}
            />
          </Tooltip>
        </Form.Item>
      </Permission>

      {/* 切换小车手动模式 */}
      <Permission id="/map/monitor/agvModal/operation/switchManualMode">
        <Form.Item
          {...FormItemLayout}
          label={formatMessage({ id: 'app.monitor.modal.AGV.label.manualMode' })}
        >
          <Popconfirm
            title={
              manualMode
                ? formatMessage({ id: 'app.monitor.modal.AGV.tip.turnOffManualMode' })
                : formatMessage({ id: 'app.monitor.modal.AGV.tip.turnOnManualMode' })
            }
            onConfirm={switchManualMode}
            okText={formatMessage({ id: 'app.monitor.action.confirm' })}
            cancelText={formatMessage({ id: 'app.monitor.action.return' })}
          >
            <Button>
              {manualMode
                ? formatMessage({ id: 'app.monitor.modal.AGV.tip.turnOff' })
                : formatMessage({ id: 'app.monitor.modal.AGV.tip.turnOn' })}
            </Button>
          </Popconfirm>
        </Form.Item>
      </Permission>

      {/* 只有小车是离线状态才显示 移出地图  */}
      {mongodbAGV.agvStatus === AGVState.offline && (
        <Permission id="/map/monitor/agvModal/operation/moveoutAMR">
          <Form.Item
            {...FormItemLayout}
            label={formatMessage({ id: 'app.monitor.modal.AGV.label.moveoutAMR' })}
          >
            <Popconfirm
              title={formatMessage({ id: 'app.monitor.modal.AGV.tip.moveoutAMR' })}
              onConfirm={removeAgvFromMap}
              okText={formatMessage({ id: 'app.monitor.action.confirm' })}
              cancelText={formatMessage({ id: 'app.monitor.action.return' })}
            >
              <Button>
                <FormattedMessage id="app.monitor.action.moveout" />
              </Button>
            </Popconfirm>
            <Tooltip
              placement="bottomRight"
              title={formatMessage({ id: 'app.monitor.modal.AGV.tip.moveoutAMRDesc' })}
            >
              <QuestionCircleOutlined
                style={{ fontSize: 17, marginLeft: 10, cursor: 'pointer', color: '#8f969c' }}
              />
            </Tooltip>
          </Form.Item>
        </Permission>
      )}

      {/* 只有小车是错误状态才显示 退出错误状态 */}
      {mongodbAGV.agvStatus === AGVState.error && (
        <Permission id="/map/monitor/agvModal/operation/exitError">
          <Form.Item
            {...FormItemLayout}
            label={formatMessage({ id: 'app.monitor.modal.AGV.label.exitError' })}
          >
            <Popconfirm
              title={formatMessage({ id: 'app.monitor.modal.AGV.tip.exitError' })}
              onConfirm={forceAgvStandBy}
              okText={formatMessage({ id: 'app.monitor.action.confirm' })}
              cancelText={formatMessage({ id: 'app.monitor.action.return' })}
            >
              <Button>
                <FormattedMessage id="app.monitor.action.exit" />
              </Button>
            </Popconfirm>
          </Form.Item>
        </Permission>
      )}
    </Form>
  );
};

export default connect(({ monitor }) => ({
  selectAgv: monitor?.viewSetting?.selectAgv,
}))(ActionTab);
