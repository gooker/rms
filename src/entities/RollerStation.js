import * as PIXI from 'pixi.js';
import { CellSize, zIndex } from '@/config/consts';

export default class RollerStation extends PIXI.Sprite {
  constructor(texture, x, y) {
    super(texture);
    this.x = x;
    this.y = y + CellSize.height / 2;
    this.height = 4 * CellSize.height;
    this.width = 4 * CellSize.width;
    this.alpha = 0.8;
    this.zIndex = zIndex.temporaryLock;
    this.anchor.set(0.5, 0.9);
  }
}
