import * as PIXI from 'pixi.js';
import { isNull } from '@/utils/util';
import { hasPermission } from '@/utils/Permission';
import { getTextureFromResources } from '@/utils/mapUtil';
import { zIndex } from '@/config/consts';

class EmergencyStop extends PIXI.Container {
  constructor(props) {
    super();
    this.x = props.x || 0;
    this.y = props.y || 0;
    this.zIndex = zIndex.emergencyStop;
    this.code = props.code;
    this.angle = props.angle || 0;
    this.$angle = props.angle || 0; //// 仅用于纠正名称角度
    this.activated = props.activated || false;
    this.safe = props.safe || 0;
    this.boxType = props.ylength && props.xlength ? 'Rect' : 'Circle';
    this.$visible = props.showEmergency;
    this.estopType = props.estopType;
    // Section,Logic
    if (props.estopType === 'Section' || props.estopType === 'Logic') {
      this.drawLogicOrSection(props);
    } else {
      this.drawShape(props);
      this.drawShape(props);
      this.addName(props);
      this.addIcon(props);
      isNull(props.notShowFixed) && props.isFixed && this.addFixed(props); //notShowFixed是地图编辑传的参数 地图编辑不需要显示固定icon
      isNull(props.notShowFixed) && this.interactiveModal(props); // 地图编辑不用看弹框
    }
  }

  drawLogicOrSection(props) {
    const { worldSize } = props;
    let fillColor = 0xdec674;
    if (props.isSafe) {
      fillColor = 0xf3704b;
    }
    this.fillcolor = fillColor;
    this.$worldWidth = worldSize.worldWidth;
    this.$worldHeight = worldSize.worldHeight;
    this.drawLogic(props.estopType);
  }

  drawShape(props) {
    let color = null;
    let fillColor = null;
    if (props.activated) {
      if (props.isSafe) {
        color = 0xf10d0d;
        fillColor = 0xf56161;
      } else {
        color = 0xffe600;
        fillColor = 0xdec674; //0xf9f79e';
      }
    } else {
      color = 0x999999; // 禁用灰色
      fillColor = 0x666666;
    }
    this.color = color;
    this.fillcolor = fillColor;
    let shape = 'Circle';
    if (this.boxType === 'Rect') {
      shape = 'Rect';
    }
    // 方法只会调一个 所以用一个Sprite -eStopSprite
    switch (shape) {
      case 'Rect':
        this.drawRect(props);
        break;
      case 'Circle':
        this.drawCircle(props);
        break;
      default:
        break;
    }
    return shape;
  }

  drawRect(props) {
    //安全显示红色圈儿，不安全显示黄色圈儿，禁用显示灰色
    const rectStop = new PIXI.Graphics();
    rectStop.lineStyle(70, this.color, 1);
    rectStop.beginFill(this.fillcolor);
    rectStop.drawRect(0, 0, props.xlength, props.ylength);
    rectStop.endFill();
    rectStop.pivot.x = props.xlength / 2;
    rectStop.pivot.y = props.ylength / 2;

    this.eStopSprite = rectStop;
    this.eStopSprite.visible = this.$visible;
    this.eStopSprite.alpha = 0.4;
    this.addChild(this.eStopSprite);
  }

  drawCircle(props) {
    const circle = new PIXI.Graphics();
    circle.lineStyle(70, this.color, 1);
    circle.beginFill(this.fillcolor);
    circle.drawCircle(0, 0, props.r);
    circle.endFill();
    const texture = window.PixiUtils.renderer.generateTexture(circle);
    this.eStopSprite = new PIXI.Sprite(texture);
    this.eStopSprite.visible = this.$visible;
    this.eStopSprite.alpha = 0.4;
    this.eStopSprite.anchor.set(0.5);
    this.addChild(this.eStopSprite);
  }

  addName(props) {
    let _fontsize = props.fontSize || 220;
    this.nameText = props.name
      ? props.name
      : props.group
      ? `${props.group}: ${props.code}`
      : props.code;

    const style = {
      fontFamily: 'Arial',
      fontSize: _fontsize,
      fontWeight: 'bold',
      fill: '0xffffff',
    };
    this.namText = new PIXI.Text(this.nameText, style);
    this.namText.visible = this.$visible;
    this.namText.anchor.set(0.5);
    this.namText.angle = -this.$angle;
    this.addChild(this.namText);
  }

  addFixed(props) {
    let _x = null;
    let _y = null;
    if (this.boxType === 'Rect') {
      _x = 0 + props.xlength / 2 - 300;
      _y = 0 + props.ylength / 2 - 680;
    } else {
      _x = 0 + props.r - 300;
      _y = 0 - props.r / 4;
    }
    const Fixedtexture = getTextureFromResources('emergencyStopFixed');
    this.fixedPoint = new PIXI.Sprite(Fixedtexture);
    this.fixedPoint.x = _x;
    this.fixedPoint.y = _y;
    this.fixedPoint.angle = -this.$angle;
    this.fixedPoint.visible = this.$visible;
    this.fixedPoint.anchor.set(0.5);
    this.addChild(this.fixedPoint);
  }

  addIcon(props) {
    let _x = null;
    let _y = null;
    if (this.boxType === 'Rect') {
      _x = 0 + props.xlength / 2 - 300;
      _y = 0 + props.ylength / 2 - 300;
    } else {
      _x = 0 + props.r - 300;
      _y = 0;
    }
    const Fixedtexture = getTextureFromResources('barrier');
    this.barrierIcon = new PIXI.Sprite(Fixedtexture);
    this.barrierIcon.x = _x;
    this.barrierIcon.y = _y;
    this.barrierIcon.angle = -this.$angle;
    this.barrierIcon.visible = this.$visible;
    this.barrierIcon.anchor.set(0.5);
    this.addChild(this.barrierIcon);
  }

  interactiveModal(props) {
    if (hasPermission('/map/monitor/action/set/emergencyArea')) {
      this.eStopSprite.interactive = true;
      this.eStopSprite.buttonMode = true;
      this.eStopSprite.interactiveChildren = false;
      this.eStopSprite.on('click', () => props.checkEStopArea(props));
    }
  }

  switchEstopsShown(flag) {
    this.children.forEach((child) => {
      child.visible = flag;
    });
  }

  drawLogic(type) {
    this[`logicSprite${type}`] = new PIXI.Sprite(PIXI.Texture.WHITE);
    this[`logicSprite${type}`].width = this.$worldWidth;
    this[`logicSprite${type}`].height = this.$worldHeight;
    this[`logicSprite${type}`].x = -400;
    this[`logicSprite${type}`].y = -400;
    this[`logicSprite${type}`].tint = this.fillcolor.replace('#', '0x');
    this[`logicSprite${type}`].alpha = 0.4;
    this[`logicSprite${type}`].anchor.set(0);
    this.addChild(this[`logicSprite${type}`]);
  }

  updateEstop(params) {
    if (params.estopType === 'Section' || params.estopType === 'Logic') {
      this.drawLogicOrSection(params);
    } else {
      this.removeChild(this.namText);
      if (this.eStopSprite) {
        this.removeChild(this.eStopSprite);
      }

      this.drawShape(params);
      this.interactiveModal(params);

      this.addName(params);
      if (this.fixedPoint) {
        this.removeChild(this.fixedPoint);
        this.addFixed(params);
      }
      if (this.barrierIcon) {
        this.removeChild(this.barrierIcon);
        this.addIcon(params);
      }
    }
  }
}
export default EmergencyStop;
