import React, { memo } from 'react';
import { connect } from '@/utils/RmsDva';
import EmptyRun from './EmptyRun';
import Charging from './Charging';
import ToRest from './ToRest';
import CarryPod from './CarryPod';
import AdvancedCarry from './AdcancedCarry';
import LatentWorkStationTask from './LatentWorkStationTask';
import AutomaticLatentWorkstationTask from './AutomaticLatentWorkstationTask';
import AutomaticToteWorkstationTask from './AutomaticToteWorkstationTask';
import RemoteControl from './RemoteControl';
import CustomComponent from './CustomComponent';
import Parabolic from './SorterThrow';
import PickCargo from './SorterPick';
import PathLock from './PathLock';
import ViewControlComponent from './ViewControlComponent';
import ToteViewControlComponent from './ToteViewControlComponent';
import HotHeatControlComponent from './HotHeatControlComponent';
import SetupLatentPod from './SetupLatentPod/SetupLatentPod';
import TemporaryForbiddenCell from './TemporaryForbidcell';
import PodToStationMessage from './PodToStationMessage';
import LatentStopMessage from './LatentPauseMessage';
import WorkStationReport from './WorkStationReport';
import CommonStationReport from './CommonStationReport';
import VehicleAlert from './VehicleInfo/VehicleAlert';
import VehicleRunningInfo from './VehicleInfo/VehicleRunninInfo';
import EmergencyManagerModal from './EmergencyStopModal';

const MonitorModals = (props) => {
  const { categoryModal, categoryPanel, dispatch } = props;

  return (
    <>
      {categoryModal === 'VehicleAlert' && <VehicleAlert />}
      {categoryModal === 'VehicleRunInfo' && <VehicleRunningInfo />}

      {categoryModal === 'emptyRun' && <EmptyRun dispatch={dispatch} />}
      {categoryModal === 'charge' && <Charging />}
      {categoryModal === 'goRest' && <ToRest />}
      {categoryModal === 'carry' && <CarryPod />}
      {categoryModal === 'advancedCarry' && <AdvancedCarry />}

      {categoryModal === 'workStationTask' && categoryPanel === 'LatentVehicle' && (
        <LatentWorkStationTask />
      )}
      {categoryModal === 'autoCall' && categoryPanel === 'LatentVehicle' && (
        <AutomaticLatentWorkstationTask />
      )}
      {categoryModal === 'workStationTask' && categoryPanel === 'ToteVehicle' && (
        <AutomaticToteWorkstationTask />
      )}

      {categoryModal === 'remoteControl' && <RemoteControl />}
      {categoryModal === 'custom' && <CustomComponent />}
      {categoryModal === 'dumpCargo' && <Parabolic />}
      {categoryModal === 'pickCargo' && <PickCargo />}
      {categoryModal === 'pathLock' && <PathLock />}
      {categoryModal === 'mapShow' && <ViewControlComponent />}
      {categoryModal === 'toteDisplay' && <ToteViewControlComponent />}
      {categoryModal === 'heatHeat' && <HotHeatControlComponent />}
      {categoryModal === 'setLatentPod' && <SetupLatentPod dispatch={dispatch} />}
      {categoryModal === 'podToWorkstationInfoMessage' && <PodToStationMessage />}
      {categoryModal === 'stopMessage' && <LatentStopMessage />}
      {categoryModal === 'temporaryBlock' && <TemporaryForbiddenCell />}
      {categoryModal === 'emergencyManagerModal' && <EmergencyManagerModal dispatch={dispatch} />}

      {categoryModal === 'station' && <CommonStationReport />}
      {categoryModal === 'WorkStation' && <WorkStationReport />}
    </>
  );
};
export default connect(({ monitor }) => ({
  categoryModal: monitor.categoryModal,
  categoryPanel: monitor.categoryPanel,
}))(memo(MonitorModals));
