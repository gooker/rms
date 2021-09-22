/* eslint-disable no-unused-vars */
import React, { memo, useState, Component } from 'react';
import { connect } from '@/utils/dva';
import find from 'lodash/find';
import { useMap, useMount } from '@umijs/hooks';
import { Row, Form, message, Col, Button, Select, Radio, InputNumber, Badge, Divider } from 'antd';

import {
  fetchToteToRest,
  fetchSorterToRest,
  fetchLatentToRest,
  fetchToteToCharger,
  fetchToteAgvEmptyRun,
  fetchWorkStationPods,
  fetchSorterToCharger,
  fetchForkLiftToRestRun,
  fetchSorterAgvEmptyRun,
  fetchForkLiftAgvEmptyRun,
  fetchForkLiftToChargerRun,
  fetchLatentLiftingSystemParam,
} from '@/services/map';
import Config from '@/config';
import request from '@/utils/request';
import { AllAGVTypes } from '@/Const';
import { fetchGetAPI } from '@/services/api';
import { hasModule } from '@/utils/authority';
import { formatMessage, FormattedMessage } from '@/utils/Lang';
import { Permission, hasPermission } from '@/utils/Permission';
import { dealResponse, isAppInUse, renderRequestBodyForm } from '@/utils/utils';
import { LatentOperation, ToteOperation, ForkOperation, SorterOperation } from '../monitorParams';

import Info from './LatentPodArrivalMessage';
import ToRestArea from './ToRestArea';
import EmptyRun from './EmptyRun';
import AgvCommand from './AgvCommand';
import SetupLatentPod from './SetupLatentPod';
import SorterPick from './SorterPick';
import SorterThrow from './SorterThrow';
import ToteAgvCommand from './ToteAgvCommand';
import ForkAgvCommand from './ForkAgvCommand';
import LatentStopMessage from './LatentPauseMessage';
import ToteWorkStationTask from './ToteWorkStationTask';
import CallPodToWorkStation from './LatentCallPodToWorkStation';
import AdvancedHandlingRack from './LatentAdvancedHandling';
import ForkLiftTransportTask from './ForkLiftTransportTask';
import AutomaticToteWorkstationTask from './ToteAutomaticWorkstationTask';
import AutomaticLatentWorkstationTask from './LatentAutomaticWorkstationTask';
import AutomaticForkLiftWorkstationTask from './ForkLiftAutomaticWorkstationTask';
import { getCurrentLogicAreaData, getCurrentRouteMapData } from '@/utils/mapUtils';

const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
const noLabelLayout = { wrapperCol: { span: 16, offset: 6 } };
const formLayout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
const TabAgvMap = {
  0: Config.AGVType.LatentLifting,
  1: Config.AGVType.Tote,
  2: Config.AGVType.ForkLifting,
  3: Config.AGVType.Sorter,
};

