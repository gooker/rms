import * as PIXI from 'pixi.js';
import * as Config from '@/config/config';
import { getTextureFromResources } from '@/utils/mapUtils';
import BitText from '@/pages/MapTool/entities/BitText';

export default class DumpBasket extends PIXI.Sprite {
  constructor(key, x, y) {
    const texture = getTextureFromResources('dump_basket');
    super(texture);
    this.x = x;
    this.y = y;
    this.key = key;
    this.height = Config.CellHeight * 4;
    this.width = Config.CellWidth * 4;
    this.zIndex = Config.zIndex.temporaryLock;
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
