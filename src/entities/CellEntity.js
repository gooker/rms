export default class CellEntity {
  constructor(props) {
    this.id = props.id;
    this.naviId = props.naviId;
    this.brand = props.brand;
    this.type = props.type || 'Normal';
    this.x = props.x;
    this.y = props.y;
    this.nx = props.nx;
    this.ny = props.ny;
    this.logicId = props.logicId;
    this.connectLogicIds = props.connectLogicIds || [];
  }
}
