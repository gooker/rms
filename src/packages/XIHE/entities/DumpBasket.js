import * as PIXI from 'pixi.js';
import { zIndex, SpotSize } from '@/config/consts';
import { getTextureFromResources } from '@/utils/mapUtils';
import BitText from '@/packages/XIHE/entities/BitText';

export default class DumpBasket extends PIXI.Sprite {
  constructor(key, x, y) {
    const texture = getTextureFromResources('dump_basket');
    super(texture);
    this.x = x;
    this.y = y;
    this.key = key;
    this.height = SpotSize.height * 4;
    this.width = SpotSize.width * 4;
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
