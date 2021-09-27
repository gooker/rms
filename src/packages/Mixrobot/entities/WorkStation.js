import * as PIXI from 'pixi.js';
import BitText from './BitText';
import * as Config from '@/config/config';
import { getTextureFromResources } from '@/utils/mapUtils';

const { WorkStationSize, CommonFunctionSize } = Config;
export default class WorkStation extends PIXI.Container {
  constructor(props) {
    super();
    this.x = props.x;
    this.y = props.y;
    this.icon = props.icon || 'work_station';
    this.name = props.name;
    this.angle = props.angle;
    this.zIndex = Config.zIndex.groundStorage;
    this.direction = props.direction;
    this.check = props.check;

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
    this.name && this.addName();

    this.employeeColor = null;
    this.showEmployee = false;

    if (props.active) {
      this.workStation.interactive = true;
      this.workStation.buttonMode = true;
      this.workStation.interactiveChildren = false;
      this.workStation.on('click', () => {
        props.check(this.showEmployee, this.employeeColor);
      });
    }
  }

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
    this.nameSprite = new BitText(this.name, 0, -this.workStation.height / 2 - 200, 0xffffff, 250);
    this.nameSprite.anchor.set(0.5);
    this.nameSprite.angle = -this.angle;
    this.addChild(this.nameSprite);
  }

  // Marker
  createEmployerMark(color) {
    this.destroySelectedBorderSprite();
    this.selectedBorderSprite = new PIXI.Sprite(PIXI.Texture.WHITE);
    this.selectedBorderSprite.width = this.workStation.width + 200;
    this.selectedBorderSprite.height = this.workStation.height + 200;
    this.selectedBorderSprite.anchor.set(0.5);
    this.selectedBorderSprite.zIndex = 1;
    this.selectedBorderSprite.alpha = 0.6;
    this.selectedBorderSprite.tint = color.replace('#', '0x');
    this.addChild(this.selectedBorderSprite);
  }

  destroySelectedBorderSprite = () => {
    if (this.selectedBorderSprite) {
      this.removeChild(this.selectedBorderSprite);
      this.selectedBorderSprite.destroy();
      this.selectedBorderSprite = null;
    }
  };

  switchMarkerShown = (isShown, color) => {
    if (isShown) {
      this.createEmployerMark(color);
    } else {
      this.destroySelectedBorderSprite();
    }
    this.showEmployee = isShown;
    this.employeeColor = isShown ? color : null;
  };
}
