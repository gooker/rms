import React, { memo } from 'react';
import { Form, Row, Col, Switch, Button, Select, message, DatePicker } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { fetchCellHeat } from '@/services/XIHE';
import { getFormLayout, dealResponse, formatMessage } from '@/utils/util';
import { CellHeatType } from '@/config/consts';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../monitorLayout.module.less';

const width = 500;
const height = 500;
const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(6, 16);
const { Option } = Select;
const OptionData = [
  {
    label: formatMessage({ id: 'monitor.view.heat.cost' }),
    value: CellHeatType.cost_type,
  },
];

const HotheatControlComponent = (props) => {
  const { dispatch, mapRef } = props;
  const [form] = Form.useForm();

  function close() {
    dispatch({ type: 'monitor/saveCategoryModal', payload: null });
  }

  // 点位热度
  async function refreshCellHeat({ type, startTime, endTime, isTransparent }) {
    const response = await fetchCellHeat({ type, startTime, endTime });
    if (dealResponse(response)) return;
    mapRef.renderCellHeat(response, isTransparent);
  }

  function handleRequestHeat(event) {
    event.stopPropagation();
    form
      .validateFields()
      .then((value) => {
        const { type, startTime, endTime, isTransparent } = value;
        if (!type) {
          message.error(formatMessage({ id: 'app.mapView.require.heatView.viewType' }));
          return;
        }
        if (type === CellHeatType.cost_type) {
          refreshCellHeat({ type, isTransparent, startTime: '', endTime: '' });
        } else {
          if (!startTime || !endTime) {
            message.error(formatMessage({ id: 'app.mapView.require.heatView.timeRange' }));
            return;
          }
          refreshCellHeat({
            type,
            isTransparent,
            startTime: startTime.format('YYYY-MM-DD HH:mm:ss'),
            endTime: endTime.format('YYYY-MM-DD HH:mm:ss'),
          });
        }
      })
      .catch(() => {});
  }

  function clear() {
    mapRef.clearCellHeat();
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
        <FormattedMessage id={'monitor.right.cellheat'} />
        <CloseOutlined onClick={close} style={{ cursor: 'pointer' }} />
      </div>
      <div className={styles.monitorModalBody} style={{ paddingTop: 20 }}>
        <div style={{ textAlign: 'end', marginBottom: 20 }}>
          <Button type="link" onClick={handleRequestHeat}>
            <FormattedMessage id="app.button.refresh" />
          </Button>
        </div>

        <Form form={form} {...formItemLayout}>
          <Form.Item
            name={'type'}
            label={formatMessage({ id: 'monitor.view.heat.queryType' })}
            rules={[{ required: true }]}
            allowClear
          >
            <Select>
              {OptionData.map(({ label, value }, index) => (
                <Option key={index} value={value}>
                  {label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name={'startTime'} label={formatMessage({ id: 'app.common.startTime' })}>
            <DatePicker showTime />
          </Form.Item>

          <Form.Item name={'endTime'} label={formatMessage({ id: 'app.common.endTime' })}>
            <DatePicker showTime />
          </Form.Item>

          <Form.Item
            name={'isTransparent'}
            initialValue={true}
            valuePropName={'checked'}
            label={formatMessage({ id: 'monitor.view.heat.isTransparent' })}
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
export default connect(({ monitor }) => ({
  allAGVs: monitor.allAGVs,
  mapRef: monitor.mapContext,
  viewSetting: monitor.viewSetting,
  currentLogicAreaId: monitor.currentLogicArea,
}))(memo(HotheatControlComponent));
