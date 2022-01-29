import * as PIXI from 'pixi.js';
import { isNull } from '@/utils/util';

function calcAngleRadians(x, y) {
  return Math.atan2(y, x);
}

export default class MapZoneMarker extends PIXI.Container {
  constructor(x, y, width, height, color, refresh) {
    super();
    this.x = x;
    this.y = y;
    this.color = color;
    this.refresh = refresh;
    this.toolShown = false;
    this.sortableChildren = true;

    // 元素
    this.border = null;
    this.scaleHandler = null;
    this.hScaleHandler = null;
    this.vScaleHandler = null;
    this.rotateHandler = null;

    // 标记
    this.aDragging = false; // 角拖拽
    this.hDragging = false; // 横向拖拽
    this.vDragging = false; // 纵向拖拽
    this.rDragging = false; // 旋转拖拽
    this.mDragging = false; // 移动

    // 边框线条宽度
    this.borderWidth = 10;
    // 边框线条颜色
    this.borderColor = 0xffffff;
    // 控制点尺寸
    this.handlerSize = 60;
    // 控制点颜色
    this.handlerColor = 0xddb230;

    this.create(width, height);
    this.initResizeTool();

    this.pivot.x = width / 2;
    this.pivot.y = height / 2;
  }

  create(width, height) {
    this.element = this.addChild(new PIXI.Graphics());
    this.element.beginFill(this.color.replace('#', '0x'));
    this.element.drawRect(0, 0, width, height);
    this.element.endFill();
    this.element.alpha = 0.8;
    this.element.buttonMode = true;
    this.element.interactive = true;
    this.element
      .on('pointerdown', this.onMoveStart)
      .on('pointermove', this.onMove)
      .on('pointerup', this.onMoveEnd)
      .on('pointerupoutside', this.onMoveEnd);
  }

  createHandler(cursor) {
    const handle = new PIXI.Graphics();
    handle.lineStyle(this.borderWidth, this.handlerColor).beginFill(this.handlerColor);
    handle.pivot.set(this.handlerSize / 2, this.handlerSize / 2);
    handle.interactive = true;
    handle.zIndex = 2;
    this.addToolTip(handle, cursor);
    return handle;
  }

  updateElement = () => {
    const { width, height } = this.element;
    this.pivot.x = width / 2;
    this.pivot.y = height / 2;
    this.refresh();
  };

  addToolTip(shape, cursor) {
    shape.on('pointerover', () => {
      this.setCursor(cursor);
    });
    shape.on('pointerout', () => {
      this.setCursor('default');
    });
  }

  setCursor(cursor) {
    const cursors = ['e-resize', 'se-resize', 's-resize', 'all-scroll'];
    const editorPixiContainer = document.getElementById('editorPixiContainer');
    editorPixiContainer.style.cursor = cursors.includes(cursor) ? cursor : 'default';
  }

  initResizeTool() {
    const { width, height } = this.element;
    if (isNull(this.border)) {
      this.border = this.addChild(new PIXI.Graphics());
      this.border.lineStyle(this.borderWidth, this.borderColor).drawRect(0, 0, width, height);
      this.border.zIndex = 1;
    }

    if (isNull(this.hScaleHandler)) {
      this.hScaleHandler = this.createHandler('e-resize');
      this.hScaleHandler.drawRect(0, 0, this.handlerSize, this.handlerSize);
      this.hScaleHandler.x = width;
      this.hScaleHandler.y = height / 2;
      this.hScaleHandler
        .on('pointerdown', this.onHScaleToolDown)
        .on('pointermove', this.onHScaleToolMove)
        .on('pointerup', () => {
          this.hDragging = false;
        })
        .on('pointerupoutside', () => {
          this.hDragging = false;
        });
      this.addChild(this.hScaleHandler);
    }

    if (isNull(this.vScaleHandler)) {
      this.vScaleHandler = this.createHandler('s-resize');
      this.vScaleHandler.drawRect(0, 0, this.handlerSize, this.handlerSize);
      this.vScaleHandler.x = width / 2;
      this.vScaleHandler.y = height;
      this.vScaleHandler
        .on('pointerdown', this.onVScaleToolDown)
        .on('pointermove', this.onVScaleToolMove)
        .on('pointerup', () => {
          this.vDragging = false;
        })
        .on('pointerupoutside', () => {
          this.vDragging = false;
        });
      this.addChild(this.vScaleHandler);
    }

    if (isNull(this.scaleHandler)) {
      this.scaleHandler = this.createHandler('se-resize');
      this.scaleHandler.drawRect(0, 0, this.handlerSize, this.handlerSize);
      this.scaleHandler.x = width;
      this.scaleHandler.y = height;
      this.scaleHandler
        .on('pointerdown', this.onScaleToolDown)
        .on('pointermove', this.onScaleToolMove)
        .on('pointerup', () => {
          this.aDragging = false;
        })
        .on('pointerupoutside', () => {
          this.aDragging = false;
        });

      this.addChild(this.scaleHandler);
    }

    if (isNull(this.rotateHandler)) {
      this.rotateHandler = this.createHandler('pointer');
      this.rotateHandler.pivot.set(0.5, 0.5);
      this.rotateHandler.drawCircle(0, 0, this.handlerSize / 2);
      this.rotateHandler.x = width;
      this.rotateHandler.y = 0;
      this.rotateHandler
        .on('pointerdown', this.onRotateToolDown)
        .on('pointermove', this.onRotateToolMove)
        .on('pointerup', () => {
          this.rDragging = false;
        })
        .on('pointerupoutside', () => {
          this.rDragging = false;
        });
      this.addChild(this.rotateHandler);
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
    this.border.lineStyle(this.borderWidth, 0xffffff).drawRect(0, 0, width, height);
    this.border.zIndex = 1;

    this.hScaleHandler.x = width;
    this.hScaleHandler.y = height / 2;

    this.vScaleHandler.x = width / 2;
    this.vScaleHandler.y = height;

    this.scaleHandler.x = width;
    this.scaleHandler.y = height;

    this.rotateHandler.x = width;
    this.rotateHandler.y = 0;
  }

  // 移动
  onMoveStart = (event) => {
    this.toolShown = !this.toolShown;
    this.switchResizeToolShown(this.toolShown);

    this.element.cursor = this.toolShown ? 'all-scroll' : 'pointer';
    this.data = event.data;
    this.mDragging = true;
  };

  onMove = () => {
    if (this.mDragging) {
      const newPosition = this.data.getLocalPosition(this.parent);
      this.x = newPosition.x;
      this.y = newPosition.y;
      this.updateElement();
    }
  };

  onMoveEnd = () => {
    this.mDragging = false;
    this.data = null;
  };

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
    this.rerenderResizeTool();
    this.updateElement();
  };

  switchResizeToolShown(visible) {
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

  select() {}

  unSelect() {}
}
