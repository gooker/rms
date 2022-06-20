import * as PIXI from 'pixi.js';
import { SmoothGraphics } from '@pixi/graphics-smooth';
import BitText from './BitText';
import { getTextureFromResources } from '@/utils/mapUtil';
import { GlobalAlpha, MonitorSelectableSpriteType, SelectionType, zIndex } from '@/config/consts';

export default class LatentPod extends PIXI.Container {
  constructor(props) {
    super();
    this.type = MonitorSelectableSpriteType.LatentPod;
    this.id = props.id;
    this.cellId = props.cellId;
    this.x = props.x;
    this.y = props.y;
    this.$width = props.width;
    this.$height = props.height;
    this.angle = props.angle || 0;
    this.zIndex = zIndex.pod;
    this.cullable = true;
    this.create();
    this.addPodId();

    this.select = props.select;
    this.selected = false; // 是否被框选
    this.createSelectionBorder();

    this.pod.interactive = true;
    this.pod.buttonMode = true;
    this.pod.interactiveChildren = false;
    this.pod.on('pointerdown', this.click);
  }

  // 选择相关
  onSelect = () => {
    if (!this.selected) {
      this.selected = true;
      this.selectionBorder.visible = true;
    }
  };

  onUnSelect = () => {
    if (this.selected) {
      this.selected = false;
      this.selectionBorder.visible = false;
    }
  };

  click = (event) => {
    if (event?.data.originalEvent.ctrlKey || event?.data.originalEvent.metaKey) {
      if (!this.selected) {
        this.onSelect();
        this.select && this.select(this, SelectionType.CTRL);
      }
    } else {
      this.selected ? this.onUnSelect() : this.onSelect();
      this.select && this.select(this, SelectionType.SINGLE);
    }
  };

  // 创建选择边框
  createSelectionBorder() {
    const scaleBase = 1.05;
    this.selectionBorder = new SmoothGraphics();
    this.selectionBorder.lineStyle(5, 0xff0000);
    const { width, height } = this.getLocalBounds();
    this.selectionBorder.drawRect(0, 0, width * scaleBase, height * scaleBase);
    this.selectionBorder.alpha = 0.8;
    this.selectionBorder.pivot = { x: (width * scaleBase) / 2, y: (height * scaleBase) / 2 };
    this.selectionBorder.visible = false;
    this.addChild(this.selectionBorder);
  }

  setAlpha(value) {
    this.pod.alpha = value;
  }

  setAngle(value) {
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

  resize(width, height) {
    this.$width = width;
    this.$height = height;
    this.pod.height = this.$height;
    this.pod.width = this.$width;
    this.addPodId();
  }

  addPodId() {
    if (this.idText) {
      this.removeChild(this.idText);
      this.idText.destroy(true);
    }
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
