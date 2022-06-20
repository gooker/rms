import React, { memo } from 'react';
import { Button, Checkbox, Col, Form, InputNumber, message, Row, Select, Switch } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { fetchCellLocks, fetchLogicAllVehicleLocks } from '@/services/XIHEService';
import { connect } from '@/utils/RmsDva';
import { dealResponse, formatMessage, getFormLayout, isNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { LockCellPolling } from '@/workers/WebWorkerManager';
import styles from '../monitorLayout.module.less';

const width = 500;
const height = 400;
const { formItemLayout } = getFormLayout(6, 16);

const PathLock = (props) => {
  const {
    dispatch,
    allVehicles,
    mapContext,
    selectVehicle,
    vehicleLockView,
    routeView,
    showCellLock,
    showLogicLockedCell,
    currentLogicAreaId,
  } = props;
  const [form] = Form.useForm();

  function close() {
    dispatch({ type: 'monitor/saveCategoryModal', payload: null });
  }

  function onValuesChange(changedValues) {
    const currentkey = Object.keys(changedValues)[0];
    const currentValue = Object.values(changedValues)[0];
    if (['showRoute', 'showFullPath', 'showTargetLine'].includes(currentkey)) {
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

  function onVehicleListChanged(changedIdList) {
    if (!mapContext) return;

    dispatch({
      type: 'monitorView/saveViewState',
      payload: { selectVehicle: changedIdList },
    });
    // 更新地图锁格显示
    lockcellPollingCallback(false);
    showRoutePollingCallback(false);

    if (changedIdList.length > 0) {
      lockcellPollingCallback(vehicleLockView.showLockCellPolling, changedIdList);
      showRoutePollingCallback(routeView.showRoute, changedIdList);
    } else {
      mapContext.clearAllLocks(); // 清理锁格
      // 清理地图上的路径
      mapContext?.registerShowTaskPath([], false);
    }
  }

  function selectAllVehicles() {
    const selectVehicle = allVehicles.map(({ uniqueId }) => uniqueId);
    form.setFieldsValue({ selectVehicle });
    onVehicleListChanged(selectVehicle);
    dispatch({
      type: 'monitorView/saveViewState',
      payload: { selectVehicle },
    });
  }

  // 显示锁格-刷新
  function refreshMapVehicleLock() {
    const selectedIds = form.getFieldValue('selectVehicle');
    if (selectedIds.length === 0) {
      message.error(formatMessage({ id: 'monitor.view.require.Vehicle' }));
      return false;
    }
    if (vehicleLockView?.showLockCellPolling) {
      dispatch({
        type: 'monitor/fetchAllLockCells',
        payload: selectedIds,
      }).then((response) => {
        if (!dealResponse(response, null, formatMessage({ id: 'monitor.tip.fetchLockFail' }))) {
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
      type: 'monitorView/saveVehicleLockView',
      payload: { showLockCellPolling: checked },
    });
  }

  // start 轮询显示锁格
  function lockcellPollingCallback(flag, vehicles) {
    const allVehicles = vehicles || selectVehicle;
    if (flag && allVehicles?.length > 0) {
      openLockcellPolling(allVehicles);
    } else {
      closeLockcellPolling();
    }
  }

  function openLockcellPolling(ids) {
    LockCellPolling.start({ logicId: currentLogicAreaId, ids }, (response) => {
      props?.mapContext?.renderLockCell(response);
    });
  }

  function closeLockcellPolling() {
    mapContext.clearAllLocks(); // 清理锁格
    LockCellPolling.terminate();
  }
  //end 显示锁格

  /*****start 显示路径**/
  function showRoutePollingCallback(flag, ids) {
    dispatch({
      type: 'monitorView/routePolling',
      payload: { flag, ids },
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

  // 逻辑区路径锁格
  function switchLogicLockedCells(checked) {
    dispatch({
      type: 'monitorView/saveViewState',
      payload: { showLogicLockedCell: checked },
    });
    switchLockCellPolling(false);
  }

  async function viewLogicLocked() {
    const response = await fetchLogicAllVehicleLocks(currentLogicAreaId);
    if (!dealResponse(response)) {
      mapContext?.renderLockCell(response);
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
          <Form.Item {...formItemLayout} label={formatMessage({ id: 'vehicle.id' })} labelWrap>
            <Row gutter={10}>
              <Col span={18}>
                <Form.Item
                  noStyle
                  name={'selectVehicle'}
                  initialValue={selectVehicle || []}
                  getValueFromEvent={(value) => {
                    onVehicleListChanged(value);
                    return value;
                  }}
                >
                  <Select
                    allowClear
                    showSearch
                    size="small"
                    maxTagCount={5}
                    mode="multiple"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {allVehicles.map((element) => (
                      <Select.Option key={element.vehicleId} value={element.uniqueId}>
                        {`${element.vehicleType}-${element.vehicleId}`}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Button size="small" onClick={selectAllVehicles}>
                  <FormattedMessage id="monitor.view.selectVehicleall" />
                </Button>
              </Col>
            </Row>
          </Form.Item>

          {/* 显示锁格  -小车*/}
          <Form.Item {...formItemLayout} label={formatMessage({ id: 'monitor.view.lockView' })}>
            <Row gutter={10}>
              <Col span={8}>
                <Form.Item
                  noStyle
                  {...formItemLayout}
                  name={'showLockCellPolling'}
                  valuePropName={'checked'}
                  initialValue={vehicleLockView?.showLockCellPolling}
                  getValueFromEvent={(ev) => {
                    switchLockCellPolling(ev);
                    return ev;
                  }}
                >
                  <Switch
                    disabled={selectVehicle?.length === 0}
                    checkedChildren={formatMessage({ id: 'app.common.true' })}
                    unCheckedChildren={formatMessage({ id: 'app.common.false' })}
                  />
                </Form.Item>
              </Col>
              <Col span={7}>
                <Button size="small" onClick={refreshMapVehicleLock}>
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
                    checkedChildren={formatMessage({ id: 'app.common.on' })}
                    unCheckedChildren={formatMessage({ id: 'app.common.off' })}
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
                  name={'showTargetLine'}
                  valuePropName={'checked'}
                  initialValue={routeView?.showTargetLine || false}
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
                <Form.Item noStyle>
                  <Switch
                    checkedChildren={formatMessage({
                      id: 'app.common.visible',
                    })}
                    unCheckedChildren={formatMessage({
                      id: 'app.common.hidden',
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
                <Form.Item name={'cellIdForLock'} noStyle>
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

          {/* 逻辑区的路径锁格信息  */}
          <Form.Item
            {...formItemLayout}
            label={<FormattedMessage id="monitor.view.logicLocked" />}
            labelWrap
          >
            <Row>
              <Col span={8}>
                <Form.Item noStyle>
                  <Switch
                    checkedChildren={formatMessage({
                      id: 'app.common.visible',
                    })}
                    unCheckedChildren={formatMessage({
                      id: 'app.common.hidden',
                    })}
                    onChange={(value) => {
                      switchLogicLockedCells(value);
                      form.setFieldsValue({ showLockCellPolling: null });
                      if (!value) {
                        mapContext.clearAllLocks(); // 清理锁格
                      }
                    }}
                    checked={showLogicLockedCell}
                  />
                </Form.Item>
              </Col>

              <Col span={7}>
                <Button size="small" disabled={!showLogicLockedCell} onClick={viewLogicLocked}>
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
  allVehicles: monitor.allVehicles,
  mapContext: monitor.mapContext,
  selectVehicle: monitorView.selectVehicle,
  vehicleLockView: monitorView.vehicleLockView,
  routeView: monitorView.routeView,
  showCellLock: monitorView.showCellLock,
  showLogicLockedCell: monitorView.showLogicLockedCell,
  currentLogicAreaId: monitor.currentLogicArea,
}))(memo(PathLock));
