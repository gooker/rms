import * as PIXI from 'pixi.js';
import Config from '@/config';

export default class TemporaryLock extends PIXI.Sprite {
  constructor(texture, x, y) {
    super(texture);
    this.x = x;
    this.y = y + Config.CellHeight / 2;
    this.height = 3 * Config.CellHeight;
    this.width = 3 * Config.CellWidth;
    this.alpha = Config.GlobalAlpha;
    this.zIndex = Config.zIndex.temporaryLock;
    this.anchor.set(0.5, 1);
  }
}
