import * as PIXI from 'pixi.js';
import { SmoothGraphics } from '@pixi/graphics-smooth';
import { BitText } from '@/entities';
import { getAngle } from '@/utils/mapUtil';
import { angleToRad } from '@/utils/util';

const offset = 100;
export default class StraightPath extends PIXI.Container {
  constructor(props) {
    super();
    this.cullable = true;
    this.distance = props.distance;
    this.sourceCell = props.sourceCell;
    this.targetCell = props.targetCell;

    this.drawGraphic();
    this.drawDistanceText();
  }

  drawGraphic() {
    const relationLine = new SmoothGraphics();
    relationLine.lineStyle(2, 0xffffff);
    relationLine.moveTo(this.sourceCell.x, this.sourceCell.y);
    relationLine.lineTo(this.targetCell.x, this.targetCell.y);
    this.addChild(relationLine);
  }

  drawDistanceText() {
    let angle = getAngle(this.sourceCell, this.targetCell);
    if (angle >= 180) {
      angle = angle - 180;
    }
    const x =
      (this.sourceCell.x + this.targetCell.x) / 2 + Math.cos(angleToRad(angle - 90)) * offset;
    const y =
      (this.sourceCell.y + this.targetCell.y) / 2 + Math.sin(angleToRad(angle - 90)) * offset;
    this.distanceText = new BitText(this.distance, x, y, 0xffffff, 100);

    // 保证距离文本始终顺着线条方向
    if (angle >= 90) {
      angle = 180 - angle;
    } else {
      angle = -angle;
    }
    this.distanceText.angle = angle;
    this.distanceText.anchor.set(0.5);
    this.addChild(this.distanceText);
  }
}
