import * as PIXI from 'pixi.js';
import Text from './Text';
import { isNull } from '@/utils/util';
import { hasPermission } from '@/utils/Permission';
import { EStopStateColor, MapSelectableSpriteType, zIndex } from '@/config/consts';
import { getTextureFromResources } from '@/utils/mapUtil';
import ResizableContainer from '@/components/ResizableContainer';

class EmergencyStop extends ResizableContainer {
  constructor(props) {
    super();
    this.x = props.x;
    this.y = props.y;
    this.zIndex = zIndex.emergencyStop;
    this.angle = props.angle || 0;
    this.visible = props.showEmergency;
    this.code = props.code;
    this.activated = props.activated || false;
    this.safe = props.safe || 0;
    this.boxType = props.ylength && props.xlength ? 'Rect' : 'Circle';

    if (this.boxType === 'Rect') {
      this.x = props.x + props.xlength / 2;
      this.y = props.y + props.ylength / 2;
    } else {
      this.x = props.x;
      this.y = props.y;
    }

    this.select = (add) => {
      props.select({ id: this.code, type: MapSelectableSpriteType.EMSTOP }, add);
    };
    this.refresh = props.refresh;

    if (props.estopType === 'Section' || props.estopType === 'Logic') {
      this.drawLogicOrSection(props);
    } else {
      const element = this.createElement(props);
      this.create(
        element,
        (data) => {
          const { dispatch } = window.g_app._store;
          dispatch({ type: 'editor/updateEStop', payload: { code: this.code, ...data } });
        },
        zIndex.zoneMarker,
        true,
      );
    }
  }

  createElement(props) {
    const container = new PIXI.Container();
    container.sortableChildren = true;
    const { eStopArea, color, width, height, radius } = this.createEStopArea(props);
    container.addChild(eStopArea);
    container.addChild(this.createBorder(width, height, radius, color));
    container.addChild(this.createName(props));
    container.addChild(this.createIcon(props));

    // notShowFixed是地图编辑传的参数 地图编辑不需要显示固定icon
    if (isNull(props.notShowFixed) && props.isFixed) {
      container.addChild(this.createFixedIcon(props));
    }

    // 地图编辑不用看弹框
    if (isNull(props.notShowFixed)) {
      this.interactiveModal(props);
    }

    return container;
  }

  // 安全显示红色，不安全显示黄色，禁用显示灰色
  createEStopArea(props) {
    let texture;
    let color, fillColor;
    if (props.activated) {
      if (props.isSafe) {
        color = EStopStateColor.active.safe.color;
        fillColor = EStopStateColor.active.safe.fillColor;
        if (this.boxType === 'Rect') {
          texture = getTextureFromResources('_EStopActiveSafe');
        } else {
          texture = getTextureFromResources('_EStopCircleActiveSafe');
        }
      } else {
        color = EStopStateColor.active.unSafe.color;
        fillColor = EStopStateColor.active.unSafe.fillColor;
        if (this.boxType === 'Rect') {
          texture = getTextureFromResources('_EStopActiveUnsafe');
        } else {
          texture = getTextureFromResources('_EStopCircleActiveUnsafe');
        }
      }
    } else {
      color = EStopStateColor.inactive.color;
      fillColor = EStopStateColor.inactive.fillColor;
      if (this.boxType === 'Rect') {
        texture = getTextureFromResources('_EStopInactive');
      } else {
        texture = getTextureFromResources('_EStopCircleInactive');
      }
    }

    let width = props.xlength;
    let height = props.ylength;
    let radius = props.r;
    let eStopArea;
    if (this.boxType === 'Rect') {
      eStopArea = new PIXI.Sprite(texture);
      eStopArea.width = width;
      eStopArea.height = height;
      eStopArea.anchor.set(0.5);
    } else {
      eStopArea = new PIXI.Graphics();
      eStopArea.lineStyle(0);
      eStopArea.beginFill(fillColor);
      eStopArea.drawCircle(0, 0, radius);
      eStopArea.endFill();
    }
    eStopArea.alpha = 0.5;
    eStopArea.zIndex = 1;
    return { eStopArea, color, fillColor, width, height, radius };
  }

