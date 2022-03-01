import * as PIXI from 'pixi.js';

export default class WorkState extends PIXI.Sprite {
  constructor(props) {
    super();
    this.state = props.state;
    this.color = props.color;
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
