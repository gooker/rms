import React, { memo } from 'react';
import { connect } from '@/utils/RmsDva';
import EmptyRun from './EmptyRun';
import Charging from './Charging';
import ToRest from './GoParking';
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
import ViewControlComponent from './MonitorViewControlModal';
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
import SourceLockPanel from '@/packages/Scene/MapMonitor/Modal/SourceLockPanel';

const MonitorModals = (props) => {
  const { categoryModal, categoryPanel, dispatch } = props;

  return (
    <>
      {/* 基础任务 */}
      {categoryModal === 'emptyRun' && <EmptyRun dispatch={dispatch} />}
      {categoryModal === 'charge' && <Charging />}
      {categoryModal === 'goRest' && <ToRest />}
      {categoryModal === 'carry' && <CarryPod />}

      {categoryModal === 'VehicleAlert' && <VehicleAlert />}
      {categoryModal === 'VehicleRunInfo' && <VehicleRunningInfo />}
      {categoryModal === 'advancedCarry' && <AdvancedCarry />}
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
      {categoryModal === 'sourceLock' && <SourceLockPanel dispatch={dispatch} />}

      {categoryModal === 'workStationTask' && categoryPanel === 'LatentVehicle' && (
        <LatentWorkStationTask />
      )}
      {categoryModal === 'autoCall' && categoryPanel === 'LatentVehicle' && (
        <AutomaticLatentWorkstationTask />
      )}
      {categoryModal === 'workStationTask' && categoryPanel === 'ToteVehicle' && (
        <AutomaticToteWorkstationTask />
      )}
    </>
  );
};
export default connect(({ monitor }) => ({
  categoryModal: monitor.categoryModal,
  categoryPanel: monitor.categoryPanel,
}))(memo(MonitorModals));
