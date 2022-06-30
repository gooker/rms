import React, { memo, useEffect, useState } from 'react';
import { connect } from '@/utils/RmsDva';
import { Button, Divider, message, Select, Switch, Tag } from 'antd';
import { LeftOutlined, ReloadOutlined, RightOutlined, SettingOutlined } from '@ant-design/icons';
import {
  closeSimulator,
  fetchCloseVehicle,
  fetchOpenVehicle,
  fetchRunVehicle,
  fetchSimulatorErrorMessage,
  fetchStopVehicle,
  openSimulator,
} from '@/services/monitorService';
import TableWithPages from '@/components/TableWithPages';
import FormattedMessage from '@/components/FormattedMessage';
import SimulatorConfigPanel from '../Modal/Simulator/SimulatorConfigPanel';
import AddSimulatorVehicle from '../Modal/Simulator/AddSimulatorVehicle';
import ClearPodsAndBatchAdd from '../Modal/Simulator/ClearPodsAndBatchAdd';
import SimulatorError from '../Modal/Simulator/SimulatorError';
import { convertToUserTimezone, dealResponse, formatMessage } from '@/utils/util';
import { VehicleType } from '@/config/config';
import styles from '@/packages/Scene/popoverPanel.module.less';
import commonStyles from '@/common.module.less';
import simulatorStyle from './simulator.module.less';

const size = 'small';

