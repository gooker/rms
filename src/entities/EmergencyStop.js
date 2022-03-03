import * as PIXI from 'pixi.js';
import Text from './Text';
import { isNull } from '@/utils/util';
import { hasPermission } from '@/utils/Permission';
import { getTextureFromResources } from '@/utils/mapUtil';
import { EStopStateColor, MapSelectableSpriteType, zIndex } from '@/config/consts';
import ResizableContainer from '@/components/ResizableContainer';
import { SmoothGraphics } from '@pixi/graphics-smooth';

const BorderWidth = 50;
class EmergencyStop extends ResizableContainer {
  constructor(props) {
    super();
    this.x = props.x;
    this.y = props.y;
    this.zIndex = zIndex.emergencyStop;
    this.angle = props.angle || 0;
    this.visible = props.showEmergency;
    this.code = props.code;
    this.boxType = props.ylength && props.xlength ? 'Rect' : 'Circle';

    // 缓存data数据
    this.$$data = { ...props };

    if (this.boxType === 'Rect') {
      this.x = props.x + props.xlength / 2;
      this.y = props.y + props.ylength / 2;
    } else {
      this.x = props.x;
      this.y = props.y;
    }

    // 回调事件
    this.select = (add) => {
      props.select({ id: this.code, type: MapSelectableSpriteType.EMERGENCYSTOP }, add);
    };
    this.refresh = props.refresh;

    if (['Section', 'Logic'].includes(props.estopType)) {
      this.drawLogicOrSection(props);
    } else {
      // 为了支持ResizableContainer组件，需要把所有元素集中在一个元素里
      this.$$container = new PIXI.Container();
      this.$$container.sortableChildren = true;
      this.createElement();
      this.create(this.$$container, this.updateLayout, zIndex.zoneMarker, true);
    }
  }

  updateLayout(data) {
    const { dispatch } = window.g_app._store;
    const { x, y, width, height } = data;
    dispatch({
      type: 'editor/updateEStop',
      payload: {
        code: this.code,
        x: parseInt(x),
        y: parseInt(y),
        width: parseInt(width),
        height: parseInt(height),
      },
    });
    dispatch({ type: 'editor/saveForceUpdate' });
    this.$$data = {
      ...this.$$data,
      xlength: parseInt(width) - BorderWidth,
      ylength: parseInt(height) - BorderWidth,
    };

    // 这里比较重要，保证急停区拖拽时候元素不变形的核心逻辑
    this.$$container.scale.set(1, 1);
    this.eStopArea.width = this.$$data.xlength;
    this.eStopArea.height = this.$$data.ylength;
    this.rerenderEStop();
  }

  // Resize过程中会出现 border, name, icon, fixedIcon 变形
  rerenderEStop() {
    this.$$container.removeChild(this.eBorder, this.eName, this.eIcon, this.eFixedIcon);
    this.eBorder && this.eBorder.destroy(true);
    this.eName && this.eName.destroy(true);
    this.eIcon && this.eIcon.destroy();
    this.eFixedIcon && this.eFixedIcon.destroy();
    this.createElement(false);
    this.refresh();
  }

  /**
   * 创建急停区所有元素
   * @param needEStopArea 是否创建区域对象(border内的部分)
   */
  createElement(needEStopArea = true) {
    const { eStopArea, color } = this.createEStopArea(needEStopArea);
    if (needEStopArea) {
      this.eStopArea = this.$$container.addChild(eStopArea);
    }
    this.eBorder = this.$$container.addChild(this.createBorder(color));
    this.eName = this.$$container.addChild(this.createName());
    this.eIcon = this.$$container.addChild(this.createIcon());

    // notShowFixed是地图编辑传的参数 地图编辑不需要显示固定icon
    if (isNull(this.$$data.notShowFixed) && this.$$data.isFixed) {
      this.eFixedIcon = this.$$container.addChild(this.createFixedIcon());
    }

    // 地图编辑不用看弹框
    if (isNull(this.$$data.notShowFixed)) {
      this.interactiveModal();
    }
  }

  // 安全显示红色，不安全显示黄色，禁用显示灰色
  createEStopArea(needEStopArea) {
    const { activated, isSafe } = this.$$data;
    let texture;
    let color, fillColor;
    if (activated) {
      if (isSafe) {
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

    let eStopArea;
    if (needEStopArea) {
      let width = this.$$data.xlength;
      let height = this.$$data.ylength;
      let radius = this.$$data.r;
      if (this.boxType === 'Rect') {
        eStopArea = new PIXI.Sprite(texture);
        eStopArea.width = width;
        eStopArea.height = height;
        eStopArea.anchor.set(0.5);
      } else {
        eStopArea = new SmoothGraphics();
        eStopArea.lineStyle(0);
        eStopArea.beginFill(fillColor);
        eStopArea.drawCircle(0, 0, radius);
        eStopArea.endFill();
      }
      eStopArea.alpha = 0.5;
      eStopArea.zIndex = 1;
    }
    return { eStopArea, color, fillColor };
  }

  createBorder(color) {
    const width = this.$$data.xlength;
    const height = this.$$data.ylength;
    const radius = this.$$data.r;
    const line = new SmoothGraphics();
    if (isNull(radius)) {
      line.lineStyle(BorderWidth, color).drawRect(0 - width / 2, 0 - height / 2, width, height);
    } else {
      line.lineStyle(BorderWidth, color).drawCircle(0, 0, radius);
    }
    line.alpha = 0.8;
    line.zIndex = 1;
    return line;
  }

  createName() {
    const { name, code, group } = this.$$data;
    let { xlength: width, ylength: height, r: radius } = this.$$data;

    const nameText = name ? name : group ? `${group}: ${code}` : code;
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

  createIcon() {
    const { xlength, ylength, r: radius } = this.$$data;
    let _x, _y;
    if (this.boxType === 'Rect') {
      _x = xlength / 2 - 300;
      _y = ylength / 2 - 300;
    } else {
      _x = 0;
      _y = radius - 300;
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

  createFixedIcon() {
    const { xlength, ylength, r: radius } = this.$$data;
    let _x, _y;
    if (this.boxType === 'Rect') {
      _x = xlength - 300;
      _y = ylength - 680;
    } else {
      _x = radius * 2 - 300;
      _y = radius;
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
    // @@@@权限key调整
    if (hasPermission('/map/monitor/action/set/emergencyArea')) {
      this.$$container.interactive = true;
      this.$$container.buttonMode = true;
      this.$$container.interactiveChildren = false;
      this.$$container.on('click', () => this.$$data.checkEStopArea(this.$$data));
    }
  }

  switchEStopsVisible(flag) {
    this.visible = flag;
  }

  updateEStop(params) {
    this.$$data = params;
    if (['Section', 'Logic'].includes(params.estopType)) {
      this.drawLogicOrSection(params);
    } else {
      // 先清空container内所有元素
      this.$$container.removeChildren();
      this.eBorder && this.eBorder.destroy(true);
      this.eName && this.eName.destroy(true);
      this.eIcon && this.eIcon.destroy();
      this.eFixedIcon && this.eFixedIcon.destroy();

      // 重新创建元素
      this.createElement();
    }
  }
}
export default EmergencyStop;
