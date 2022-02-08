import * as PIXI from 'pixi.js';
import { isNull } from '@/utils/util';
import { LeftCategory } from '@/packages/XIHE/MapEditor/enums';
import { getTextureFromResources } from '@/utils/mapUtil';
import { Text } from '@/entities';

const Tiny_Rotate_Offset = 120;

function calcAngleRadians(x, y) {
  return Math.atan2(y, x);
}

export default class ResizableContainer extends PIXI.Container {
  constructor() {
    super();
    this.sortableChildren = true;

    // 边框线条宽度
    this.borderWidth = 10;
    // 边框线条颜色
    this.borderColor = 0xffffff;
    // 控制点尺寸
    this.handlerSize = 70;
    // 控制点颜色
    this.handlerColor = 0xffffff;

    // 元素
    this.border = null;
    this.hScaleHandler = null;
    this.vScaleHandler = null;
    this.scaleHandler = null;
    this.rotateHandler = null;

    // 标记
    this.toolShown = false;
    this.aDragging = false; // 角拖拽
    this.hDragging = false; // 横向拖拽
    this.vDragging = false; // 纵向拖拽
    this.rDragging = false; // 旋转拖拽
    this.mDragging = false; // 移动
  }

  create(element, updater, zIndex) {
    this.$zIndex = zIndex;
    this.$updater = updater;
    this.element = this.addChild(element);
    this.element.buttonMode = true;
    this.element.interactive = true;
    this.element
      .on('pointerdown', this.onElementPointerDown)
      .on('pointermove', this.onElementMove)
      .on('pointerup', this.onElementPointerUp)
      .on('pointerupoutside', this.onElementPointerUp);
    this.initResizeTool();
  }

  /**
   * 元素移动事件
   * 注意点:
   * 1. 支持直接将Label添加到区域标记上
   * 2. Label依然要支持点击
   */
  onElementPointerDown = (event) => {
    const target = event.target;
    const leftActiveCategory = window.g_app._store.getState().editor.leftActiveCategory;
    if (leftActiveCategory !== LeftCategory.Font || target instanceof Text) {
      this.data = event.data;
      this.toolShown = true;
      this.mDragging = true;
      this.element.cursor = 'move';
    }
  };

  onElementMove = () => {
    if (this.mDragging) {
      const newPosition = this.data.getLocalPosition(this.parent);
      this.x = newPosition.x;
      this.y = newPosition.y;
      this.updateElement();
    }
  };

  onElementPointerUp = () => {
    this.data = null;
    this.mDragging = false;
    this.switchResizeToolShown(this.toolShown);
    // this.$updater({ x: this.x, y: this.y });
  };

  createHandler(cursor) {
    const handle = new PIXI.Graphics();
    handle.lineStyle(this.borderWidth, this.handlerColor).beginFill(this.handlerColor);
    handle.pivot.set(this.handlerSize / 2, this.handlerSize / 2);
    handle.interactive = true;
    handle.zIndex = 2;
    this.addToolTip(handle, cursor);
    return handle;
  }

  createTinyHandler(texture, cursor) {
    const handler = new PIXI.Sprite(getTextureFromResources(texture));
    handler.width = this.handlerSize * 2;
    handler.height = this.handlerSize * 2;
    handler.interactive = true;
    handler.anchor.set(0.5);
    handler.zIndex = 2;
    this.addToolTip(handler, cursor);
    return handler;
  }

  updateElement = () => {
    // TODO: could do others update
    this.refresh();
  };

  switchResizeToolShown(visible) {
    this.zIndex = visible ? 100 : this.$zIndex;

    if (this.border) {
      this.border.visible = visible;
    }

    if (this.hScaleHandler) {
      this.hScaleHandler.visible = visible;
    }

    if (this.vScaleHandler) {
      this.vScaleHandler.visible = visible;
    }

    if (this.scaleHandler) {
      this.scaleHandler.visible = visible;
    }

    if (this.rotateHandler) {
      this.rotateHandler.visible = visible;
    }

    this.updateElement();
  }

  addToolTip(shape, cursor) {
    shape.on('pointerover', () => {
      this.setCursor(cursor);
    });
    shape.on('pointerout', () => {
      this.setCursor('default');
    });
  }

  setCursor(cursor) {
    const cursors = ['e-resize', 'se-resize', 's-resize', 'all-scroll', 'grabbing'];
    const editorPixiContainer = document.getElementById('editorPixiContainer');
    editorPixiContainer.style.cursor = cursors.includes(cursor) ? cursor : 'default';
  }

