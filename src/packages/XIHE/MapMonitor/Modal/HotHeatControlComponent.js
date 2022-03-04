import React, { memo } from 'react';
import { Form, Row, Col, Switch, Button, Select, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { fetchCellHeat } from '@/services/XIHE';
import { getFormLayout, dealResponse, formatMessage } from '@/utils/util';
import { CellHeatType } from '@/config/consts';
import FormattedMessage from '@/components/FormattedMessage';

import styles from '../monitorLayout.module.less';

const width = 500;
const height = 400;
const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(6, 16);
const { Option } = Select;
const OptionData = [
  {
    label: formatMessage({ id: 'monitor.view.heat.cost' }),
    value: CellHeatType.cost_type,
  },
];

const HotheatControlComponent = (props) => {
  const { dispatch, mapRef, hotType, costHeatOpacity } = props;
  const [form] = Form.useForm();

  function close() {
    dispatch({ type: 'monitor/saveCategoryModal', payload: null });
  }

  // 点位热度
  async function refreshCellHeat({ type, startTime, endTime }) {
    const response = await fetchCellHeat({ type, startTime, endTime });
    if (dealResponse(response)) return;
    mapRef.renderCellHeat(response);
  }

  function handleRequestHeat(event) {
    event.stopPropagation();
    form
      .validateFields()
      .then((value) => {
        const { type, startTime, endTime } = value;
        if (type === CellHeatType.cost_type) {
          refreshCellHeat({ type, startTime: '', endTime: '' });
        } else {
          if (!startTime || !endTime) {
            message.error(formatMessage({ id: 'monitor.view.heat.require.timeRange' }));
            return;
          }
          refreshCellHeat({
            type,
            startTime: startTime.format('YYYY-MM-DD HH:mm:ss'),
            endTime: endTime.format('YYYY-MM-DD HH:mm:ss'),
          });
        }
      })
      .catch(() => {});
  }

  function clear() {
    switchPolling(false);
    mapRef.clearCellHeat();
  }

  function switchPolling(checked) {
    dispatch({
      type: 'monitorView/savePollingCost',
      payload: checked,
    });
  }

  async function switchTransparent(checked) {
    await dispatch({
      type: 'monitor/saveState',
      payload: { costHeatOpacity: checked },
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
        <FormattedMessage id={'monitor.right.heat'} />
        <CloseOutlined onClick={close} style={{ cursor: 'pointer' }} />
      </div>
      <div className={styles.monitorModalBody} style={{ paddingTop: 20 }}>
        <Row>
          <Col offset={16}>
            <Form.Item label={<FormattedMessage id={'monitor.view.heat.autoRefresh'} />}>
              <Switch
                checked={props.showCostPolling}
                onChange={(ev) => switchPolling(ev)}
                checkedChildren={formatMessage({ id: 'app.common.true' })}
                unCheckedChildren={formatMessage({ id: 'app.common.false' })}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form form={form} {...formItemLayout}>
          <Form.Item
            name={'type'}
            initialValue={hotType}
            label={formatMessage({ id: 'monitor.view.heat.queryType' })}
            rules={[{ required: true }]}
            allowClear
            getValueFromEvent={(e) => {
              dispatch({
                type: 'monitor/saveState',
                payload: { hotType: e },
              });
              return e;
            }}
          >
            <Select>
              {OptionData.map(({ label, value }, index) => (
                <Option key={index} value={value}>
                  {label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name={'isTransparent'}
            valuePropName={'checked'}
            label={formatMessage({ id: 'monitor.view.heat.isTransparent' })}
            initialValue={costHeatOpacity}
            getValueFromEvent={(e) => {
              switchTransparent(e);
              return e;
            }}
          >
            <Switch
              checkedChildren={formatMessage({ id: 'app.common.true' })}
              unCheckedChildren={formatMessage({ id: 'app.common.false' })}
            />
          </Form.Item>

          <Form.Item {...formItemLayoutNoLabel}>
            <Row type="flex" gutter={10}>
              <Col>
                <Button type="primary" onClick={handleRequestHeat}>
                  <FormattedMessage id="app.map.view" />
                </Button>
              </Col>
              <Col>
                <Button onClick={clear}>
                  <FormattedMessage id="monitor.view.heat.clear" />
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
  mapRef: monitor.mapContext,
  showCostPolling: monitorView?.showCostPolling,
  hotType: monitor?.hotType,
  costHeatOpacity: monitor?.costHeatOpacity,
}))(memo(HotheatControlComponent));
