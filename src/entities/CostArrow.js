import * as PIXI from 'pixi.js';
import { getTextureFromResources } from '@/utils/mapUtil';
import { MapSelectableSpriteType, SelectionType } from '@/config/consts';
import { SmoothGraphics } from '@pixi/graphics-smooth';

export default class CostArrow extends PIXI.Container {
  constructor(props) {
    super();
    this.type = MapSelectableSpriteType.ROUTE;
    this.id = props.id;
    this.x = props.x;
    this.y = props.y;
    this.angle = props.angle;
    this.cost = props.cost;
    this.selected = false; // 标记是否被选中
    this.select = props.select;

    this.drawArrow(false);
    this.createSelectionBorder();
  }

  drawArrow(withPrograming) {
    if (this.arrow) {
      this.removeChild(this.arrow);
      this.arrow.destroy();
      this.arrow = null;
    }
    this.arrow = new PIXI.Sprite(
      getTextureFromResources(`cost_${this.cost}${withPrograming ? '_p' : ''}`),
    );
    this.arrow.anchor.set(1, 0.5);
    this.arrow.scale.set(0.6);
    this.addChild(this.arrow);

    // 处理点击事件
    this.arrow.interactive = true;
    this.arrow.buttonMode = true;
    this.arrow.interactiveChildren = false;
    this.arrow.on('pointerdown', this.click);
  }

  setProgramingFlag() {
    this.drawArrow(true);
  }

  resetProgramingFlag() {
    this.drawArrow(false);
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

  createSelectionBorder() {
    this.selectionBorder = new SmoothGraphics();
    this.selectionBorder.lineStyle(5, 0xff0000);
    this.selectionBorder.drawRect(-this.width / 2, 0, this.width, this.height);
    this.selectionBorder.alpha = 0.8;
    this.selectionBorder.visible = false;
    this.addChild(this.selectionBorder);
  }
}
