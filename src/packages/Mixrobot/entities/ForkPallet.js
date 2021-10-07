import * as PIXI from 'pixi.js';
import BitText from './BitText';
import { getTextureFromResources } from '@/utils/mapUtils';
import { GlobalAlpha, zIndex, LatentPodSize } from '@/config/consts';

export default class ForkPallet extends PIXI.Container {
  constructor(props) {
    super();
    this.x = props.x;
    this.y = props.y;
    this.cellId = props.cellId;
    this.code = props.code;
    this.$height = props.height;
    this.$width = props.width;
    this.angle = props.angle || 0;
    this.zIndex = zIndex.pod;
    this.create();
    this.addPodCode();
  }

  addPodCode() {
    this.idText = new BitText(this.code, 0, LatentPodSize.height / 3, 0xffffff, 100);
    this.idText.angle = -this.angle;
    this.idText.anchor.set(0.5);
    this.addChild(this.idText);
  }

  create() {
    const forkPodTexture = getTextureFromResources('fork_pallet');
    this.pod = new PIXI.Sprite(forkPodTexture);
    this.pod.x = 0;
    this.pod.y = 0;
    this.pod.height = this.$height;
    this.pod.width = this.$width;
    this.pod.alpha = GlobalAlpha;
    this.pod.anchor.set(0.5);
    this.addChild(this.pod);
  }
}
