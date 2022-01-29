import * as PIXI from 'pixi.js';
import ResizableContainer from '@/components/ResizableContainer';
import { zIndex } from '@/config/consts';

export default class MapZoneMarker extends ResizableContainer {
  constructor({ x, y, radius, width, height, color, refresh, type }) {
    super();
    this.x = x;
    this.y = y;
    this.type = type;
    this.color = color;
    this.radius = radius;
    this.refresh = refresh;
    this.zIndex = zIndex.zoneMarker;
    const element = this.createElement(width, height);
    this.create(element, zIndex.zoneMarker);
  }

  createElement(width, height) {
    let element = new PIXI.Graphics();
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
    element.alpha = 0.8;
    element.anchor.set(0.5);
    element.buttonMode = true;
    element.interactive = true;
    return element;
  }
}
