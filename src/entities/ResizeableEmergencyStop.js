import * as PIXI from 'pixi.js';
import Text from './Text';
import { isNull } from '@/utils/util';
import { getTextureFromResources } from '@/utils/mapUtil';
import { EStopStateColor, SelectionType, zIndex, ZoneMarkerType } from '@/config/consts';
import ResizableContainer from '@/components/ResizableContainer';

const BorderWidth = 50;
class ResizeableEmergencyStop extends ResizableContainer {
  constructor(props) {
    super();
    this.code = props.code;
    this.x = props.x;
    this.y = props.y;
    this.angle = props.angle || 0;
    this.visible = props.showEmergency;
    this.zIndex = zIndex.emergencyStop;
    this.type =
      !isNull(props.ylength) && !isNull(props.xlength)
        ? ZoneMarkerType.RECT
        : ZoneMarkerType.CIRCLE;

    // 缓存data数据
    this.$$data = { ...props };

    if (this.type === ZoneMarkerType.RECT) {
      this.x = props.x + props.xlength / 2;
      this.y = props.y + props.ylength / 2;
    } else {
      this.x = props.x;
      this.y = props.y;
    }

    // 回调事件
    this.select = (event) => {
      this.click(event, props.select);
    };
    this.refresh = props.refresh;

    // 为了支持ResizableContainer组件，需要把所有元素集中在一个元素里
    this.$$container = new PIXI.Container();
    this.$$container.sortableChildren = true;
    this.createElement();
    this.create(this.$$container, this.updateLayout, zIndex.zoneMarker, true);
  }

  click = (event, select) => {
    if (event?.data.originalEvent.ctrlKey || event?.data.originalEvent.metaKey) {
      select && select(this, SelectionType.CTRL);
    } else {
      select && select(this, SelectionType.SINGLE);
    }
  };

  updateLayout(data) {
    const { x, y, width, height } = data;
    // 判断是圆形还是矩形
    window.$$dispatch({
      type: 'editor/updateEStop',
      payload: {
        code: this.code,
        x: parseInt(x),
        y: parseInt(y),
        width: parseInt(width) - BorderWidth,
        height: parseInt(height) - BorderWidth,
      },
    });
    window.$$dispatch({ type: 'editorView/saveForceUpdate' });
    this.$$data = {
      ...this.$$data,
      xlength: parseInt(width) - BorderWidth,
      ylength: parseInt(height) - BorderWidth,
    };

    // 这里比较重要，保证急停区拖拽时候元素不变形的核心逻辑
    this.$$container.scale.set(1, 1);
    this.rerenderEStop();
  }

  rerenderEStop() {
    this.$$container.removeChild(this.eStopArea, this.eName, this.eIcon, this.eFixedIcon);
    this.eStopArea && this.eStopArea.destroy(true);
    this.eName && this.eName.destroy(true);
    this.eIcon && this.eIcon.destroy();
    this.createElement();
    this.refresh();
  }

  /**
   * 创建急停区所有元素
   */
  createElement() {
    this.eStopArea = this.$$container.addChild(this.createEStopArea());
    this.eName = this.$$container.addChild(this.createName());
    this.eIcon = this.$$container.addChild(this.createIcon());
  }

  createEStopArea() {
    const { xlength, ylength, r } = this.$$data;
    const color = EStopStateColor.inactive.color;
    const fillColor = EStopStateColor.inactive.fillColor;
    const graphics = new PIXI.Graphics();
    graphics.lineStyle(BorderWidth, color, 1);
    graphics.beginFill(fillColor);
    if (isNull(r)) {
      graphics.drawRect(0, 0, xlength, ylength);
      graphics.pivot.set(xlength / 2, ylength / 2);
    } else {
      graphics.drawCircle(0, 0, r);
    }
    graphics.endFill();
    return graphics;
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
    const sizeBase = isNull(radius) ? 2 : 4;
    if (width >= height) {
      textHeight = height / sizeBase;
      textWidth = (namTextSprite.width * textHeight) / namTextSprite.height;
    } else {
      textWidth = width / sizeBase;
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
    if (this.type === ZoneMarkerType.RECT) {
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

  switchEStopsVisible(flag) {
    this.visible = flag;
  }

  updateEStop(params) {
    this.$$data = params;

    // 先清空container内所有元素
    this.$$container.removeChildren();
    this.eName && this.eName.destroy(true);
    this.eIcon && this.eIcon.destroy();
    this.eFixedIcon && this.eFixedIcon.destroy();

    // 重新创建元素
    this.createElement();
  }
}
export default ResizeableEmergencyStop;
