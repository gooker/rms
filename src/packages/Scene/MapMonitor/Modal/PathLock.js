import React, { memo } from 'react';
import { Button, Checkbox, Col, Form, InputNumber, message, Row, Select, Switch } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { fetchCellLocks, fetchLogicAllVehicleLocks } from '@/services/XIHEService';
import { connect } from '@/utils/RmsDva';
import { dealResponse, formatMessage, getFormLayout, getMapModalPosition, isNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { LockCellPolling } from '@/workers/WebWorkerManager';
import styles from '../monitorLayout.module.less';

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
    const currentKey = Object.keys(changedValues)[0];
    const currentValue = Object.values(changedValues)[0];
    if (['showRoute', 'showFullPath', 'showTargetLine'].includes(currentKey)) {
      dispatch({
        type: 'monitorView/saveRouteView',
        payload: {
          [currentKey]: currentValue,
        },
      });
      if (currentKey === 'showRoute') {
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
    vehicleLockPollingCallback(false);
    showRoutePollingCallback(false);

    if (changedIdList.length > 0) {
      vehicleLockPollingCallback(vehicleLockView.showLockCellPolling, changedIdList);
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

  /********************** 显示小车锁格  ********************/
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
          mapContext.renderVehicleLocks(response);
        }
      });
    } else {
      mapContext.clearAllLocks();
    }
  }

  function switchLockCellPolling(checked) {
    vehicleLockPollingCallback(checked);
    dispatch({
      type: 'monitorView/saveVehicleLockView',
      payload: { showLockCellPolling: checked },
    });
  }

  function vehicleLockPollingCallback(flag, vehicles) {
    const allVehicles = vehicles || selectVehicle;
    if (flag && allVehicles?.length > 0) {
      openVehicleLockPolling(allVehicles);
    } else {
      closeVehicleLockPolling();
    }
  }

  function openVehicleLockPolling(ids) {
    LockCellPolling.start({ logicId: currentLogicAreaId, ids }, (response) => {
      props?.mapContext?.renderVehicleLocks(response);
    });
  }

  function closeVehicleLockPolling() {
    mapContext.clearAllLocks(); // 清理锁格
    LockCellPolling.terminate();
  }

  /********************** END: 显示小车锁格  ********************/

  /********************** 显示小车路径  ********************/
  function showRoutePollingCallback(flag, ids) {
    dispatch({
      type: 'monitorView/routePolling',
      payload: { flag, ids },
    });
  }

  /********************** END: 显示小车路径  ********************/

  /********************** 显示点位锁格  ********************/
  function switchCellLock(checked) {
    dispatch({
      type: 'monitorView/saveViewState',
      payload: { showCellLock: checked },
    });
  }

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

  /********************** END: 显示点位锁格  ********************/

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
      mapContext?.renderVehicleLocks(response);
    }
  }

  return (
    <div style={getMapModalPosition(550)} className={styles.monitorModal}>
      <div className={styles.monitorModalHeader}>
        <FormattedMessage id={'monitor.right.pathLock'} />
        <CloseOutlined onClick={close} style={{ cursor: 'pointer' }} />
      </div>
      <div className={styles.monitorModalBody} style={{ paddingTop: 20 }}>
        <Form labelWrap form={form} onValuesChange={onValuesChange}>
          {/* 小车ID */}
          <Form.Item {...formItemLayout} label={formatMessage({ id: 'app.vehicle' })} labelWrap>
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
                <Button size='small' onClick={selectAllVehicles}>
                  <FormattedMessage id='monitor.view.selectAllVehicles' />
                </Button>
              </Col>
            </Row>
          </Form.Item>

          {/* 任务路径 */}
          <Form.Item {...formItemLayout} label={formatMessage({ id: 'monitor.view.taskPath' })}>
            <Row gutter={10}>
              <Col>
                <Form.Item
                  noStyle
                  {...formItemLayout}
                  name={'showRoute'}
                  valuePropName={'checked'}
                  initialValue={routeView?.showRoute}
                >
                  <Switch
                    checkedChildren={formatMessage({ id: 'app.common.visible' })}
                    unCheckedChildren={formatMessage({ id: 'app.common.hidden' })}
                  />
                </Form.Item>
              </Col>
              <Col offset={2}>
                <Form.Item
                  noStyle
                  {...formItemLayout}
                  name={'showFullPath'}
                  valuePropName={'checked'}
                  initialValue={routeView?.showFullPath || false}
                >
                  <Checkbox>
                    <FormattedMessage id='monitor.view.taskPath.fullPath' />
                  </Checkbox>
                </Form.Item>
              </Col>
              <Col offset={2}>
                <Form.Item
                  noStyle
                  {...formItemLayout}
                  name={'showTargetLine'}
                  valuePropName={'checked'}
                  initialValue={routeView?.showTargetLine || false}
                >
                  <Checkbox>
                    <FormattedMessage id='monitor.view.taskPath.targetLine' />
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>

          {/* 路径锁格 */}
          <Form.Item {...formItemLayout} label={formatMessage({ id: 'monitor.right.pathLock' })}>
            <Row>
              <Col>
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
                    checkedChildren={formatMessage({ id: 'app.common.visible' })}
                    unCheckedChildren={formatMessage({ id: 'app.common.hidden' })}
                  />
                </Form.Item>
              </Col>
              <Col offset={2}>
                <Button
                  size='small'
                  onClick={refreshMapVehicleLock}
                  disabled={!vehicleLockView?.showLockCellPolling}
                >
                  <FormattedMessage id='app.button.refresh' />
                </Button>
              </Col>
            </Row>
          </Form.Item>

          {/* 点位锁格 */}
          <Form.Item {...formItemLayout} label={<FormattedMessage id='monitor.view.cellLock' />}>
            <Row style={{ width: '100%' }}>
              <Col>
                <Form.Item noStyle>
                  <Switch
                    checkedChildren={formatMessage({ id: 'app.common.visible' })}
                    unCheckedChildren={formatMessage({ id: 'app.common.hidden' })}
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
              <Col offset={2}>
                <Form.Item name={'cellIdForLock'} noStyle>
                  <InputNumber
                    allowClear
                    disabled={!showCellLock}
                    size='small'
                    style={{ width: '100%' }}
                    placeholder={formatMessage(
                      { id: 'app.template.required' },
                      { name: formatMessage({ id: 'app.map.cell' }) },
                    )}
                  />
                </Form.Item>
              </Col>
              <Col offset={1}>
                <Button size='small' disabled={!showCellLock} onClick={viewCellLocker}>
                  <FormattedMessage id='app.button.refresh' />
                </Button>
              </Col>
            </Row>
          </Form.Item>

          {/* 逻辑区的路径锁格信息  */}
          {window.localStorage.getItem('dev') === 'true' && (
            <Form.Item
              {...formItemLayout}
              label={<FormattedMessage id='monitor.view.logicLocked' />}
              labelWrap
            >
              <Row>
                <Col>
                  <Form.Item noStyle>
                    <Switch
                      checkedChildren={formatMessage({ id: 'app.common.visible' })}
                      unCheckedChildren={formatMessage({ id: 'app.common.hidden' })}
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
                <Col offset={2}>
                  <Button size='small' disabled={!showLogicLockedCell} onClick={viewLogicLocked}>
                    <FormattedMessage id='app.button.refresh' />
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          )}
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
