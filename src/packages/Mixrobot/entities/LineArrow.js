/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import * as PIXI from 'pixi.js';
import { zIndex, CostColor, SpotSize } from '@/config/consts';
import { BitText } from '@/packages/Mixrobot/entities';
import { covertAngle2Direction } from '@/utils/utils';

export default class LineArrow extends PIXI.Container {
  constructor(props) {
    super();
    this.id = props.id;
    this.x = props.fromX;
    this.y = props.fromY;
    this.angle = props.lineAngle;
    this.$interactive = props.interactive;
    this.type = 'line';
    this.isClassic = props.isClassic;
    this.zIndex = this.isClassic ? zIndex.line : 100;
    this.distance = props.distance;
    this.selectLine = props.click;
    this.cost = props.cost;
    this.$angle = props.lineAngle;
    this.dir = covertAngle2Direction(props.lineAngle);
    this.states = {
      selected: false,
      arrow: true,
      distance: false,
    };
    this.additionalFlag = new Map();
    this.createArrow();
  }

  createArrow = () => {
    const distanceInt = parseInt(this.distance, 10) - SpotSize.width;
    const texture = this.switchArrowTexture();
    if (!texture) return;
    this.arrow = new PIXI.Sprite(texture);
    this.arrow.anchor.set(0.5, 1);
    this.arrow.scale.y = distanceInt / 1125;
    this.arrow.buttonMode = this.$interactive;
    this.arrow.interactive = this.$interactive;
    this.arrow.on('click', this.click);
    this.addChild(this.arrow);

    // 距离文本
    let distanceAngle;
    const textFontSize = 70;
    const xOffset = 40;
    if (this.angle > 0 && this.angle < 180) {
      distanceAngle = -90;
    } else {
      distanceAngle = 90;
    }
    this.distanceText = new BitText(
      parseInt(this.distance, 10),
      xOffset,
      -distanceInt * 0.5,
      CostColor[this.cost],
      textFontSize,
    );
    this.distanceText.anchor = 0.5;
    this.distanceText.angle = distanceAngle;
    this.addChild(this.distanceText);

    // 线条选中背景色
    this.selectedBorderSprite = new PIXI.Sprite(PIXI.utils.TextureCache.cellSelectBorderTexture);
    this.selectedBorderSprite.anchor.set(0, 1);
    this.selectedBorderSprite.x = -this.width / 2;
    this.selectedBorderSprite.alpha = 0.7;
    this.selectedBorderSprite.height = this.height;
    this.selectedBorderSprite.width = this.width;
    this.selectedBorderSprite.visible = false;
    this.addChild(this.selectedBorderSprite);
  };

  switchArrowTexture = () => {
    let texture;
    switch (this.cost) {
      case 10:
        texture = PIXI.utils.TextureCache._10CostArrow;
        break;
      case 20:
        texture = PIXI.utils.TextureCache._20CostArrow;
        break;
      case 100:
        texture = PIXI.utils.TextureCache._100CostArrow;
        break;
      case 1000:
        texture = PIXI.utils.TextureCache._1000CostArrow;
        break;
      default:
        break;
    }
    return texture;
  };

  click = () => {
    if (this.states.selected) {
      this.unSelect();
      this.selectLine && this.selectLine(this.id, false);
    } else {
      this.select();
      this.selectLine && this.selectLine(this.id);
    }
  };

  select = () => {
    if (!this.states.selected) {
      this.states.selected = true;
      this.selectedBorderSprite.visible = true;
    }
  };

  unSelect = () => {
    if (this.states.selected) {
      this.states.selected = false;
      this.selectedBorderSprite.visible = false;
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
    const distanceInt = parseInt(this.distance, 10) - SpotSize.width;
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
