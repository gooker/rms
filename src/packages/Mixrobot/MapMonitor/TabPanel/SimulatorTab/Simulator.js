import React, { Component } from 'react';
import { Row, Col, Table, Button, Switch, Select, message } from 'antd';
import { connect } from 'umi';
import {
  fetchRunAGV,
  fetchStopAGV,
  fetchOpenAGV,
  fetchCloseAgv,
  fetchTrafficRobotType,
  fetchSimulatorErrorMessage,
} from '@/services/simulator';
import { formatMessage, FormattedMessage } from '@/utils/Lang';
import AddSimulatorAgv from './AddSimulatorAgv';
import SimulatorError from './SimulatorError';
import SimulatorConfig from './SimulatorConfig';
import { dealResponse, dateFormat } from '@/utils/utils';
import { getCurrentLogicAreaData } from '@/utils/mapUtils';
import Config from '@/config';

@connect(({ simulator, loading, user }) => ({
  simulator,
  sectionId: user.sectionId,
  currentLogicArea: getCurrentLogicAreaData('monitor'),
  loading: loading.effects['simulator/fetchSimulatorLoginAGV'],
  openSimulatorLoading: loading.effects['simulator/fetchChangeSimulatorStatus'],
}))
class Simulator extends Component {
  state = {
    simulatorConfig: null,
    robotType: Config.AGVType.LatentLifting,

    selectIds: [],
    robotTypes: [],
    simulatorHistory: [],

    addVisit: true,
    visitForError: false,
    visitForConfig: false,
  };

