import * as PIXI from 'pixi.js';
import { Simple } from '@/libs/simple';
import { Viewport } from 'pixi-viewport';
import { uniq, sortBy } from 'lodash';
import { CellHeight, CellWidth, WorldScreenRatio } from '@/config/config';

export default class PixiBuilder {
  constructor(width, height) {
    this.width = width;
    this.height = height;

    // 初始化渲染器
    this.renderer = new PIXI.Renderer({
      width,
      height,
      antialias: true,
      autoResize: true,
      autoDensity: true,
      transparent: true,
      resolution: window.devicePixelRatio || 1,
      powerPreference: 'high-performance',
    });

    this.stage = new PIXI.Container();
    this.loader = new PIXI.Loader();
    this.resources = this.loader.resources;

    // 初始化 Viewport 对象
    this.viewport = new Viewport({
      top: 0,
      left: 0,
      screenWidth: width,
      screenHeight: height,
      passiveWheel: false,
      stopPropagation: true,
      divWheel: document.getElementById('pixi'),
      interaction: this.renderer.plugins.interaction,
    });
    this.viewport.fitWorld(false);
    this.viewport.sortableChildren = true;
    this.viewport.on('moved', this.refresh);

    // 初始化 Cull 对象
    this.cull = new Simple();
    this.cull.addList(this.viewport.children);
    this.cull.cull(this.viewport.getVisibleBounds());
  }

  // 激活渲染
  activeRender = () => {
    document.getElementById('pixi').appendChild(this.renderer.view);
    this.stage.addChild(this.viewport);
    this.viewport.drag().pinch().wheel().decelerate().clampZoom({ maxScale: 0.5 });
  };

  // 手动渲染函数
  reRender = () => {
    if (this.viewport.dirty) {
      this.cull.cull(this.viewport.getVisibleBounds());
      this.viewport.dirty = false;
    }
    this.renderer.render(this.viewport);
  };

  /**
   * 统一使用此方法添加元素到视窗
   * 第二个参数是为了告诉Cull当前这个Sprite位置不会变化
   * 之所以和 needCull 是一样的是因为原来的逻辑就是静止的Sprite才cull
   */
  viewportAddChild = (child, needCull = true) => {
    this.viewport.addChild(child);
    needCull && this.cull.add(child, needCull);
  };

  viewportRemoveChild = (child, needCull = true) => {
    this.viewport.removeChild(child);
    needCull && this.cull.remove(child);
  };

  viewportRemoveChildren = () => {
    this.cull.removeList(this.viewport.children);
    this.viewport.removeChildren();
  };

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.renderer.resize(width, height);
    this.viewport.resize(width, height);
    this.reRender();
  }

  centerView(cells) {
    if (cells && Object.keys(cells).length > 0) {
      // Sort all points x & y
      const uniqueXs = uniq(
        Object.keys(cells)
          .map((id) => cells[id])
          .map((cell) => cell.x),
      );
      const Xs = sortBy(uniqueXs, (x) => x);

      const uniqueYs = uniq(
        Object.keys(cells)
          .map((id) => cells[id])
          .map((cell) => cell.y),
      );
      const Ys = sortBy(uniqueYs, (y) => y);

      // Get Min and Max
      const minX = Xs[0];
      const minY = Ys[0];
      const maxX = Xs[Xs.length - 1];
      const maxY = Ys[Ys.length - 1];

      // Map elements Area
      const elementsWidth = maxX - minX + CellWidth;
      const elementsHeight = maxY - minY + CellHeight;

      const worldWidth = elementsWidth * WorldScreenRatio;
      const worldHeight = elementsHeight * WorldScreenRatio;

      this.viewport.worldWidth = worldWidth;
      this.viewport.worldHeight = worldHeight;
      this.viewport.fitWorld(false);
      this.viewport.moveCenter(minX + elementsWidth / 2, minY + elementsHeight / 2);
    }
  }

  moveTo(x, y, scaled) {
    this.viewport.moveCenter(x, y);
    if (scaled) {
      this.viewport.scaled = scaled;
    }
  }

  destroy = () => {
    this.viewportRemoveChildren();
    // PIXI.utils.destroyTextureCache();
    this.loader.reset();
    this.viewport.destroy(true);
    this.renderer.destroy();
  };
}
