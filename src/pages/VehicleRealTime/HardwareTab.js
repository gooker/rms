import React from 'react';
import { Card, Col, Popover, Row } from 'antd';
import { convertToUserTimezone, formatMessage, getDay, getSuffix } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import Dictionary from '@/utils/Dictionary';
import LabelComponent from '@/components/LabelComponent';
import styles from './index.module.less';

const HardwareTab = (props) => {
  const { data } = props;

  function renderCreateTime(time) {
    return convertToUserTimezone(time).format('YYYY-MM-DD HH:mm:ss');
  }

  function getModeldata(record) {
    let nameArray = [
      'app.activity.model.LeftWheelMotor',
      'app.activity.model.rightWheelMotor',
      'app.activity.model.RotatingMotor',
      'app.activity.model.JackingMotor',
      'app.activity.model.camera',
      'app.activity.model.radar',
      'app.activity.model.ins',
      'app.activity.model.wifi',
    ];

    const list = [];
    for (let index = 0; index < record.length; index++) {
      const element = record[index];
      list.push(
        <Row>
          <Col span={5}>
            <LabelComponent
              style={{ height: '30px' }}
              label={formatMessage({ id: 'app.activity.modelName' })}
            >
              {formatMessage({ id: nameArray[index] })}
            </LabelComponent>
          </Col>
          <Col span={5}>
            <LabelComponent
              style={{ height: '30px' }}
              label={formatMessage({ id: 'app.activity.firmwareType' })}
            >
              {element.type}
            </LabelComponent>
          </Col>
          <Col span={7}>
            <LabelComponent
              style={{ height: '30px' }}
              label={formatMessage({ id: 'app.activity.softwareVersion' })}
            >
              {element.softVersion}
            </LabelComponent>
          </Col>
          <Col span={7}>
            <LabelComponent
              style={{ height: '30px' }}
              label={formatMessage({ id: 'app.activity.hardwareVersion' })}
            >
              {element.hardwareVersion}
            </LabelComponent>
          </Col>
        </Row>,
      );
    }
    const content = (
      <Card style={{ width: 820, paddingTop: 0 }} bordered={false}>
        {list}
      </Card>
    );
    return (
      <Popover placement="topLeft" content={content}>
        <span style={{ cursor: 'pointer', color: 'blue' }}>
          <FormattedMessage id="app.activity.detaildata" />
        </span>
      </Popover>
    );
  }

  let countDay = '';
  if (data && data.reserved2 != null) {
    countDay = getDay(data.reserved2);
  }
  function batteryTemperatureColor(batteryTemperature) {
    let batteryTemperatureOneColor = 'green';
    if (parseInt(batteryTemperature) >= 48) {
      batteryTemperatureOneColor = 'red';
    } else if (parseInt(batteryTemperature) >= 40) {
      batteryTemperatureOneColor = 'yellow';
    }
    return batteryTemperatureOneColor;
  }

  return (
    <Row gutter={{ xs: 4, sm: 8, md: 14, lg: 16 }}>
      <Col span={12}>
        {/* 小车ID */}
        <LabelComponent label={formatMessage({ id: 'app.vehicle.id' })}>
          {data?.vehicle?.vehicleId}
        </LabelComponent>

        <LabelComponent label={formatMessage({ id: 'app.vehicle.battery' })}>
          {data && data.battery != null ? getSuffix(parseInt(data?.vehicleInfo?.battery), '%') : null}
        </LabelComponent>

        <LabelComponent label={formatMessage({ id: 'app.vehicle.batteryVoltage' })}>
          {data && data.batteryVoltage
            ? getSuffix(data?.vehicleInfo?.batteryVoltage / 1000, 'V')
            : null}
        </LabelComponent>

        <LabelComponent label={formatMessage({ id: 'app.activity.batteryStatus' })}>
          <div className={styles.spanRight}>
            {data && data.batteryStatus != null ? (
              data.batteryStatus ? (
                <span className={styles.main} style={{ color: 'green' }}>
                  <FormattedMessage id="app.vehicle.normal" />
                </span>
              ) : (
                <span style={{ color: 'red' }} className={styles.main}>
                  <FormattedMessage id="app.vehicle.exception" />
                </span>
              )
            ) : null}
          </div>
        </LabelComponent>

        <LabelComponent label={<FormattedMessage id="app.activity.cycleCount" />}>
          <div className={styles.spanRight}>
            {data && data.reserved3
              ? getSuffix(data.reserved3, formatMessage({ id: 'app.chargeManagement.times' }), {
                  className: styles.main,
                })
              : null}
          </div>
        </LabelComponent>

        <LabelComponent label={<FormattedMessage id="app.activity.runTime" />}>
          <div className={styles.spanRight}>
            <span style={{ marginRight: 5 }}>
              {getSuffix(countDay.days, formatMessage({ id: 'app.time.day' }), {
                className: styles.main,
              })}
            </span>
            <span style={{ marginRight: 5 }}>
              {getSuffix(countDay.hours, formatMessage({ id: 'app.time.hours' }), {
                className: styles.main,
              })}
            </span>
            <span style={{ marginRight: 5 }}>
              {getSuffix(countDay.minutes, formatMessage({ id: 'app.time.minutes' }), {
                className: styles.main,
              })}
            </span>
          </div>
        </LabelComponent>

        <LabelComponent label={<FormattedMessage id="app.activity.batteryCurrent" />}>
          <div className={styles.spanRight}>
            {data && data.reserved1 != null
              ? getSuffix(parseFloat(data.reserved1) / 10, 'A', { className: styles.main })
              : null}
          </div>
        </LabelComponent>

        <LabelComponent label={formatMessage({ id: 'app.activity.batteryTemperatureOne' })}>
          <div className={styles.spanRight}>
            {data && data.batteryTemperatureOne
              ? getSuffix(data.batteryTemperatureOne, '°C', {
                  className: styles.main,
                  style: { color: batteryTemperatureColor(data.batteryTemperatureOne) },
                })
              : null}
          </div>
        </LabelComponent>

        <LabelComponent label={formatMessage({ id: 'app.activity.batteryTemperatureTwo' })}>
          <div className={styles.spanRight}>
            {data && data.batteryTemperatureTwo
              ? getSuffix(data.batteryTemperatureTwo, '°C', {
                  className: styles.main,
                  style: { color: batteryTemperatureColor(data.batteryTemperatureTwo) },
                })
              : null}
          </div>
        </LabelComponent>

        <LabelComponent label={formatMessage({ id: 'app.vehicle.lastFullChargeTime' })}>
          {data && data.lastFullChargeTime ? renderCreateTime(data.lastFullChargeTime) : null}
        </LabelComponent>

        <LabelComponent label={formatMessage({ id: 'app.vehicle.currentCoefficient' })}>
          <div className={styles.spanRight}>
            {data && data.currentCoefficient
              ? getSuffix(data.currentCoefficient, '°C', {
                  className: styles.main,
                  style: { color: batteryTemperatureColor(data.currentCoefficient) },
                })
              : null}
          </div>
        </LabelComponent>

        <LabelComponent label={formatMessage({ id: 'app.common.creationTime' })}>
          {data && data.createTime ? renderCreateTime(data.createTime) : null}
        </LabelComponent>
        <LabelComponent label={formatMessage({ id: 'app.taskDetail.createUser' })}>
          {data?.createdByUser}
        </LabelComponent>
      </Col>

      <Col span={12}>
        <LabelComponent label={<FormattedMessage id="app.common.status" />}>
          <span>
            {data && data.status != null
              ? formatMessage({
                  id: Dictionary('handwareStatus', data.status),
                })
              : null}
          </span>
        </LabelComponent>

        <LabelComponent label={<FormattedMessage id="app.activity.statusFlag" />}>
          <span>
            {data && data.statusFlag != null
              ? data.statusFlag
                ? formatMessage({ id: 'app.activity.jackingUp' })
                : formatMessage({ id: 'app.activity.unJckingUp' })
              : null}
          </span>
        </LabelComponent>

        <LabelComponent label={formatMessage({ id: 'app.activity.modelInfo' })}>
          {data && data.moduledataList ? getModeldata(data.moduledataList) : null}
        </LabelComponent>
        <LabelComponent label={formatMessage({ id: 'app.activity.theta' })}>
          {data && data.theta ? getSuffix(data.theta, '°') : null}
        </LabelComponent>

        <LabelComponent label={formatMessage({ id: 'app.pod.id' })}>{data?.podId}</LabelComponent>

        <LabelComponent label={formatMessage({ id: 'app.activity.leftCodec' })}>
          {data?.leftCodec}
        </LabelComponent>

        <LabelComponent label={formatMessage({ id: 'app.activity.rightCodec' })}>
          {data?.rightCodec}
        </LabelComponent>

        <LabelComponent label={formatMessage({ id: 'app.activity.leftWheelMotorTemperature' })}>
          {data?.leftWheelMotorTemperature}
        </LabelComponent>

        <LabelComponent label={formatMessage({ id: 'app.activity.rightWheelMotorTemperature' })}>
          {data?.rightWheelMotorTemperature}
        </LabelComponent>

        <LabelComponent label={formatMessage({ id: 'app.activity.rotationMotorTemperature' })}>
          {data?.rotationMotorTemperature}
        </LabelComponent>

        <LabelComponent label={formatMessage({ id: 'app.activity.upMotorTemperature' })}>
          {data?.upMotorTemperature}
        </LabelComponent>

        <LabelComponent label={formatMessage({ id: 'app.vehicle.sensorStatusFlag' })}>
          {data?.sensorStatus}
        </LabelComponent>

        <LabelComponent label={formatMessage({ id: 'app.activity.distanceFromLastSpot' })}>
          {data && data.distanceFromLastCell ? getSuffix(data.distanceFromLastCell, 'mm') : null}
        </LabelComponent>
      </Col>
    </Row>
  );
};

export default React.memo(HardwareTab);