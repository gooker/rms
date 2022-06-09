import * as PIXI from 'pixi.js';
import { SmoothGraphics } from '@pixi/graphics-smooth';
import { isNull } from '@/utils/util';
import { LeftCategory } from '@/packages/Scene/MapEditor/editorEnums';
import { getTextureFromResources } from '@/utils/mapUtil';
import { Text } from '@/entities';
import { ZoneMarkerType } from '@/config/consts';

const Tiny_Rotate_Offset = 200;

function calcAngleRadians(x, y) {
  return Math.atan2(y, x);
}

export default class ResizableContainer extends PIXI.Container {
  constructor() {
    super();
    this.sortableChildren = true;

    // 边框线条宽度
    this.borderWidth = 40;
    // 边框线条颜色
    this.borderColor = 0xffffff;
    // 控制点尺寸
    this.handlerSize = 100;
    // 控制点颜色
    this.handlerColor = 0xffffff;

    // 元素
    this.border = null;
    this.hScaleHandler = null;
    this.vScaleHandler = null;
    this.scaleHandler = null;
    this.rotateHandler = null;

    // 标记
    this.isPointerDown = false; // 指针是否按下
    this.toolShown = false; // 是否显示Resize触点
    this.aDragging = false; // 角拖拽
    this.hDragging = false; // 横向拖拽
    this.vDragging = false; // 纵向拖拽
    this.rDragging = false; // 旋转拖拽
    this.mDragging = false; // 移动
  }

  create(element, updater, zIndex, interactive) {
    this.$zIndex = zIndex;
    this.$updater = updater;
    this.element = this.addChild(element);

    if (interactive) {
      this.element.interactive = true;
      this.element.buttonMode = true;
      this.element.interactiveChildren = true;
      this.element
        .on('pointerdown', this.onElementPointerDown)
        .on('pointermove', this.onElementMove)
        .on('pointerup', this.onElementPointerUp);
      this.initResizeTool();
    }
  }

  onSelect() {
    this.toolShown = true;
    this.element.cursor = 'move';
    this.switchResizeToolShown(true);
  }

  onUnSelect() {
    this.toolShown = false;
    this.element.cursor = 'pointer';
    this.switchResizeToolShown(false);
  }

  /**
   * 元素移动事件
   * 注意点:
   * 1. 支持直接将Label添加到区域标记上
   * 2. Label依然要支持点击
   */
  onElementPointerDown = (event) => {
    const target = event.target;
    const leftActiveCategory = window.$$state().editor.leftActiveCategory;
    if (leftActiveCategory !== LeftCategory.Font || target instanceof Text) {
      this.isPointerDown = true;
      this.data = event.data;
    }
  };

  onElementMove = () => {
    if (this.isPointerDown) {
      this.mDragging = true;
      const newPosition = this.data.getLocalPosition(this.parent);
      this.x = newPosition.x;
      this.y = newPosition.y;
      this.updateElement();
    }
  };

  onElementPointerUp = (event) => {
    if (!this.isPointerDown) return;
    // 如果进行了拖拽，就判定不是选择
    if (!this.mDragging) {
      this.toolShown = !this.toolShown;
      this.select(event);
      this.switchResizeToolShown(this.toolShown);
    }
    this.data = null;
    this.mDragging = false;
    this.isPointerDown = false;
    this.$updater({ x: this.x, y: this.y, width: this.element.width, height: this.element.height });
  };

  createHandler(cursor) {
    const handle = new SmoothGraphics();
    handle.lineStyle(10, this.handlerColor, 1);
    handle.beginFill(this.handlerColor);
    handle.drawRect(0, 0, this.handlerSize, this.handlerSize);
    handle.endFill();
    handle.pivot.set(this.handlerSize / 2, this.handlerSize / 2);
    handle.interactive = true;
    handle.zIndex = 1;
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
      this.border.lineStyle(this.borderWidth, this.borderColor);
      this.border.drawRect(-width / 2, -height / 2, width, height);
      this.border.zIndex = 1;
    }

    if (this.type === ZoneMarkerType.RECT && isNull(this.hScaleHandler)) {
      this.hScaleHandler = this.addChild(this.createHandler('e-resize'));
      this.hScaleHandler.x = width / 2;
      this.hScaleHandler.y = 0;
      this.hScaleHandler
        .on('pointerdown', this.onHScaleToolDown)
        .on('pointermove', this.onHScaleToolMove)
        .on('pointerup', this.onHScaleToolUp)
        .on('pointerupoutside', this.onHScaleToolUp);
    }

    if (this.type === ZoneMarkerType.RECT && isNull(this.vScaleHandler)) {
      this.vScaleHandler = this.addChild(this.createHandler('s-resize'));
      this.vScaleHandler.x = 0;
      this.vScaleHandler.y = height / 2;
      this.vScaleHandler
        .on('pointerdown', this.onVScaleToolDown)
        .on('pointermove', this.onVScaleToolMove)
        .on('pointerup', this.onVScaleToolUp)
        .on('pointerupoutside', this.onVScaleToolUp);
    }

