import * as PIXI from 'pixi.js';
import { SmoothGraphics } from '@pixi/graphics-smooth';
import { getTextureFromResources } from '@/utils/mapUtil';
import { ElevatorSize, GlobalAlpha, MapSelectableSpriteType, SelectionType } from '@/config/consts';

export default class Elevator extends PIXI.Container {
  constructor(props) {
    super();
    this.$$formData = props.$$formData;
    this.type = MapSelectableSpriteType.ELEVATOR;
    this.id = props.id;
    this.x = props.x;
    this.y = props.y;
    this.cullable = true;

    this.select = props.select;
    this.selected = false; // 标记是否被选中

    this.create();
    this.createSelectionBorder();

    // 处理点击事件
    this.elevator.interactive = true;
    this.elevator.buttonMode = true;
    this.elevator.interactiveChildren = false;
    this.elevator.on('pointerdown', this.click);
  }

  create() {
    const elevatorTexture = getTextureFromResources('elevator');
    this.elevator = new PIXI.Sprite(elevatorTexture);
    const scaleX = ElevatorSize.width / elevatorTexture.width;
    const scaleY = ElevatorSize.height / elevatorTexture.height;
    this.elevator.anchor.set(0.5);
    this.elevator.setTransform(0, 0, scaleX, scaleY);
    this.elevator.alpha = GlobalAlpha;
    this.addChild(this.elevator);
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
    this.selectionBorder = new SmoothGraphics();
    this.selectionBorder.lineStyle(5, 0xff0000);
    const { width, height } = this.getLocalBounds();
    this.selectionBorder.drawRect(0, 0, width * 1.3, height * 1.2);
    this.selectionBorder.alpha = 0.8;
    this.selectionBorder.pivot = { x: (width * 1.3) / 2, y: (height * 1.2) / 2 };
    this.selectionBorder.visible = false;
    this.addChild(this.selectionBorder);
  }
}
