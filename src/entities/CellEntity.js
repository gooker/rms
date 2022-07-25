export default class CellEntity {
  constructor(props) {
    this.type = props.type || 'Normal';
    this.id = props.id;
    this.naviId = `${props.naviId || props.id}`;
    this.navigationType = props.navigationType;
    this.x = props.x;
    this.y = props.y;
    this.nx = props.nx;
    this.ny = props.ny;
    this.logicId = props.logicId;

    // 各品牌地图点位特有属性集
    this.additional = props.additional || {};
  }
}