    if (isNull(this.scaleHandler)) {
      this.scaleHandler = this.addChild(this.createHandler('se-resize'));
      this.scaleHandler.x = width / 2;
      this.scaleHandler.y = height / 2;
      this.scaleHandler
        .on('pointerdown', this.onScaleToolDown)
        .on('pointermove', this.onScaleToolMove)
        .on('pointerup', this.onScaleToolUp)
        .on('pointerupoutside', this.onScaleToolUp);
    }

    if (this.type === ZoneMarkerType.RECT && isNull(this.rotateHandler)) {
      this.rotateHandler = this.addChild(this.createTinyHandler('tiny_rotate', 'grabbing'));
      this.rotateHandler.x = 0;
      this.rotateHandler.y = -height / 2 - Tiny_Rotate_Offset;
      this.rotateHandler
        .on('pointerdown', this.onRotateToolDown)
        .on('pointermove', this.onRotateToolMove)
        .on('pointerup', this.onRotateToolUp)
        .on('pointerupoutside', this.onRotateToolUp);
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
    this.border.lineStyle(this.borderWidth, this.borderColor);
    this.border.drawRect(-width / 2, -height / 2, width, height);
    this.border.zIndex = 1;

    if (this.hScaleHandler) {
      this.hScaleHandler.x = width / 2;
      this.hScaleHandler.y = 0;
    }

    if (this.vScaleHandler) {
      this.vScaleHandler.x = 0;
      this.vScaleHandler.y = height / 2;
    }

    if (this.scaleHandler) {
      this.scaleHandler.x = width / 2;
      this.scaleHandler.y = height / 2;
    }

    if (this.rotateHandler) {
      this.rotateHandler.x = 0;
      this.rotateHandler.y = -height / 2 - Tiny_Rotate_Offset;
    }
  }

  // 横向拉伸
  onHScaleToolDown = (event) => {
    this.hScaleData = event.data;
    this.hDragging = true;
    this.baseWidth = this.element.width;
    this.globalStart = this.hScaleData.getLocalPosition(this.parent).clone();
  };

  onHScaleToolMove = () => {
    if (!this.hDragging) {
      return;
    }
    const endPosition = this.hScaleData.getLocalPosition(this.parent).clone();
    this.element.width = this.baseWidth + (endPosition.x - this.globalStart.x);
    this.rerenderResizeTool();
    this.updateElement();
  };

  onHScaleToolUp = () => {
    this.hScaleData = null;
    this.hDragging = false;
    this.$updater({
      x: this.x,
      y: this.y,
      width: this.element.width,
      height: this.element.height,
    });
  };

  // 纵向拉伸
  onVScaleToolDown = (event) => {
    this.vScaleData = event.data;
    this.vDragging = true;
    this.baseHeight = this.element.height;
    this.globalStart = this.vScaleData.getLocalPosition(this.parent).clone();
  };

  onVScaleToolMove = () => {
    if (!this.vDragging) {
      return;
    }
    const endPosition = this.vScaleData.getLocalPosition(this.parent).clone();
    this.element.height = this.baseHeight + (endPosition.y - this.globalStart.y);
    this.rerenderResizeTool();
    this.updateElement();
  };

  onVScaleToolUp = () => {
    this.vScaleData = null;
    this.vDragging = false;
    this.$updater({
      x: this.x,
      y: this.y,
      width: this.element.width,
      height: this.element.height,
    });
  };

  // 角向拉伸
  onScaleToolDown = (event) => {
    this.scaleEventData = event.data;
    this.aDragging = true;
    this.baseWidth = this.element.width;
    this.baseHeight = this.element.height;
    this.globalStart = this.scaleEventData.getLocalPosition(this.parent).clone();
  };

  onScaleToolMove = () => {
    if (!this.aDragging) {
      return;
    }
    const endPosition = this.scaleEventData.getLocalPosition(this.parent).clone();
    this.element.width = this.baseWidth + (endPosition.x - this.globalStart.x);
    this.element.height = this.baseHeight + (endPosition.x - this.globalStart.x);
    this.rerenderResizeTool();
    this.updateElement();
  };

  onScaleToolUp = () => {
    this.scaleEventData = null;
    this.aDragging = false;
    this.$updater({
      x: this.x,
      y: this.y,
      width: this.element.width,
      height: this.element.height,
    });
  };

  // 旋转
  onRotateToolDown = (event) => {
    this.rotateEventData = event.data;
    this.rDragging = true;
    this.rotationStartPoint = this.rotateEventData.getLocalPosition(this.parent).clone();
    this.baseRotation = this.rotation;
  };

  onRotateToolMove = () => {
    if (!this.rDragging) {
      return;
    }
    const rotationEndPoint = this.rotateEventData.getLocalPosition(this.parent).clone();
    const startRotation = calcAngleRadians(this.rotationStartPoint.x, this.rotationStartPoint.y);
    const endRotation = calcAngleRadians(rotationEndPoint.x, rotationEndPoint.y);
    const deltaRotation = endRotation - startRotation;
    this.rotation = this.baseRotation + deltaRotation;
    this.updateElement();
  };

  onRotateToolUp = () => {
    this.rotateEventData = null;
    this.rDragging = false;
    this.$updater({
      x: this.x,
      y: this.y,
      width: this.element.width,
      height: this.element.height,
    });
  };
}
