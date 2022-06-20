import * as PIXI from 'pixi.js';
import { SmoothGraphics } from '@pixi/graphics-smooth';

export default class WorkState extends PIXI.Sprite {
  constructor(props) {
    super();
    this.state = props.state;
    this.color = props.color;
    this.cullable = true;
    const graphics = this.createGraphics();
    this.texture = window.PixiUtils.renderer.generateTexture(graphics);
    this.anchor = 0.5;
  }

  createGraphics() {
    const circle = new SmoothGraphics();
    circle.clear();
    circle.beginFill(this.color);
    circle.drawCircle(0, 0, 3);
    circle.endFill();
    return circle;
  }
}
