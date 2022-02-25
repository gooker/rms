import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { Simple } from 'pixi-cull';
// import Simple from '@/libs/SimpleCull';

export default class PixiBuilder {
  constructor(width, height, htmlDOM) {
    this.width = width;
    this.height = height;

    // 初始化渲染器
    this.renderer = new PIXI.Renderer({
      width,
      height,
      antialias: true,
      autoDensity: true,
      backgroundAlpha: 0,
      resolution: window.devicePixelRatio,
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

    // 创建cull组件
    this.cull = new Simple();
    this.cull.addList(this.viewport.children);
    this.cull.cull(this.viewport.getVisibleBounds());

    // 渲染标记
    this.isNeedRender = true;
    this.ticker = PIXI.Ticker.shared;
    this.ticker.maxFPS = 20;
    this.ticker.add(() => {
      if (this.isNeedRender || this.viewport.dirty) {
        if (this.viewport.dirty) {
          this.cull.cull(this.viewport.getVisibleBounds());
        }
        this.isNeedRender = false;
        this.viewport.dirty = false;
        this.renderer.render(this.viewport);
      }
    });
  }

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
