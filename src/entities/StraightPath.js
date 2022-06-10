import * as PIXI from 'pixi.js';
import { SmoothGraphics } from '@pixi/graphics-smooth';
import { BitText } from '@/entities';
import { getAngle } from '@/utils/mapUtil';
import { angleToRad } from '@/utils/util';

const offset = 100;
export default class StraightPath extends PIXI.Container {
  constructor(props) {
    super();
    this.distance = props.distance;
    this.sourceCell = props.sourceCell;
    this.targetCell = props.targetCell;

    this.drawGraphic();
    this.drawDistanceText();
  }

  set textVisible(visible) {
    this.distanceText.visible = visible;
  }

  drawGraphic() {
    const relationLine = new SmoothGraphics();
    relationLine.lineStyle(2, 0xffffff);
    relationLine.moveTo(this.sourceCell.x, this.sourceCell.y);
    relationLine.lineTo(this.targetCell.x, this.targetCell.y);
    this.addChild(relationLine);
  }

  drawDistanceText() {
    const angle = getAngle(this.sourceCell, this.targetCell);
    const x =
      (this.sourceCell.x + this.targetCell.x) / 2 + Math.cos(angleToRad(angle - 90)) * offset;
    const y =
      (this.sourceCell.y + this.targetCell.y) / 2 + Math.sin(angleToRad(angle - 90)) * offset;
    this.distanceText = new BitText(this.distance, x, y, 0xffffff, 100);
    this.distanceText.angle = angle === 180 ? 0 : angle; // 防止距离文档倒过来
    this.distanceText.anchor.set(0.5);
    this.addChild(this.distanceText);
  }
}