const SimulatorPanel = (props) => {
  const {
    dispatch,
    simulatorHistory,
    simulatorVehicleList,
    currentLogicArea,
    vehicleTypes,
    allAdaptors,
  } = props;

  const [currentVehicleType, setCurrentVehicleType] = useState(null);
  const [vehicleAdapter, setVehicleAdapter] = useState(null); // 适配器
  const [simulatorConfiguration, setSimulatorConfiguration] = useState(null); // 模拟器配置信息
  const [configurationVisible, setConfigurationVisible] = useState(false); // 配置
  const [addVisit, setAddVisit] = useState(false); // 添加模拟器
  const [addPodVisible, setAddPodVisible] = useState(false); // 添加货架
  const [errorVisible, setErrorVisible] = useState(false); // 模拟错误
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    setVehicleAdapter(Object.values(allAdaptors)?.[0]?.adapterType?.id);
  }, [allAdaptors]);

  function init() {
    dispatch({ type: 'simulator/fetchAllAdaptors' });
    dispatch({ type: 'simulator/fetchSimulatorLoginVehicle' });
    dispatch({ type: 'simulator/fetchSimulatorHistory' });
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'vehicleId',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.common.type' }),
      dataIndex: 'vehicleType',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.vehicle.register.status' }),
      dataIndex: 'register',
      align: 'center',
      render: (text) => {
        if (text) {
          return (
            <Tag color="#87d068">
              <FormattedMessage id="app.common.true" />
            </Tag>
          );
        }
        return (
          <Tag>
            <FormattedMessage id="app.common.false" />
          </Tag>
        );
      },
    },
    // {
    //   title: formatMessage({ id: 'monitor.simulator.list.movable' }),
    //   dataIndex: 'canMove',
    //   align: 'center',
    //   render: (text, record) => (
    //     <Switch
    //       checked={text || false}
    //       onChange={(checked) => {
    //         changeVehicleRunTask(record.vehicleId, checked);
    //       }}
    //     />
    //   ),
    // },
  ];

  const expandColumns = [
    {
      title: formatMessage({ id: 'monitor.simulator.list.snapStop' }),
      dataIndex: 'isStop',
      align: 'center',
      render: (text) => {
        if (text) {
          return formatMessage({ id: 'monitor.simulator.list.snapStop' });
        }
        return formatMessage({ id: 'app.common.normal' });
      },
    },
    {
      title: formatMessage({ id: 'app.common.status' }),
      dataIndex: 'isOpen',
      align: 'center',
      render: (text, record) => {
        const { isOpen } = record;
        if (isOpen) {
          return formatMessage({ id: 'monitor.simulator.action.bootUp' });
        }
        return formatMessage({ id: 'monitor.simulator.action.shutDown' });
      },
    },
  ];

  // 开启 & 关闭模拟器
  async function changeSimulatorStatus(status) {
    if (status) {
      const response = await openSimulator();
      if (dealResponse(response, formatMessage({ id: 'app.message.operateSuccess' }))) {
        return false;
      }
    } else {
      const response = await closeSimulator();
      if (dealResponse(response, formatMessage({ id: 'app.message.operateSuccess' }))) {
        return false;
      }
    }

    init();
  }

  function changeVehicleRunTask(vehicleId, checked) {
    const params = {
      vehicleId: `${vehicleId}`,
      logicId: currentLogicArea,
      runTask: checked,
    };
    fetchSimulatorErrorMessage(params).then(() => {
      dispatch({ type: 'simulator/fetchSimulatorLoginVehicle' });
    });
  }

  function vehicleOperate(api, successMes, failedMes) {
    const currentMessage = successMes || formatMessage({ id: 'app.message.operateSuccess' });
    const failMessage = failedMes || formatMessage({ id: 'app.message.operateFailed' });
    const promises = [];
    for (let index = 0; index < selectedRowKeys.length; index++) {
      const element = selectedRowKeys[index];
      promises.push(api(element));
    }
    Promise.all(promises)
      .then(() => {
        message.success(currentMessage);
        setSelectedRowKeys([]);
        dispatch({ type: 'simulator/fetchSimulatorLoginVehicle' });
      })
      .catch(() => {
        message.error(failMessage);
      });
  }

  function renderContent() {
    if (configurationVisible) {
      return (
        <SimulatorConfigPanel
          simulatorConfig={simulatorConfiguration}
          submit={(obj) => {
            dispatch({
              type: 'simulator/fetchUpdateVehicleConfig',
              payload: obj,
            }).then((result) => {
              result && setConfigurationVisible(false);
            });
          }}
          onCancel={() => {
            setConfigurationVisible(false);
          }}
        />
      );
    }
  }

  // 判断是否打开了二级菜单
  function isExistVisibleDisplay() {
    return addVisit || addPodVisible || errorVisible;
  }

  function closeVisible() {
    setAddVisit(false);
    setAddPodVisible(false);
    setErrorVisible(false);
  }

  return (
    <div style={{ width: 330 }} className={commonStyles.categoryPanel}>
      {renderContent()}

      {/* 标题栏 */}
      <div>
        {isExistVisibleDisplay() ? (
          <LeftOutlined style={{ cursor: 'pointer', marginRight: 5 }} onClick={closeVisible} />
        ) : null}
        <FormattedMessage id={'monitor.right.simulator'} />
        {isExistVisibleDisplay() ? (
          <RightOutlined style={{ fontSize: 16, margin: '0 5px' }} />
        ) : null}
        <span style={{ fontSize: 15, fontWeight: 500 }}>
          {(addVisit || addPodVisible) && formatMessage({ id: 'app.button.add' })}
          {errorVisible && formatMessage({ id: 'monitor.simulator.simulateAMRError' })}
        </span>
      </div>

      <div>
        {isExistVisibleDisplay() ? (
          <div style={{ marginTop: 20 }}>
            {addVisit && (
              <AddSimulatorVehicle
                vehicleTypes={vehicleTypes}
                vehicleAdapter={vehicleAdapter}
                submit={(value) => {
                  dispatch({
                    type: 'simulator/fetchAddSimulatorVehicle',
                    payload: { ...value },
                  }).then(() => {
                    dispatch({
                      type: 'simulator/fetchSimulatorLoginVehicle',
                      payload: { ...value },
                    });
                    setAddVisit(false);
                  });
                }}
                onCancel={setAddVisit}
              />
            )}
            {addPodVisible && <ClearPodsAndBatchAdd dispatch={dispatch} />}
            {errorVisible && (
              <SimulatorError
                dispatch={dispatch}
                selectIds={selectedRowKeys}
                logicId={currentLogicArea}
                onCancel={setErrorVisible}
              />
            )}
          </div>
        ) : (
          <>
            {/* 模拟器开关  */}
            <div className={styles.panelBlockBase}>
              <div className={simulatorStyle.simulatorSwitch}>
                <span style={{ marginRight: 10 }} className={commonStyles.popoverFontColor}>
                  <FormattedMessage id="monitor.right.simulator" />:
                </span>
                <Switch
                  size={size}
                  onChange={changeSimulatorStatus}
                  checked={simulatorHistory.openSimulator}
                />
                <span style={{ marginLeft: 15 }} className={commonStyles.popoverFontColor}>
                  {convertToUserTimezone(simulatorHistory.timeStamp).format('MM-DD HH:mm')}
                  <span style={{ marginLeft: 10 }}>{simulatorHistory.updatedByUser}</span>
                </span>
                <span style={{ margin: '3px 0 0 15px', color: '#fff', cursor: 'pointer' }}>
                  <ReloadOutlined onClick={init} />
                </span>
              </div>
            </div>

            {/* allType && 配置 */}
            <div style={{ marginTop: 10 }} className={styles.panelBlockBase}>
              <div style={{ padding: '0 0 0px 5px' }}>
                <span
                  style={{ marginRight: 10, fontWeight: 600, fontSize: 15 }}
                  className={commonStyles.popoverFontColor}
                >
                  <FormattedMessage id="app.configInfo.header.adapter" />:
                </span>
                <Select
                  size={size}
                  style={{ width: '60%' }}
                  value={vehicleAdapter}
                  onChange={(value) => {
                    setVehicleAdapter(value);
                  }}
                >
                  {Object.values(allAdaptors).map(({ adapterType }) => {
                    const { id, name } = adapterType;
                    return (
                      <Select.Option key={id} value={id}>
                        {name}
                      </Select.Option>
                    );
                  })}
                </Select>
                <SettingOutlined
                  style={{ color: '#fff', fontSize: 17, marginLeft: 10 }}
                  onClick={() => {
                    dispatch({
                      type: 'simulator/fetchSimulatorGetVehicleConfig',
                      payload: currentVehicleType,
                    }).then((result) => {
                      if (result) {
                        setSimulatorConfiguration(result);
                        setConfigurationVisible(true);
                      }
                    });
                  }}
                />
              </div>

              {/* 小车添加 & 刷新 */}
              <div style={{ marginTop: 10 }} className={styles.panelBlockBase}>
                <Button
                  size={size}
                  onClick={() => {
                    setAddVisit(true);
                  }}
                >
                  <FormattedMessage id="app.button.add" />
                  <FormattedMessage id={'app.vehicle'} />
                </Button>
                <Button
                  size={size}
                  onClick={() => {
                    setAddPodVisible(true);
                  }}
                  style={{ marginLeft: '5px' }}
                >
                  <FormattedMessage id="monitor.simulator.action.batchAddPods" />
                </Button>
              </div>
            </div>

            {/* 小车操作 */}
            <div style={{ marginTop: 10 }} className={styles.panelBlockBase}>
              <Button
                style={{ marginRight: '5px', marginBottom: '5px' }}
                disabled={selectedRowKeys.length === 0}
                onClick={() => {
                  dispatch({
                    type: 'simulator/fetchDeletedSimulatorVehicle',
                    payload: {
                      vehicleIds: selectedRowKeys,
                    },
                  }).then((result) => {
                    if (result) {
                      setSelectedRowKeys([]);
                      dispatch({ type: 'simulator/fetchSimulatorLoginVehicle' });
                    }
                  });
                }}
                size={size}
              >
                <FormattedMessage id="app.button.remove" />
              </Button>
              <Button
                size={size}
                style={{ marginRight: '5px', marginBottom: '5px' }}
                disabled={selectedRowKeys.length === 0}
                onClick={() => {
                  vehicleOperate(
                    fetchStopVehicle,
                    formatMessage({ id: 'app.simulator.tip.beatStopSuccess' }),
                    formatMessage({ id: 'app.simulator.tip.beatStopFail' }),
                  );
                }}
              >
                <FormattedMessage id="monitor.simulator.action.beatStop" />
              </Button>
              <Button
                size={size}
                style={{ marginRight: '5px', marginBottom: '5px' }}
                disabled={selectedRowKeys.length === 0}
                onClick={() => {
                  vehicleOperate(
                    fetchRunVehicle,
                    formatMessage({ id: 'app.simulator.tip.loosenStopSuccess' }),
                    formatMessage({ id: 'app.simulator.tip.loosenStopFail' }),
                  );
                }}
              >
                <FormattedMessage id="monitor.simulator.action.loosenStop" />
              </Button>
              <Button
                size={size}
                style={{ marginRight: '5px', marginBottom: '5px' }}
                disabled={selectedRowKeys.length === 0}
                onClick={() => {
                  vehicleOperate(
                    fetchCloseVehicle,
                    formatMessage({ id: 'app.simulator.tip.shutdownSuccess' }),
                    formatMessage({ id: 'app.simulator.tip.shutdownFail' }),
                  );
                }}
              >
                <FormattedMessage id="monitor.simulator.action.shutDown" />
              </Button>
              <Button
                size={size}
                style={{ marginRight: '5px', marginBottom: '5px' }}
                disabled={selectedRowKeys.length === 0}
                onClick={() => {
                  vehicleOperate(
                    fetchOpenVehicle,
                    formatMessage({ id: 'app.simulator.tip.bootUpSuccess' }),
                    formatMessage({ id: 'app.simulator.tip.bootUpFail' }),
                  );
                }}
              >
                <FormattedMessage id="monitor.simulator.action.bootUp" />
              </Button>
              <Button
                size={size}
                style={{ marginRight: '5px', marginBottom: '5px' }}
                disabled={selectedRowKeys.length === 0}
                onClick={() => {
                  setErrorVisible(true);
                }}
              >
                <FormattedMessage id="app.common.Error" />
              </Button>
              <Divider style={{ margin: '10px 0 12px 0', background: '#c5c5c5' }} />
              {/* 小车列表 */}
              <Select
                size={size}
                allowClear
                showSearch
                mode="multiple"
                maxTagCount={4}
                style={{ width: '100%', marginBottom: 10 }}
                value={selectedRowKeys}
                onChange={(value) => {
                  setSelectedRowKeys(value);
                }}
              >
                {simulatorVehicleList?.filter(({register})=>register).map(({ vehicleId }) => {
                  return (
                    <Select.Option value={vehicleId} key={vehicleId}>
                      {vehicleId}
                    </Select.Option>
                  );
                })}
              </Select>
              <TableWithPages
                bordered
                size={size}
                columns={columns}
                // expandColumns={expandColumns}
                dataSource={simulatorVehicleList}
                rowKey={(record) => record.vehicleId}
                rowSelection={{
                  selectedRowKeys: selectedRowKeys,
                  getCheckboxProps: (record) => ({
                    disabled: !record.register,
                  }),
                  onChange: (selectRowKey) => {
                    setSelectedRowKeys(selectRowKey);
                  },
                }}
                pagination={false}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default connect(({ global, simulator, loading, monitor }) => ({
  vehicleTypes: global.allVehicleTypes,
  currentLogicArea: monitor.currentLogicArea,
  simulatorVehicleList: simulator.simulatorVehicleList,
  simulatorHistory: simulator.simulatorHistory,
  allAdaptors: simulator.allAdaptors,
}))(memo(SimulatorPanel));
