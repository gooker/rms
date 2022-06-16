import React, { memo } from 'react';
import { Button, Form, Row, Switch } from 'antd';
import { CloseOutlined, ReloadOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { dealResponse, formatMessage, getFormLayout, isStrictNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { StationRatePolling } from '@/workers/WebWorkerManager';
import CostCheckBox from '@/packages/Scene/components/CostCheckBox';
import styles from '../monitorLayout.module.less';

const width = 600;
const height = 520;
const { formItemLayout } = getFormLayout(6, 10);

const MonitorViewControlModal = (props) => {
  const {
    dispatch,
    mapContext,
    showCellPoint,
    showCoordinate,
    showCellsLine,
    shownPriority,
    showDistance,
    showBackImage,
    stationRealTimeRateView,
    emergencyAreaShown,
  } = props;

  // 轮询站点速率
  function switchRatePolling(checked) {
    if (checked) {
      StationRatePolling.start((response) => {
        if (!dealResponse(response)) {
          const currentData = Object.values(response).filter((item) => !isStrictNull(item))[0];
          mapContext.renderCommonStationRate(currentData);
          dispatch({ type: 'monitor/saveStationRate', payload: currentData });
        }
      });
    } else {
      StationRatePolling.terminate();
    }
  }

  // 切换显示地图点位
  function switchCellShown(visible) {
    dispatch({
      type: 'monitorView/saveState',
      payload: { showCellPoint: visible },
    });
    mapContext.switchCellShown(visible, true);
  }

  // 切换显示点位坐标
  function switchCoordinatorShown(value) {
    dispatch({
      type: 'monitorView/saveState',
      payload: { showCoordinate: value },
    });
    mapContext.switchCoordinationShown(value, true);
  }

  // 切换显示点的关系线
  function switchCellsLineShown(value) {
    dispatch({
      type: 'monitorView/saveState',
      payload: { showCellsLine: value },
    });
    mapContext.switchCellsLineShown(value);
  }

  // 切换显示优先级箭头
  function filterPriorityShown(value) {
    dispatch({
      type: 'monitorView/saveState',
      payload: { shownPriority: value },
    });
    mapContext.filterRelations(value);
  }

  // 切换显示距离
  function switchDistanceShown(value) {
    dispatch({
      type: 'monitorView/saveState',
      payload: { showDistance: value },
    });
    mapContext.switchDistanceShown(value, false);
  }

  // 切换显示站点实时速率
  function switchStationRealTimeRateShown(value) {
    dispatch({
      type: 'monitorView/saveState',
      payload: { stationRealTimeRateView: value },
    });
    switchRatePolling(value);
    mapContext && mapContext.switchStationRealTimeRateShown(value);
  }

  // 切换显示地图背景
  function switchBackImageShown(value) {
    dispatch({
      type: 'monitorView/saveState',
      payload: { showBackImage: value },
    });
    mapContext.switchBackImgShown(value);
  }

  // 切换显示急停区
  function switchEmergencyStopShown(value) {
    dispatch({
      type: 'monitorView/saveState',
      payload: { emergencyAreaShown: value },
    });
    mapContext.emergencyAreaShown(value);
  }

  // 刷新紧急区域
  function refreshEmergencyArea() {
    const { mapId } = props;
    dispatch({
      type: 'monitor/fetchEmergencyStopList',
      payload: mapId,
    }).then((res) => {
      if (emergencyAreaShown) {
        mapContext.renderEmergencyStopArea(res || []);
      } else {
        mapContext.clearEmergencyStopArea();
      }
    });
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
        <FormattedMessage id={'monitor.right.mapView'} />
        <CloseOutlined
          style={{ cursor: 'pointer' }}
          onClick={() => {
            dispatch({ type: 'monitor/saveCategoryModal', payload: null });
          }}
        />
      </div>
      <div className={styles.monitorModalBody} style={{ paddingTop: 20 }}>
        <Form labelWrap>
          {/* 地图点位 */}
          <Form.Item {...formItemLayout} label={formatMessage({ id: 'monitor.view.mapCellView' })}>
            <Switch
              checked={showCellPoint}
              onChange={switchCellShown}
              checkedChildren={formatMessage({ id: 'app.common.visible' })}
              unCheckedChildren={formatMessage({ id: 'app.common.hidden' })}
            />
          </Form.Item>

          {/* 优先级显示 */}
          <Form.Item
            {...formItemLayout}
            label={<FormattedMessage id={'editor.view.priorityDisplay'} />}
          >
            <CostCheckBox
              disabled={!showCellPoint}
              style={{ marginTop: 6 }}
              value={shownPriority}
              onChange={filterPriorityShown}
            />
          </Form.Item>

          {/* 点关系线显示 */}
          <Form.Item
            {...formItemLayout}
            label={<FormattedMessage id={'editor.view.cellsLineDisplay'} />}
          >
            <Switch
              disabled={shownPriority.length === 0 || !showCellPoint}
              checked={showCellsLine}
              onChange={switchCellsLineShown}
            />
          </Form.Item>

          {/* 点位坐标 */}
          <Form.Item
            {...formItemLayout}
            label={formatMessage({ id: 'monitor.view.coordinateDisplay' })}
          >
            <Switch
              disabled={!showCellPoint}
              checked={showCoordinate}
              onChange={switchCoordinatorShown}
              checkedChildren={formatMessage({ id: 'app.common.visible' })}
              unCheckedChildren={formatMessage({ id: 'app.common.hidden' })}
            />
          </Form.Item>

          {/* 距离显示 */}
          <Form.Item
            {...formItemLayout}
            label={formatMessage({ id: 'editor.view.distanceDisplay' })}
          >
            <Switch
              disabled={!showCellsLine}
              checked={showDistance}
              onChange={switchDistanceShown}
              checkedChildren={formatMessage({ id: 'app.common.visible' })}
              unCheckedChildren={formatMessage({ id: 'app.common.hidden' })}
            />
          </Form.Item>

          {/* 站点速率显示 */}
          <Form.Item
            {...formItemLayout}
            label={formatMessage({ id: 'monitor.view.stationRealtimeRate' })}
          >
            <Switch
              checked={stationRealTimeRateView}
              onChange={switchStationRealTimeRateShown}
              checkedChildren={formatMessage({ id: 'app.common.visible' })}
              unCheckedChildren={formatMessage({ id: 'app.common.hidden' })}
            />
          </Form.Item>

          {/* 背景显示 */}
          <Form.Item
            {...formItemLayout}
            label={formatMessage({ id: 'editor.view.backImgDisplay' })}
          >
            <Switch
              checked={showBackImage}
              onChange={switchBackImageShown}
              checkedChildren={formatMessage({ id: 'app.common.visible' })}
              unCheckedChildren={formatMessage({ id: 'app.common.hidden' })}
            />
          </Form.Item>

          {/* 急停区 */}
          <Form.Item {...formItemLayout} label={formatMessage({ id: 'app.map.emergencyStop' })}>
            <Row style={{ width: '100%' }}>
              <Form.Item>
                <Switch
                  checked={emergencyAreaShown}
                  onChange={switchEmergencyStopShown}
                  checkedChildren={formatMessage({ id: 'app.common.visible' })}
                  unCheckedChildren={formatMessage({ id: 'app.common.hidden' })}
                />
              </Form.Item>
              <div style={{ paddingTop: 5, marginLeft: 5 }}>
                <Button size='small' type={'link'} onClick={refreshEmergencyArea}>
                  <ReloadOutlined />
                </Button>
              </div>
            </Row>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default connect(({ monitor, monitorView }) => ({
  mapContext: monitor.mapContext,
  shownPriority: monitorView.shownPriority,
  showCellsLine: monitorView.showCellsLine,
  showDistance: monitorView.showDistance,
  showCellPoint: monitorView.showCellPoint,
  showCoordinate: monitorView.showCoordinate,
  showBackImage: monitorView.showBackImage,
  emergencyAreaShown: monitorView.emergencyAreaShown,
  stationRealTimeRateView: monitorView.stationRealTimeRateView,
}))(memo(MonitorViewControlModal));
