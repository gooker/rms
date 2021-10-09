import * as PIXI from 'pixi.js';
import { SpotSize, zIndex } from '@/config/consts';

export default class RollerStation extends PIXI.Sprite {
  constructor(texture, x, y) {
    super(texture);
    this.x = x;
    this.y = y + SpotSize.height / 2;
    this.height = 4 * SpotSize.height;
    this.width = 4 * SpotSize.width;
    this.alpha = 0.8;
    this.zIndex = zIndex.temporaryLock;
    this.anchor.set(0.5, 0.9);
  }
}
