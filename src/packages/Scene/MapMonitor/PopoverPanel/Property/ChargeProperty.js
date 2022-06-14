import React, { memo, useEffect, useState } from 'react';
import { Button, Col, message, Popconfirm, Row, Select } from 'antd';
import { ClearOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { withRouter } from 'react-router-dom';
import FormattedMessage from '@/components/FormattedMessage';
import { IconFont } from '@/components/IconFont';
import { clearChargerFault, resetCharger } from '@/services/XIHEService';
import { fetchChargeByCode, fetchChargerList, handleleChargers } from '@/services/resourceService';
import { dealResponse, formatMessage, getSuffix, isNull, isStrictNull } from '@/utils/util';
import LabelColComponent from '@/components/LabelColComponent';
import { ChargerStatus } from '@/packages/ResourceManage/Charger/components/chargeConfig';
import Dictionary from '@/utils/Dictionary';
import styles from '../../monitorLayout.module.less';

const checkedColor = '#70df39';

const ChargeProperty = (props) => {
  const { data, mapContext } = props;
  const [unRegistedCharger, setUnRegistedCharger] = useState([]);
  const [chargerInfo, setChargerInfo] = useState(null);
  const [enabled, setEnabled] = useState(false);
  const [currentChargeId, setCurrentChargeId] = useState(null);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    async function init() {
      // 1.获取充电桩属性
      await fetchgChargeInfo();
    }
    init();
  }, [data]);

  async function fetchgChargeInfo() {
    const [response, chargerList] = await Promise.all([
      fetchChargeByCode(data?.$$formData?.code),
      fetchChargerList({ filterType: 'UNREGISTER' }),
    ]);
    if (!dealResponse(response)) {
      setChargerInfo(response);
      setEnabled(!response.disabled);
      setUnRegistedCharger(chargerList);
      setCurrentChargeId(response?.chargerId);
      setCurrentId(response?.id);
    }
  }

  // 注册/注销
  async function updateCharger() {
    const requestParam = {
      updateType: chargerInfo?.chargerId ? 'LOGOUT' : 'REGISTER',
      mapChargerCode: data?.$$formData?.code,
      ids: [currentId],
    };

    const response = await handleleChargers(requestParam);
    if (!dealResponse(response)) {
      mapContext.updateChargerHardware(data.name, chargerInfo.chargerId, chargerInfo.id);
      await fetchgChargeInfo();
    }
  }

  // 启用/禁用
  async function switchChargerEnable() {
    const response = await handleleChargers({
      updateType: !chargerInfo.disabled ? 'DISABLE' : 'ENABLE',
      ids: [chargerInfo?.id],
    });
    if (!dealResponse(response, 1)) {
      fetchgChargeInfo();
    }
  }

  // 清除故障
  async function clearFault() {
    const response = await clearChargerFault(chargerInfo.id);
    if (dealResponse(response)) {
      message.error(formatMessage({ id: 'app.message.operateFailed' }));
    } else {
      message.success(formatMessage({ id: 'app.message.operateSuccess' }));
    }
  }

  // 解除占用
  async function release() {
    const response = await resetCharger(chargerInfo.id);
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
            {data?.$$formData?.name}
          </LabelColComponent>
          <LabelColComponent label={<FormattedMessage id={'app.common.status'} />}>
            {chargerInfo?.chargerStatus ? ChargerStatus[chargerInfo?.chargerStatus] : '-'}
          </LabelColComponent>

          <LabelColComponent label={<FormattedMessage id={'chargeManager.fitbattery'} />}>
            {chargerInfo?.batteryType
              ? formatMessage({ id: Dictionary('batteryType', chargerInfo.batteryType) })
              : '-'}
          </LabelColComponent>

          <LabelColComponent label={<FormattedMessage id={'chargeManager.temperature'} />}>
            {chargerInfo?.temperature ? getSuffix(chargerInfo.temperature, '°c') : '-'}
          </LabelColComponent>
          <LabelColComponent label={<FormattedMessage id={'chargeManager.chargeCurrent'} />}>
            {chargerInfo?.currentElectricity
              ? getSuffix((chargerInfo.currentElectricity || 0) / 10, 'A')
              : '-'}
          </LabelColComponent>
          <LabelColComponent label={<FormattedMessage id={'chargeManager.batteryVoltage'} />}>
            {chargerInfo?.currentVoltage ? getSuffix(chargerInfo.currentVoltage || 0, 'V') : '-'}
          </LabelColComponent>
          <LabelColComponent label={<FormattedMessage id={'IP'} />}>
            {chargerInfo?.ip}
          </LabelColComponent>
          <LabelColComponent label={<FormattedMessage id={'vehicle.port'} />}>
            {chargerInfo?.port}
          </LabelColComponent>

          {/* 绑定-chargerId */}
          <div
            style={{
              color: '#e8e8e8',
              fontSize: '15px',
              paddingTop: 10,
            }}
          >
            <Row>
              <Col span={4}>
                <FormattedMessage id={'chargeManager.fault. chargerId'} />
              </Col>
              <Col span={15}>
                <Select
                  style={{ width: 180 }}
                  allowClear
                  size="small"
                  value={currentChargeId}
                  disabled={!isStrictNull(chargerInfo?.chargerId)}
                  onChange={(v) => {
                    if (isStrictNull(v)) {
                      setCurrentChargeId(null);
                      setCurrentId(null);
                    } else {
                      const [id, chargerId] = v?.split('@');
                      console.log(id, chargerId);
                      setCurrentChargeId(chargerId);
                      setCurrentId(id);
                    }
                  }}
                >
                  {unRegistedCharger?.map(({ id, chargerId, chargerStatus }) => (
                    <Select.Option key={id} value={`${id}@${chargerId}`}>
                      {chargerId}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
            </Row>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <Popconfirm
                title={formatMessage({ id: 'app.message.doubleConfirm' })}
                onConfirm={updateCharger}
                okText={formatMessage({ id: 'app.button.confirm' })}
                cancelText={formatMessage({ id: 'app.button.cancel' })}
              >
                <Button size="small" disabled={isStrictNull(currentChargeId)}>
                  {chargerInfo?.chargerId ? '注销' : '注册'}
                </Button>
              </Popconfirm>
            </div>
          </div>
        </div>

        {/* 操作区域*/}
        {!isNull(chargerInfo) ? (
          <div style={{ marginTop: 30 }}>
            {/* 状态、清楚故障、解除占用 */}
            <div className={styles.rightSideVehicleContentOperation}>
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
                <div className={styles.rightSideVehicleContentOperationItem2}>
                  <div style={{ background: enabled ? checkedColor : '' }}>
                    <img
                      alt={'vehicle'}
                      src={require('@/packages/Scene/icons/maintain.png').default}
                    />
                  </div>
                  <div>
                    <FormattedMessage id={'app.common.status'} />
                  </div>
                </div>
              </Popconfirm>

              <div className={styles.rightSideVehicleContentOperationItem2}>
                <div onClick={clearFault} style={{ disabled: !chargerInfo?.chargerId }}>
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
                <div className={styles.rightSideVehicleContentOperationItem2}>
                  <div>
                    <IconFont
                      type={'icon-jiechuzhanyong'}
                      style={{
                        fontSize: '17px',
                        color: '#fff',
                        height: 'auto',
                        textAlign: 'center',
                      }}
                    />
                  </div>

                  <div>
                    <FormattedMessage id={'monitor.charger.release'} />
                  </div>
                </div>
              </Popconfirm>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};
export default connect(({ monitor }) => ({
  mapId: monitor.currentMap?.id,
  mapContext: monitor.mapContext,
}))(withRouter(memo(ChargeProperty)));
