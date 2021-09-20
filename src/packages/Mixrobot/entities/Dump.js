import * as PIXI from 'pixi.js';
import Config from '@/config';
import { getTextureFromResources } from '@/utils/utils';
import BitText from '@/pages/MapTool/entities/BitText';

export default class Dump extends PIXI.Sprite {
  constructor(x, y, name) {
    const texture = getTextureFromResources('dump');
    super(texture);
    this.x = x;
    this.y = y;
    this.name = name;
    this.height = Config.CellHeight * 3;
    this.width = Config.CellWidth * 3;
    this.zIndex = Config.zIndex.temporaryLock;
    this.alpha = 0.7;
    this.anchor.set(0.5, 1);

    this.addName();
  }

  addName() {
    const y = this.height * 2 + 50;
    this.nameSprite = new BitText(this.name, 0, -y, 0xD77F4A, 200);
    this.nameSprite.anchor.set(0.5);
    this.addChild(this.nameSprite);
  }
}
