import * as PIXI from 'pixi.js';
import { SmoothGraphics } from '@pixi/graphics-smooth';
import { getTextureFromResources } from '@/utils/mapUtil';
import {
  zIndex,
  SelectionType,
  CommonFunctionSize,
  MapSelectableSpriteType,
} from '@/config/consts';
import Text from '@/entities/Text';
import { isStrictNull } from '@/utils/util';

export default class CommonFunction extends PIXI.Container {
  constructor(props) {
    super();
    this.$$formData = props.$$formData;
    this.type = MapSelectableSpriteType.STATION;
    this.x = props.x;
    this.y = props.y;
    this.name = props.name;
    this.angle = props.iconAngle || 0;
    this.zIndex = zIndex.functionIcon;
    this.$angle = props.angle || 0; // 仅用于纠正名称角度
    this.icon = props.icon || 'common';
    this.iconSize = props.size || `${CommonFunctionSize.width}@${CommonFunctionSize.height}`;
    this.select = props.select;
    this.selected = false; // 标记该工作站是否被选中

    // 尺寸转换(向前兼容)
    const [iconWidth, iconHeight] = this.iconSize.split('@').map((value) => parseInt(value, 10));
    this.iconWidth = iconWidth;
    this.iconHeight = iconHeight;

    this.create();
    this.addName();
    this.createSelectionBorder();

    // 在途小车显示相关
    this.employeeColor = null;
    this.showEmployee = false;

    // 点击事件处理
    this.CommonFunction.interactive = true;
    this.CommonFunction.buttonMode = true;
    this.CommonFunction.interactiveChildren = false;
    this.CommonFunction.on('pointerdown', this.click);
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
    const commonFunctionTexture = getTextureFromResources(this.icon || 'common');
    const scaleX = this.iconWidth / commonFunctionTexture.width;
    const scaleY = this.iconHeight / commonFunctionTexture.height;
    this.CommonFunction = new PIXI.Sprite(commonFunctionTexture);
    this.CommonFunction.anchor.set(0.5);
    this.CommonFunction.setTransform(0, 0, scaleX, scaleY);
    this.addChild(this.CommonFunction);
  }

  addName() {
    if (isStrictNull(this.name)) return;
    const y = this.CommonFunction.height / 2 + 150;
    this.nameSprite = new Text(this.name, 0, -y, 0xffffff, false, 200);
    this.nameSprite.anchor.set(0.5);
    this.nameSprite.angle = -this.angle;
    this.addChild(this.nameSprite);
  }

  // 创建选择边框
  createSelectionBorder() {
    this.selectionBorder = new SmoothGraphics();
    this.selectionBorder.lineStyle(5, 0xff0000);
    const { width, height } = this.getLocalBounds();
    this.selectionBorder.drawRect(0, -100, width * 1.3, height * 1.2);
    this.selectionBorder.alpha = 0.8;
    this.selectionBorder.pivot = { x: (width * 1.3) / 2, y: (height * 1.2) / 2 };
    this.selectionBorder.visible = false;
    this.addChild(this.selectionBorder);
  }

  // Marker
  createCommonEmployerMark(color) {
    this.destroyCommonSelectedBorderSprite();
    this.selectedBorderSprite = new PIXI.Sprite(PIXI.Texture.WHITE);
    this.selectedBorderSprite.width = this.CommonFunction.width + 200;
    this.selectedBorderSprite.height = this.CommonFunction.height + 200;
    this.selectedBorderSprite.anchor.set(0.5);
    this.selectedBorderSprite.zIndex = 1;
    this.selectedBorderSprite.alpha = 0.6;
    this.selectedBorderSprite.tint = color.replace('#', '0x');
    this.addChild(this.selectedBorderSprite);
  }

  destroyCommonSelectedBorderSprite = () => {
    if (this.selectedBorderSprite) {
      this.removeChild(this.selectedBorderSprite);
      this.selectedBorderSprite.destroy();
      this.selectedBorderSprite = null;
    }
  };

  switchCommonMarkerShown = (isShown, color) => {
    if (isShown) {
      this.createCommonEmployerMark(color);
    } else {
      this.destroyCommonSelectedBorderSprite();
    }
    this.showEmployee = isShown;
    this.employeeColor = isShown ? color : null;
  };
}
