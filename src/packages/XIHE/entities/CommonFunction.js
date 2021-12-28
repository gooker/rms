import * as PIXI from 'pixi.js';
import BitText from './BitText';
import { getTextureFromResources } from '@/utils/mapUtils';
import { CommonFunctionSize, zIndex } from '@/config/consts';
export default class CommonFunction extends PIXI.Container {
  constructor(props) {
    super();
    this.x = props.x;
    this.y = props.y;
    this.name = props.name;
    this.angle = props.iconAngle || 0;
    this.zIndex = zIndex.groundStorage;
    this.$angle = props.angle || 0; // 仅用于纠正名称角度
    this.icon = props.icon || 'common';
    this.iconSize = props.size || `${CommonFunctionSize.width}@${CommonFunctionSize.height}`;

    // 尺寸转换(向前兼容)
    const [iconWidth, iconHeight] = this.iconSize.split('@').map((value) => parseInt(value, 10));
    this.iconWidth = iconWidth;
    this.iconHeight = iconHeight;

    this.create();
    this.name && this.addName();
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
    this.nameSprite = new BitText(this.name, 0, -y, 0xffffff, 250);
    this.nameSprite.anchor.set(0.5);
    this.nameSprite.angle = -this.$angle;
    this.addChild(this.nameSprite);
  }
}
