import React from 'react';
import VehicleRealTimeComponent from '@/pages/VehicleRealTime/VehicleRealTimeComponent';

export default class VehicleRealTime extends React.Component {
  render() {
    return <VehicleRealTimeComponent {...this.props} />;
  }
}
