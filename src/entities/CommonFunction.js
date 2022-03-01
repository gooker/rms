import * as PIXI from 'pixi.js';
import BitText from './BitText';
import { getTextureFromResources } from '@/utils/mapUtil';
import { CommonFunctionSize, zIndex } from '@/config/consts';
import Text from '@/entities/Text';

export default class CommonFunction extends PIXI.Container {
  constructor(props) {
    super();
    this.x = props.x;
    this.y = props.y;
    this.name = props.name;
    this.angle = props.iconAngle || 0;
    this.zIndex = zIndex.functionIcon;
    this.$angle = props.angle || 0; // 仅用于纠正名称角度
    this.icon = props.icon || 'common';
    this.iconSize = props.size || `${CommonFunctionSize.width}@${CommonFunctionSize.height}`;

    // 尺寸转换(向前兼容)
    const [iconWidth, iconHeight] = this.iconSize.split('@').map((value) => parseInt(value, 10));
    this.iconWidth = iconWidth;
    this.iconHeight = iconHeight;

    this.create();
    this.name && this.addName();

    this.employeeColor = null;
    this.showEmployee = false;

    if (props.active) {
      this.CommonFunction.interactive = true;
      this.CommonFunction.buttonMode = true;
      this.CommonFunction.interactiveChildren = false;
      this.CommonFunction.on('pointerdown', () => {
        props.click(this.showEmployee, this.employeeColor);
      });
    }
  }

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
    const y = this.CommonFunction.height / 2 + 150;
    this.nameSprite = new Text(this.name, 0, -y, 0xffffff, false, 200);
    this.nameSprite.anchor.set(0.5);
    this.nameSprite.angle = -this.angle;
    this.addChild(this.nameSprite);
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