  createBorder(width, height, radius, color) {
    const line = new PIXI.Graphics();
    if (isNull(radius)) {
      line.lineStyle(50, color).drawRect(0 - width / 2, 0 - height / 2, width, height);
    } else {
      line.lineStyle(50, color).drawCircle(0, 0, radius);
    }
    line.alpha = 0.8;
    line.zIndex = 1;
    return line;
  }

  createName(props) {
    const nameText = props.name
      ? props.name
      : props.group
      ? `${props.group}: ${props.code}`
      : props.code;

    let { xlength: width, ylength: height, r: radius } = props;
    if (isNull(width) || isNull(height)) {
      width = radius * 2;
      height = radius * 2;
    }

    const namTextSprite = new Text(nameText, 0, 0, 0xffffff, true, 200);
    namTextSprite.alpha = 0.8;
    namTextSprite.anchor.set(0.5);
    namTextSprite.angle = -this.angle;

    // 字体大小自适应急停区大小
    let textWidth, textHeight;
    if (width >= height) {
      textHeight = height / 2;
      textWidth = (namTextSprite.width * textHeight) / namTextSprite.height;
    } else {
      textWidth = width / 2;
      textHeight = (namTextSprite.height * textWidth) / namTextSprite.width;
    }
    namTextSprite.width = textWidth;
    namTextSprite.height = textHeight;
    namTextSprite.zIndex = 2;
    return namTextSprite;
  }

  createIcon(props) {
    let _x, _y;
    if (this.boxType === 'Rect') {
      _x = props.xlength / 2 - 300;
      _y = props.ylength / 2 - 300;
    } else {
      _x = 0;
      _y = props.r - 300;
    }
    const fixedTexture = getTextureFromResources('barrier');
    const barrierIcon = new PIXI.Sprite(fixedTexture);
    barrierIcon.x = _x;
    barrierIcon.y = _y;
    barrierIcon.zIndex = 2;
    barrierIcon.angle = -this.angle;
    barrierIcon.anchor.set(0.5);
    return barrierIcon;
  }

  createFixedIcon(props) {
    let _x, _y;
    if (this.boxType === 'Rect') {
      _x = props.xlength - 300;
      _y = props.ylength - 680;
    } else {
      _x = props.r * 2 - 300;
      _y = props.r;
    }
    const fixedTexture = getTextureFromResources('emergencyStopFixed');
    const fixedIcon = new PIXI.Sprite(fixedTexture);
    fixedIcon.x = _x;
    fixedIcon.y = _y;
    fixedIcon.zIndex = 2;
    fixedIcon.angle = -this.angle;
    fixedIcon.anchor.set(0.5);
    return fixedIcon;
  }

  drawLogic(type) {
    this[`logicSprite${type}`] = new PIXI.Sprite(PIXI.Texture.WHITE);
    this[`logicSprite${type}`].width = this.$worldWidth;
    this[`logicSprite${type}`].height = this.$worldHeight;
    this[`logicSprite${type}`].x = -400;
    this[`logicSprite${type}`].y = -400;
    this[`logicSprite${type}`].tint = this.fillColor;
    this[`logicSprite${type}`].alpha = 0.4;
    this[`logicSprite${type}`].anchor.set(0);
    this.addChild(this[`logicSprite${type}`]);
  }

  drawLogicOrSection(props) {
    const { worldSize } = props;
    let fillColor = 0xdec674;
    if (props.isSafe) {
      fillColor = 0xf3704b;
    }
    this.fillColor = fillColor;
    this.$worldWidth = worldSize.worldWidth;
    this.$worldHeight = worldSize.worldHeight;
    this.drawLogic(props.estopType);
  }

  interactiveModal(props) {
    if (hasPermission('/map/monitor/action/set/emergencyArea')) {
      this.eStopSprite.interactive = true;
      this.eStopSprite.buttonMode = true;
      this.eStopSprite.interactiveChildren = false;
      this.eStopSprite.on('click', () => props.checkEStopArea(props));
    }
  }

  switchEStopsVisible(flag) {
    this.children.forEach((child) => {
      child.visible = flag;
    });
  }

  updateEStop(params) {
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
