export default class CellEntity {
  constructor(props) {
    this.type = props.type || 'Normal';
    this.id = props.id; // 点位唯一ID
    this.naviId = `${props.naviId || props.id}`; // 厂家地图点位Code
    // this.pid = `${props.pid || props.id}`; // 标记位置的ID, 同一个位置的点位拥有同一个pid
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
