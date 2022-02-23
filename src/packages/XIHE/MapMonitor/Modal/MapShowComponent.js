import React, { memo, useEffect } from 'react';
import { Form, Row, Col, Switch, Button, Checkbox } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { formatMessage, getFormLayout } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { getCurrentRouteMapData } from '@/utils/mapUtil';
import { CostOptions } from '../../MapEditor/enums';
import styles from '../monitorLayout.module.less';

const width = 500;
const height = 500;
const { formItemLayout } = getFormLayout(6, 16);

const MapShowComponent = (props) => {
  const { dispatch, relations, mapRef, viewSetting } = props;
  const [form] = Form.useForm();

  function close() {
    dispatch({ type: 'monitor/saveCategoryModal', payload: null });
  }

  function onValuesChange(changedValues) {
    dispatch({
      type: 'monitor/fetchUpdateViewSetting',
      payload: {
        key: Object.keys(changedValues)[0],
        value: Object.values(changedValues)[0],
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
            initialValue={viewSetting?.shownPriority || []}
            label={<FormattedMessage id={'editor.view.priorityDisplay'} />}
          >
            <Checkbox.Group
              onChange={(value) => {
                mapRef && mapRef.filterRelations(relations, value || [], 'monitor');
              }}
              options={CostOptions?.map((item) => ({
                ...item,
                label: formatMessage({ id: item.label }),
              }))}
            />
          </Form.Item>

          <Form.Item
            name={'distanceShow'}
            initialValue={viewSetting?.distanceShow || false}
            valuePropName={'checked'}
            label={formatMessage({ id: 'editor.view.distanceDisplay' })}
          >
            <Switch
              onChange={(value) => {
                mapRef && mapRef.switchDistanceShown(value, true);
              }}
            />
          </Form.Item>

          {/* 地图点位 */}
          <Form.Item
            name={'cellPointShow'}
            initialValue={viewSetting?.cellPointShow || true}
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
            initialValue={viewSetting?.coordinationShow || false}
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
            initialValue={viewSetting?.stationRealTimeRateView || false}
          >
            <Switch
              onChange={(value) => {
                mapRef && mapRef.switchStationRealTimeRateShown(value);
              }}
            />
          </Form.Item>

          {/* 背景显示 */}
          <Form.Item
            label={formatMessage({ id: 'editor.view.backImgDisplay' })}
            name={'backImgeView'}
            valuePropName={'checked'}
            initialValue={viewSetting?.backImgeView || false}
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
                  initialValue={viewSetting?.emergencyAreaShow || true}
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
export default connect(({ monitor }) => ({
  allAGVs: monitor.allAGVs,
  mapRef: monitor.mapContext,
  viewSetting: monitor.viewSetting,
  currentLogicAreaId: monitor.currentLogicArea,
  relations: getCurrentRouteMapData('monitor')?.relations || [],
}))(memo(MapShowComponent));
