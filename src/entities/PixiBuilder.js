import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';

export default class PixiBuilder {
  constructor(width, height, htmlDOM, adaptiveCB) {
    this.width = width;
    this.height = height;
    this.adaptiveCB = adaptiveCB;
    // 渲染标记
    this.isNeedRender = true;

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
      if (typeof _this.adaptiveCB === 'function') {
        _this.adaptiveCB();
        _this.renderer.render(_this.viewport);
      }
    });

    // 配置Ticker
    this.ticker = PIXI.Ticker.shared;
    this.ticker.maxFPS = 24;
    this.ticker.add(this.tickerHandler);
  }

  tickerHandler = () => {
    if (this.isNeedRender || this.viewport.dirty) {
      this.isNeedRender = false;
      this.viewport.dirty = false;
      this.renderer.render(this.viewport);
    }
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
