import React, { memo, useState } from 'react';
import { Form, Row, Col, message, Button, Select } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { isStrictNull, getFormLayout, formatMessage } from '@/utils/util';
import Dictionary from '@/utils/Dictionary';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../monitorLayout.module.less';

const width = 500;
const height = 400;
const { formItemLayout } = getFormLayout(6, 16);

const Tracking = (props) => {
  const { dispatch, mapRef, viewSetting, allAGVs } = props;
  const [form] = Form.useForm();
  const [isTracking, setIsTracking] = useState(false);

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
        <FormattedMessage id={'monitor.right.tracking'} />
        <CloseOutlined onClick={close} style={{ cursor: 'pointer' }} />
      </div>
      <div className={styles.monitorModalBody} style={{ paddingTop: 20 }}>
        <Form form={form} onValuesChange={onValuesChange} {...formItemLayout}>
          {/* 追踪小车 */}
          <Form.Item label={<FormattedMessage id="monitor.tracking.trackAMR" />}>
            <Row>
              <Col span={15}>
                <Form.Item name={'trackingCar'} initialValue={viewSetting?.trackingCar}>
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
                    if (isTracking) {
                      setIsTracking(false);
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
                      setIsTracking(true);
                      mapRef && mapRef.trackAGV(trackingCar);
                    }
                  }}
                  size="small"
                >
                  {isTracking
                    ? formatMessage({ id: 'monitor.tracking.trackAMR.untrack' })
                    : formatMessage({ id: 'monitor.tracking.trackAMR.track' })}
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
}))(memo(Tracking));
