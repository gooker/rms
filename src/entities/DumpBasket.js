import * as PIXI from 'pixi.js';
import { getTextureFromResources } from '@/utils/mapUtil';
import { zIndex } from '@/config/consts';
import Text from '@/entities/Text';

export default class DumpBasket extends PIXI.Sprite {
  constructor(name, x, y) {
    const texture = getTextureFromResources('basket');
    super(texture);
    this.x = x;
    this.y = y;
    this.name = name;
    this.height = 100 * 4;
    this.width = 100 * 4;
    this.cullable = true;
    this.zIndex = zIndex.temporaryLock;
    this.anchor.set(0.5);
    this.addName();
  }

  addName() {
    const y = this.height / 2 + 50;
    this.nameSprite = new Text(this.name, 0, y, 0xd77f4a, false, 200);
    this.nameSprite.anchor.set(0.5);
    this.addChild(this.nameSprite);
  }
}
