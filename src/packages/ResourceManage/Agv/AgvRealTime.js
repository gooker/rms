import React from 'react';
import AgvRealTimeComponent from '@/pages/AgvRealTime/AgvRealTimeComponent';

export default class AgvRealTime extends React.Component {
  render() {
    return <AgvRealTimeComponent {...this.props} />;
  }
}
