import React, { memo } from 'react';
import { Form, Row, Col, Switch, Select, Button, message, Checkbox, InputNumber } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { fetchCellLocks } from '@/services/XIHE';
import { connect } from '@/utils/RmsDva';
import { dealResponse, formatMessage, getFormLayout, isNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import LabelComponent from '@/components/LabelComponent.js';
import { LockCellPolling } from '@/workers/LockCellPollingManager';
import styles from '../monitorLayout.module.less';

const width = 500;
const height = 400;
const { formItemLayout } = getFormLayout(6, 16);

const allLockOptions = [
  {
    value: 'PATH',
    label: formatMessage({ id: 'monitor.view.lock.path' }),
    key: 'PATH',
  },
  {
    value: 'ROTATION',
    label: formatMessage({ id: 'monitor.view.lock.rotation' }),
    key: 'ROTATION',
  },
  {
    value: 'SPECIAL',
    label: formatMessage({ id: 'monitor.view.lock.special' }),
    key: 'SPECIAL',
  },
];

const PathLock = (props) => {
  const {
    dispatch,
    allAGVs,
    mapContext,
    selectAgv,
    agvLockView,
    routeView,
    showCellLock,
    currentLogicAreaId,
  } = props;
  const [form] = Form.useForm();

  function close() {
    dispatch({ type: 'monitor/saveCategoryModal', payload: null });
  }

  function onValuesChange(changedValues) {
    const currentkey = Object.keys(changedValues)[0];
    const currentValue = Object.values(changedValues)[0];
    if (['showRoute', 'showFullPath', 'showTagetLine'].includes(currentkey)) {
      dispatch({
        type: 'monitorView/saveRouteView',
        payload: {
          [currentkey]: currentValue,
        },
      });
      if (currentkey === 'showRoute') {
        showRoutePollingCallback(false);
        if (currentValue) {
          showRoutePollingCallback(true);
        }
      }
    }
  }

  function onAgvListChanged(changedAgvList) {
    if (!mapContext) return;

    dispatch({
      type: 'monitorView/saveViewState',
      payload: { selectAgv: changedAgvList },
    });
    // 更新地图锁格显示
    const showAgvLock = form.getFieldValue('showAgvLock');
    lockcellPollingCallback(false);
    showRoutePollingCallback(false);
    if (changedAgvList.length > 0 && showAgvLock?.length > 0) {
      lockcellPollingCallback(agvLockView.showLockCellPolling, changedAgvList);
    } else {
      mapContext.clearAllLocks();
    }
    if (changedAgvList.length > 0) {
      showRoutePollingCallback(routeView.showRoute, changedAgvList);
    } else {
      // 清理地图上的路径
      mapContext?.registerShowTaskPath([], true);
    }
  }

  function changeAgvlock(changedValues) {
    dispatch({
      type: 'monitorView/saveAgvLockView',
      payload: {
        showAgvLock: changedValues,
      },
    });
    lockcellPollingCallback(false);
    if (changedValues?.length > 0) {
      lockcellPollingCallback(agvLockView.showLockCellPolling, null, changedValues);
    }
  }

  function selectAllAgvs() {
    const selectAgv = allAGVs.map(({ robotId }) => robotId);
    form.setFieldsValue({ selectAgv });
    onAgvListChanged(selectAgv);
    dispatch({
      type: 'monitorView/saveViewState',
      payload: { selectAgv },
    });
  }

  // 显示锁格-刷新
  function refreshMapAgvLock() {
    const selectAgv = form.getFieldValue('selectAgv');
    if (selectAgv.length === 0) {
      message.error(formatMessage({ id: 'monitor.view.require.AGV' }));
      return false;
    }
    const showAgvLock = form.getFieldValue('showAgvLock');
    if (showAgvLock && showAgvLock?.length > 0) {
      dispatch({
        type: 'monitor/fetchAllLockCells',
        payload: { lockTypes: showAgvLock, robotIds: selectAgv },
      }).then((response) => {
        if (
          !dealResponse(response, false, null, formatMessage({ id: 'monitor.tip.fetchLockFail' }))
        ) {
          mapContext.renderLockCell(response);
        }
      });
    } else {
      mapContext.clearAllLocks();
    }
  }

  // 点位锁格-自动刷新
  function switchLockCellPolling(checked) {
    lockcellPollingCallback(checked);
    dispatch({
      type: 'monitorView/saveAgvLockView',
      payload: { showLockCellPolling: checked },
    });
  }

  // start 轮询显示锁格
  function lockcellPollingCallback(flag, agvs, lockstype) {
    if (flag) {
      openLockcellPolling(agvs, lockstype);
    } else {
      closeLockcellPolling();
    }
  }
  function openLockcellPolling(agvs, lockstype) {
    const { showAgvLock } = agvLockView;
    const robotIds = agvs || selectAgv;
    const lockTypes = lockstype || showAgvLock;
    if (robotIds?.length > 0 && lockTypes?.length > 0) {
      LockCellPolling.start({ logicId: currentLogicAreaId, lockTypes, robotIds }, (response) => {
        mapContext?.renderLockCell(response);
      });
    }
  }

  function closeLockcellPolling() {
    LockCellPolling.terminate();
  }
  //end 显示锁格

  /*****start 显示路径**/
  function showRoutePollingCallback(flag, agvs) {
    dispatch({
      type: 'monitorView/routePolling',
      payload: { flag, agvs },
    });
  }
  /*****end*****/

  function switchCellLock(checked) {
    dispatch({
      type: 'monitorView/saveViewState',
      payload: { showCellLock: checked },
    });
  }
  // 点位锁格-点击刷新
  async function viewCellLocker() {
    const cellId = form.getFieldValue('cellIdForLock');
    if (!isNull(cellId)) {
      const response = await fetchCellLocks(currentLogicAreaId, cellId);
      if (dealResponse(response)) {
        message.error(formatMessage({ id: 'monitor.tip.fetchCellLockFail' }));
      } else {
        mapContext.renderCellLocks(response);
      }
    } else {
      message.error(formatMessage({ id: 'monitor.view.cell.required' }));
    }
  }

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        left: `calc(50% - ${width / 2}px)`,
      }}
      className={styles.monitorModal}
    >
      <div className={styles.monitorModalHeader}>
        <FormattedMessage id={'monitor.right.pathLock'} />
        <CloseOutlined onClick={close} style={{ cursor: 'pointer' }} />
      </div>
      <div className={styles.monitorModalBody} style={{ paddingTop: 20 }}>
        <Form form={form} onValuesChange={onValuesChange}>
          {/* 小车ID */}
          <Form.Item {...formItemLayout} label={formatMessage({ id: 'app.agv.id' })} labelWrap>
            <Row gutter={10}>
              <Col span={18}>
                <Form.Item
                  noStyle
                  name={'selectAgv'}
                  initialValue={selectAgv || []}
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
                  <FormattedMessage id="monitor.view.selectAgvall" />
                </Button>
              </Col>
            </Row>
          </Form.Item>

          {/* 显示锁格  -小车*/}
          <Form.Item {...formItemLayout} label={formatMessage({ id: 'monitor.view.lockView' })}>
            <Row gutter={10}>
              <Form.Item
                noStyle
                {...formItemLayout}
                name={'showAgvLock'}
                valuePropName={'checked'}
                getValueFromEvent={(value) => {
                  changeAgvlock(value);
                  return value;
                }}
              >
                <Checkbox.Group
                  value={agvLockView?.showAgvLock || []}
                  options={allLockOptions.map((item) => ({
                    ...item,
                  }))}
                />
              </Form.Item>
            </Row>
            <Row style={{ margin: '10px 0 0 0 ' }}>
              <Col span={13}>
                <LabelComponent label={<FormattedMessage id={'monitor.view.heat.autoRefresh'} />}>
                  <Switch
                    checked={agvLockView?.showLockCellPolling}
                    onChange={(ev) => switchLockCellPolling(ev)}
                    checkedChildren={formatMessage({ id: 'app.common.true' })}
                    unCheckedChildren={formatMessage({ id: 'app.common.false' })}
                  />
                </LabelComponent>
              </Col>
              <Col span={7}>
                <Button size="small" onClick={refreshMapAgvLock} style={{ marginTop: 5 }}>
                  <FormattedMessage id="app.button.refresh" />
                </Button>
              </Col>
            </Row>
          </Form.Item>

          {/* 显示路径 */}
          <Form.Item {...formItemLayout} label={formatMessage({ id: 'monitor.view.pathView' })}>
            <Row gutter={10}>
              <Col span={8}>
                <Form.Item
                  noStyle
                  {...formItemLayout}
                  name={'showRoute'}
                  valuePropName={'checked'}
                  initialValue={routeView?.showRoute}
                >
                  <Switch
                    checkedChildren={formatMessage({ id: 'app.notification.on' })}
                    unCheckedChildren={formatMessage({ id: 'app.notification.off' })}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  noStyle
                  {...formItemLayout}
                  name={'showFullPath'}
                  valuePropName={'checked'}
                  initialValue={routeView?.showFullPath || false}
                >
                  <Checkbox>
                    <FormattedMessage id="monitor.view.path.fullPath" />
                  </Checkbox>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  noStyle
                  {...formItemLayout}
                  name={'showTagetLine'}
                  valuePropName={'checked'}
                  initialValue={routeView?.showTagetLine || false}
                >
                  <Checkbox>
                    <FormattedMessage id="monitor.view.path.targetLine" />
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>

          {/* 点位锁格 */}
          <Form.Item {...formItemLayout} label={<FormattedMessage id="monitor.view.cellLock" />}>
            <Row style={{ width: '100%' }}>
              <Col span={5}>
                <Form.Item>
                  <Switch
                    checkedChildren={formatMessage({
                      id: 'app.map.view',
                    })}
                    unCheckedChildren={formatMessage({
                      id: 'app.common.hide',
                    })}
                    onChange={(value) => {
                      switchCellLock(value);
                      if (!value) {
                        form.setFieldsValue({ cellIdForLock: null });
                        mapContext.clearCellLocks();
                      }
                    }}
                    checked={showCellLock}
                  />
                </Form.Item>
              </Col>

              <Col span={12} offset={1}>
                <Form.Item name={'cellIdForLock'}>
                  <InputNumber
                    allowClear
                    disabled={!showCellLock}
                    size="small"
                    style={{ width: '80%' }}
                    placeholder={formatMessage({ id: 'monitor.view.cell.required' })}
                  />
                </Form.Item>
              </Col>

              <Col span={5} style={{ paddingTop: 4 }}>
                <Button size="small" disabled={!showCellLock} onClick={viewCellLocker}>
                  <FormattedMessage id="app.button.refresh" />
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default connect(({ monitor, monitorView }) => ({
  allAGVs: monitor.allAGVs,
  mapContext: monitor.mapContext,
  selectAgv: monitorView.selectAgv,
  agvLockView: monitorView.agvLockView,
  routeView: monitorView.routeView,
  showCellLock: monitorView.showCellLock,
  currentLogicAreaId: monitor.currentLogicArea,
}))(memo(PathLock));