// 权限配置
const MapMonitorOperationMap = (props) => {
  const [form] = Form.useForm();

  const sectionId = window.localStorage.getItem('sectionId');

  const {
    dispatch,
    currentRouteMap,
    currentLogicArea,
    podToWorkstationInfo,
    latentStopMessageList,
  } = props;

  //  筛选车辆操作菜单
  const operations = [[], [], [], []];
  operations[0] = LatentOperation.filter((item) => hasPermission(item.auth));
  operations[1] = ToteOperation.filter((item) => hasPermission(item.auth));
  operations[2] = ForkOperation.filter((item) => hasPermission(item.auth));
  operations[3] = SorterOperation.filter((item) => hasPermission(item.auth));

  // @权限控制: 这里做双重过滤 --> 微前端配置过滤 && 权限树过滤
  const grantedAPP = JSON.parse(window.localStorage.getItem('grantedAPP')) ?? [];
  const grantedAPPKeys = grantedAPP.map(({ name }) => name);
  const AGVTypes = AllAGVTypes.filter((record) => hasModule(record.key)).filter((record) =>
    grantedAPPKeys.includes(record.key),
  );

  const [map, { set, get }] = useMap([
    ['currentApp', AGVTypes[0].value],
    ['currentKey', null],
    ['currentApiId', null],
  ]);
  const [podSizeMap, { setAll, get: getPodSize }] = useMap([
    ['width', 1050],
    ['height', 1050],
  ]);
  const [apiList, setApiList] = useState([]);

  useMount(() => {
    // 获取潜伏车到站信息和暂停消息
    if (isAppInUse('latent-lifting')) {
      dispatch({ type: 'monitor/fetchLatentSopMessageList' });
      fetchWorkStationPods().then((res) => {
        if (!dealResponse(res)) {
          dispatch({
            type: 'monitor/savePodToWorkStation',
            payload: res,
          });
        }
      });
      fetchLatentLiftingSystemParam().then((res) => {
        if (!dealResponse(res)) {
          const runTimePrams = res[0].tabContent;
          const podProps = find(runTimePrams, {
            groupName: formatMessage({ id: 'app.monitorOperation.podProps' }),
          });
          if (podProps) {
            const data = [];
            podProps.group.forEach((item) => {
              if (item.key === 'pod_width') {
                data.push(['width', item.defaultValue]);
              }
              if (item.key === 'pod_length') {
                data.push(['height', item.defaultValue]);
              }
            });
            if (data.length > 0) {
              setAll(data);
            }
          }
        }
      });
    }

    // 获取自定义API
    fetchGetAPI().then((response) => {
      if (dealResponse(response)) {
        message.error(formatMessage({ id: 'app.requestor.tip.getApi.fail' }));
      } else {
        setApiList(response);
      }
    });
  });

  const sendApiRequest = async () => {
    const formValue = form.getFieldsValue();

    const apiId = get('currentApiId');
    const apiData = apiList.filter((item) => item.id === apiId)[0];

    let requestBody;
    // 特殊Case: 对于非{}形式的参数
    if (formValue.placeholder) {
      requestBody = formValue.placeholder;
    } else {
      requestBody = { ...formValue };
    }

    // 请求器
    async function fetchRequest() {
      return request(apiData.url, {
        method: apiData.method,
        data: requestBody,
        headers: apiData.header,
      });
    }

    // 开始请求
    const response = await fetchRequest();
    if (dealResponse(response)) {
      message.error(formatMessage({ id: 'app.requestor.tip.execute.failed' }));
    } else {
      message.success(formatMessage({ id: 'app.requestor.tip.execute.success' }));
    }
  };

  const renderContent = () => {
    const workstationList = currentLogicArea.workstationList || [];
    const currentKey = get('currentKey');
    const currentApp = get('currentApp');
    if (currentKey) {
      if (currentApp === 0) {
        if (currentKey === 'emptyRun') {
          return (
            <EmptyRun
              submit={(value) => {
                dispatch({
                  type: 'monitor/fetchEmptyRun',
                  payload: { ...value, sectionId },
                });
              }}
            />
          );
        }
        if (currentKey === 'setupPod') {
          return (
            <SetupLatentPod
              sectionId={sectionId}
              height={getPodSize('height')}
              width={getPodSize('width')}
            />
          );
        }
        if (currentKey === 'toRestArea') {
          return <ToRestArea api={fetchLatentToRest} sectionId={sectionId} />;
        }
        if (currentKey === 'command') {
          return <AgvCommand />;
        }
        if (currentKey === 'charger') {
          return (
            <Form form={form}>
              <Form.Item
                {...layout}
                name={'agvId'}
                label={formatMessage({ id: 'app.monitorOperation.robotId' })}
              >
                <InputNumber />
              </Form.Item>
              <Form.Item {...noLabelLayout}>
                <Col span={12}>
                  <Button
                    onClick={() => {
                      form.validateFields().then((value) => {
                        dispatch({
                          type: 'monitor/fetchTryToCharge',
                          payload: { ...value, sectionId },
                        });
                      });
                    }}
                    type="primary"
                  >
                    <FormattedMessage id="app.monitorOperation.charger" />
                  </Button>
                </Col>
              </Form.Item>
            </Form>
          );
        }
        if (currentKey === 'handlingRack') {
          return (
            <Form form={form}>
              <Form.Item
                {...layout}
                name={'podId'}
                label={formatMessage({ id: 'app.monitorOperation.pod' })}
              >
                <InputNumber />
              </Form.Item>
              <Form.Item
                {...layout}
                name={'targetCellId'}
                label={formatMessage({ id: 'app.monitorOperation.targetCell' })}
              >
                <InputNumber />
              </Form.Item>
              <Form.Item
                {...layout}
                name={'robotId'}
                label={formatMessage({ id: 'app.monitorOperation.robotId' })}
              >
                <InputNumber />
              </Form.Item>
              <Form.Item {...noLabelLayout}>
                <Col span={12}>
                  <Button
                    onClick={() => {
                      form.validateFields().then((value) => {
                        dispatch({
                          type: 'monitor/fetchPodToCell',
                          payload: { ...value, sectionId },
                        });
                      });
                    }}
                    type="primary"
                  >
                    <FormattedMessage id="app.monitorOperation.carryPod" />
                  </Button>
                </Col>
              </Form.Item>
            </Form>
          );
        }
        if (currentKey === 'advancedHandlingRack') {
          return <AdvancedHandlingRack />;
        }
        if (currentKey === 'callRackToWorkstation') {
          return (
            <CallPodToWorkStation sectionId={sectionId} workstationList={workstationList || []} />
          );
        }
        if (currentKey === 'autoLatentWorkstationTask') {
          return <AutomaticLatentWorkstationTask workstationList={workstationList || []} />;
        }
        if (currentKey === 'info') {
          return <Info />;
        }
        if (currentKey === 'stopMessage') {
          return (
            <LatentStopMessage
              sectionId={sectionId}
              dispatch={dispatch}
              latentStopMessageList={latentStopMessageList}
            />
          );
        }
      } else if (currentApp === 1) {
        if (currentKey === 'emptyRun') {
          return (
            <EmptyRun
              submit={(value) => {
                fetchToteAgvEmptyRun({ ...value, mapScopeCode: currentRouteMap.code }).then(
                  (res) => {
                    if (
                      dealResponse(
                        res,
                        1,
                        formatMessage({ id: 'app.monitorOperation.agvEmptyRunSuccess' }),
                      )
                    ) {
                      return false;
                    }
                  },
                );
              }}
            />
          );
        }
        if (currentKey === 'toRestArea') {
          return <ToRestArea api={fetchToteToRest} sectionId={sectionId} />;
        }
        if (currentKey === 'charger') {
          return (
            <Form form={form}>
              <Form.Item
                {...layout}
                name={'agvId'}
                label={formatMessage({ id: 'app.monitorOperation.robotId' })}
              >
                <InputNumber />
              </Form.Item>
              <Form.Item {...noLabelLayout}>
                <Col span={12}>
                  <Button
                    type="primary"
                    onClick={() => {
                      form.validateFields().then((value) => {
                        fetchToteToCharger({ sectionId, ...value }).then((response) => {
                          dealResponse(
                            response,
                            true,
                            formatMessage(
                              { id: 'app.monitorOperation.chargerSuccess' },
                              { value: value.agvId },
                            ),
                          );
                        });
                      });
                    }}
                  >
                    <FormattedMessage id="app.monitorOperation.charger" />
                  </Button>
                </Col>
              </Form.Item>
            </Form>
          );
        }
        if (currentKey === 'command') {
          return <ToteAgvCommand sectionId={sectionId} />;
        }
        if (currentKey === 'toteWorkstationTask') {
          return <ToteWorkStationTask />;
        }
        if (currentKey === 'autoToteWorkstationTask') {
          return <AutomaticToteWorkstationTask workstationList={workstationList || []} />;
        }
      } else if (currentApp === 2) {
        if (currentKey === 'emptyRun') {
          return (
            <EmptyRun
              appointHeight={true}
              submit={(value) => {
                fetchForkLiftAgvEmptyRun({ sectionId, ...value }).then((res) => {
                  if (
                    dealResponse(
                      res,
                      1,
                      formatMessage({ id: 'app.monitorOperation.agvEmptyRunSuccess' }),
                    )
                  ) {
                    return false;
                  }
                });
              }}
            />
          );
        }
        if (currentKey === 'toRestArea') {
          return <ToRestArea api={fetchForkLiftToRestRun} sectionId={sectionId} />;
        }
        if (currentKey === 'charger') {
          return (
            <Form form={form}>
              <Form.Item
                {...layout}
                name={'agvId'}
                label={formatMessage({ id: 'app.monitorOperation.robotId' })}
              >
                <InputNumber />
              </Form.Item>
              <Form.Item {...noLabelLayout}>
                <Col span={12}>
                  <Button
                    type="primary"
                    onClick={() => {
                      form.validateFields().then((value) => {
                        fetchForkLiftToChargerRun({ sectionId, ...value }).then((res) => {
                          dealResponse(
                            res,
                            true,
                            formatMessage({ id: 'app.monitorOperation.agvToChargerSuccess' }),
                          );
                        });
                      });
                    }}
                  >
                    <FormattedMessage id="app.monitorOperation.charger" />
                  </Button>
                </Col>
              </Form.Item>
            </Form>
          );
        }
        if (currentKey === 'command') {
          return <ForkAgvCommand sectionId={sectionId} />;
        }
        if (currentKey === 'forkPickPodTask') {
          return <ForkLiftTransportTask />;
        }
        if (currentKey === 'autoForkLiftWorkstationTask') {
          return <AutomaticForkLiftWorkstationTask workstationList={workstationList || []} />;
        }
      } else if (currentApp === 3) {
        if (currentKey === 'emptyRun') {
          return (
            <EmptyRun
              submit={(value) => {
                fetchSorterAgvEmptyRun({ sectionId, ...value }).then((res) => {
                  if (
                    dealResponse(
                      res,
                      1,
                      formatMessage({ id: 'app.monitorOperation.agvEmptyRunSuccess' }),
                    )
                  ) {
                    return false;
                  }
                });
              }}
            />
          );
        }
        if (currentKey === 'toRestArea') {
          return <ToRestArea api={fetchSorterToRest} sectionId={sectionId} />;
        }
        if (currentKey === 'charger') {
          return (
            <Form form={form}>
              <Form.Item
                {...layout}
                name={'agvId'}
                label={formatMessage({ id: 'app.monitorOperation.robotId' })}
              >
                <InputNumber />
              </Form.Item>
              <Form.Item {...noLabelLayout}>
                <Col span={12}>
                  <Button
                    type="primary"
                    onClick={() => {
                      form.validateFields().then((value) => {
                        fetchSorterToCharger({ sectionId, ...value }).then((res) => {
                          if (
                            dealResponse(
                              res,
                              true,
                              formatMessage({ id: 'app.monitorOperation.agvToChargerSuccess' }),
                            )
                          ) {
                            return false;
                          }
                        });
                      });
                    }}
                  >
                    <FormattedMessage id="app.monitorOperation.charger" />
                  </Button>
                </Col>
              </Form.Item>
            </Form>
          );
        }
        if (currentKey === 'sorterPick') {
          return <SorterPick />;
        }
        if (currentKey === 'sorterThrow') {
          return <SorterThrow />;
        }
      }
    } else {
      const apiId = get('currentApiId');
      const dataSource = apiList.filter((item) => item.id === apiId)[0];
      if (dataSource) {
        return (
          <div style={{ width: '100%' }}>
            {renderRequestBodyForm(dataSource, form, true, {
              formLayout: {},
              layout: 'vertical',
            })}
            <Button type="primary" style={{ marginLeft: 84 }} onClick={sendApiRequest}>
              <FormattedMessage id="app.monitorOperation.agvCommand.sendAgvCommand" />
            </Button>
          </div>
        );
      }
    }
  };

  const renderCustomButton = () => {
    const currentApp = get('currentApp');
    const agvType = TabAgvMap[currentApp];
    const agvApiList = apiList
      .filter((item) => item.agvType === agvType)
      .map(({ id, name }) => ({ id, name }));

    if (agvApiList.length > 0) {
      return (
        <Form.Item
          {...formLayout}
          style={{ width: '100%' }}
          label={formatMessage({ id: 'app.monitorOperation.customoperations' })}
        >
          {agvApiList.map(({ id, name }) => (
            <Button
              key={id}
              size="small"
              type={get('currentApiId') === id ? 'primary' : ''}
              style={{ marginRight: '10px', marginBottom: '10px' }}
              onClick={() => {
                set('currentApiId', id);
                set('currentKey', null);
              }}
            >
              {name}
            </Button>
          ))}
        </Form.Item>
      );
    }
  };

  return (
    <Row>
      <Row style={{ borderBottom: '1px solid #e9e9e9' }}>
        {/* 小车类型 */}
        <Form.Item
          {...formLayout}
          style={{ width: '100%' }}
          label={formatMessage({ id: 'app.monitorOperation.AGVTypes' })}
        >
          <Radio.Group
            size="small"
            value={get('currentApp')}
            onChange={({ target: { value } }) => {
              set('currentApp', value);
              set('currentKey', null);
            }}
          >
            {AGVTypes.map((record) => {
              return (
                <Radio.Button key={record.key} value={record.value}>
                  {formatMessage({ id: record.name })}
                </Radio.Button>
              );
            })}
          </Radio.Group>
        </Form.Item>

        {/* 小车操作 */}
        <Form.Item
          {...formLayout}
          style={{ width: '100%' }}
          label={formatMessage({ id: 'app.monitorOperation.operations' })}
        >
          {/* 操作按钮 */}
          {operations[get('currentApp')].map((record) => (
            <Button
              size="small"
              key={record.key}
              value={record.key}
              type={get('currentKey') === record.key ? 'primary' : ''}
              style={{ marginRight: '10px', marginBottom: '10px' }}
              onClick={() => {
                set('currentKey', record.key);
                set('currentApiId', null);
              }}
            >
              {formatMessage({ id: record.name })}
            </Button>
          ))}

          {/* 潜伏车特有 */}
          {get('currentApp') === 0 && (
            <Row type={'flex'} justify={'space-between'} style={{ width: '70%' }}>
              {/* 到站消息 */}
              <Badge count={podToWorkstationInfo.length}>
                <Button
                  size="small"
                  type={get('currentKey') === 'info' ? 'primary' : ''}
                  style={{ marginRight: '10px' }}
                  onClick={() => {
                    set('currentKey', 'info');
                    set('currentApiId', null);
                  }}
                >
                  <FormattedMessage id="app.monitorOperation.podToWorkstationInfo" />
                </Button>
              </Badge>

              {/* 暂停消息 */}
              <Permission id="/map/monitor/action/latent/messagePaused">
                <Badge count={latentStopMessageList.length}>
                  <Button
                    size="small"
                    type={get('currentKey') === 'stopMessage' ? 'primary' : ''}
                    onClick={() => {
                      set('currentKey', 'stopMessage');
                      set('currentApiId', null);
                    }}
                  >
                    <FormattedMessage id="app.monitorOperation.latentStopMessage" />
                  </Button>
                </Badge>
              </Permission>
            </Row>
          )}
        </Form.Item>

        {/* 自定义操作 */}
        {renderCustomButton()}
      </Row>
      <Row style={{ width: '100%', paddingTop: 20 }}>{renderContent()}</Row>
    </Row>
  );
};
export default connect(({ monitor }) => ({
  currentLogicArea: getCurrentLogicAreaData('monitor'),
  currentRouteMap: getCurrentRouteMapData('monitor'),
  podToWorkstationInfo: monitor.podToWorkstationInfo,
  latentStopMessageList: monitor.latentStopMessageList,
}))(memo(MapMonitorOperationMap));
