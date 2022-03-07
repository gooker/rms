import * as PIXI from 'pixi.js';
import { SmoothGraphics } from '@pixi/graphics-smooth';
import { isStrictNull } from '@/utils/util';
import { getTextureFromResources } from '@/utils/mapUtil';
import Text from './Text';
import {
  zIndex,
  SelectionType,
  WorkStationSize,
  CommonFunctionSize,
  MapSelectableSpriteType,
} from '@/config/consts';

export default class WorkStation extends PIXI.Container {
  constructor(props) {
    super();
    this.type = MapSelectableSpriteType.WORKSTATION;
    this.$$formData = props.$$formData;
    this.x = props.x;
    this.y = props.y;
    this.code = props.station;
    this.icon = props.icon || 'work_station';
    this.name = props.name;
    this.angle = props.angle;
    this.$angle = props.angle || 0; // 不要删掉 为了和通用站点保持统一 站点速率显示会用
    this.zIndex = zIndex.functionIcon;
    this.direction = props.direction;
    this.select = props.select;
    this.selected = false; // 标记该工作站是否被选中

    // 尺寸转换(向前兼容)
    if (this.icon === 'common') {
      this.iconWidth = CommonFunctionSize.width;
      this.iconHeight = CommonFunctionSize.height;
    } else {
      const iconSize = props.size || `${WorkStationSize.width}@${WorkStationSize.height}`;
      const [iconWidth, iconHeight] = iconSize.split('@').map((value) => parseInt(value, 10));
      this.iconWidth = iconWidth;
      this.iconHeight = iconHeight;
    }

    this.create();
    this.addName();
    this.createSelectionBorder();

    // 在途小车显示相关
    this.showEmployee = false;
    this.employeeColor = null;

    // 点击事件处理
    this.workStation.interactive = true;
    this.workStation.buttonMode = true;
    this.workStation.interactiveChildren = false;
    this.workStation.on('pointerdown', this.click);
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
    const workStationTexture = getTextureFromResources(this.icon);
    const scaleX = this.iconWidth / workStationTexture.width;
    const scaleY = this.iconHeight / workStationTexture.height;
    this.workStation = new PIXI.Sprite(workStationTexture);
    this.workStation.anchor.set(0.5);
    this.workStation.setTransform(0, 0, scaleX, scaleY);
    this.addChild(this.workStation);
  }

  addName() {
    if (isStrictNull(this.name)) return;
    this.nameSprite = new Text(
      this.name,
      0,
      -this.workStation.height / 2 - 100,
      0xffffff,
      false,
      200,
    );
    this.nameSprite.anchor.set(0, 0.5);
    this.nameSprite.angle = -this.angle;
    this.addChild(this.nameSprite);
  }

  // 创建选择边框
  createSelectionBorder() {
    this.selectionBorder = new SmoothGraphics();
    this.selectionBorder.lineStyle(5, 0xff0000);
    const { width, height } = this.getLocalBounds();
    this.selectionBorder.drawRect(0, 0, width * 1.3, height);
    this.selectionBorder.alpha = 0.8;
    this.selectionBorder.pivot = { x: (width * 1.3) / 2, y: height / 2 };
    this.selectionBorder.visible = false;
    this.addChild(this.selectionBorder);
  }

  // Marker
  createEmployerMark(color) {
    this.destroyMarkerSprite();
    this.markerSprite = new PIXI.Sprite(PIXI.Texture.WHITE);
    this.markerSprite.width = this.workStation.width + 200;
    this.markerSprite.height = this.workStation.height + 200;
    this.markerSprite.anchor.set(0.5);
    this.markerSprite.zIndex = 1;
    this.markerSprite.alpha = 0.6;
    this.markerSprite.tint = color.replace('#', '0x');
    this.addChild(this.markerSprite);
  }

  destroyMarkerSprite = () => {
    if (this.markerSprite) {
      this.removeChild(this.markerSprite);
      this.markerSprite.destroy(true);
      this.markerSprite = null;
    }
  };

  switchMarkerShown = (isShown, color) => {
    if (isShown) {
      this.createEmployerMark(color);
    } else {
      this.destroyMarkerSprite();
    }
    this.showEmployee = isShown;
    this.employeeColor = isShown ? color : null;
  };
}
