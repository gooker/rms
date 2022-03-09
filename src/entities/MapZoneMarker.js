import * as PIXI from 'pixi.js';
import { Text } from '@/entities';
import { SelectionType, zIndex, ZoneMarkerType } from '@/config/consts';
import ResizableContainer from '@/components/ResizableContainer';
import { isStrictNull } from '@/utils/util';

export default class MapZoneMarker extends ResizableContainer {
  constructor(props) {
    const { code, type, x, y, radius, width, height, color, text, data } = props;
    const { interactive, select, refresh } = props;
    super();
    this.x = x;
    this.y = y;
    this.code = code;
    this.type = type;
    this.data = data;
    this.color = color;
    this.text = text;
    this.radius = radius;
    this.select = (event) => {
      this.click(event, select);
    };
    this.refresh = refresh;
    this.zIndex = zIndex.zoneMarker;

    this.$$container = new PIXI.Container();
    this.$$container.sortableChildren = true;
    this.createElement(width, height);
    this.create(this.$$container, this.updateZonMarker, zIndex.zoneMarker, interactive);
  }

  click = (event, select) => {
    if (event?.data.originalEvent.ctrlKey || event?.data.originalEvent.metaKey) {
      select && select(this, SelectionType.CTRL);
    } else {
      select && select(this, SelectionType.SINGLE);
    }
  };

  createElement(width, height) {
    if ([ZoneMarkerType.RECT, ZoneMarkerType.CIRCLE].includes(this.type)) {
      const graphics = new PIXI.Graphics();
      graphics.lineStyle(0);
      graphics.beginFill(this.color);
      if (this.type === ZoneMarkerType.RECT) {
        graphics.drawRect(0, 0, width, height);
        graphics.pivot = { x: width / 2, y: height / 2 };
      }
      if (this.type === ZoneMarkerType.CIRCLE) {
        graphics.drawCircle(0, 0, this.radius);
      }
      graphics.endFill();
      this.zoneArea = graphics;
    } else {
      const imageBaseTexture = new PIXI.BaseTexture(this.data);
      const imageTexture = new PIXI.Texture(imageBaseTexture);
      this.zoneArea = new PIXI.Sprite(imageTexture);
      this.zoneArea.width = width;
      this.zoneArea.height = height;
      this.zoneArea.anchor.set(0.5);
    }
    this.zoneArea.alpha = 0.7;
    this.zoneArea.zIndex = 1;
    this.$$container.addChild(this.zoneArea);

    // 渲染名称
    if (this.type === ZoneMarkerType.CIRCLE) {
      this.renderName(this.radius * 0.5, this.radius * 0.5);
    } else {
      this.renderName(width * 0.5, height * 0.5);
    }
  }

  renderName(width, height) {
    if (isStrictNull(this.text)) return;
    this.textSprite = new Text(this.text, 0, 0, 0xffffff, true, 200);
    let textWidth, textHeight;
    if (width >= height) {
      textHeight = height;
      textWidth = (this.textSprite.width * textHeight) / this.textSprite.height;
    } else {
      textWidth = width;
      textHeight = (this.textSprite.height * textWidth) / this.textSprite.width;
    }
    this.textSprite.anchor.set(0.5);
    this.textSprite.width = textWidth;
    this.textSprite.height = textHeight;
    this.textSprite.zIndex = 2;
    this.$$container.addChild(this.textSprite);
  }

  updateZonMarker(data) {
    window.$$dispatch({ type: 'editor/updateZoneMarker', payload: { code: this.code, ...data } });

    // 这里比较重要，保证急停区拖拽时候元素不变形的核心逻辑
    this.$$container.scale.set(1, 1);
    const width = parseInt(data.width);
    const height = parseInt(data.height);
    this.zoneArea.width = width;
    this.zoneArea.height = height;

    if (this.textSprite) {
      this.$$container.removeChild(this.textSprite);
      this.textSprite.destroy(true);
    }
    // 渲染名称
    if (this.type === ZoneMarkerType.CIRCLE) {
      this.renderName(width * 0.6, width * 0.6);
    } else {
      this.renderName(width, height);
    }
    this.refresh();
  }
}
