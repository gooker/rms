import RouteMap from '@/entities/RouteMap';

export default class LogicArea {
  constructor(props = {}) {
    this.id = props.id || 0;
    this.name = props.name || 'DEFAULT';
    this.routeMap = {
      DEFAULT: new RouteMap(),
    };
    this.restCells = props.restCells || [];
    this.obstacles = props.obstacles || [];
    this.commonList = props.commonList || [];
    this.chargerList = props.chargerList || [];
    this.dumpStations = props.dumpStations || [];
    this.elevatorList = props.elevatorList || [];
    this.storeCellIds = props.storeCellIds || [];
    this.workstationList = props.workstationList || [];
  }
}
