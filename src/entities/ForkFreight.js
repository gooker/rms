import * as PIXI from 'pixi.js';
import { getTextureFromResources } from '@/utils/mapUtil';
import { GlobalAlpha } from '@/config/consts';

export default class ForkFreight extends PIXI.Container {
  constructor(props) {
    super();
    this.x = props.x;
    this.y = props.y;
    this.$height = props.height;
    this.$width = props.width;
    this.create();
  }

  create() {
    const forkPodTexture = getTextureFromResources('fork_freight');
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
