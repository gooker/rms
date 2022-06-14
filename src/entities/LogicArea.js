import RouteMap from '@/entities/RouteMap';

export default class LogicArea {
  constructor(props = {}) {
    this.id = props.id || 0;
    this.name = props.name || 'DEFAULT';
    this.routeMap = {
      DEFAULT: new RouteMap(),
    };
    this.commonList = props.commonList || [];
    this.chargerList = props.chargerList || [];
    this.dumpStations = props.dumpStations || [];
    this.emergencyStopFixedList = props.emergencyStopFixedList || [];
    this.intersectionList = props.intersectionList || [];
    this.obstacles = props.obstacles || [];
    this.restCells = props.restCells || [];
    this.rotateCellIds = props.rotateCellIds || [];
    this.safeAreaCellIds = props.safeAreaCellIds || [];
    this.storeCellIds = props.storeCellIds || [];
    this.taskCellIds = props.taskCellIds || [];
    this.workstationList = props.workstationList || [];
    this.labels = props.labels || [];
    this.zoneMarker = props.zoneMarker || [];
  }
}
