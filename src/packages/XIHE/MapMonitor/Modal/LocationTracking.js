import React, { memo } from 'react';
import { Form, Row, Col, message, Button, Select, Input } from 'antd';
import { connect } from '@/utils/RmsDva';
import { isStrictNull, getFormLayout, formatMessage } from '@/utils/util';
import Dictionary from '@/utils/Dictionary';
import FormattedMessage from '@/components/FormattedMessage';

const { formItemLayout } = getFormLayout(6, 16);

const LocationTracking = (props) => {
  const { dispatch, mapRef, allAGVs, trackingCar, trackingCarSure } = props;
  const [form] = Form.useForm();

  function onValuesChange(changedValues) {
    dispatch({
      type: 'monitor/fetchUpdateViewSetting',
      payload: {
        key: Object.keys(changedValues)[0],
        value: Object.values(changedValues)[0],
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
                    <Select.Option value={record.robotId} key={record.robotId}>
                      <Row>
                        <Col span={12}>{record.robotId}</Col>
                        <Col span={12} style={{ textAlign: 'end' }}>
                          <FormattedMessage id={Dictionary('agvStatus', record.agvStatus)} />
                        </Col>
                      </Row>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col style={{ paddingTop: 4, marginLeft: 10 }}>
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
                    type: 'monitor/fetchUpdateViewSetting',
                    payload: {
                      key: 'trackingCarSure',
                      value: isTracking,
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
              <Form.Item name={'locationType'}>
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
export default connect(({ monitor }) => ({
  allAGVs: monitor.allAGVs,
  mapRef: monitor.mapContext,
  trackingCar: monitor.viewSetting?.trackingCar,
  trackingCarSure: monitor.viewSetting?.trackingCarSure || false,
  currentLogicAreaId: monitor.currentLogicArea,
}))(memo(LocationTracking));
