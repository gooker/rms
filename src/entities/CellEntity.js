export default class CellEntity {
  constructor(props) {
    this.id = props.id;
    this.naviId = props.naviId || props.id;
    this.navigationType = props.navigationType;
    this.type = props.type || 'Normal';
    this.x = props.x;
    this.y = props.y;
    this.nx = props.nx || props.x;
    this.ny = props.ny || props.y;
    this.logicId = props.logicId;

    // 各品牌地图点位特有属性集
    this.additional = props.additional || {};
  }
}
