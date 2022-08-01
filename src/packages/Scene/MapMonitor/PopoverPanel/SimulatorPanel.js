import React, { memo, useEffect, useState } from 'react';
import { connect } from '@/utils/RmsDva';
import { Button, Col, Divider, message, Row, Select, Switch, Tag } from 'antd';
import { LeftOutlined, PlusOutlined, ReloadOutlined, RightOutlined, SettingOutlined } from '@ant-design/icons';
import { find } from 'lodash';
import {
  closeSimulator,
  fetchCloseVehicle,
  fetchOpenVehicle,
  fetchRunVehicle,
  fetchStopVehicle,
  openSimulator,
} from '@/services/monitorService';
import TableWithPages from '@/components/TableWithPages';
import FormattedMessage from '@/components/FormattedMessage';
import SimulatorError from '../Modal/Simulator/SimulatorError';
import AddSimulatorVehicle from '../Modal/Simulator/AddSimulatorVehicle';
import ClearPodsAndBatchAdd from '../Modal/Simulator/ClearPodsAndBatchAdd';
import SimulatorConfigModal from '../Modal/Simulator/SimulatorConfigModal';
import { convertToUserTimezone, dealResponse, formatMessage, isNull } from '@/utils/util';
import styles from '@/packages/Scene/popoverPanel.module.less';
import simulatorStyle from './simulator.module.less';
import commonStyles from '@/common.module.less';

const size = 'small';

const SimulatorPanel = (props) => {
  const {
    loading,
    dispatch,
    simulatorHistory,
    simulatorVehicleList,
    currentLogicArea,
    allAdaptors,
  } = props;

  // 选中的车辆类型
  const [vehicleType, setVehicleType] = useState(null);
  // 参数配置
  const [configurationVisible, setConfigurationVisible] = useState(false);
  // 添加模拟车
  const [addVisit, setAddVisit] = useState(false);
  // 添加货架
  const [addPodVisible, setAddPodVisible] = useState(false);
  // 模拟错误
  const [errorVisible, setErrorVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    if (!addVisit) {
      refresh();
    }
  }, [addVisit]);

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
  ];

  function refresh() {
    dispatch({ type: 'simulator/init' });
  }

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
      })
      .catch(() => {
        message.error(failMessage);
      });
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

  function getVehicleTypeOptions() {
    return Object.values(allAdaptors).map(({ adapterType }) => {
      const { code, name, vehicleTypes } = adapterType;
      return (
        <Select.OptGroup key={code} label={name}>
          {vehicleTypes.map((item, index) => (
            <Select.Option key={index} value={`${code}@${item.code}`}>
              {item.name}
            </Select.Option>
          ))}
        </Select.OptGroup>
      );
    });
  }

  return (
    <div style={{ width: 330 }} className={commonStyles.categoryPanel}>
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
                vehicleType={vehicleType}
                onCancel={() => {
                  setAddVisit(false);
                }}
              />
            )}
            {addPodVisible && <ClearPodsAndBatchAdd dispatch={dispatch} />}
            {errorVisible && (
              <SimulatorError
                data={simulatorVehicleList}
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
                  <ReloadOutlined spin={loading} onClick={refresh} />
                </span>
              </div>
            </div>

            {/* 车辆类型选择 & 新增车辆  */}
            <div style={{ marginTop: 10 }} className={styles.panelBlockBase}>
              <div>
                <span
                  style={{ marginRight: 10, fontWeight: 600, fontSize: 15 }}
                  className={commonStyles.popoverFontColor}
                >
                  <FormattedMessage id='app.vehicleType' />:
                </span>
                <Select
                  size={size}
                  style={{ width: '60%' }}
                  value={vehicleType}
                  onChange={(value) => {
                    setVehicleType(value);
                  }}
                >
                  {getVehicleTypeOptions()}
                </Select>
              </div>

              {/* 小车添加 & 模拟车配置 */}
              <Row style={{ marginTop: 16 }} gutter={16}>
                <Col>
                  <Button
                    disabled={isNull(vehicleType)}
                    size={size}
                    onClick={() => {
                      setAddVisit(true);
                    }}
                  >
                    <PlusOutlined /> <FormattedMessage id='simulator.add.vehicle' />
                  </Button>
                </Col>
                <Col>
                  <Button
                    disabled={isNull(vehicleType)}
                    size={size}
                    onClick={() => {
                      setConfigurationVisible(true);
                    }}
                  >
                    <SettingOutlined /> <FormattedMessage id={'simulator.config.title'} />
                  </Button>
                </Col>
              </Row>
            </div>

            {/* 车辆操作 */}
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
                value={selectedRowKeys?.map((id) => {
                  const { vehicleId } = find(simulatorVehicleList, { id });
                  return vehicleId;
                })}
                onChange={(value) => {
                  setSelectedRowKeys(value);
                }}
              >
                {simulatorVehicleList
                  ?.filter(({ register }) => register)
                  .map(({ vehicleId }) => {
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
                dataSource={simulatorVehicleList}
                pagination={false}
                rowKey={({ id }) => id}
                rowSelection={{
                  selectedRowKeys: selectedRowKeys,
                  getCheckboxProps: (record) => ({
                    disabled: !record.register,
                  }),
                  onChange: (selectRowKey) => {
                    setSelectedRowKeys(selectRowKey);
                  },
                }}
              />
            </div>
          </>
        )}
      </div>

      {/* 模拟车参数配置 */}
      <SimulatorConfigModal
        visible={configurationVisible}
        adapterType={vehicleType ? vehicleType.split('@')[0] : null}
        onCancel={() => {
          setConfigurationVisible(false);
        }}
      />
    </div>
  );
};
export default connect(({ global, simulator, loading, monitor }) => ({
  loading: loading.effects['simulator/init'],
  allAdaptors: global.allAdaptors,
  currentLogicArea: monitor.currentLogicArea,
  simulatorHistory: simulator.simulatorHistory,
  simulatorVehicleList: simulator.simulatorVehicleList,
}))(memo(SimulatorPanel));
