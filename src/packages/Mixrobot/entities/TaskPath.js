import * as PIXI from 'pixi.js';
import { zIndex } from '@/config/consts';

export default class TaskPath extends PIXI.Container {
  constructor(props) {
    super();
    this.x = props.startPoint.x;
    this.y = props.startPoint.y;
    this.end = props.endPoint;
    this.zIndex = zIndex.line;
    this.$type = props.type;
    this.calculate();
    this.createPath();
  }

  calculate() {
    const endX = this.end.x;
    const endY = this.end.y;
    const dx = Math.abs(this.x - endX);
    const dy = Math.abs(this.y - endY);
    this.distance = Math.sqrt(dx ** 2 + dy ** 2);
    this.angle = this.getAngle(this.x, this.y, endX, endY);
  }

  getAngle(px, py, mx, my) {
    const dx = Math.abs(px - mx);
    const dy = Math.abs(py - my);
    const dz = Math.sqrt(dx ** 2 + dy ** 2);
    let angle = Math.floor(180 / (Math.PI / Math.acos(dy / dz)));

    if (mx > px && my > py) {
      angle = 180 - angle;
    }

    if (mx === px && my > py) {
      angle = 180;
    }

    if (mx > px && my === py) {
      angle = 90;
    }

    if (mx < px && my > py) {
      angle = 180 + angle;
    }

    if (mx < px && my === py) {
      angle = 270;
    }

    if (mx < px && my < py) {
      angle = 360 - angle;
    }

    return angle;
  }

  createPath() {
    let texture;
    switch (this.$type) {
      case 'passed':
        texture = PIXI.utils.TextureCache._passedTaskPath;
        break;
      case 'locked':
        texture = PIXI.utils.TextureCache._lockedTaskPath;
        break;
      case 'future':
        texture = PIXI.utils.TextureCache._futureTaskPath;
        break;
      default:
        break;
    }
    if (!texture) return;
    this.path = new PIXI.Sprite(texture);
    this.path.anchor.set(0.5, 1);
    this.path.scale.y = this.distance / 100;
    this.addChild(this.path);
  }
}
