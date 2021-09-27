import * as PIXI from 'pixi.js';
import { GlobalAlpha } from '@/consts';
import BitText from './BitText';
import { isNull } from '@/utils/utils';

export default class OpenLock extends PIXI.Container {
  constructor(props) {
    super();
    this.x = props.posX;
    this.y = props.posY;
    this.robotId = props.robotId;
    this.openAngle = props.openAngle;
    this.color = props.color;
    this.radius = props.radius;
    this.boxType = props.boxType;
    this.boxAction = props.boxAction;
    this.alpha = GlobalAlpha;
    this.$width = props.width;
    this.$height = props.height;

    this.drawShape();
    !isNull(this.robotId) && this.addRobotId();
  }

  getRadBase(dx, dy) {
    // 标准坐标系,顺时针方向累计角度
    const dz = Math.sqrt(Math.abs(dx) ** 2 + Math.abs(dy) ** 2);

    // 第四象限
    let angle = Math.floor(180 / (Math.PI / Math.acos(Math.abs(dx) / dz)));

    // 第一象限
    if (dx > 0 && dy > 0) {
      angle = 360 - angle;
    }

    // 第二象限
    if (dx < 0 && dy > 0) {
      angle = 180 + angle;
    }

    // 第三象限
    if (dx < 0 && dy < 0) {
      angle = 180 - angle;
    }

    return angle / 180;
  }

  getStartAndEnd() {
    const result = {};
    switch (parseInt(this.openAngle, 10)) {
      case 0:
        result.startX = this.$width / 2;
        result.startY = this.$height / 2;
        result.endX = -this.$width / 2;
        result.endY = this.$height / 2;
        break;
      case 90:
        result.startX = this.$width / 2;
        result.startY = -this.$height / 2;
        result.endX = this.$width / 2;
        result.endY = this.$height / 2;
        break;
      case 180:
        result.startX = -this.$width / 2;
        result.startY = -this.$height / 2;
        result.endX = this.$width / 2;
        result.endY = -this.$height / 2;
        break;
      case 270:
        result.startX = -this.$width / 2;
        result.startY = this.$height / 2;
        result.endX = -this.$width / 2;
        result.endY = -this.$height / 2;
        break;
      default:
        break;
    }
    return result;
  }

  drawShape() {
    let outRadius = Math.sqrt(this.$width * this.$width + this.$height * this.$height) / 2 + 6;
    outRadius = Number.parseFloat(outRadius.toFixed(3));

    // 画内矩形
    const reactPainter = new PIXI.Graphics();
    reactPainter.lineStyle(30, this.color, 1);
    const rect = reactPainter.drawRect(0, 0, this.$width, this.$height);
    rect.position.x = this.width / 2 - rect.width / 2 + 15;
    rect.position.y = this.height / 2 - rect.height / 2 + 15;
    this.addChild(rect);

    // 画外圆
    const { startX, startY, endX, endY } = this.getStartAndEnd();
    if (startX && startY && endX && endY) {
      const circlePainter = new PIXI.Graphics();
      circlePainter.lineStyle(30, this.color, 1);
      const openCircle = circlePainter.arc(
        0,
        0,
        outRadius,
        this.getRadBase(startX, startY) * Math.PI,
        this.getRadBase(endX, endY) * Math.PI,
      );
      this.addChild(openCircle);
    } else {
      // eslint-disable-next-line no-console
      console.warn(`Open Angle invaliable: ${this.openAngle}`);
    }
  }

  addRobotId() {
    const width = -this.$width / 2 + 30;
    const height = this.$height / 2 - 20;
    this.robotIdText = new BitText(this.robotId, width + 20, height - 40, this.color, 70);
    this.robotIdText.anchor.set(0.5);
    this.robotIdText.angle = -this.angle;
    this.addChild(this.robotIdText);
  }
}
