import React, { memo } from 'react';
import { Button, Col, Form, Input, message, Row, Select } from 'antd';
import { connect } from '@/utils/RmsDva';
import { formatMessage, getFormLayout, isStrictNull } from '@/utils/util';
import Dictionary from '@/utils/Dictionary';
import FormattedMessage from '@/components/FormattedMessage';

const { formItemLayout } = getFormLayout(6, 16);

const LocationTracking = (props) => {
  const {
    dispatch,
    mapRef,
    allVehicles,
    trackingView: { trackingCar, trackingCarSure, locationType, locationValue },
  } = props;
  const [form] = Form.useForm();

  function onValuesChange(changedValues) {
    const currentkey = Object.keys(changedValues)[0];
    const currentValue = Object.values(changedValues)[0];
    dispatch({
      type: 'monitorView/saveTrackingView',
      payload: {
        [currentkey]: currentValue,
      },
    });
  }

  return (
    <div>
      <Form form={form} onValuesChange={onValuesChange} {...formItemLayout}>
        {/* 追踪小车 */}
        <Form.Item label={<FormattedMessage id="monitor.tracking.trackAMR" />}>
          <Row>
            <Col span={15}>
              <Form.Item name={'trackingCar'} initialValue={trackingCar} noStyle>
                <Select size="small" optionLabelProp="value">
                  {allVehicles?.map((record) => (
                    <Select.Option value={record.uniqueId} key={record.uniqueId}>
                      <Row>
                        <Col span={12}>{record.vehicleId}</Col>
                        <Col span={12} style={{ textAlign: 'end' }}>
                          <FormattedMessage
                            id={Dictionary(
                              'vehicleStatus',
                              record?.vehicleWorkStatusDTO?.vehicleStatus,
                            )}
                          />
                        </Col>
                      </Row>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col style={{ marginLeft: 10 }}>
              <Button
                onClick={() => {
                  let isTracking;
                  if (trackingCarSure) {
                    isTracking = false;
                    if (mapRef) {
                      mapRef.trackVehicle(null);
                      mapRef.centerView();
                    }
                  } else {
                    const trackingCar = form.getFieldValue('trackingCar');
                    if (isStrictNull(trackingCar)) {
                      message.error(formatMessage({ id: 'monitor.tracking.require.trackAMR' }));
                      return false;
                    }
                    isTracking = true;
                    mapRef && mapRef.trackVehicle(trackingCar);
                  }
                  dispatch({
                    type: 'monitorView/saveTrackingView',
                    payload: {
                      trackingCarSure: isTracking,
                    },
                  });
                }}
                size="small"
              >
                {trackingCarSure
                  ? formatMessage({ id: 'monitor.tracking.trackAMR.untrack' })
                  : formatMessage({ id: 'monitor.tracking.trackAMR.track' })}
              </Button>
            </Col>
          </Row>
        </Form.Item>

        {/* 定位 */}
        <Form.Item label={formatMessage({ id: 'monitor.location' })}>
          <Row>
            <Col span={8}>
              <Form.Item noStyle name={'locationType'} initialValue={locationType}>
                <Select size="small">
                  <Select.Option key="cell" value={'cell'}>
                    <FormattedMessage id="app.map.cell" />
                  </Select.Option>
                  <Select.Option key="pod" value={'pod'}>
                    <FormattedMessage id="app.pod" />
                  </Select.Option>
                  <Select.Option key="vehicle" value={'vehicle'}>
                    <FormattedMessage id="app.vehicle" />
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8} offset={1}>
              <Form.Item noStyle name={'locationValue'} initialValue={locationValue}>
                {form.getFieldValue('locationType') === 'vehicle' ? (
                  <Select
                    allowClear
                    showSearch
                    size="small"
                    maxTagCount={5}
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
                ) : (
                  <Input size="small" />
                )}
              </Form.Item>
            </Col>
            <Col span={6} style={{ textAlign: 'right' }}>
              <Button
                size="small"
                onClick={() => {
                  const locationType = form.getFieldValue('locationType');
                  const locationValue = form.getFieldValue('locationValue');
                  if (!isStrictNull(locationType) && !isStrictNull(locationValue)) {
                    mapRef?.locationElements(locationType, locationValue);
                  } else {
                    message.error(formatMessage({ id: 'monitor.tracking.require.location' }));
                  }
                }}
              >
                <FormattedMessage id="monitor.location" />
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </div>
  );
};
export default connect(({ monitor, monitorView }) => ({
  allVehicles: monitor.allVehicles,
  mapRef: monitor.mapContext,
  trackingView: monitorView.trackingView,
  currentLogicAreaId: monitor.currentLogicArea,
}))(memo(LocationTracking));
