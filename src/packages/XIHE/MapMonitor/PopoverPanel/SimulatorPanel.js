import React, { memo, useState, useEffect } from 'react';
import classnames from 'classnames';
import { connect } from '@/utils/RmsDva';
import { Row, Switch, Col, Select, Button, Divider, Table, message } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import {
  openSimulator,
  closeSimulator,
  fetchTrafficRobotType,
  fetchSimulatorErrorMessage,
  fetchStopAGV,
  fetchRunAGV,
  fetchOpenAGV,
  fetchCloseAgv,
} from '@/services/monitor';
import FormattedMessage from '@/components/FormattedMessage';
import { getCurrentLogicAreaData } from '@/utils/mapUtil';
import SimulatorConfig from '../Modal/Simulator/SimulatorConfig';
import AddSimulatorAgv from '../Modal/Simulator/AddSimulatorAgv';
import ClearPodsAndBatchAdd from '../Modal/Simulator/ClearPodsAndBatchAdd';
import SimulatorError from '../Modal/Simulator/SimulatorError';
import { AGVType } from '@/config/config';
import { formatMessage, dateFormat, dealResponse } from '@/utils/util';
import styles from '../monitorLayout.module.less';

const size = 'small';

const SimulatorPanel = (props) => {
  const { height = 100, dispatch, simulatorConfig, simulatorAgvList, currentLogicArea } = props;
  const [loading, setLoading] = useState(false);
  const [robotTypes, setRobotTypes] = useState([]); // 所有类型
  const [currentRobotType, setCurrentRobotType] = useState(AGVType.LatentLifting);
  const [simulatorConfiguration, setSimulatorConfiguration] = useState(null); // 模拟器配置信息
  const [configurationVisible, setConfigurationVisible] = useState(false); // 配置
  const [addVisit, setAddVisit] = useState(false); // 添加模拟器
  const [addPodVisible, setAddPodVisible] = useState(false); // 添加货架
  const [errorVisible, setErrorVisible] = useState(false); // 模拟错误
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    init();
  }, []);

  function init() {
    setLoading(true);
    dispatch({ type: 'simulator/fetchSimulatorLoginAGV' });
    dispatch({ type: 'simulator/fetchSimulatorHistory' });
    fetchTrafficRobotType().then((res) => {
      if (!dealResponse(res)) {
        setRobotTypes(res);
      }
    });
    setLoading(false);
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'robotId',
      align: 'center',
      width: '50',
    },
    {
      title: formatMessage({ id: 'app.common.type' }),
      dataIndex: 'robotType',
      align: 'center',
      width: '50',
    },
    {
      title: formatMessage({ id: 'monitor.simulator.list.snapStop' }),
      dataIndex: 'isStop',
      align: 'center',
      width: '80',
      render: (text) => {
        if (text) {
          return formatMessage({ id: 'monitor.simulator.list.snapStop' });
        }
        return formatMessage({ id: 'app.agv.normal' });
      },
    },
    {
      title: formatMessage({ id: 'app.common.status' }),
      dataIndex: 'isOpen',
      align: 'center',
      width: '80',
      render: (text, record) => {
        const { isOpen } = record;
        if (isOpen) {
          return formatMessage({ id: 'monitor.simulator.action.bootUp' });
        }
        return formatMessage({ id: 'monitor.simulator.action.shutDown' });
      },
    },
    {
      title: formatMessage({ id: 'monitor.simulator.list.movable' }),
      dataIndex: 'canMove',
      align: 'center',
      width: '100',
      render: (text, record) => (
        <Switch
          checked={text}
          checkedChildren={formatMessage({ id: 'monitor.simulator.list.movable' })}
          unCheckedChildren={formatMessage({ id: 'monitor.simulator.list.unMovable' })}
          onChange={(checked) => {
            changeAgvRunTask(record.robotId, checked);
          }}
        />
      ),
    },
  ];

  async function changeSimulatorStatus(status) {
    if (status) {
      const response = await openSimulator();
      if (dealResponse(response, 1, formatMessage({ id: 'app.message.operateSuccess' }))) {
        return false;
      }
    } else {
      const response = await closeSimulator();
      if (dealResponse(response, 1, formatMessage({ id: 'app.message.operateSuccess' }))) {
        return false;
      }
    }

    init();
  }

  function changeAgvRunTask(robotId, checked) {
    const params = {
      robotId: `${robotId}`,
      logicId: currentLogicArea?.id,
      runTask: checked,
    };
    fetchSimulatorErrorMessage(params).then(() => {
      dispatch({ type: 'simulator/fetchSimulatorLoginAGV' });
    });
  }

  function agvOperate(api, successMes, failedMes) {
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
        dispatch({ type: 'simulator/fetchSimulatorLoginAGV' });
      })
      .catch(() => {
        message.error(failMessage);
      });
  }

  function renderContent() {
    if (configurationVisible) {
      return (
        <SimulatorConfig
          robotType={currentRobotType}
          simulatorConfig={simulatorConfiguration}
          submit={(obj) => {
            dispatch({
              type: 'simulator/fetchUpdateAGVConfig',
              payload: obj,
            }).then(() => {
              setConfigurationVisible(false);
            });
          }}
          onCancel={() => {
            setConfigurationVisible(false);
          }}
        />
      );
    }
  }

  // 判断visible是不是有一个为true
  function isExistVisbleDisplay() {
    if (addVisit || addPodVisible || errorVisible) {
      return true;
    }
    return false;
  }

  function closeVisible() {
    setAddVisit(false);
    setAddPodVisible(false);
    setErrorVisible(false);
  }

  return (
    <div style={{ height, width: 330 }} className={classnames(styles.popoverPanel)}>
      {renderContent()}

      {/* 标题栏 */}
      <div
        style={{
          height: 40,
          lineHeight: '40px',
          paddingLeft: 13,
          color: '#fff',
          fontSize: '16px',
          background: '#051c28',
          borderBottom: '1px solid #6c6c6c',
        }}
      >
        {isExistVisbleDisplay() ? (
          <LeftOutlined style={{ cursor: 'pointer', marginRight: 5 }} onClick={closeVisible} />
        ) : null}
        <FormattedMessage id={'monitor.right.simulator'} />
        {isExistVisbleDisplay() ? (
          <RightOutlined style={{ fontSize: 16, margin: '0 5px' }} />
        ) : null}
        <span style={{ fontSize: 15, fontWeight: 500 }}>
          {(addVisit || addPodVisible) && formatMessage({ id: 'app.button.add' })}
          {errorVisible && formatMessage({ id: 'monitor.simulator.simulateAMRError' })}
        </span>
      </div>

      <div style={{ marginLeft: 6,overflow:'auto' }}>
        {addVisit || addPodVisible || errorVisible ? (
          <div style={{ marginTop: 20 }}>
            {addVisit && (
              <AddSimulatorAgv
                robotType={currentRobotType}
                robotTypes={robotTypes}
                submit={(value) => {
                  dispatch({
                    type: 'simulator/fetchAddSimulatorAgv',
                    payload: { ...value },
                  }).then(() => {
                    dispatch({ type: 'simulator/fetchSimulatorLoginAGV' });
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
                logicId={currentLogicArea?.id}
                onCancel={setErrorVisible}
              />
            )}
          </div>
        ) : (
          <>
            {/* 模拟器开关  */}
            <Row style={{ margin: '10px 0px' }}>
              <span>
                <span style={{ marginRight: 10 }}>
                  <FormattedMessage id="monitor.right.simulator" />:
                </span>
                <Switch
                  onChange={changeSimulatorStatus}
                  checked={simulatorConfig.openSimulator}
                  loading={loading}
                  size={size}
                />
              </span>
              <span>
                <span style={{ marginLeft: 20 }}>
                  <span>{dateFormat(simulatorConfig.timeStamp).format('MM-DD HH:mm')}</span>
                  <span style={{ marginLeft: 10 }}>{simulatorConfig.createdByUser}</span>
                </span>
              </span>
            </Row>

            {/* allType && 配置 */}
            <Row style={{ margin: '10px 0px' }}>
              <Col span={20}>
                <Row>
                  <span style={{ marginRight: 8 }}>
                    <FormattedMessage id="app.agv.type" />:
                  </span>
                  <Select
                    size={size}
                    value={currentRobotType}
                    style={{ width: '70%' }}
                    onChange={(value) => {
                      setCurrentRobotType(value);
                    }}
                  >
                    {robotTypes.map((record) => (
                      <Select.Option value={record} key={record}>
                        {record}
                      </Select.Option>
                    ))}
                  </Select>
                </Row>
              </Col>
              <Col span={4} style={{ textAlign: 'end' }}>
                <Button
                  size={size}
                  onClick={() => {
                    dispatch({
                      type: 'simulator/fetchSimulatorGetAGVConfig',
                      payload: currentRobotType,
                      then: (res) => {
                        setSimulatorConfiguration(res);
                        setConfigurationVisible(true);
                      },
                    });
                  }}
                >
                  <FormattedMessage id="monitor.simulator.config" />
                </Button>
              </Col>
            </Row>

            {/* 小车添加 & 刷新 */}
            <Row style={{ margin: '10px 0px' }}>
              <Button
                size={size}
                onClick={() => {
                  setAddVisit(true);
                }}
              >
                <FormattedMessage id="app.button.add" />
              </Button>
              <Button size={size} onClick={init} style={{ margin: '0px 10px' }}>
                <FormattedMessage id="app.button.refresh" />
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
            </Row>

            <Divider style={{ margin: '12px 0' }} />
            {/* 小车操作 */}
            <Row>
              <Button
                style={{ marginRight: '5px', marginBottom: '5px' }}
                disabled={selectedRowKeys.length === 0}
                onClick={() => {
                  dispatch({
                    type: 'simulator/fetchDeletedSimulatorAgv',
                    payload: {
                      robotIds: selectedRowKeys,
                    },
                    then: () => {
                      setSelectedRowKeys([]);
                      dispatch({ type: 'simulator/fetchSimulatorLoginAGV' });
                    },
                  });
                }}
                size={size}
              >
                <FormattedMessage id="monitor.simulator.action.remove" />
              </Button>
              <Button
                size={size}
                style={{ marginRight: '5px', marginBottom: '5px' }}
                disabled={selectedRowKeys.length === 0}
                onClick={() => {
                  agvOperate(
                    fetchStopAGV,
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
                  agvOperate(
                    fetchRunAGV,
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
                  agvOperate(
                    fetchCloseAgv,
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
                  agvOperate(
                    fetchOpenAGV,
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
            </Row>
            <Divider style={{ margin: '12px 0' }} />

            {/* 小车列表 */}
            <Row>
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
                {simulatorAgvList.map(({ robotId }) => {
                  return (
                    <Select.Option value={robotId} key={robotId}>
                      {robotId}
                    </Select.Option>
                  );
                })}
              </Select>
              <Table
                size={size}
                dataSource={simulatorAgvList}
                rowKey={(record) => record.robotId}
                loading={loading}
                columns={columns}
                rowSelection={{
                  selectedRowKeys: selectedRowKeys,
                  onChange: (selectRowKey, selectRow) => {
                    setSelectedRowKeys(selectRowKey);
                  },
                }}
                scroll={{ y: 450 }}
                pagination={false}
              />
            </Row>
          </>
        )}
      </div>
    </div>
  );
};
export default connect(({ simulator }) => ({
  simulatorAgvList: simulator?.simulatorAgvList,
  simulatorConfig: simulator?.simulatorConfig,
  currentLogicArea: getCurrentLogicAreaData('monitor'),
}))(memo(SimulatorPanel));
