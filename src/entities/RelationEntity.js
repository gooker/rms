import { LineType } from '@/config/config';

export default class RelationEntity {
  constructor(props) {
    this.type = props.type || LineType.StraightPath;
    this.source = props.source;
    this.target = props.target;
    this.cost = props.cost || 10;
    this.angle = props.angle || null;
    this.nangle = props.nangle || null;
    this.distance = props.distance || null;
    this.control1 = props.control1 || null;
    this.ncontrol1 = props.ncontrol1 || null;
    this.control2 = props.control2 || null;
    this.ncontrol2 = props.ncontrol2 || null;
  }
}
