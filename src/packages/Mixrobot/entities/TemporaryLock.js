import * as PIXI from 'pixi.js';
import { GlobalAlpha, zIndex, SpotSize } from '@/consts';

export default class TemporaryLock extends PIXI.Sprite {
  constructor(texture, x, y) {
    super(texture);
    this.x = x;
    this.y = y + SpotSize.height / 2;
    this.height = 3 * SpotSize.height;
    this.width = 3 * SpotSize.width;
    this.alpha = GlobalAlpha;
    this.zIndex = zIndex.temporaryLock;
    this.anchor.set(0.5, 1);
  }
}
