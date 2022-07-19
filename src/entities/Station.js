import * as PIXI from 'pixi.js';
import { SmoothGraphics } from '@pixi/graphics-smooth';
import Text from '@/entities/Text';
import { isStrictNull } from '@/utils/util';
import { getTextureFromResources } from '@/utils/mapUtil';
import { MapSelectableSpriteType, SelectionType, zIndex } from '@/config/consts';

export default class Station extends PIXI.Container {
  constructor(props) {
    super();
    this.$$formData = props.$$formData;
    this.type = MapSelectableSpriteType.STATION;
    this.x = props.x;
    this.y = props.y;
    this.name = props.name;
    this.cullable = true;
    this.zIndex = zIndex.functionIcon;
    this.angle = props.iconAngle || 0;
    this.$angle = props.angle || 0; // 仅用于纠正名称角度
    this.icon = props.icon || 'common';
    this.iconWidth = props.iconWidth;
    this.iconHeight = props.iconHeight;
    this.stopId = props.stopId;

    this.select = props.select;
    this.selected = false; // 标记该工作站是否被选中

    this.create(this.icon);
    this.addName(this.name);
    this.createSelectionBorder();

    // 在途小车显示相关
    this.employeeColor = null;
    this.showEmployee = false;

    // 点击事件处理
    this.stationSprite.interactive = true;
    this.stationSprite.buttonMode = true;
    this.stationSprite.interactiveChildren = false;
    this.stationSprite.on('pointerdown', this.click);
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

  create(icon) {
    if (this.stationSprite) {
      this.stationSprite.destroy();
      this.removeChild(this.stationSprite);
      this.stationSprite = null;
    }
    const stationTexture = getTextureFromResources(icon || 'common');
    const scaleX = this.iconWidth / stationTexture.width;
    const scaleY = this.iconHeight / stationTexture.height;
    this.stationSprite = new PIXI.Sprite(stationTexture);
    this.stationSprite.anchor.set(0.5);
    this.stationSprite.setTransform(0, 0, scaleX, scaleY);
    this.addChild(this.stationSprite);
  }

  addName(name) {
    if (this.nameSprite) {
      this.nameSprite.destroy(true);
      this.removeChild(this.nameSprite);
      this.nameSprite = null;
    }
    if (isStrictNull(name)) return;
    const y = this.stationSprite.height / 2 + 150;
    this.nameSprite = new Text(this.name, 0, -y, 0xffffff, false, 200);
    this.nameSprite.anchor.set(0.5);
    this.nameSprite.angle = -this.angle;
    this.addChild(this.nameSprite);
  }

  updateStationIcon(icon, iconWidth, iconHeight, iconAngle) {
    this.icon = icon;
    this.iconWidth = iconWidth;
    this.iconHeight = iconHeight;
    this.angle = iconAngle;
    this.create(icon);
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
    this.selectedBorderSprite.width = this.stationSprite.width + 200;
    this.selectedBorderSprite.height = this.stationSprite.height + 200;
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
