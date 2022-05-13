export default class RouteMap {
  constructor(props = {}) {
    this.name = props.name || 'DEFAULT';
    this.code = props.code || 'DEFAULT';
    this.desc = this.desc || null;
    this.relations = props.relations || [];
    this.programing = {
      cells: {},
      relations: {},
      zones: {},
    };
  }
}
