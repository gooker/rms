import * as PIXI from 'pixi.js';
import { getTextureFromResources } from '@/utils/mapUtil';

export default class CostArrow extends PIXI.Container {
  constructor(props) {
    super();
    this.id = props.id;
    this.x = props.x;
    this.y = props.y;
    this.angle = props.angle;
    this.cost = props.cost;
    this.drawArrow();
  }

  drawArrow() {
    this.arrow = new PIXI.Sprite(getTextureFromResources(`cost_${this.cost}`));
    // this.arrow.height = 600;
    // this.arrow.width = 580;
    this.arrow.anchor.set(0.5, 0);
    this.addChild(this.arrow);
  }
}
