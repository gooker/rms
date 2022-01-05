import * as PIXI from 'pixi.js';
import { GlobalAlpha, CellSize } from '@/config/consts';

export default class TemporaryLock extends PIXI.Sprite {
  constructor(texture, x, y) {
    super(texture);
    this.x = x;
    this.y = y + CellSize.height / 2;
    this.height = 3 * CellSize.height;
    this.width = 3 * CellSize.width;
    this.alpha = GlobalAlpha;
    this.zIndex = CellSize.zIndex.temporaryLock;
    this.anchor.set(0.5, 1);
  }
}
