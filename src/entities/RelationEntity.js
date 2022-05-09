import { LineType } from '@/config/config';

export default class RelationEntity {
  constructor(props) {
    this.type = props.type || LineType.StraightPath;
    this.cost = props.cost || 10;
    this.angle = props.angle;
    this.source = props.source;
    this.target = props.target;
    this.distance = props.distance;
    this.control1 = props.control1 || null;
    this.control2 = props.control2 || null;
  }
}