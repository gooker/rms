import * as PIXI from 'pixi.js';
import { orderBy } from 'lodash';
import BitText from './BitText';
import { GlobalAlpha, ToteAGVSize, ForkLiftAGVSize } from '@/config/consts';

export default class GeoLock extends PIXI.Sprite {
  constructor(props) {
    super();
    this.x = props.posX;
    this.y = props.posY;
    this.robotId = props.robotId;
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
    this.addRobotId();
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

  addRobotId() {
    let width;
    let height;
    if (this.shape === 'Rectangle') {
      width = -this.$width / 2 + 30;
      height = this.$height / 2 - 20;
    } else {
      width = -(this.radius - 15) * Math.cos((45 * Math.PI) / 180);
      height = (this.radius - 15) * Math.sin((45 * Math.PI) / 180);
    }
    const robotIdText = new BitText(this.robotId, width + 20, height - 40, this.color, 70);
    robotIdText.anchor.set(0.5);
    robotIdText.angle = -this.angle;
    this.addChild(robotIdText);
  }

  drawRectLock() {
    this.texture = this.getNestTextureBySize(this.$width, this.$height);
    this.tint = this.color;
    this.width = this.$width;
    this.height = this.$height;
  }

  drawCircleLock() {
    const circle = new PIXI.Graphics();
    circle.clear();
    circle.lineStyle(30, this.color, 1);
    circle.drawCircle(0, 0, this.radius);
    this.texture = window.PixiUtils.renderer.generateTexture(circle);
  }

  getNestTextureBySize(width, height) {
    const latent = Math.abs(1050 - width) + Math.abs(1050 - height);
    const tote = Math.abs(ToteAGVSize.width - width) + Math.abs(ToteAGVSize.height - height);
    const fork =
      Math.abs(ForkLiftAGVSize.width - width) + Math.abs(ForkLiftAGVSize.height - height);

    const array = [
      { key: latent, texture: PIXI.utils.TextureCache.LatentRectLock },
      { key: tote, texture: PIXI.utils.TextureCache.ToteRectLock },
      { key: fork, texture: PIXI.utils.TextureCache.ForkRectLock },
    ];

    const sortedArray = orderBy(array, ['key']);
    return sortedArray[0].texture;
  }
}