  initResizeTool() {
    const { width, height } = this.element;
    if (isNull(this.border)) {
      this.border = this.addChild(new PIXI.Graphics());
      this.border
        .lineStyle(this.borderWidth, this.borderColor)
        .drawRect(-width / 2, -height / 2, width, height);
      this.border.zIndex = 1;
    }

    if (isNull(this.hScaleHandler)) {
      this.hScaleHandler = this.addChild(this.createHandler('e-resize'));
      this.hScaleHandler.drawRect(0, 0, this.handlerSize, this.handlerSize);
      this.hScaleHandler.x = width / 2;
      this.hScaleHandler.y = 0;
      this.hScaleHandler
        .on('pointerdown', this.onHScaleToolDown)
        .on('pointermove', this.onHScaleToolMove)
        .on('pointerup', () => {
          this.hDragging = false;
        })
        .on('pointerupoutside', () => {
          this.hDragging = false;
        });
    }

    if (isNull(this.vScaleHandler)) {
      this.vScaleHandler = this.addChild(this.createHandler('s-resize'));
      this.vScaleHandler.drawRect(0, 0, this.handlerSize, this.handlerSize);
      this.vScaleHandler.x = 0;
      this.vScaleHandler.y = height / 2;
      this.vScaleHandler
        .on('pointerdown', this.onVScaleToolDown)
        .on('pointermove', this.onVScaleToolMove)
        .on('pointerup', () => {
          this.vDragging = false;
        })
        .on('pointerupoutside', () => {
          this.vDragging = false;
        });
    }

    if (isNull(this.scaleHandler)) {
      this.scaleHandler = this.addChild(this.createHandler('se-resize'));
      this.scaleHandler.drawRect(0, 0, this.handlerSize, this.handlerSize);
      this.scaleHandler.x = width / 2;
      this.scaleHandler.y = height / 2;
      this.scaleHandler
        .on('pointerdown', this.onScaleToolDown)
        .on('pointermove', this.onScaleToolMove)
        .on('pointerup', () => {
          this.aDragging = false;
        })
        .on('pointerupoutside', () => {
          this.aDragging = false;
        });
    }

    if (isNull(this.rotateHandler)) {
      this.rotateHandler = this.addChild(this.createTinyHandler('tiny_rotate', 'grabbing'));
      this.rotateHandler.x = 0;
      this.rotateHandler.y = -height / 2 - Tiny_Rotate_Offset;
      this.rotateHandler
        .on('pointerdown', this.onRotateToolDown)
        .on('pointermove', this.onRotateToolMove)
        .on('pointerup', () => {
          this.rDragging = false;
        })
        .on('pointerupoutside', () => {
          this.rDragging = false;
        });
    }

    this.switchResizeToolShown(false);
  }

  rerenderResizeTool() {
    const { width, height } = this.element;

    if (this.border) {
      this.removeChild(this.border);
      this.border.destroy(true);
      this.border = null;
    }
    this.border = this.addChild(new PIXI.Graphics());
    this.border
      .lineStyle(this.borderWidth, 0xffffff)
      .drawRect(-width / 2, -height / 2, width, height);
    this.border.zIndex = 1;

    this.hScaleHandler.x = width / 2;
    this.hScaleHandler.y = 0;

    this.vScaleHandler.x = 0;
    this.vScaleHandler.y = height / 2;

    this.scaleHandler.x = width / 2;
    this.scaleHandler.y = height / 2;

    this.rotateHandler.x = 0;
    this.rotateHandler.y = -height / 2 - Tiny_Rotate_Offset;
  }

  // 横向拉伸
  onHScaleToolDown = (event) => {
    this.hDragging = true;
    // 记录按下时候元素的高度
    this.baseWidth = this.element.width;
    // 计算按下时候的位置(viewport)
    this.globalStart = event.data.getLocalPosition(this.parent).clone();
  };

  onHScaleToolMove = (event) => {
    if (!this.hDragging) {
      return;
    }
    // 计算拖拽完时候的位置(viewport)
    const endPosition = event.data.getLocalPosition(this.parent).clone();
    this.element.width = this.baseWidth + (endPosition.x - this.globalStart.x);
    this.rerenderResizeTool();
    this.updateElement();
  };

  // 纵向拉伸
  onVScaleToolDown = (event) => {
    this.vDragging = true;
    this.baseHeight = this.element.height;
    this.globalStart = event.data.getLocalPosition(this.parent).clone();
  };

  onVScaleToolMove = (event) => {
    if (!this.vDragging) {
      return;
    }
    const endPosition = event.data.getLocalPosition(this.parent).clone();
    this.element.height = this.baseHeight + (endPosition.y - this.globalStart.y);
    this.rerenderResizeTool();
    this.updateElement();
  };

  // 角向拉伸
  onScaleToolDown = (event) => {
    this.aDragging = true;
    this.baseWidth = this.element.width;
    this.baseHeight = this.element.height;
    this.globalStart = event.data.getLocalPosition(this.parent).clone();
  };

  onScaleToolMove = (event) => {
    if (!this.aDragging) {
      return;
    }
    const endPosition = event.data.getLocalPosition(this.parent).clone();
    this.element.width = this.baseWidth + (endPosition.x - this.globalStart.x);
    this.element.height = this.baseHeight + (endPosition.y - this.globalStart.y);
    this.rerenderResizeTool();
    this.updateElement();
  };

  // 旋转
  onRotateToolDown = (event) => {
    this.rDragging = true;
    this.rotationStartPoint = event.data.getLocalPosition(this.parent).clone();
    this.baseRotation = this.rotation;
  };

  onRotateToolMove = (event) => {
    if (!this.rDragging) {
      return;
    }
    const rotationEndPoint = event.data.getLocalPosition(this.parent).clone();
    const startRotation = calcAngleRadians(this.rotationStartPoint.x, this.rotationStartPoint.y);
    const endRotation = calcAngleRadians(rotationEndPoint.x, rotationEndPoint.y);
    const deltaRotation = endRotation - startRotation;
    this.rotation = this.baseRotation + deltaRotation;
    this.updateElement();
  };
}
