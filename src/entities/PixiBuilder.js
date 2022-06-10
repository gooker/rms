import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { Simple } from 'pixi-cull';

export default class PixiBuilder {
  constructor(width, height, htmlDOM, adaptiveCB) {
    this.width = width;
    this.height = height;
    this.adaptiveCB = adaptiveCB;

    // 初始化渲染器
    this.renderer = new PIXI.Renderer({
      width,
      height,
      antialias: true, //抗锯齿
      autoDensity: true,
      backgroundAlpha: 0,
      resolution: window.devicePixelRatio || 1.0,
      powerPreference: 'high-performance',
    });
    htmlDOM.appendChild(this.renderer.view);

    // 创建视窗组件
    this.viewport = new Viewport({
      screenWidth: width,
      screenHeight: height,
      passiveWheel: false, // Event passive
      stopPropagation: true,
      divWheel: htmlDOM,
      interaction: this.renderer.plugins.interaction,
    });
    this.viewport.sortableChildren = true;
    this.viewport.drag().pinch().wheel().decelerate();

    const _this = this;
    this.viewport.on('zoomed-end', function () {
      if (this.scale.x <= 0.4) {
        _this.adaptiveCB();
      } else {
        _this.resetZoom();
      }
      _this.renderer.render(_this.viewport);
    });

    // 创建cull组件
    this.cull = new Simple();
    this.cull.addList(this.viewport.children);
    this.cull.cull(this.viewport.getVisibleBounds());

    // 渲染标记
    this.isNeedRender = true;
    this.ticker = PIXI.Ticker.shared;
    this.ticker.maxFPS = 24;
    this.ticker.add(this.tickerHandler);
  }

  tickerHandler = () => {
    if (this.isNeedRender || this.viewport.dirty) {
      if (this.viewport.dirty) {
        this.cull.cull(this.viewport.getVisibleBounds());
      }
      this.isNeedRender = false;
      this.viewport.dirty = false;
      this.renderer.render(this.viewport);
    }
  };

  resetZoom = () => {
    const { children } = this.viewport;
    children.forEach((child) => {
      child.scale.set(1, 1);
    });
  };

  // 手动触发渲染，只更改渲染标记
  callRender = () => {
    this.isNeedRender = true;
  };

  viewportAddChild = (child) => {
    this.viewport.addChild(child);
  };

  viewportRemoveChild = (child) => {
    this.viewport.removeChild(child);
  };

  viewportRemoveChildren = () => {
    this.viewport.removeChildren();
  };
}
