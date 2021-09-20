import React, { memo, useContext, useEffect, useState } from 'react';
import {
  Row,
  Form,
  Col,
  Checkbox,
  Input,
  InputNumber,
  Switch,
  Button,
  Select,
  message,
  Divider,
} from 'antd';
import { connect } from 'umi';
import { useMount } from '@umijs/hooks';
import Dictionary from '@/utils/Dictionary';
import { Permission, hasApp } from '@/utils/Permission';
import SelectSearch from '@/components/SelectSearch';
import { dealResponse, isNull, isStrictNull, sleep } from '@/utils/utils';
import { formatMessage, FormattedMessage } from '@/utils/Lang';
import {
  fetchCellHeat,
  fetchCellLocks,
  getToteTaskRealtimePath,
  getToteTaskRealtimeState,
} from '@/services/map';
import CheckBoxFun from './CheckBoxFun';
import MonitorMapContext from './MonitorMapContext';
import CellHeatControlPanel from './CellHeatControlPanel';
import { getCurrentRouteMapData } from '@/utils/mapUtils';
import config from '@/config';
import styles from './MapMonitorView.less';

const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
let toteTaskRealtimeImterval = null;

const MapMonitorView = (props) => {
  const [form] = Form.useForm();
  const mapRef = useContext(MonitorMapContext);

  const [pullToteTaskRealtime, setPullToteTaskRealtime] = useState(false);
  const [isTracking, setIsTracking] = useState(false);

  const sectionId = window.localStorage.getItem('sectionId');
  const locale = window.localStorage.getItem('umi_locale') || 'zh-CN';

  const {
    dispatch,

    latentLiftingList,
    toteAgvList,
    forkAgvList,
    sorterAgvList,

    viewSetting,
    relations,
    currentLogicAreaId,
  } = props;

  // 对从各个WCS获取到的小车数据进行整合显示
  const allAGVs = [...latentLiftingList, ...toteAgvList, ...forkAgvList, ...sorterAgvList];

  useEffect(() => {
    mapPropsToFields();
  }, [viewSetting]);

  useMount(() => {
    // 拉取一次临时不可走点数据
    dispatch({
      type: 'monitor/fetchTemporaryLockedCells',
    }).then((res) => {
      if (viewSetting.tempBlockShown) {
        mapRef.renderTemporaryLock(res || []);
      }
    });

    //  mapPropsToFields
    mapPropsToFields();
  });

  const onAgvListChanged = (changedAgvList) => {
    if (!mapRef) return;
    // 更新地图锁格显示
    const showLockCell = form.getFieldValue('showLockCell');
    if (changedAgvList.length > 0 && showLockCell.length > 0) {
      dispatch({
        type: 'monitor/fetchAllLockCells',
        payload: { lockTypes: showLockCell, robotIds: changedAgvList },
        then: (locked) => {
          if (!locked) {
            message.error(formatMessage({ id: 'app.mapView.tip.fetchLockFail' }));
            return;
          }
          mapRef.renderLockCell(locked);
        },
      });
    } else {
      mapRef.clearAllLocks();
    }
  };

  const mapPropsToFields = () => {
    form.setFieldsValue({
      selectAgv: viewSetting.selectAgv,
      showLockCell: viewSetting.showLockCell,
      showRoute: viewSetting.showRoute,
      showFullPath: viewSetting.showFullPath,
      showTagetLine: viewSetting.showTagetLine,
      tempBlockShown: viewSetting.tempBlockShown,
      temporaryCell: viewSetting.temporaryCell,
      toteBinShown: viewSetting.toteBinShown,
      distanceShow: viewSetting.distanceShow,
      cadShadow: viewSetting.cadShadow,
      coordinationShow: viewSetting.coordinationShow,
      cellPointShow: viewSetting.cellPointShow,
      trackingCar: viewSetting.trackingCar,
      locationType: viewSetting.locationType,
      locationValue: viewSetting.locationValue,
      shownPriority: viewSetting.shownPriority,
    });
  };

  // 小车锁
  const refreshMapAgvLock = () => {
    const selectAgv = form.getFieldValue('selectAgv');
    if (selectAgv.length === 0) {
      message.error(formatMessage({ id: 'app.mapView.require.AGV' }));
      return false;
    }
    const showLockCell = form.getFieldValue('showLockCell');
    if (showLockCell && showLockCell.length > 0) {
      dispatch({
        type: 'monitor/fetchAllLockCells',
        payload: {
          lockTypes: showLockCell,
          robotIds: selectAgv,
        },
        then: (locked) => {
          if (!locked) {
            message.error(formatMessage({ id: 'app.mapView.tip.fetchLockFail' }));
            return;
          }
          mapRef.renderLockCell(locked);
        },
      });
    } else {
      mapRef.clearAllLocks();
    }
  };

  // 临时不可走点
  const refreshTemporaryLockedCells = () => {
    dispatch({
      type: 'monitor/fetchTemporaryLockedCells',
    }).then((res) => {
      const showTempAllowed = form.getFieldValue('tempBlockShown');
      if (showTempAllowed) {
        mapRef.renderTemporaryLock(res || []);
      } else {
        mapRef.clearTemporaryLock();
      }
    });
  };

  // 新增临时不可走点
  const addTemporaryLockedCells = () => {
    const temporaryCell = form.getFieldValue('temporaryCell');
    if (temporaryCell != null) {
      const temporaryCellList = temporaryCell.map((record) => ({ robotId: -1, cellId: record }));
      dispatch({
        type: 'monitor/fetchSaveTemporaryCell',
        payload: {
          sectionId,
          temporaryCellList,
        },
      }).then(refreshTemporaryLockedCells);
    } else {
      message.error(formatMessage({ id: 'app.mapView.require.temporaryBlock' }));
    }
  };

  // 删除临时不可走点
  const deleteTemporaryLockedCells = () => {
    const temporaryCell = form.getFieldValue('temporaryCell');
    if (temporaryCell != null) {
      const temporaryCellList = temporaryCell.map((record) => ({ robotId: -1, cellId: record }));
      dispatch({
        type: 'monitor/fetchDeleteTemporaryCell',
        payload: { sectionId, temporaryCellList },
      }).then(refreshTemporaryLockedCells);
    } else {
      message.error(formatMessage({ id: 'app.mapView.require.temporaryBlock' }));
    }
  };

  // 重载地图
  const handleRefreshMap = async () => {
    if (mapRef) {
      mapRef.refreshMap();
      const init = await dispatch({ type: 'monitor/initMap' });
      if (!init) return;
      const initStatus = await dispatch({ type: 'monitor/initStatus' });
      await sleep(2000);
      if (mapRef) {
        // 潜伏车相关
        mapRef.renderLatentAGV(initStatus.latentLiftingList || []);
        mapRef.renderLatentPod(initStatus.podList || []);

        // 料箱车相关
        const { rackLayout, rackSizeList } = initStatus;
        mapRef.renderToteAGV(initStatus.toteList || []);
        if (!isNull(rackLayout) && !isNull(rackSizeList)) {
          if (Object.keys(rackSizeList).length > 0) {
            mapRef.renderTotePod(rackLayout, rackSizeList);
          }
        }

        // 叉车相关
        mapRef.renderForkPodLayout(initStatus.forkPodList || []);
        mapRef.renderForkLiftAGV(initStatus.forkList || []);

        //  分拣车相关
        mapRef.renderSorterAGV(initStatus.sorterList || []);
      }
    }

    // 重新拉取临时不可走点信息
    const temporaryLockedCells = await dispatch({ type: 'monitor/fetchTemporaryLockedCells' });
    if (viewSetting.tempBlockShown) {
      mapRef.renderTemporaryLock(temporaryLockedCells || []);
    }
  };

  // 点位热度
  const refreshCellHeat = async ({ type, startTime, endTime, isTransparent }) => {
    const response = await fetchCellHeat({ type, startTime, endTime });
    if (dealResponse(response)) return;
    mapRef.renderCellHeat(response, isTransparent);
  };

  // 点位锁格
  const viewCellLocker = async () => {
    const cellId = form.getFieldValue('cellIdForLock');
    if (!isNull(cellId)) {
      const response = await fetchCellLocks(currentLogicAreaId, cellId);
      if (dealResponse(response)) {
        message.error(formatMessage({ id: 'app.mapView.tip.fetchCellLockFail' }));
      } else {
        mapRef.renderCellLocks(response);
      }
    } else {
      message.error(formatMessage({ id: 'app.mapView.require.cell' }));
    }
  };

  // 显示料箱任务实时路径状态
  const displayToteTaskRealtime = () => {
    const toteTaskRealtimePath = form.getFieldValue('toteTaskRealtimePath');
    if (pullToteTaskRealtime) {
      setPullToteTaskRealtime(false);
      mapRef.recordToteTaskRealtimeData([]);
      toteTaskRealtimeImterval && clearInterval(toteTaskRealtimeImterval);
    } else {
      if (!isStrictNull(toteTaskRealtimePath)) {
        setPullToteTaskRealtime(true);
        toteTaskRealtimeImterval = setInterval(() => {
          getToteTaskRealtimePath().then((response) => {
            if (!dealResponse(response)) {
              const targetToteRealtime = response.filter(
                (item) => item.rid === toteTaskRealtimePath,
              );
              mapRef.recordToteTaskRealtimeData(targetToteRealtime);
            }
          });
        }, 1000);
      }
    }
  };

  // 显示料箱实时状态
  const refreshToteBinState = () => {
    const toteTaskRealtime = form.getFieldValue('toteTaskRealtime');
    if (!isNull(toteTaskRealtime)) {
      getToteTaskRealtimeState(toteTaskRealtime).then((response) => {
        if (!dealResponse(response)) {
          mapRef.renderToteRealtimeState(toteTaskRealtime, response);
        }
      });
    }
  };

  const onValuesChange = (changedValues) => {
    dispatch({
      type: 'monitor/fetchUpdateViewSetting',
      payload: {
        key: Object.keys(changedValues)[0],
        value: Object.values(changedValues)[0],
      },
    });
  };

  const selectAllAgvs = () => {
    const selectAgv = allAGVs.map(({ robotId }) => robotId);
    form.setFieldsValue({ selectAgv });
    onAgvListChanged(selectAgv);
    dispatch({
      type: 'monitor/fetchUpdateViewSetting',
      payload: { key: 'selectAgv', value: selectAgv },
    });
  };

  return (
    <Form form={form} onValuesChange={onValuesChange}>
      {/* 重载地图 */}
      <Form.Item {...layout} label={formatMessage({ id: 'app.mapView.label.reloadMap' })}>
        <Button size="small" onClick={handleRefreshMap}>
          <FormattedMessage id="app.mapView.action.reloadMap" />
        </Button>
      </Form.Item>

      {/* 小车ID */}
      <Permission id={['/map/monitor/view/showLock', '/map/monitor/view/showPath']} type="or">
        <Divider orientation="left">
          <FormattedMessage id="app.mapView.label.AMRView" />
        </Divider>
        <Form.Item {...layout} label={formatMessage({ id: 'app.mapView.label.AGV' })}>
          <Row gutter={10}>
            <Col span={18}>
              <Form.Item
                noStyle
                name={'selectAgv'}
                getValueFromEvent={(value) => {
                  onAgvListChanged(value);
                  return value;
                }}
              >
                <Select allowClear showSearch size="small" mode="tags" maxTagCount={5}>
                  {allAGVs.map((element) => (
                    <Select.Option key={element.robotId} value={element.robotId}>
                      {element.robotId}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Button size="small" onClick={selectAllAgvs}>
                <FormattedMessage id="app.monitorOperation.agvCommand.all" />
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Permission>

      {/* 显示锁格 */}
      <Permission id="/map/monitor/view/showLock">
        <Form.Item
          {...layout}
          name={'showLockCell'}
          valuePropName={'checked'}
          label={formatMessage({ id: 'app.mapView.label.lockView' })}
        >
          <CheckBoxFun
            height={100}
            button={
              <Button size="small" onClick={refreshMapAgvLock} style={{ marginTop: 5 }}>
                <FormattedMessage id="app.mapView.action.refresh" />
              </Button>
            }
            dataSource={[
              {
                value: 'PATH',
                label: formatMessage({ id: 'app.mapView.label.lock.path' }),
                key: 'PATH',
              },
              {
                value: 'ROTATION',
                label: formatMessage({ id: 'app.mapView.label.lock.rotation' }),
                key: 'ROTATION',
              },
              {
                value: 'SPECIAL',
                label: formatMessage({ id: 'app.mapView.label.lock.special' }),
                key: 'SPECIAL',
              },
            ]}
          />
        </Form.Item>
      </Permission>

      {/* 显示路径 */}
      <Permission id="/map/monitor/view/showPath">
        <Form.Item {...layout} label={formatMessage({ id: 'app.mapView.label.pathView' })}>
          <Row gutter={10}>
            <Col span={8}>
              <Form.Item
                noStyle
                {...layout}
                name={'showRoute'}
                valuePropName={'checked'}
                label={formatMessage({ id: 'app.mapView.label.pathView' })}
              >
                <Switch
                  checkedChildren={formatMessage({ id: 'app.mapView.label.path.on' })}
                  unCheckedChildren={formatMessage({ id: 'app.mapView.label.path.off' })}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item noStyle {...layout} name={'showFullPath'} valuePropName={'checked'}>
                <Checkbox>
                  <FormattedMessage id="app.mapView.label.fullPath" />
                </Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item noStyle {...layout} name={'showTagetLine'} valuePropName={'checked'}>
                <Checkbox>
                  <FormattedMessage id="app.mapView.label.targetLine" />
                </Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
      </Permission>

      {/* 点位锁格 */}
      <Permission id="/map/monitor/view/showLock">
        <Divider orientation="left">
          <FormattedMessage id="app.mapView.label.cellLock" />
        </Divider>
        <Form.Item {...layout} label={formatMessage({ id: 'app.mapView.label.cell' })}>
          <Row style={{ width: '100%' }} className={styles.temporarily2}>
            <Col span={14}>
              <Form.Item name={'cellIdForLock'}>
                <InputNumber size="small" style={{ width: '80%' }} />
              </Form.Item>
            </Col>
            <Col span={5} style={{ paddingTop: 4 }}>
              <Button size="small" onClick={viewCellLocker}>
                <FormattedMessage id="app.mapView.action.view" />
              </Button>
            </Col>
            <Col span={5} style={{ paddingTop: 4 }}>
              <Button
                size="small"
                type="danger"
                onClick={() => {
                  mapRef.clearCellLocks();
                }}
              >
                <FormattedMessage id="app.mapView.action.delete" />
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Permission>

      {/* 料箱相关 */}
      {hasApp(config.BaseContext.Tote) && (
        <>
          <Divider orientation="left">
            <FormattedMessage id="app.mapView.label.toteRelative" />
          </Divider>
          {/* 料箱货架 */}
          <Permission id="/map/monitor/view/binRack">
            <Form.Item
              {...layout}
              name={'toteBinShown'}
              valuePropName={'checked'}
              label={<FormattedMessage id="app.mapView.label.toteRack" />}
            >
              <Switch
                checkedChildren={formatMessage({
                  id: 'app.mapView.label.temporaryBlock.show',
                })}
                unCheckedChildren={formatMessage({
                  id: 'app.mapView.label.temporaryBlock.hide',
                })}
                onChange={(value) => {
                  mapRef && mapRef.switchToteShown(value, true);
                }}
              />
            </Form.Item>
          </Permission>

          {/* 料箱任务路径展示 */}
          <Permission id="/map/monitor/view/toteTaskPath">
            <Form.Item {...layout} label={<FormattedMessage id="app.mapView.label.toteTaskPath" />}>
              <Row>
                <Col>
                  <Form.Item noStyle name={'toteTaskRealtimePath'}>
                    <Select size="small" style={{ width: 150 }}>
                      {allAGVs.map((element) => (
                        <Select.Option key={element.robotId} value={element.robotId}>
                          {element.robotId}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col style={{ marginLeft: 13 }}>
                  <Button size="small" onClick={displayToteTaskRealtime}>
                    {pullToteTaskRealtime ? (
                      <FormattedMessage id="app.common.cancel" />
                    ) : (
                      <FormattedMessage id="app.mapView.action.view" />
                    )}
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Permission>

          {/* 料箱实时状态 */}
          <Permission id="/map/monitor/view/toteBinState">
            <Form.Item {...layout} label={<FormattedMessage id="app.mapView.label.toteBinState" />}>
              <Row>
                <Col>
                  <Form.Item noStyle name={'toteTaskRealtime'}>
                    <Select size="small" style={{ width: 150 }}>
                      <Select.Option value={'FETCH'}>
                        <FormattedMessage id="app.mapView.label.fetchTaskCount" />
                      </Select.Option>
                      <Select.Option value={'PUT'}>
                        <FormattedMessage id="app.mapView.label.putTaskCount" />
                      </Select.Option>
                      <Select.Option value={'USED'}>
                        <FormattedMessage id="app.mapView.label.binUsedState" />
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col style={{ marginLeft: 13 }}>
                  <Button size="small" onClick={refreshToteBinState}>
                    <FormattedMessage id="app.common.refresh" />
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Permission>
        </>
      )}

      {/* 临时不可走点 */}
      <Divider />
      <Permission id="/map/monitor/view/temporarily">
        <Form.Item
          {...(locale === 'zh-CN' ? layout : { labelCol: { span: 7 }, wrapperCol: { span: 17 } })}
          label={formatMessage({ id: 'app.mapView.label.temporaryBlock' })}
        >
          <Row>
            <Row style={{ width: '100%' }}>
              <Col span={6} className={styles.temporarily1}>
                <Form.Item name={'tempBlockShown'} valuePropName={'checked'}>
                  <Switch
                    checkedChildren={formatMessage({
                      id: 'app.mapView.label.temporaryBlock.show',
                    })}
                    unCheckedChildren={formatMessage({
                      id: 'app.mapView.label.temporaryBlock.hide',
                    })}
                    onChange={(checked) => {
                      if (checked) {
                        refreshTemporaryLockedCells();
                      } else {
                        mapRef.clearTemporaryLock();
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12} style={{ padding: 5 }}>
                <Button size="small" onClick={refreshTemporaryLockedCells}>
                  <FormattedMessage id="app.mapView.action.refresh" />
                </Button>
              </Col>
            </Row>
            <Row style={{ width: '100%' }} className={styles.temporarily2}>
              <Col span={14}>
                <Form.Item name={'temporaryCell'}>
                  <Select
                    allowClear
                    mode="tags"
                    size="small"
                    style={{ width: '90%' }}
                    placeholder={formatMessage({ id: 'app.mapView.require.temporaryBlock' })}
                  />
                </Form.Item>
              </Col>
              <Col span={5} style={{ paddingTop: 4 }}>
                <Button size="small" onClick={addTemporaryLockedCells}>
                  <FormattedMessage id="app.mapView.action.add" />
                </Button>
              </Col>
              <Col span={5} style={{ paddingTop: 4 }}>
                <Button size="small" type="danger" onClick={deleteTemporaryLockedCells}>
                  <FormattedMessage id="app.mapView.action.delete" />
                </Button>
              </Col>
            </Row>
          </Row>
        </Form.Item>
      </Permission>

      {/* 优先级显示和距离 */}
      <Permission id="/map/monitor/view/showPriority">
        <>
          <Form.Item
            {...layout}
            name={'shownPriority'}
            valuePropName={'checked'}
            label={formatMessage({ id: 'app.mapView.label.priorityView' })}
          >
            <CheckBoxFun
              height={60}
              onChange={(value) => {
                mapRef && mapRef.filterRelations(relations, value || [], 'monitor');
              }}
              dataSource={[
                {
                  key: '10',
                  value: '10',
                  label: formatMessage({ id: 'app.mapView.label.priority.green' }),
                },
                {
                  key: '20',
                  value: '20',
                  label: formatMessage({ id: 'app.mapView.label.priority.blue' }),
                },
                {
                  key: '100',
                  value: '100',
                  label: formatMessage({ id: 'app.mapView.label.priority.yellow' }),
                },
                {
                  key: '1000',
                  value: '1000',
                  label: formatMessage({ id: 'app.mapView.label.priority.red' }),
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            {...layout}
            name={'distanceShow'}
            valuePropName={'checked'}
            label={formatMessage({ id: 'app.mapView.label.priority.distance' })}
          >
            <Switch
              checkedChildren={formatMessage({
                id: 'app.mapView.label.temporaryBlock.show',
              })}
              unCheckedChildren={formatMessage({
                id: 'app.mapView.label.temporaryBlock.hide',
              })}
              onChange={(value) => {
                mapRef && mapRef.switchDistanceShown(value, true);
              }}
            />
          </Form.Item>
        </>
      </Permission>

      {/* 地图点位和坐标 */}
      <Permission id="/map/monitor/view/mapCellView">
        <Form.Item
          {...layout}
          name={'cellPointShow'}
          valuePropName={'checked'}
          label={formatMessage({ id: 'app.mapView.label.mapCellView' })}
        >
          <Switch
            checkedChildren={formatMessage({
              id: 'app.mapView.label.temporaryBlock.show',
            })}
            unCheckedChildren={formatMessage({
              id: 'app.mapView.label.temporaryBlock.hide',
            })}
            onChange={(value) => {
              mapRef && mapRef.switchCellShown(value, true);
            }}
          />
        </Form.Item>
        <Form.Item
          {...layout}
          name={'coordinationShow'}
          valuePropName={'checked'}
          label={formatMessage({ id: 'app.mapView.label.coordinate' })}
        >
          <Switch
            checkedChildren={formatMessage({
              id: 'app.mapView.label.temporaryBlock.show',
            })}
            unCheckedChildren={formatMessage({
              id: 'app.mapView.label.temporaryBlock.hide',
            })}
            onChange={(value) => {
              mapRef && mapRef.switchCoordinationShown(value, true);
            }}
          />
        </Form.Item>
      </Permission>

      {/* CAD 背景 */}
      <Permission id="/map/monitor/view/mapCadShadow">
        <Form.Item
          {...layout}
          name={'cadBackShow'}
          valuePropName={'checked'}
          label={formatMessage({ id: 'app.mapView.label.cadShadow' })}
        >
          <Switch
            checkedChildren={formatMessage({
              id: 'app.mapView.label.temporaryBlock.show',
            })}
            unCheckedChildren={formatMessage({
              id: 'app.mapView.label.temporaryBlock.hide',
            })}
            onChange={(value) => {
              mapRef && mapRef.switchCadShadowShown(value);
            }}
          />
        </Form.Item>
      </Permission>

      {/* 追踪小车 */}
      <Permission id="/map/monitor/view/tracking">
        <Form.Item {...layout} label={formatMessage({ id: 'app.mapView.label.trackAMR' })}>
          <Row>
            <Col span={15} className={styles.temporarily2}>
              <Form.Item name={'trackingCar'}>
                <SelectSearch size="small" optionLabelProp="value">
                  {latentLiftingList.map((record) => (
                    <Select.Option value={record.robotId} key={record.robotId}>
                      <Row>
                        <Col span={12}>{record.robotId}</Col>
                        <Col span={12} style={{ textAlign: 'end' }}>
                          <FormattedMessage id={Dictionary('agvStatus', record.agvStatus)} />
                        </Col>
                      </Row>
                    </Select.Option>
                  ))}
                </SelectSearch>
              </Form.Item>
            </Col>
            <Col style={{ paddingTop: 4, marginLeft: 10 }}>
              <Button
                onClick={() => {
                  if (isTracking) {
                    setIsTracking(false);
                    if (mapRef) {
                      mapRef.trackAGV(null);
                      mapRef.centerView();
                    }
                  } else {
                    setIsTracking(true);
                    const trackingCar = form.getFieldValue('trackingCar');
                    if (trackingCar === null) {
                      message.error(formatMessage({ id: 'app.mapView.require.trackAMR' }));
                      return false;
                    }
                    mapRef && mapRef.trackAGV(trackingCar);
                  }
                }}
                size="small"
              >
                {isTracking
                  ? formatMessage({ id: 'app.mapView.label.trackAMR.untrack' })
                  : formatMessage({ id: 'app.mapView.label.trackAMR.track' })}
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Permission>

      {/* 定位 */}
      <Permission id="/map/monitor/view/position">
        <Form.Item {...layout} label={formatMessage({ id: 'app.mapView.label.location' })}>
          <Row className={styles.temporarily2}>
            <Col span={8}>
              <Form.Item name={'locationType'}>
                <Select size="small">
                  <Select.Option key="cell" value={'cell'}>
                    <FormattedMessage id="app.mapView.label.location.cell" />
                  </Select.Option>
                  <Select.Option key="pod" value={'pod'}>
                    <FormattedMessage id="app.mapView.label.location.pod" />
                  </Select.Option>
                  <Select.Option key="robot" value={'robot'}>
                    <FormattedMessage id="app.mapView.label.location.AGV" />
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8} offset={1}>
              <Form.Item name={'locationValue'}>
                <Input size="small" />
              </Form.Item>
            </Col>
            <Col span={6} style={{ textAlign: 'right', paddingTop: 3 }}>
              <Button
                size="small"
                onClick={() => {
                  const locationType = form.getFieldValue('locationType');
                  const locationValue = form.getFieldValue('locationValue');
                  if (locationType != null && locationValue != null) {
                    mapRef && mapRef.moveTo(locationType, locationValue);
                  } else {
                    message.error(formatMessage({ id: 'app.mapView.require.location' }));
                  }
                }}
              >
                <FormattedMessage id="app.mapView.label.location" />
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Permission>

      {/* 热度 */}
      <Permission id="/map/monitor/view/heatView">
        <Divider orientation="left">
          <FormattedMessage id="app.mapView.label.heatView" />
        </Divider>
        <Form.Item {...layout} label={formatMessage({ id: 'app.mapView.label.heatView.cellHeat' })}>
          <CellHeatControlPanel fresh={refreshCellHeat} clearCellHeat={mapRef.clearCellHeat} />
        </Form.Item>
      </Permission>
    </Form>
  );
};
export default connect(({ monitor }) => ({
  latentLiftingList: monitor.latentLiftingList,
  toteAgvList: monitor.toteAgvList,
  forkAgvList: monitor.forkAgvList,
  sorterAgvList: monitor.sorterAgvList,
  viewSetting: monitor.viewSetting,
  relations: getCurrentRouteMapData('monitor')?.relations || [],
  currentLogicAreaId: monitor.currentLogicArea,
}))(memo(MapMonitorView));
