import React, { memo } from 'react';
import { connect } from '@/utils/RmsDva';
import EmptyRun from './EmptyRun';
import Charging from './Charging';
import ToRest from './ToRest';
import CarryPod from './CarryPod';
import AdvancedCarry from './AdcancedCarry';
import AutomaticLatentWorkstationTask from './AutomaticLatentWorkstationTask';

const MonitorModals = (props) => {
  const { categoryModal, categoryPanel } = props;
  return (
    <>
      {categoryModal === 'emptyRun' && <EmptyRun />}
      {categoryModal === 'charge' && <Charging />}
      {categoryModal === 'goRest' && <ToRest />}
      {categoryModal === 'carry' && <CarryPod />}
      {categoryModal === 'advancedCarry' && <AdvancedCarry />}
      {categoryModal === 'workStationTask' && categoryPanel === 'LatentAGV' && (
        <AutomaticLatentWorkstationTask />
      )}
      {categoryModal === 'workStationTask' && categoryPanel === 'ToteAGV' && (
        <AutomaticLatentWorkstationTask />
      )}
    </>
  );
};
export default connect(({ monitor }) => ({
  categoryModal: monitor.categoryModal,
  categoryPanel: monitor.categoryPanel,
}))(memo(MonitorModals));
