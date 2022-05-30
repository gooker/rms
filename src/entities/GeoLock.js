import * as PIXI from 'pixi.js';
import BitText from './BitText';
import { GlobalAlpha } from '@/config/consts';
import { SmoothGraphics } from '@pixi/graphics-smooth';

export default class GeoLock extends PIXI.Sprite {
  constructor(props) {
    super();
    this.x = props.x;
    this.y = props.y;
    this.vehicleId = props.vehicleId;
    this.$width = props.width;
    this.$height = props.height;
    this.angle = props.angle;
    this.color = props.color;
    this.radius = props.radius;
    this.boxType = props.boxType;
    this.boxAction = props.boxAction;
    this.alpha = GlobalAlpha;
    this.anchor.set(0.5);

    this.drawShape();
    this.addVehicleId();
  }

  drawShape() {
    let shape = 'Circle';
    if (this.boxType === 'Rectangle') {
      shape = 'Rectangle';
      if (this.boxAction === 'ROTATING') {
        shape = 'Circle';
      }
    }
    this.shape = shape;
    switch (shape) {
      case 'Rectangle':
        this.drawRectLock();
        break;
      case 'Circle':
        this.drawCircleLock();
        break;
      default:
        break;
    }
    return shape;
  }

  addVehicleId() {
    let width;
    let height;
    if (this.shape === 'Rectangle') {
      width = -this.$width / 2 + 30;
      height = this.$height / 2 - 20;
    } else {
      width = -(this.radius - 15) * Math.cos((45 * Math.PI) / 180);
      height = (this.radius - 15) * Math.sin((45 * Math.PI) / 180);
    }
    const vehicleIdText = new BitText(this.vehicleId, width + 20, height - 40, this.color, 70);
    vehicleIdText.anchor.set(0.5);
    vehicleIdText.angle = -this.angle;
    this.addChild(vehicleIdText);
  }

  drawRectLock() {
    const rect = new SmoothGraphics();
    rect.clear();
    this.width = this.$width + 10;
    this.height = this.$height;
    this.tint = this.color;
    rect.lineStyle(20, this.color, 1);
    rect.beginFill('0xffffff', 0.1);
    rect.drawRect(0, 0, this.width, this.height);
    rect.endFill();
    this.texture = window.PixiUtils.renderer.generateTexture(rect);
  }

  drawCircleLock() {
    const circle = new SmoothGraphics();
    circle.clear();
    circle.lineStyle(30, this.color, 1);
    circle.drawCircle(0, 0, this.radius);
    this.texture = window.PixiUtils.renderer.generateTexture(circle);
  }
}
