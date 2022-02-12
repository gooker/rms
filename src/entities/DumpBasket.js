import * as PIXI from 'pixi.js';
import { getTextureFromResources } from '@/utils/mapUtil';
import BitText from './BitText';
import { zIndex } from '@/config/consts';

export default class DumpBasket extends PIXI.Sprite {
  constructor(key, x, y) {
    const texture = getTextureFromResources('basket');
    super(texture);
    this.x = x;
    this.y = y;
    this.key = key;
    this.height = 100 * 4;
    this.width = 100 * 4;
    this.zIndex = zIndex.temporaryLock;
    this.anchor.set(0.5);
    this.addName();
  }

  addName() {
    const y = this.height / 2 + 50;
    this.nameSprite = new BitText(this.key, 0, -y, 0xd77f4a, 200);
    this.nameSprite.anchor.set(0.5);
    this.addChild(this.nameSprite);
  }
}
