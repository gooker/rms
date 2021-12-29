import * as PIXI from 'pixi.js';
import { SpotSize, zIndex } from '@/config/consts';
import { getTextureFromResources } from '@/utils/mapUtils';
import BitText from '@/packages/XIHE/entities/BitText';

export default class Dump extends PIXI.Sprite {
  constructor(x, y, name) {
    const texture = getTextureFromResources('dump');
    super(texture);
    this.x = x;
    this.y = y;
    this.name = name;
    this.height = SpotSize.height * 3;
    this.width = SpotSize.width * 3;
    this.zIndex = zIndex.temporaryLock;
    this.alpha = 0.7;
    this.anchor.set(0.5, 1);

    this.addName();
  }

  addName() {
    const y = this.height * 2 + 50;
    this.nameSprite = new BitText(this.name, 0, -y, 0xd77f4a, 200);
    this.nameSprite.anchor.set(0.5);
    this.addChild(this.nameSprite);
  }
}