  columns = [
    {
      title: formatMessage({ id: 'app.simulator.list.id' }),
      dataIndex: 'robotId',
      align: 'center',
      width: '50',
    },
    {
      title: formatMessage({ id: 'app.simulator.list.type' }),
      dataIndex: 'robotType',
      align: 'center',
      width: '50',
    },
    {
      title: formatMessage({ id: 'app.simulator.list.snapStop' }),
      dataIndex: 'isStop',
      align: 'center',
      width: '80',
      render: (text) => {
        if (text) {
          return formatMessage({ id: 'app.simulator.list.snapStop' });
        }
        return formatMessage({ id: 'app.simulator.list.normal' });
      },
    },
    {
      title: formatMessage({ id: 'app.simulator.list.state' }),
      dataIndex: 'isOpen',
      align: 'center',
      width: '80',
      render: (text, record) => {
        const { isOpen } = record;
        if (isOpen) {
          return formatMessage({ id: 'app.simulator.list.poweron' });
        }
        return formatMessage({ id: 'app.simulator.list.shutdown' });
      },
    },
    {
      title: formatMessage({ id: 'app.simulator.list.movable' }),
      dataIndex: 'canMove',
      align: 'center',
      width: '100',
      render: (text, record) => (
        <Switch
          checked={text}
          checkedChildren={formatMessage({ id: 'app.simulator.list.movable' })}
          unCheckedChildren={formatMessage({ id: 'app.simulator.list.unMovable' })}
          onChange={(checked) => {
            this.changeAgvRunTask(record.robotId, checked);
          }}
        />
      ),
    },
  ];

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'simulator/fetchSimulatorLoginAGV' });
    dispatch({ type: 'simulator/fetchSimulatorHistory' });
    fetchTrafficRobotType().then((res) => {
      if (!dealResponse(res)) {
        this.setState({ robotTypes: res });
      } else {
        message.error(formatMessage({ id: 'app.simulator.tip.fetchAMRTypeFail' }));
      }
    });
  };

  changeAgvRunTask = (robotId, checked) => {
    const { dispatch, currentLogicArea } = this.props;
    const params = {
      robotId: `${robotId}`,
      logicId: currentLogicArea.id,
      runTask: checked,
    };
    fetchSimulatorErrorMessage(params).then(() => {
      dispatch({ type: 'simulator/fetchSimulatorLoginAGV' });
    });
  };

  renderContent = () => {
    const {
      dispatch,
      sectionId,
      currentLogicArea,
      openSimulatorLoading,
      simulator: { simulatorAgvList, simulatorConfig: currentSimulator },
    } = this.props;
    const size = 'small';
    const {
      addVisit,
      robotType,
      selectIds,
      robotTypes,
      visitForError,
      visitForConfig,
      simulatorConfig,
    } = this.state;
    if (!addVisit) {
      return (
        <AddSimulatorAgv
          robotType={robotType}
          robotTypes={robotTypes}
          onCancel={() => {
            this.setState({ addVisit: true });
          }}
          submit={(value) => {
            dispatch({
              type: 'simulator/fetchAddSimulatorAgv',
              payload: { ...value },
            }).then(() => {
              dispatch({ type: 'simulator/fetchSimulatorLoginAGV' });
              this.setState({ addVisit: true });
            });
          }}
        />
      );
    }
    if (visitForConfig) {
      return (
        <SimulatorConfig
          robotType={robotType}
          sectionId={sectionId}
          simulatorConfig={simulatorConfig}
          submit={(obj) => {
            dispatch({
              type: 'simulator/fetchUpdateAGVConfig',
              payload: obj,
            }).then(() => {
              this.setState({
                visitForConfig: false,
              });
            });
          }}
          onCancel={() => {
            this.setState({ visitForConfig: false });
          }}
        />
      );
    }
    if (visitForError) {
      return (
        <SimulatorError
          dispatch={dispatch}
          selectIds={selectIds}
          logicId={currentLogicArea.id}
          onCancel={() => {
            this.setState({ visitForError: false });
          }}
        />
      );
    }
    return (
      <>
        {/* 模拟器开关  */}
        <Row style={{ margin: '10px 0px' }}>
          <span>
            <span style={{ marginRight: 10 }}>
              <FormattedMessage id="app.simulator" />:
            </span>
            <Switch
              onChange={(value) => {
                dispatch({
                  type: 'simulator/fetchChangeSimulatorStatus',
                  payload: { status: value },
                }).then(this.getData);
              }}
              loading={openSimulatorLoading}
              checked={currentSimulator.openSimulator}
              size={size}
            />
          </span>
          <span>
            <span style={{ marginLeft: 20 }}>
              <span>{dateFormat(currentSimulator.timeStamp).format('MM-DD HH:mm')}</span>
              <span style={{ marginLeft: 10 }}>{currentSimulator.createdByUser}</span>
            </span>
          </span>
        </Row>

        {/* 车辆配置 */}
        <Row style={{ margin: '10px 0px' }}>
          <Col span={18}>
            <Row>
              <span style={{ marginRight: 10 }}>
                <FormattedMessage id="app.simulator.form.label.AMRType" />:
              </span>
              <Select
                size={size}
                value={robotType}
                style={{ width: '70%' }}
                onChange={(value) => {
                  this.setState({ robotType: value });
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
          <Col span={6}>
            <Button
              size={size}
              onClick={() => {
                dispatch({
                  type: 'simulator/fetchSimulatorGetAGVConfig',
                  payload: robotType,
                  then: (res) => {
                    this.setState({
                      simulatorConfig: res,
                      visitForConfig: true,
                    });
                  },
                });
              }}
            >
              <FormattedMessage id="app.simulator.mainPanel.config" />
            </Button>
          </Col>
        </Row>

        {/* 小车添加 & 刷新 */}
        <Row style={{ margin: '10px 0px' }}>
          <Row span={10}>
            <Button
              size={size}
              onClick={() => {
                this.setState({ addVisit: false });
              }}
            >
              <FormattedMessage id="app.simulator.action.add" />
            </Button>
          </Row>
          <Row span={13} style={{ textAlign: 'end' }}>
            <Button
              size={size}
              onClick={this.getData}
              style={{ marginLeft: '5px', textAlign: 'end' }}
            >
              <FormattedMessage id="app.simulator.action.refresh" />
            </Button>
          </Row>
        </Row>

        {/* 小车操作 */}
        <Row style={{ margin: '10px 0' }}>
          <Button
            style={{ marginRight: '5px', marginBottom: '5px' }}
            disabled={selectIds.length === 0}
            onClick={() => {
              dispatch({
                type: 'simulator/fetchDeletedSimulatorAgv',
                payload: {
                  robotIds: selectIds,
                },
                then: () => {
                  this.setState({ selectIds: [] });
                  dispatch({ type: 'simulator/fetchSimulatorLoginAGV' });
                },
              });
            }}
            size={size}
          >
            <FormattedMessage id="app.simulator.action.remove" />
          </Button>
          <Button
            size={size}
            style={{ marginRight: '5px', marginBottom: '5px' }}
            disabled={selectIds.length === 0}
            onClick={() => {
              const promises = [];
              for (let index = 0; index < selectIds.length; index++) {
                const element = selectIds[index];
                promises.push(fetchStopAGV(element));
              }
              Promise.all(promises)
                .then(() => {
                  message.success(formatMessage({ id: 'app.simulator.tip.beatStopSuccess' }));
                  this.setState({ selectIds: [] });
                  dispatch({ type: 'simulator/fetchSimulatorLoginAGV' });
                })
                .catch(() => {
                  message.error(formatMessage({ id: 'app.simulator.tip.beatStopFail' }));
                });
            }}
          >
            <FormattedMessage id="app.simulator.mainPanel.beatStop" />
          </Button>
          <Button
            size={size}
            style={{ marginRight: '5px', marginBottom: '5px' }}
            disabled={selectIds.length === 0}
            onClick={() => {
              const promises = [];
              for (let index = 0; index < selectIds.length; index++) {
                const robotId = selectIds[index];
                promises.push(fetchRunAGV(robotId));
              }
              Promise.all(promises)
                .then(() => {
                  message.success(formatMessage({ id: 'app.simulator.tip.loosenStopSuccess' }));
                  this.setState({ selectIds: [] });
                  dispatch({ type: 'simulator/fetchSimulatorLoginAGV' });
                })
                .catch(() => {
                  message.error(formatMessage({ id: 'app.simulator.tip.loosenStopFail' }));
                });
            }}
          >
            <FormattedMessage id="app.simulator.mainPanel.loosenStop" />
          </Button>
          <Button
            size={size}
            style={{ marginRight: '5px', marginBottom: '5px' }}
            disabled={selectIds.length === 0}
            onClick={async () => {
              const promises = [];
              for (let index = 0; index < selectIds.length; index++) {
                const robotId = selectIds[index];
                promises.push(fetchCloseAgv(robotId));
              }
              Promise.all(promises)
                .then(() => {
                  message.success(formatMessage({ id: 'app.simulator.tip.shutdownSuccess' }));
                  this.setState({ selectIds: [] });
                  dispatch({ type: 'simulator/fetchSimulatorLoginAGV' });
                })
                .catch(() => {
                  message.error(formatMessage({ id: 'app.simulator.tip.shutdownFail' }));
                });
            }}
          >
            <FormattedMessage id="app.simulator.mainPanel.shutDown" />
          </Button>
          <Button
            size={size}
            style={{ marginRight: '5px', marginBottom: '5px' }}
            disabled={selectIds.length === 0}
            onClick={() => {
              const promises = [];
              for (let index = 0; index < selectIds.length; index++) {
                const robotId = selectIds[index];
                promises.push(fetchOpenAGV(robotId));
              }
              Promise.all(promises)
                .then(() => {
                  message.success(formatMessage({ id: 'app.simulator.tip.bootUpSuccess' }));
                  this.setState({ selectIds: [] });
                  dispatch({ type: 'simulator/fetchSimulatorLoginAGV' });
                })
                .catch(() => {
                  message.error(formatMessage({ id: 'app.simulator.tip.bootUpFail' }));
                });
            }}
          >
            <FormattedMessage id="app.simulator.mainPanel.bootUp" />
          </Button>
          <Button
            size={size}
            style={{ marginRight: '5px', marginBottom: '5px' }}
            disabled={selectIds.length === 0}
            onClick={() => {
              this.setState({ visitForError: true });
            }}
          >
            <FormattedMessage id="app.simulator.mainPanel.simulateError" />
          </Button>
        </Row>

        {/* 小车列表 */}
        <Row style={{ margin: '10px 0px' }}>
          <Table
            size={size}
            dataSource={simulatorAgvList}
            rowKey={(record) => record.robotId}
            loading={this.props.loading}
            columns={this.columns}
            rowSelection={{
              onChange: (select) => {
                this.setState({
                  selectIds: select,
                });
              },
              selectedRowKeys: selectIds,
            }}
          />
        </Row>
      </>
    );
  };

  render() {
    return <div style={{ margin: '20px 0px' }}>{this.renderContent()}</div>;
  }
}
export default Simulator;
