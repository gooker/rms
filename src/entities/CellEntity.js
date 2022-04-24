export default class CellEntity {
  constructor(props) {
    this.id = props.id;
    this.naviId = props.naviId || props.id;
    this.brand = props.brand;
    this.type = props.type || 'Normal';
    this.x = props.x;
    this.y = props.y;
    this.nx = props.nx || props.x;
    this.ny = props.ny || props.y;
    this.logicId = props.logicId;
  }
}
