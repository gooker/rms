import React, { memo } from 'react';
import { Form, Row, Col, Switch, Button, Checkbox } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { formatMessage, getFormLayout } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { StationRatePolling } from '@/workers/StationRateManager';
import { CostOptions } from '../../MapEditor/enums';
import styles from '../monitorLayout.module.less';

const width = 500;
const height = 500;
const { formItemLayout } = getFormLayout(6, 16);

const ViewControlComponent = (props) => {
  const {
    dispatch,
    mapRef,
    shownPriority,
    distanceShow,
    cellPointShow,
    coordinationShow,
    stationRealTimeRateView,
    backImgeView,
    emergencyAreaShow,
  } = props;
  const [form] = Form.useForm();

  function close() {
    dispatch({ type: 'monitor/saveCategoryModal', payload: null });
  }

  function onValuesChange(changedValues) {
    const currentKey = Object.keys(changedValues)[0];
    const currentValue = Object.values(changedValues)[0];
    dispatch({
      type: 'monitorView/saveViewState',
      payload: {
        [currentKey]: currentValue,
      },
    });
  }

  // 刷新紧急区域
  function refreshEmergencyArea() {
    const { mapId } = props;
    dispatch({
      type: 'monitor/fetchEmergencyStopList',
      payload: mapId,
    }).then((res) => {
      const showAllowed = form.getFieldValue('emergencyAreaShow');
      if (showAllowed) {
        mapRef.renderEmergencyStopArea(res || []);
      } else {
        mapRef.clearEmergencyStopArea();
      }
    });
  }

  // 轮询站点速率
  function switchRatePolling(checked) {
    if (checked) {
      StationRatePolling.start((value) => {
        dispatch({ type: 'monitor/updateStationRate', payload: { mapRef, response: value } });
      });
    } else {
      StationRatePolling.terminate();
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
        <FormattedMessage id={'monitor.right.mapView'} />
        <CloseOutlined onClick={close} style={{ cursor: 'pointer' }} />
      </div>
      <div className={styles.monitorModalBody} style={{ paddingTop: 20 }}>
        <Form form={form} onValuesChange={onValuesChange} {...formItemLayout}>
          {/* 优先级显示 */}
          <Form.Item
            {...formItemLayout}
            name="shownPriority"
            initialValue={shownPriority || []}
            label={<FormattedMessage id={'editor.view.priorityDisplay'} />}
          >
            <Checkbox.Group
              onChange={(value) => {
                mapRef && mapRef.filterRelations(value || [], 'monitor');
              }}
              options={CostOptions?.map((item) => ({
                ...item,
                label: formatMessage({ id: item.label }),
              }))}
            />
          </Form.Item>

          <Form.Item
            name={'distanceShow'}
            initialValue={distanceShow}
            valuePropName={'checked'}
            label={formatMessage({ id: 'editor.view.distanceDisplay' })}
          >
            <Switch
              onChange={(value) => {
                mapRef && mapRef.switchDistanceShown(value, false);
              }}
            />
          </Form.Item>

          {/* 地图点位 */}
          <Form.Item
            name={'cellPointShow'}
            initialValue={cellPointShow}
            valuePropName={'checked'}
            label={formatMessage({ id: 'monitor.view.mapCellView' })}
          >
            <Switch
              onChange={(value) => {
                mapRef && mapRef.switchCellShown(value, true);
              }}
            />
          </Form.Item>

          {/* 点位坐标 */}
          <Form.Item
            name={'coordinationShow'}
            initialValue={coordinationShow}
            valuePropName={'checked'}
            label={formatMessage({ id: 'monitor.view.coordinateDisplay' })}
          >
            <Switch
              onChange={(value) => {
                mapRef && mapRef.switchCoordinationShown(value, true);
              }}
            />
          </Form.Item>

          {/* 站点速率显示 */}
          <Form.Item
            label={formatMessage({ id: 'monitor.view.stationRealtimeRate' })}
            name={'stationRealTimeRateView'}
            valuePropName={'checked'}
            initialValue={stationRealTimeRateView}
          >
            <Switch
              onChange={(value) => {
                switchRatePolling(value);
                mapRef && mapRef.switchStationRealTimeRateShown(value);
              }}
            />
          </Form.Item>

          {/* 背景显示 */}
          <Form.Item
            label={formatMessage({ id: 'editor.view.backImgDisplay' })}
            name={'backImgeView'}
            valuePropName={'checked'}
            initialValue={backImgeView}
          >
            <Switch
              checked={props.showBackImg}
              onChange={(value) => {
                mapRef && mapRef.switchBackImgShown(value);
              }}
            />
          </Form.Item>

          {/* 急停区 */}
          <Form.Item
            label={formatMessage({ id: 'app.map.emergencyStop' })}
            style={{ marginBottom: 0 }}
          >
            <Row style={{ width: '100%' }}>
              <Col span={6}>
                <Form.Item
                  name={'emergencyAreaShow'}
                  valuePropName={'checked'}
                  initialValue={emergencyAreaShow}
                >
                  <Switch
                    onChange={(value) => {
                      mapRef && mapRef.emergencyAreaShown(value);
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={4} style={{ padding: 5 }}>
                <Button size="small" onClick={refreshEmergencyArea}>
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
  mapRef: monitor.mapContext,
  shownPriority: monitorView.shownPriority,
  distanceShow: monitorView.distanceShow,
  cellPointShow: monitorView.cellPointShow,
  coordinationShow: monitorView.coordinationShow,
  stationRealTimeRateView: monitorView.stationRealTimeRateView,
  backImgeView: monitorView.backImgeView,
  emergencyAreaShow: monitorView.emergencyAreaShow,
  currentLogicAreaId: monitor.currentLogicArea,
}))(memo(ViewControlComponent));
