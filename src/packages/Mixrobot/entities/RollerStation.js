import * as PIXI from 'pixi.js';
import * as Config from '@/config/config';

export default class RollerStation extends PIXI.Sprite {
  constructor(texture, x, y) {
    super(texture);
    this.x = x;
    this.y = y + Config.CellHeight / 2;
    this.height = 4 * Config.CellHeight;
    this.width = 4 * Config.CellWidth;
    this.alpha = 0.8;
    this.zIndex = Config.zIndex.temporaryLock;
    this.anchor.set(0.5, 0.9);
  }
}
