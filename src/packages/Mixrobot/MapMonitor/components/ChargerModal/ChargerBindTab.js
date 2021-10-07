import React, { memo, useState, useContext, useEffect } from 'react';
import { Form, Row, Col, Popconfirm, Select, Button } from 'antd';
import { formatMessage, dealResponse } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';
import {
  fetchPhysicChargers,
  fetchBindPhysicCharger,
  fetchBatchUnbindHardware,
} from '@/services/mixrobot';
import MonitorMapContext from '@/packages/Mixrobot/MapMonitor/MonitorMapContext';
import styles from './chargerModal.less';

const FormItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 19 } };
const { Option } = Select;

const ChargerBindTab = (props) => {
  const mapRef = useContext(MonitorMapContext);

  const { mapId, data, refresh } = props;

  const [hardwareId, setHardwareId] = useState(getHardwareId());
  const [physicCharger, setPhysicCharger] = useState([]);

  useEffect(() => {
    fetchPhysicChargers().then((response) => {
      if (!dealResponse(response)) {
        setPhysicCharger(response);
      }
    });
  }, []);

  function renderSelectOption() {
    return physicCharger.map((item) => {
      let label = item.hardwareId;
      if (item.status) {
        label += ' - ';
        label += formatMessage({
          id: `app.chargeManger.${item.status}`,
        });
      }
      return (
        <Option key={item.id} value={item.hardwareId}>
          {label}
        </Option>
      );
    });
  }

  function getHardwareId() {
    if (data && data.type) {
      return data.hardwareId;
    }
    return null;
  }

  async function bindHardware() {
    const requestParam = { mapId, name: data.name, hardwareId };
    const response = await fetchBindPhysicCharger(requestParam);
    if (!dealResponse(response)) {
      mapRef.updateChargerHardware(data.name, hardwareId);
      refresh(data.name);
    }
  }

  async function unbindHardware() {
    const response = await fetchBatchUnbindHardware([data.id]);
    if (!dealResponse(response)) {
      mapRef.updateChargerHardware(data.name);
      refresh(data.name);
    }
  }

  function renderHardwareId() {
    if (data) {
      return (
        <Row gutter={10}>
          <Col span={8}>
            <Select
              allowClear
              size="small"
              value={hardwareId}
              onChange={setHardwareId}
              disabled={data.hardwareId}
              placeholder={formatMessage({ id: 'app.monitor.modal.tip.hardware' })}
            >
              {renderSelectOption()}
            </Select>
          </Col>
          <Col span={4}>
            <Popconfirm
              title={
                data.hardwareId
                  ? formatMessage({ id: 'app.monitor.modal.charger.unBind.confirm' })
                  : formatMessage({ id: 'app.monitor.modal.charger.bind.confirm' })
              }
              onConfirm={() => {
                data.hardwareId ? unbindHardware() : bindHardware();
              }}
            >
              <Button size="small">
                {data.hardwareId ? (
                  <FormattedMessage id="app.monitor.modal.charger.unBind" />
                ) : (
                  <FormattedMessage id="app.monitor.modal.charger.bind" />
                )}
              </Button>
            </Popconfirm>
          </Col>
        </Row>
      );
    }
    return null;
  }

  function renderPort() {
    // 首先保证不是虚拟的
    if (data && data.type) {
      return data.port;
    }
    return '-';
  }

  return (
    <div>
      <Form.Item {...FormItemLayout} label={formatMessage({ id: 'app.chargeManger.hardwareId' })}>
        {renderHardwareId()}
      </Form.Item>
      <Form.Item {...FormItemLayout} label={formatMessage({ id: 'app.chargeManger.port' })}>
        <span className={styles.valueStyle}>{renderPort()}</span>
      </Form.Item>
      <Form.Item
        {...FormItemLayout}
        label={formatMessage({ id: 'app.chargeManger.hardwareVersion' })}
      >
        <span className={styles.valueStyle}>{data?.hardwareVersion || '-'}</span>
      </Form.Item>
      <Form.Item
        {...FormItemLayout}
        label={formatMessage({ id: 'app.chargeManger.softwareVersion' })}
      >
        <span className={styles.valueStyle}>{data?.softwareVersion || '-'}</span>
      </Form.Item>
    </div>
  );
};
export default memo(ChargerBindTab);
