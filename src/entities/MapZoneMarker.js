import * as PIXI from 'pixi.js';
import ResizableContainer from '@/components/ResizableContainer';
import { zIndex } from '@/config/consts';

export default class MapZoneMarker extends ResizableContainer {
  constructor({ code, type, x, y, radius, width, height, color, data, refresh }) {
    super();
    this.x = x;
    this.y = y;
    this.code = code;
    this.type = type;
    this.data = data;
    this.color = color;
    this.radius = radius;
    this.refresh = refresh;
    this.zIndex = zIndex.zoneMarker;
    const element = this.createElement(width, height);
    this.create(element, this.updateZonMarker, zIndex.zoneMarker);
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
    element.alpha = 0.8;
    element.anchor.set(0.5);
    return element;
  }

  updateZonMarker(data) {
    const { dispatch } = window.g_app._store;
    dispatch({ type: 'editor/updateZoneMarker', payload: { code: this.code, ...data } });
  }
}
