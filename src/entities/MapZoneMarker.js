import * as PIXI from 'pixi.js';
import { Text } from '@/entities';
import ResizableContainer from '@/components/ResizableContainer';
import { MapSelectableSpriteType, zIndex } from '@/config/consts';

export default class MapZoneMarker extends ResizableContainer {
  constructor(props) {
    const { code, type, x, y, radius, width, height, color, text, data } = props;
    const { interactive, select, ctrlSelect, refresh } = props;
    super();
    this.x = x;
    this.y = y;
    this.code = code;
    this.type = type;
    this.data = data;
    this.color = color;
    this.text = text;
    this.radius = radius;
    this.boxType = 'Rect';
    this.select = (add) => {
      select({ id: code, type: MapSelectableSpriteType.ZONE }, add);
    };
    this.ctrlSelect = () => {
      ctrlSelect({ id: code, type: MapSelectableSpriteType.ZONE });
    };
    this.refresh = refresh;
    this.zIndex = zIndex.zoneMarker;

    this.$$container = new PIXI.Container();
    this.$$container.sortableChildren = true;
    this.createElement(width, height);
    this.create(this.$$container, this.updateZonMarker, zIndex.zoneMarker, interactive);
  }

  createElement(width, height) {
    if (['RECT', 'CIRCLE'].includes(this.type)) {
      const graphics = new PIXI.Graphics();
      graphics.beginFill(this.color);
      if (this.type === 'RECT') {
        graphics.drawRect(0, 0, width, height);
      }
      if (this.type === 'CIRCLE') {
        graphics.drawCircle(0, 0, this.radius);
      }
      graphics.endFill();
      const texture = window.PixiUtils.renderer.generateTexture(graphics);
      this.zoneArea = new PIXI.Sprite(texture);
    } else {
      const imageBaseTexture = new PIXI.BaseTexture(this.data);
      const imageTexture = new PIXI.Texture(imageBaseTexture);
      this.zoneArea = new PIXI.Sprite(imageTexture);
      this.zoneArea.width = width;
      this.zoneArea.height = height;
    }
    this.zoneArea.alpha = 0.7;
    this.zoneArea.anchor.set(0.5);
    this.zoneArea.zIndex = 1;
    this.$$container.addChild(this.zoneArea);

    // 渲染名称
    this.renderName(width, height);
  }

  renderName(width, height) {
    // 添加Label
    this.textSprite = new Text(this.text, 0, 0, '0xffffff', true, 200);
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
    const { dispatch } = window.g_app._store;
    dispatch({ type: 'editor/updateZoneMarker', payload: { code: this.code, ...data } });

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
    this.renderName(width, height);
    this.refresh();
  }
}
