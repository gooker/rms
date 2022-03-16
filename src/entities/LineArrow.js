import * as PIXI from 'pixi.js';
import { BitText } from '@/entities';
import { getDirByAngle } from '@/utils/util';
import {
  zIndex,
  CostColor,
  CellSize,
  MapSelectableSpriteType,
  SelectionType,
} from '@/config/consts';
import { getCostArrow, getRelationSelectionBG } from '@/utils/mapUtil';

export default class LineArrow extends PIXI.Container {
  constructor(props) {
    super();
    this.type = MapSelectableSpriteType.ROUTE;
    this.id = props.id;
    this.x = props.fromX;
    this.y = props.fromY;
    this.angle = props.angle;
    this.alpha = 0.8;
    this.zIndex = props.isClassic ? zIndex.line : 100;

    this.cost = props.cost;
    this.isClassic = props.isClassic;
    this.length = props.length; // Sprite长度
    this.distance = props.distance; // 显示的长度文本
    this.dir = getDirByAngle(props.angle);

    this.select = props.select;

    this.createArrow();
    // this.createHitArea();
    this.createLabel();
    this.createSelectionBG();

    if (props.interactive) {
      this.arrow.buttonMode = true;
      this.arrow.interactive = true;
      this.arrow.on('pointerdown', this.click);
    }

    this.states = { selected: false, arrow: true, distance: false };
    this.additionalFlag = new Map();
  }

  set clickable(value) {
    this.arrow.buttonMode = value;
    this.arrow.interactive = value;
    if (value) {
      this.arrow.on('pointerdown', this.click);
    } else {
      this.arrow.off('pointerdown', this.click);
    }
  }

  createArrow = () => {
    this.arrow = getCostArrow(this.length, CostColor[this.cost]);
    this.arrow.pivot = { x: 0, y: this.length };
    if (!this.isClassic) {
      this.arrow.scale.x = 5;
    }
    this.addChild(this.arrow);
  };

  createLabel() {
    // 距离文本
    let distanceAngle;
    const textFontSize = 70;
    let xOffset = 80;

    if (this.angle > 0 && this.angle < 180) {
      distanceAngle = -90;
    } else {
      distanceAngle = 90;
    }
    let fontColor = CostColor[this.cost];

    // 大图模式下，字体悬浮在箭头上，所以显示成白色
    if (!this.isClassic) {
      fontColor = 0xffffff;
      xOffset = 15;
    }
    this.distanceText = new BitText(
      this.distance,
      xOffset,
      -this.length * 0.5,
      fontColor,
      textFontSize,
    );
    this.distanceText.anchor = 0.5;
    this.distanceText.angle = distanceAngle;
    this.distanceText.zIndex = 200;
    this.addChild(this.distanceText);
  }

  createHitArea() {
    const hitArea = new PIXI.Rectangle(
      -this.arrow.width / 2,
      0,
      this.arrow.width,
      this.arrow.height,
    );
    // hitArea.pivot = { x: 0, y: this.length };
    this.hitArea = hitArea;
  }

  createSelectionBG() {
    this.selectedBorderSprite = getRelationSelectionBG(this.arrow.width, this.arrow.height);
    this.selectedBorderSprite.pivot = { x: 0, y: this.length };
    this.selectedBorderSprite.x = -this.arrow.width / 2;
    this.selectedBorderSprite.alpha = 0.6;
    this.selectedBorderSprite.visible = false;
    this.addChild(this.selectedBorderSprite);
  }

  // 选择相关
  onSelect = () => {
    if (!this.states.selected) {
      this.states.selected = true;
      this.selectedBorderSprite.visible = true;
    }
  };

  onUnSelect = () => {
    if (this.states.selected) {
      this.states.selected = false;
      this.selectedBorderSprite.visible = false;
    }
  };

  click = (event) => {
    if (event?.data.originalEvent.ctrlKey || event?.data.originalEvent.metaKey) {
      if (!this.selected) {
        this.onSelect();
        this.select && this.select(this, SelectionType.CTRL);
      }
    } else {
      this.states.selected ? this.onUnSelect() : this.onSelect();
      this.select && this.select(this, SelectionType.SINGLE);
    }
  };

  switchDistanceShown(flag) {
    this.states.distance = flag;
    if (this.distanceText && this.states.arrow) {
      this.distanceText.visible = flag;
    }
  }

  switchShown(flag) {
    this.states.arrow = flag;
    this.arrow.visible = flag;
    this.additionalFlag.forEach((entity) => {
      entity.visible = flag;
    });
    if (flag) {
      this.distanceText.visible = this.states.distance;
      this.selectedBorderSprite.visible = this.states.selected;
    } else {
      this.distanceText.visible = false;
      this.selectedBorderSprite.visible = false;
    }
  }

  plusAction(texture, key, size) {
    if (this.additionalFlag.has(key)) {
      console.warn(`给线条添加Icon时候发生key冲突: ${key}`);
      return;
    }
    const distanceInt = parseInt(this.distance, 10) - CellSize.width;
    const x = size === 'M' ? 180 : 100;
    const width = size === 'M' ? 250 : 150;
    const height = size === 'M' ? 250 : 150;
    if (texture) {
      const actionSprite = new PIXI.Sprite(texture);
      actionSprite.x = x;
      actionSprite.y = -distanceInt * 0.3;
      actionSprite.width = width;
      actionSprite.height = height;
      actionSprite.anchor.set(0.5);
      actionSprite.alpha = 0.8;
      actionSprite.angle = -this.angle;
      this.addChild(actionSprite);
      this.additionalFlag.set(key, actionSprite);
    }
  }

  removeAction(key) {
    const actionSprite = this.additionalFlag.get(key);
    if (actionSprite) {
      this.removeChild(actionSprite);
      actionSprite.destroy({ children: true });
      this.additionalFlag.delete(key);
    }
  }
}
