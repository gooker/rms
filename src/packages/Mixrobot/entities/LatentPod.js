import * as PIXI from 'pixi.js';
import BitText from './BitText';
import { getTextureFromResources } from '@/utils/mapUtils';
import { zIndex } from '@/consts';

export default class LatentPod extends PIXI.Container {
  constructor(props) {
    super();
    this.id = props.id;
    this.cellId = props.cellId;
    this.x = props.x;
    this.y = props.y;
    this.$width = props.width;
    this.$height = props.height;
    this.angle = props.angle || 0;
    this.zIndex = zIndex.pod;
    this.create();
    this.addPodId();
  }

  setAlpha(value) {
    this.pod.alpha = value;
  }

  setAlgle(value) {
    if (this.angle !== value) {
      this.angle = value;
      if (this.idText) this.idText.angle = -value;
    }
  }

  create() {
    const latentPodTexture = getTextureFromResources('heat_0');
    this.pod = new PIXI.Sprite(latentPodTexture);
    this.pod.x = 0;
    this.pod.y = 0;
    this.pod.height = this.$height;
    this.pod.width = this.$width;
    this.pod.alpha = GlobalAlpha;
    this.pod.anchor.set(0.5);
    this.addChild(this.pod);
  }

  addPodId() {
    this.idText = new BitText(this.id, -this.$width / 3, this.$height / 3, 0xffffff, 100);
    // PIXI渲染角度后会先旋转父容器，再旋转子对象
    this.idText.angle = -this.angle;
    this.idText.anchor.set(0.5);
    this.addChild(this.idText);
  }

  mockHeat() {
    let texture;
    const base = parseInt(this.cellId / 100, 10);
    switch (true) {
      case base >= 0 && base < 10: {
        texture = getTextureFromResources('heat1');
        break;
      }
      case base >= 10 && base < 20: {
        texture = getTextureFromResources('heat2');
        break;
      }
      case base >= 20 && base < 30: {
        texture = getTextureFromResources('heat3');
        break;
      }
      case base >= 30 && base < 40: {
        texture = getTextureFromResources('heat4');
        break;
      }
      case base >= 40 && base < 50: {
        texture = getTextureFromResources('heat5');
        break;
      }
      case base >= 50 && base < 60: {
        texture = getTextureFromResources('heat6');
        break;
      }
      case base >= 60 && base < 70: {
        texture = getTextureFromResources('heat7');
        break;
      }
      case base >= 70 && base < 80: {
        texture = getTextureFromResources('heat8');
        break;
      }
      case base >= 80 && base < 90: {
        texture = getTextureFromResources('heat9');
        break;
      }
      case base >= 90 && base < 100: {
        texture = getTextureFromResources('heat10');
        break;
      }
      default:
        break;
    }
    return texture;
  }
}
