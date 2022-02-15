import * as PIXI from 'pixi.js';
import ResizableContainer from '@/components/ResizableContainer';
import { MapSelectableSpriteType, zIndex } from '@/config/consts';
import { Text } from '@/entities/index';

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
    this.select = (add) => {
      select({ id: code, type: MapSelectableSpriteType.ZONE }, add);
    };
    this.ctrlSelect = () => {
      ctrlSelect({ id: code, type: MapSelectableSpriteType.ZONE });
    };
    this.refresh = refresh;
    this.zIndex = zIndex.zoneMarker;
    const element = this.createElement(width, height);
    this.create(element, this.updateZonMarker, zIndex.zoneMarker, interactive);
  }

  createElement(width, height) {
    let element;
    if (['RECT', 'CIRCLE'].includes(this.type)) {
      element = new PIXI.Graphics();
      element.beginFill(this.color);
      if (this.type === 'RECT') {
        element.drawRect(0, 0, width, height);
      }
      if (this.type === 'CIRCLE') {
        element.drawCircle(0, 0, this.radius);
      }
      element.endFill();
      const texture = window.PixiUtils.renderer.generateTexture(element);
      element = new PIXI.Sprite(texture);
    } else {
      const imageBaseTexture = new PIXI.BaseTexture(this.data);
      const imageTexture = new PIXI.Texture(imageBaseTexture);
      element = new PIXI.Sprite(imageTexture);
      element.width = width;
      element.height = height;
    }
    element.alpha = 0.7;
    element.anchor.set(0.5);
    element.zIndex = 1;

    // 添加Label
    const textSprite = new Text(this.text, 0, 0, '0xffffff', true, 200);
    let textWidth, textHeight;
    if (width >= height) {
      textHeight = height;
      textWidth = (textSprite.width * textHeight) / textSprite.height;
    } else {
      textWidth = width;
      textHeight = (textSprite.height * textWidth) / textSprite.width;
    }
    textSprite.anchor.set(0.5);
    textSprite.width = textWidth;
    textSprite.height = textHeight;
    textSprite.zIndex = 2;

    element.addChild(textSprite);
    return element;
  }

  updateZonMarker(data) {
    const { dispatch } = window.g_app._store;
    dispatch({ type: 'editor/updateZoneMarker', payload: { code: this.code, ...data } });
  }
}
