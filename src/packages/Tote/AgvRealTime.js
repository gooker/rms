import React from 'react';
import AgvRealTimeComponent from '@/pages/AgvRealTime/AgvRealTimeComponent';
import { AGVType } from '@/config/config';

const TaskAgvType = AGVType.Tote;
export default class AgvRealTime extends React.Component {
    render() {
        return <AgvRealTimeComponent agvType={TaskAgvType} {...this.props}/>;
    }
}
