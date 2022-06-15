import * as PIXI from 'pixi.js';
import { SmoothGraphics } from '@pixi/graphics-smooth';
import Text from '@/entities/Text';
import { getTextureFromResources } from '@/utils/mapUtil';
import { MapSelectableSpriteType, SelectionType, zIndex } from '@/config/consts';

export default class Dump extends PIXI.Container {
  constructor(props) {
    super();
    this.$$formData = props.$$formData;
    this.type = MapSelectableSpriteType.DELIVERY;
    this.x = props.x;
    this.y = props.y;
    this.name = props.name;
    this.cullable = true;
    this.zIndex = zIndex.temporaryLock;
    this.selected = false; // 标记是否被选中
    this.select = props.select;

    this.create();
    this.addName();
    this.createSelectionBorder();

    // 处理点击事件
    this.dump.interactive = true;
    this.dump.buttonMode = true;
    this.dump.interactiveChildren = false;
    this.dump.on('pointerdown', this.click);
  }

  create() {
    const dumpTexture = getTextureFromResources('delivery');
    this.dump = new PIXI.Sprite(dumpTexture);
    this.dump.zIndex = 1;
    this.dump.alpha = 0.8;
    this.dump.anchor.set(0.5);
    this.dump.height = 600;
    this.dump.width = 600;
    this.addChild(this.dump);
  }

  addName() {
    this.nameSprite = new Text(this.name, 0, -this.dump.height / 2 - 150, 0xd77f4a, true, 200);
    this.nameSprite.anchor.set(0.5);
    this.addChild(this.nameSprite);
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

  click = () => {
    this.selected ? this.onUnSelect() : this.onSelect();
    this.select && this.select(this, SelectionType.SINGLE);
  };

  // 创建选择边框
  createSelectionBorder() {
    this.selectionBorder = new SmoothGraphics();
    this.selectionBorder.lineStyle(5, 0xff0000);
    const { width, height } = this.getLocalBounds();
    this.selectionBorder.drawRect(0, -130, width * 1.3, height * 1.1);
    this.selectionBorder.alpha = 0.8;
    this.selectionBorder.pivot = { x: (width * 1.3) / 2, y: (height * 1.1) / 2 };
    this.selectionBorder.visible = false;
    this.addChild(this.selectionBorder);
  }
}
