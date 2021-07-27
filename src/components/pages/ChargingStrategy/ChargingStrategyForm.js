import React, { Component, createRef } from 'react';
import Battery from '@/components/Battery/Battery';

class BatteryCharging extends Component {
  mapRef = createRef();

  state = {
    paramsId: '',
    robotCancelChargerAndReceiveTaskBattery: 0,

    //电池
    startBattery: 0, //起始电量
    endBattery: 0, //终止电量
    chargeBattery: 0, //可换充电量
    lowBatteryAlarm: 0, //低电量报警
    fullBattery: 0, //满充时电量
    lowestBattery: 0, //最低电量

    //电压
    startVoltage: 0, //起始电压
    endVoltage: 0, //终止电压
    fullVoltage: 0, //满充时电压
    lowestVoltage: 0, //最低电压

    timeInterval: [], //两次满充时间间隔
    frequency: [], //普通充电连续次数
    chargeTimes: [], //最短充电时间
  };

  componentDidMount() {
    const { data } = this.props;
    this.setState({
      paramsId: data?.id || '',
      timeInterval: data?.robotFullChargingDuration || [],
      frequencyData: data?.robotNormalChargingMaxTimes,
      chargeTimesData: data?.agvMinChargingTime,

      startBattery: data?.robotChargingBatteryMinValue || 0,
      endBattery: data?.robotChargingBatteryMaxValue || 0,
      chargeBattery: data?.robotChargingBatteryRunnableValue || 0,
      lowBatteryAlarm: data?.robotChargingBatteryWarningValue || 0,
      fullBattery: data?.robotFullChargingBatteryMaxValue || 0,
      lowestBattery: data?.robotTaskAcceptableBatteryMinValue || 0,
      robotCancelChargerAndReceiveTaskBattery: data?.robotCancelChargerAndReceiveTaskBattery || 0,
      startVoltage: data ? parseFloat(data.robotChargingVoltageMinValue / 1000) : 35,
      endVoltage: data ? parseFloat(data.robotChargingVoltageMaxValue / 1000) : 35,
      fullVoltage: data ? parseFloat(data.robotFullChargingVoltageMaxValue / 1000) : 35,
      lowestVoltage: data ? parseFloat(data.robotTaskAcceptableVoltageMinValue / 1000) : 35,
    });
  }

  render() {
    return (
      <div style={{ width: 100, height: 300 }}>
        <Battery />
      </div>
    );
  }
}
//充电策略
export default BatteryCharging;
