import * as PIXI from 'pixi.js';
import { zIndex } from '@/config/consts';
import { getTextureFromResources } from '@/utils/mapUtil';

export default class SourceLock extends PIXI.Sprite {
  constructor(props) {
    const texture = getTextureFromResources('sourceLock');
    super(texture);

    this.x = props.x;
    this.y = props.y;
    this.cullable = true;
    this.alpha = 0.8;
    this.height = 500;
    this.width = 500;
    this.zIndex = zIndex.sourceLock;
    this.anchor.set(0.5);

    // 保存该资源锁有关的数据
    this.dataSet = props.dataSet;

    // 支持点击查看资源锁详情
    this.interactive = true;
    this.buttonMode = true;
    this.on('pointerdown', props.click);
  }
}
