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
    allAGVs,
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
                  {allAGVs?.map((record) => (
                    <Select.Option value={record.vehicleId} key={record.vehicleId}>
                      <Row>
                        <Col span={12}>{record.vehicleId}</Col>
                        <Col span={12} style={{ textAlign: 'end' }}>
                          <FormattedMessage id={Dictionary('agvStatus', record?.agvWorkStatusDTO?.agvStatus)} />
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
                      mapRef.trackAGV(null);
                      mapRef.centerView();
                    }
                  } else {
                    const trackingCar = form.getFieldValue('trackingCar');
                    if (isStrictNull(trackingCar)) {
                      message.error(formatMessage({ id: 'monitor.tracking.require.trackAMR' }));
                      return false;
                    }
                    isTracking = true;
                    mapRef && mapRef.trackAGV(trackingCar);
                  }
                  dispatch({
                    type: 'monitorView/saveTrackingView',
                    payload: {
                      trackingCarSure:isTracking,
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
                  <Select.Option key="robot" value={'robot'}>
                    <FormattedMessage id="app.agv" />
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8} offset={1}>
              <Form.Item noStyle name={'locationValue'} initialValue={locationValue}>
                <Input size="small" />
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
  allAGVs: monitor.allAGVs,
  mapRef: monitor.mapContext,
  trackingView: monitorView.trackingView,
  currentLogicAreaId: monitor.currentLogicArea,
}))(memo(LocationTracking));
