import * as PIXI from 'pixi.js';
import { Simple } from '@/libs/simple';
import { Viewport } from 'pixi-viewport';

export default class PixiBuilder {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.loader = new PIXI.Loader();
    this.resources = this.loader.resources;

    // 初始化渲染器
    this.renderer = new PIXI.Renderer({
      width,
      height,
      antialias: true,
      autoResize: true,
      transparent: true,
      autoDensity: true,
      resolution: window.devicePixelRatio,
      powerPreference: 'high-performance',
    });
    document.getElementById('pixi').appendChild(this.renderer.view);

    // 创建视窗组件
    this.viewport = new Viewport({
      screenWidth: width,
      screenHeight: height,
      passiveWheel: false, // Event passive
      stopPropagation: true,
      divWheel: document.getElementById('pixi'),
      interaction: this.renderer.plugins.interaction,
    });
    this.viewport.drag().pinch().wheel().decelerate().clampZoom({ minScale: 0.001, maxScale: 0.5 });
    this.viewport.fitWorld(false);
    this.viewport.sortableChildren = true;

    // 创建cull组件
    this.cull = new Simple();
    this.cull.addList(this.viewport.children);
    this.cull.cull(this.viewport.getVisibleBounds());

    // 渲染标记
    this.isNeedRender = true;
    this.ticker = PIXI.Ticker.shared;
    this.ticker.maxFPS = 10;
    this.ticker.add(() => {
      if (this.isNeedRender || this.viewport.dirty) {
        if (this.viewport.dirty) {
          // TODO: viewport.x viewport.y  防止越界
          // 重新计算cull边界
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

  /**
   * 统一使用此方法添加元素到视窗，对添加的元素做是否显示判断
   * @param {*} child 目标Sprite
   */
  viewportAddChild = (child) => {
    this.viewport.addChild(child);
  };

  viewportRemoveChild = (child) => {
    this.viewport.removeChild(child);
  };

  viewportRemoveChildren = () => {
    this.viewport.removeChildren();
  };

  destroy = () => {
    PIXI.utils.destroyTextureCache();
    this.loader.reset();
    this.cull.removeList(this.viewport.children);
    this.viewport.removeChildren();
    this.viewport.destroy(true);
    this.renderer.destroy();
  };
}
