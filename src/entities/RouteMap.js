export default class RouteMap {
  constructor(props = {}) {
    this.name = props.name || 'DEFAULT';
    this.code = props.code || 'DEFAULT';
    this.desc = props.desc || null;
    this.relations = props.relations || [];
    this.blockCellIds = props.blockCellIds || [];
    this.followCellIds = props.followCellIds || [];
    this.nonStopCellIds = props.nonStopCellIds || [];
    this.rotateAreaMap = props.rotateAreaMap || {};
    this.tunnels = props.tunnels || [];
    this.turnCellId = props.turnCellId || [];
    this.waitCellIds = props.waitCellIds || [];
    this.programing = { cells: {}, relations: {}, zones: {} };
  }
}
