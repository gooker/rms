import React from 'react';
import { Row, Col, Card, Popover } from 'antd';
// import { ToolOutlined } from '@ant-design/icons';
import { formatMessage, FormattedMessage } from '@/utils/Lang';
import { dateFormat, getSuffix, getDay } from '@/utils/utils';
import Dictionary from '@/utils/Dictionary';
import LabelComponent from '@/components/LabelComponent';
import styles from './index.module.less';

const HardwareTab = (props) => {
  const { data } = props;

  function renderCreateTime(time) {
    return dateFormat(time).format('YYYY-MM-DD HH:mm:ss');
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
              children={formatMessage({ id: nameArray[index] })}
            />
          </Col>
          <Col span={5}>
            <LabelComponent
              style={{ height: '30px' }}
              label={formatMessage({ id: 'app.activity.firmwareType' })}
              children={element.type}
            />
          </Col>
          <Col span={7}>
            <LabelComponent
              style={{ height: '30px' }}
              label={formatMessage({ id: 'app.activity.softwareVersion' })}
              children={element.softVersion}
            />
          </Col>
          <Col span={7}>
            <LabelComponent
              style={{ height: '30px' }}
              label={formatMessage({ id: 'app.activity.firewareVersion' })}
              children={element.hardwareVersion}
            />
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
        <LabelComponent label={formatMessage({ id: 'app.agv.id' })}>{data?.robotId}</LabelComponent>

        <LabelComponent label={formatMessage({ id: 'app.agv.battery' })}>
          {data && data.battery != null ? getSuffix(parseInt(data.battery), '%') : null}
        </LabelComponent>

        <LabelComponent
          label={formatMessage({ id: 'app.activity.batteryStatus' })}
          children={
            <div className={styles.spanRight}>
              {data && data.batteryStatus != null ? (
                data.batteryStatus ? (
                  <span className={styles.main} style={{ color: 'green' }}>
                    <FormattedMessage id="app.agv.normal" />
                  </span>
                ) : (
                  <span style={{ color: 'red' }} className={styles.main}>
                    <FormattedMessage id="app.agv.exception" />
                  </span>
                )
              ) : null}
            </div>
          }
        ></LabelComponent>

        <LabelComponent
          label={<FormattedMessage id="app.activity.cycleCount" />}
          children={
            <div className={styles.spanRight}>
              {data && data.reserved3
                ? getSuffix(data.reserved3, formatMessage({ id: 'app.chargeManagement.times' }), {
                    className: styles.main,
                  })
                : null}
            </div>
          }
        />

        <LabelComponent
          label={<FormattedMessage id="app.activity.runTime" />}
          children={
            <div className={styles.spanRight}>
              <span style={{ marginRight: 5 }}>
                {getSuffix(countDay.days, formatMessage({ id: 'app.common.day' }), {
                  className: styles.main,
                })}
              </span>
              <span style={{ marginRight: 5 }}>
                {getSuffix(countDay.hours, formatMessage({ id: 'app.common.hours' }), {
                  className: styles.main,
                })}
              </span>
              <span style={{ marginRight: 5 }}>
                {getSuffix(countDay.minutes, formatMessage({ id: 'app.common.minutes' }), {
                  className: styles.main,
                })}
              </span>
            </div>
          }
        />

        <LabelComponent
          label={<FormattedMessage id="app.activity.batteryCurrent" />}
          children={
            <div className={styles.spanRight}>
              {data && data.reserved1 != null
                ? getSuffix(parseFloat(data.reserved1) / 10, 'A', { className: styles.main })
                : null}
            </div>
          }
        />

        <LabelComponent
          label={formatMessage({ id: 'app.activity.batteryTemperatureOne' })}
          children={
            <div className={styles.spanRight}>
              {data && data.batteryTemperatureOne
                ? getSuffix(data.batteryTemperatureOne, '°C', {
                    className: styles.main,
                    style: { color: batteryTemperatureColor(data.batteryTemperatureOne) },
                  })
                : null}
            </div>
          }
        />

        <LabelComponent
          label={formatMessage({ id: 'app.activity.batteryTemperatureTwo' })}
          children={
            <div className={styles.spanRight}>
              {data && data.batteryTemperatureTwo
                ? getSuffix(data.batteryTemperatureTwo, '°C', {
                    className: styles.main,
                    style: { color: batteryTemperatureColor(data.batteryTemperatureTwo) },
                  })
                : null}
            </div>
          }
        />

        <LabelComponent label={formatMessage({ id: 'app.agv.lastFullChargeTime' })}>
          {data && data.lastFullChargeTime ? renderCreateTime(data.lastFullChargeTime) : null}
        </LabelComponent>

        <LabelComponent
          label={formatMessage({ id: 'app.agv.currentCoefficient' })}
          children={
            <div className={styles.spanRight}>
              {data && data.currentCoefficient
                ? getSuffix(data.currentCoefficient, '°C', {
                    className: styles.main,
                    style: { color: batteryTemperatureColor(data.currentCoefficient) },
                  })
                : null}
            </div>
          }
        ></LabelComponent>

        <LabelComponent label={formatMessage({ id: 'app.agv.batteryVoltage' })}>
          {data && data.batteryVoltage ? getSuffix(data.batteryVoltage / 1000, 'V') : null}
        </LabelComponent>

        <LabelComponent label={formatMessage({ id: 'app.taskDetail.createTime' })}>
          {data && data.createTime ? renderCreateTime(data.createTime) : null}
        </LabelComponent>
        <LabelComponent label={formatMessage({ id: 'app.taskDetail.createdByUser' })}>
          {data?.createdByUser}
        </LabelComponent>
      </Col>

      <Col span={12}>
        <LabelComponent label={formatMessage({ id: 'app.activity.distanceFromLastCell' })}>
          {data && data.distanceFromLastCell ? getSuffix(data.distanceFromLastCell, 'mm') : null}
        </LabelComponent>

        <LabelComponent
          label={<FormattedMessage id="app.common.status" />}
          children={
            <span>
              {data && data.status != null
                ? formatMessage({
                    id: Dictionary('handwareStatus', data.status),
                  })
                : null}
            </span>
          }
        />
        <LabelComponent
          label={<FormattedMessage id="app.activity.statusFlag" />}
          children={
            <span>
              {data && data.statusFlag != null
                ? data.statusFlag
                  ? formatMessage({ id: 'app.activity.jackingUp' })
                  : formatMessage({ id: 'app.activity.unJckingUp' })
                : null}
            </span>
          }
        />

        <LabelComponent label={formatMessage({ id: 'app.activity.modelInfo' })}>
          {data && data.moduledataList ? getModeldata(data.moduledataList) : null}
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

        <LabelComponent label={formatMessage({ id: 'app.agv.sensorStatusFlag' })}>
          {data?.sensorStatus}
        </LabelComponent>

        <LabelComponent label={formatMessage({ id: 'app.activity.theta' })}>
          {data && data.theta ? getSuffix(data.theta, '°') : null}
        </LabelComponent>
      </Col>
    </Row>
  );
};

export default React.memo(HardwareTab);
