import * as PIXI from 'pixi.js';
import { getTextureFromResources } from '@/utils/mapUtil';
import { GlobalAlpha, MapSelectableSpriteType, SelectionType, zIndex } from '@/config/consts';
import { SmoothGraphics } from '@pixi/graphics-smooth';

export default class Intersection extends PIXI.Container {
  constructor(props) {
    super();
    this.$$formData = props.$$formData;
    this.type = MapSelectableSpriteType.INTERSECTION;
    this.x = props.x;
    this.y = props.y;
    this.cellId = props.cellId;
    this.directions = props.directions;
    this.isTrafficCell = props.isTrafficCell;
    this.alpha = GlobalAlpha;
    this.zIndex = zIndex.temporaryLock;

    this.select = props.select;
    this.selected = false; // 标记该工作站是否被选中

    this.create();
    this.addDirection();
    this.createSelectionBorder();

    // 处理点击事件
    this.intersection.interactive = true;
    this.intersection.buttonMode = true;
    this.intersection.interactiveChildren = false;
    this.intersection.on('pointerdown', this.click);
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

  create() {
    const intersectionTexture = getTextureFromResources(
      this.isTrafficCell ? 'traffic_control' : 'intersection',
    );
    this.intersection = new PIXI.Sprite(intersectionTexture);
    this.intersection.height = 500;
    this.intersection.width = 500;
    this.intersection.anchor.set(0.5);
    this.addChild(this.intersection);
  }

  addDirection() {
    const boldDirectionTexture = getTextureFromResources('intersectionDirection');
    if (!Array.isArray(this.directions)) return;
    const direction = this.directions.map((item) => item.direction).map((item) => `${item}`);

    // 渲染向上的箭头
    if (direction.includes('0')) {
      this.up = new PIXI.Sprite(boldDirectionTexture);
      this.up.angle = 0;
      this.up.anchor.set(0.5, 1);
      this.up.y = -234;
      this.addChild(this.up);
    }

    // 渲染向右的箭头
    if (direction.includes('90')) {
      this.right = new PIXI.Sprite(boldDirectionTexture);
      this.right.angle = 90;
      this.right.anchor.set(0.5, 1);
      this.right.x = 228;
      this.addChild(this.right);
    }

    // 渲染向下的箭头
    if (direction.includes('180')) {
      this.down = new PIXI.Sprite(boldDirectionTexture);
      this.down.angle = 180;
      this.down.anchor.set(0.5, 1);
      this.down.y = 234;
      this.addChild(this.down);
    }

    // 渲染向左的箭头
    if (direction.includes('270')) {
      this.left = new PIXI.Sprite(boldDirectionTexture);
      this.left.angle = 270;
      this.left.anchor.set(0.5, 1);
      this.left.x = -228;
      this.addChild(this.left);
    }
  }

  // 创建选择边框
  createSelectionBorder() {
    this.selectionBorder = new SmoothGraphics();
    this.selectionBorder.lineStyle(5, 0xff0000);
    const { width, height } = this.getLocalBounds();
    this.selectionBorder.drawRect(0, 0, width * 1.4, height * 1.3);
    this.selectionBorder.alpha = 0.8;
    this.selectionBorder.pivot = { x: (width * 1.3) / 2, y: (height * 1.3) / 2 };
    this.selectionBorder.visible = false;
    this.addChild(this.selectionBorder);
  }
}
