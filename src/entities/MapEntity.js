export default class MapEntity {
  constructor(props) {
    this.name = props.name;
    this.desc = props.description;
    this.sectionId = props.sectionId;
    this.cellMap = {};
    this.logicAreaList = props.logicAreaList || [];
    this.transform = props.transform || {};
    this.mver = props.version;
    this.ever = props.version;
    this.activeFlag = false;
  }
}
