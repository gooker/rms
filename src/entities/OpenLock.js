import * as PIXI from 'pixi.js';
import BitText from './BitText';
import { angleToRad, isNull, radToAngle } from '@/utils/util';
import { GlobalAlpha } from '@/config/consts';
import { convertAngleToPixiAngle } from '@/utils/mapUtil';

export default class OpenLock extends PIXI.Container {
  constructor(props) {
    super();
    this.x = props.x;
    this.y = props.y;
    this.$width = props.width;
    this.$height = props.height;
    this.alpha = GlobalAlpha;
    this.vehicleId = props.vehicleId;
    this.mathOpenAngle = props.openAngle;
    this.openAngle = convertAngleToPixiAngle(props.openAngle);
    this.color = props.color;
    this.radius = props.radius;
    this.boxAction = props.boxAction;
    this.cullable = true;

    // 开口圆的张角弧度
    this.sectorRad = Math.PI / 2 - Math.acos(this.$width / (2 * this.radius));

    this.drawShape();
    !isNull(this.vehicleId) && this.addVehicleId();
  }

  getPoint(angle) {
    // 因为cos和sin的值正负是基于数学坐标系，不能直接用到pixi坐标系中
    const x = Math.abs(Math.cos(angleToRad(angle)) * this.radius);
    const y = Math.abs(Math.sin(angleToRad(angle)) * this.radius);
    if (angle >= 0 && angle < 90) {
      return { x, y: -y };
    } else if (angle >= 90 && angle < 180) {
      return { x, y };
    } else if (angle >= 180 && angle < 270) {
      return { x: -x, y };
    } else {
      return { x: -x, y: -y };
    }
  }

  getStartAndEndPoint() {
    const sectorAngle = Math.round(radToAngle(this.sectorRad));
    const startPoint = this.getPoint(this.openAngle + sectorAngle);
    const endPoint = this.getPoint(this.openAngle - sectorAngle);
    return { startPoint, endPoint };
  }

  getStartAndEndRad() {
    const start = angleToRad(this.mathOpenAngle) + this.sectorRad;
    let end = angleToRad(this.mathOpenAngle) - this.sectorRad;
    if (end < 0) {
      end = 2 * Math.PI + end;
    }
    return { start, end };
  }

  radFlipX(rad) {
    let result = Math.PI * 2 - rad;
    if (result === 360) {
      return 0;
    }
    return result;
  }

  drawShape() {
    const { start, end } = this.getStartAndEndRad();
    const circlePainter = new PIXI.Graphics();
    circlePainter.lineStyle(30, this.color, 1);
    // true -> 逆时针绘制。实际上标准坐标系里弧度的增长方向就是逆时针，所以这里使用true
    // 但是蛋疼的是，pixi标系里弧度的增长方向是顺时针，所以需要转换一下
    circlePainter.arc(0, 0, this.radius, this.radFlipX(start), this.radFlipX(end), true);

    // 开口圆封口线
    const { startPoint, endPoint } = this.getStartAndEndPoint();
    circlePainter.moveTo(startPoint.x, startPoint.y);
    circlePainter.lineTo(endPoint.x, endPoint.y);
    this.addChild(circlePainter);
  }

  addVehicleId() {
    this.vehicleIdText = new BitText(this.vehicleId, -this.$width / 3, 0, this.color, 70);
    this.vehicleIdText.anchor.set(0.5);
    this.vehicleIdText.angle = -this.angle;
    this.addChild(this.vehicleIdText);
  }
}
