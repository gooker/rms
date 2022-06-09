import React, { memo, useState } from 'react';
import { Button, Col, Form, Row, Select, Switch } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { getToteTaskRealtimePath, getToteTaskRealtimeState } from '@/services/XIHEService';
import { dealResponse, getFormLayout, isNull, isStrictNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../monitorLayout.module.less';

const width = 500;
const height = 400;
const { formItemLayout } = getFormLayout(6, 16);
let toteTaskRealtimeImterval = null;

const ToteViewControlComponent = (props) => {
  const { dispatch, mapRef, toteBinShown, allVehicles } = props;
  const [form] = Form.useForm();
  const [pullToteTaskRealtime, setPullToteTaskRealtime] = useState(false);

  function close() {
    dispatch({ type: 'monitor/saveCategoryModal', payload: null });
  }

  function onValuesChange(changedValues) {
    const currentKey = Object.keys(changedValues)[0];
    const currentValue = Object.values(changedValues)[0];
    dispatch({
      type: 'monitorView/saveViewState',
      payload: { [currentKey]: currentValue },
    });
  }

  // 显示料箱任务实时路径状态
  function displayToteTaskRealtime() {
    const toteTaskRealtimePath = form.getFieldValue('toteTaskRealtimePath');
    if (pullToteTaskRealtime) {
      setPullToteTaskRealtime(false);
      mapRef.recordToteTaskRealtimeData([]);
      toteTaskRealtimeImterval && clearInterval(toteTaskRealtimeImterval);
    } else {
      if (!isStrictNull(toteTaskRealtimePath)) {
        setPullToteTaskRealtime(true);
        toteTaskRealtimeImterval = setInterval(() => {
          getToteTaskRealtimePath().then((response) => {
            if (!dealResponse(response)) {
              const targetToteRealtime = response.filter(
                (item) => item.rid === toteTaskRealtimePath,
              );
              mapRef.recordToteTaskRealtimeData(targetToteRealtime);
            }
          });
        }, 1000);
      }
    }
  }

  // 显示料箱实时状态
  function refreshToteBinState() {
    const toteTaskRealtime = form.getFieldValue('toteTaskRealtime');
    if (!isNull(toteTaskRealtime)) {
      getToteTaskRealtimeState(toteTaskRealtime).then((response) => {
        if (!dealResponse(response)) {
          mapRef.renderToteRealtimeState(toteTaskRealtime, response);
        }
      });
    } else {
      mapRef.renderToteRealtimeState(null);
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
        <FormattedMessage id={'monitor.right.toteDisplay'} />
        <CloseOutlined onClick={close} style={{ cursor: 'pointer' }} />
      </div>
      <div className={styles.monitorModalBody} style={{ paddingTop: 20 }}>
        <Form form={form} onValuesChange={onValuesChange} {...formItemLayout}>
          {/* 料箱货架 */}
          <Form.Item
            name={'toteBinShown'}
            valuePropName={'checked'}
            label={<FormattedMessage id="app.map.tote" />}
            initialValue={toteBinShown}
          >
            <Switch
              onChange={(value) => {
                mapRef && mapRef.switchToteShown(value);
              }}
            />
          </Form.Item>

          {/* 料箱任务路径展示 */}
          <Form.Item label={<FormattedMessage id="monitor.view.toteTaskPath" />}>
            <Row>
              <Col>
                <Form.Item noStyle name={'toteTaskRealtimePath'}>
                  <Select size="small" style={{ width: 150 }}>
                    {allVehicles.map((element) => (
                      <Select.Option key={element.vehicleId} value={element.vehicleId}>
                        {element.vehicleId}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col style={{ marginLeft: 13 }}>
                <Button size="small" onClick={displayToteTaskRealtime}>
                  {pullToteTaskRealtime ? (
                    <FormattedMessage id="app.button.cancel" />
                  ) : (
                    <FormattedMessage id="app.button.check" />
                  )}
                </Button>
              </Col>
            </Row>
          </Form.Item>

          {/* 料箱实时状态 */}
          <Form.Item label={<FormattedMessage id="monitor.view.toteBinState" />}>
            <Row>
              <Col>
                <Form.Item noStyle name={'toteTaskRealtime'}>
                  <Select allowClear size="small" style={{ width: 150 }}>
                    <Select.Option value={'BOTH'}>
                      <FormattedMessage id="monitor.view.bothTaskCount" />
                    </Select.Option>
                    <Select.Option value={'USED'}>
                      <FormattedMessage id="monitor.view.binUsedState" />
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col style={{ marginLeft: 13 }}>
                <Button size="small" onClick={refreshToteBinState}>
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
  mapRef: monitor.mapContext,
  toteBinShown: monitorView.toteBinShown,
  currentLogicAreaId: monitor.currentLogicArea,
}))(memo(ToteViewControlComponent));
