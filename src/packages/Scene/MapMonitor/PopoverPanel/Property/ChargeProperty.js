import React, { memo, useEffect, useState } from 'react';
import { Button, Col, message, Popconfirm, Row, Select } from 'antd';
import { ClearOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { withRouter } from 'react-router-dom';
import FormattedMessage from '@/components/FormattedMessage';
import { IconFont } from '@/components/IconFont';
import {
  clearChargerFault,
  fetchBatchUnbindHardware,
  fetchBindPhysicCharger,
  fetchChargerState,
  fetchPhysicChargers,
  fetchUpdateCharger,
  resetCharger,
} from '@/services/XIHE';
import { dealResponse, formatMessage, getSuffix, isStrictNull } from '@/utils/util';
import LabelColComponent from '@/components/LabelColComponent';
import Dictionary from '@/utils/Dictionary';
import styles from '../../monitorLayout.module.less';

const checkedColor = '#70df39';

const ChargeProperty = (props) => {
  const { data, mapId, mapContext } = props;
  const [chargeData, setChargeData] = useState(null);
  const [hardwareId, setHardwareId] = useState(null); // 绑定的硬件id select选择会发生变化
  const [physicCharger, setPhysicCharger] = useState([]);
  const [chargerInfo, setChargerInfo] = useState(null);

  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    async function init() {
      const $$formData = data.$$formData;
      setChargeData($$formData);
      if ($$formData && $$formData.type) {
        setHardwareId(data.hardwareId);
      }
      // 1.获取充电桩属性
      await fetchgChargeInfo();
      // 2.获取硬件
      await fetchPhysicCharger();
    }
    init();
  }, [data]);

  async function fetchgChargeInfo() {
    const response = await fetchChargerState({ mapId, name: data?.name });
    if (!dealResponse(response)) {
      setChargerInfo(response);
      setEnabled(!response.disabled);
      if (response?.type) {
        setHardwareId(data.hardwareId);
      }
    }
  }

  async function fetchPhysicCharger() {
    fetchPhysicChargers().then((response) => {
      if (!dealResponse(response)) {
        setPhysicCharger(response);
      }
    });
  }

  async function bindHardware() {
    const requestParam = { mapId, name: chargeData.name, hardwareId };
    const response = await fetchBindPhysicCharger(requestParam);
    if (!dealResponse(response)) {
      mapContext.updateChargerHardware(data.name, hardwareId);
      await fetchgChargeInfo();
    }
  }

  async function unbindHardware() {
    const response = await fetchBatchUnbindHardware([chargeData.id]);
    if (!dealResponse(response)) {
      mapContext.updateChargerHardware(data.name);
      await fetchgChargeInfo();
    }
  }

  // 启用状态
  async function switchChargerEnable() {
    if (!chargerInfo?.hardwareId) return;
    const response = await fetchUpdateCharger({
      hardwareId: chargerInfo.hardwareId,
      disabled: !chargerInfo.disabled,
    });
    if (dealResponse(response)) {
      message.error(formatMessage({ id: 'app.message.operateFailed' }));
    } else {
      message.success(formatMessage({ id: 'app.message.operateSuccess' }));
      setEnabled(!chargerInfo.disabled);
    }
  }

  // 清除故障
  async function clearFault() {
    if (!chargerInfo?.hardwareId) return;
    const response = await clearChargerFault(chargerInfo.hardwareId);
    if (dealResponse(response)) {
      message.error(formatMessage({ id: 'app.message.operateFailed' }));
    } else {
      message.success(formatMessage({ id: 'app.message.operateSuccess' }));
    }
  }

  // 解除占用
  async function release() {
    if (!chargerInfo?.hardwareId) return;
    const response = await resetCharger(chargerInfo.hardwareId);
    if (!dealResponse(response)) {
      message.success(formatMessage({ id: 'app.message.operateSuccess' }));
    }
  }

  return (
    <>
      <div>
        <FormattedMessage id={'app.map.charger'} />
        <FormattedMessage id={'app.common.prop'} />
      </div>
      <div>
        {/* 充电桩详情 */}
        <div>
          <LabelColComponent label={<FormattedMessage id={'app.common.name'} />}>
            {chargerInfo?.name}
          </LabelColComponent>
          <LabelColComponent label={<FormattedMessage id={'app.common.status'} />}>
            {chargerInfo?.statusMerge
              ? formatMessage({ id: Dictionary('chargerStatus', chargerInfo.statusMerget) })
              : '-'}
          </LabelColComponent>

          <LabelColComponent label={<FormattedMessage id={'chargeManager.fitbattery'} />}>
            {chargerInfo?.batteryType
              ? formatMessage({ id: Dictionary('batteryType', chargerInfo.batteryType) })
              : '-'}
          </LabelColComponent>

          {!isStrictNull(chargerInfo?.vehicleId) && (
            <LabelColComponent label={<FormattedMessage id={'monitor.charge.assignedAMR'} />}>
              {chargerInfo.vehicleId}
            </LabelColComponent>
          )}
          <LabelColComponent label={<FormattedMessage id={'app.activity.batteryTemperature'} />}>
            {chargerInfo?.chargerTemperature
              ? getSuffix(chargerInfo.chargerTemperature, '°c')
              : '-'}
          </LabelColComponent>
          <LabelColComponent label={<FormattedMessage id={'chargeManager.chargeCurrent'} />}>
            {chargerInfo?.currentElectricity
              ? getSuffix((chargerInfo.currentElectricity || 0) / 10, 'A')
              : '-'}
          </LabelColComponent>
          <LabelColComponent label={<FormattedMessage id={'app.agv.maxChargeCurrent'} />}>
            {chargerInfo?.maxChargerElectricity
              ? getSuffix((chargerInfo.maxChargerElectricity || 0) / 10, 'A')
              : '-'}
          </LabelColComponent>
          <LabelColComponent label={<FormattedMessage id={'IP'} />}>
            {chargerInfo?.ip}
          </LabelColComponent>
          <LabelColComponent label={<FormattedMessage id={'app.agv.port'} />}>
            {chargerInfo?.type ? data.port : '-'}
          </LabelColComponent>
          <LabelColComponent label={<FormattedMessage id={'app.activity.hardwareVersion'} />}>
            {chargerInfo?.hardwareVersion}
          </LabelColComponent>
          <LabelColComponent label={<FormattedMessage id={'app.activity.softwareVersion'} />}>
            {chargerInfo?.softwareVersion}
          </LabelColComponent>

          {/* 绑定-硬件id */}
          <div
            style={{
              color: '#e8e8e8',
              fontSize: '15px',
              paddingTop: 10,
            }}
          >
            <Row>
              <Col span={4}>
                <FormattedMessage id={'app.form.hardwareId'} />
              </Col>
              <Col span={15}>
                <Select
                  style={{ width: 180 }}
                  allowClear
                  size="small"
                  value={hardwareId}
                  onChange={(v) => {
                    setHardwareId(v);
                  }}
                  disabled={chargerInfo?.hardwareId}
                >
                  {physicCharger?.map(({ id, hardwareId, status }) => (
                    <Select.Option key={id} value={hardwareId}>
                      {status ? `${hardwareId}-${status}` : hardwareId}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
            </Row>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <Popconfirm
                title={
                  data.hardwareId
                    ? formatMessage({ id: 'monitor.charger.unBind.confirm' })
                    : formatMessage({ id: 'monitor.charger.bind.confirm' })
                }
                onConfirm={data.hardwareId ? unbindHardware : bindHardware}
                okText={formatMessage({ id: 'app.button.confirm' })}
                cancelText={formatMessage({ id: 'app.button.cancel' })}
              >
                <Button size="small" disabled={!hardwareId}>
                  {data.hardwareId ? (
                    <FormattedMessage id="app.button.unBind" />
                  ) : (
                    <FormattedMessage id="app.button.bind" />
                  )}
                </Button>
              </Popconfirm>
            </div>
          </div>
        </div>

        {/* 操作区域*/}
        <div style={{ marginTop: 30 }}>
          {/* 状态、清楚故障、接触占用 */}
          <div className={styles.rightSideAgvContentOperation}>
            {/* 状态 */}
            <Popconfirm
              title={formatMessage(
                { id: 'monitor.charger.enable.confirm' },
                {
                  state: enabled
                    ? formatMessage({ id: 'app.common.disabled' })
                    : formatMessage({ id: 'app.common.enable' }),
                },
              )}
              onConfirm={switchChargerEnable}
              okText={formatMessage({ id: 'app.button.confirm' })}
              cancelText={formatMessage({ id: 'app.button.cancel' })}
            >
              <div className={styles.rightSideAgvContentOperationItem2}>
                <div style={{ background: enabled ? checkedColor : '' }}>
                  <img alt={'agv'} src={require('@/packages/Scene/icons/maintain.png').default} />
                </div>
                <div>
                  <FormattedMessage id={'app.common.enabled'} />
                  <FormattedMessage id={'app.common.status'} />
                </div>
              </div>
            </Popconfirm>

            <div className={styles.rightSideAgvContentOperationItem2}>
              <div onClick={clearFault} style={{ disabled: !chargerInfo?.hardwareId }}>
                <ClearOutlined
                  style={{ fontSize: '17px', color: '#fff', height: 'auto', textAlign: 'center' }}
                />
              </div>

              <div>
                <FormattedMessage id={'chargeManager.clearFault'} />
              </div>
            </div>

            <Popconfirm
              title={formatMessage({ id: 'monitor.charger.release.confirm' })}
              onConfirm={release}
              okText={formatMessage({ id: 'app.button.confirm' })}
              cancelText={formatMessage({ id: 'app.button.cancel' })}
            >
              <div className={styles.rightSideAgvContentOperationItem2}>
                <div>
                  <IconFont
                    type={'icon-jiechuzhanyong'}
                    style={{ fontSize: '17px', color: '#fff', height: 'auto', textAlign: 'center' }}
                  />
                </div>

                <div>
                  <FormattedMessage id={'monitor.charger.release'} />
                </div>
              </div>
            </Popconfirm>
          </div>
        </div>
      </div>
    </>
  );
};
export default connect(({ monitor }) => ({
  mapId: monitor.currentMap?.id,
  mapContext: monitor.mapContext,
}))(withRouter(memo(ChargeProperty)));
