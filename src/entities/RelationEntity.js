export default class RelationEntity {
  constructor(props) {
    this.type = props.type || 'line';
    this.cost = props.cost || 10;
    this.angle = props.angle;
    this.source = props.source;
    this.target = props.target;
    this.distance = props.distance;
    this.bparam1 = props.bparam1 || null;
    this.bparam2 = props.bparam2 || null;
  }
}
