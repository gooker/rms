import * as PIXI from 'pixi.js';
import { zIndex } from '@/config/consts';
import { getTextureFromResources } from '@/utils/mapUtil';

export default class TemporaryLock extends PIXI.Sprite {
  constructor(x, y) {
    const texture = getTextureFromResources('tmp_block_lock');
    super(texture);

    this.x = x;
    this.y = y;
    this.cullable = true;
    this.alpha = 0.7;
    this.height = 500;
    this.width = 500;
    this.zIndex = zIndex.temporaryLock;
    this.anchor.set(0.5);
  }
}
