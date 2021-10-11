export default class LogicArea {
  constructor(props) {
    this.id = props.id || 0;
    this.name = props.name || 'DEFAULT';
    this.rangeStart = props.rangeStart || 1;
    this.rangeEnd = props.rangeEnd || 10000;
    this.routeMap = props.routeMap || {};
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
