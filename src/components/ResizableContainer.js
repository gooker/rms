import * as PIXI from 'pixi.js';

function calcAngleRadians(x, y) {
  return Math.atan2(y, x);
}

function calcDistance(a, b) {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
}

/**
 * Force a rectangle to always be inside another by
 * updating location and size.
 * @param {PIXI.Rectangle} rect
 * @param {PIXI.Rectangle} container
 */
function constrainRectTo(rect, container) {
  if (rect.width >= container.width) {
    rect.width = container.width;
  }
  if (rect.x <= container.x) {
    rect.x = container.x;
  } else if (rect.x + rect.width > container.x + container.width) {
    rect.x = container.x + container.width - rect.width;
  }
  if (rect.height >= container.height) {
    rect.height = container.height;
  }
  if (rect.y <= container.y) {
    rect.y = container.y;
  } else if (rect.y + rect.height > container.y + container.height) {
    rect.y = container.y + container.height - rect.height;
  }
  return rect;
}

export default class ResizableContainer extends PIXI.Container {
  constructor() {
    super();
    this.sortableChildren = true;

    // 边框线条颜色
    this.lineColor = 0xffffff;
    // 边框线条宽度
    this.lineWidth = 10;
    // 控制点尺寸
    this.handleSize = 60;
    // 控制点颜色
    this.handleColor = 0xddb230;

    this.rotateTool = null;
    this.element = null;
    this.border = null;
    this.boundary = null;
  }

  createHandle(cursor) {
    const handle = new PIXI.Graphics();
    handle.lineStyle(this.lineWidth, this.handleColor).beginFill(this.handleColor);
    handle.pivot.set(this.handleSize / 2, this.handleSize / 2);
    handle.interactive = true;
    handle.zIndex = 100;
    this.addToolTip(handle, cursor);
    return handle;
  }

  addToolTip(shape, cursor) {
    const _this = this;
    shape.on('pointerover', function () {
      _this.setCursor(cursor);
    });
    shape.on('pointerout', function () {
      _this.setCursor('default');
    });
  }

  setCursor(cursor) {
    const cursors = [
      'e-resize',
      'se-resize',
      's-resize',
      'sw-resize',
      'w-resize',
      'nw-resize',
      'n-resize',
      'ne-resize',
    ];
    const index = cursors.indexOf(cursor);
    const editorPixiContainer = document.getElementById('editorPixiContainer');
    if (index >= 0) {
      const angle = 45;
      let rotation = this.element.rotation;
      rotation = rotation + angle / 2;
      let newIndex = index + Math.floor(rotation / angle);
      newIndex = newIndex % cursors.length;
      editorPixiContainer.style.cursor = cursors[newIndex];
    } else {
      editorPixiContainer.style.cursor = cursor;
    }
  }

  initialize() {
    const _this = this;

    // ******************** 横向缩放控制 ******************** //
    this.hScaleHandle = this.createHandle('e-resize');
    this.hScaleHandle.drawRect(this.width, this.height / 2, this.handleSize, this.handleSize);
    this.hScaleHandle.on('pointerdown', onHScaleToolDown).on('pointermove', onHScaleToolMove);
    // this.addChild(this.hScaleHandle);

    function onHScaleToolDown(downEvent) {
      this.globalStart = downEvent.data.global.clone();
      this.scaleStart = _this.element.scale.clone();
    }

    function onHScaleToolMove(moveEvent) {
      if (!this.dragging) {
        return;
      }
      const distStart = calcDistance(this.globalStart, _this.element.position);
      const distEnd = calcDistance(moveEvent.data.global, _this.element);
      const rescaleFactor = distEnd / distStart;
      _this.element.scale.x = this.scaleStart.x * rescaleFactor;
      _this.update();
    }

    // ******************** 纵向缩放控制 ******************** //
    this.vScaleHandle = this.createHandle('s-resize');
    this.vScaleHandle.drawRect(0, 0, this.handleSize, this.handleSize);
    this.vScaleHandle.on('pointerdown', onVScaleToolDown).on('pointermove', onVScaleToolMove);
    // this.addChild(this.vScaleHandle);

    function onVScaleToolDown(downEvent) {
      this.globalStart = downEvent.data.global.clone();
      this.scaleStart = _this.element.scale.clone();
    }

    function onVScaleToolMove(moveEvent) {
      if (!this.dragging) {
        return;
      }
      const distStart = calcDistance(this.globalStart, _this.element.position);
      const distEnd = calcDistance(moveEvent.data.global, _this.element);
      const rescaleFactor = distEnd / distStart;
      _this.element.scale.y = this.scaleStart.y * rescaleFactor;
      _this.update();
    }

    // ******************** 角缩放控制 ******************** //
    this.scaleHandle = this.createHandle('se-resize');
    this.scaleHandle.drawRect(0, 0, this.handleSize, this.handleSize);
    this.scaleHandle
      .on('pointerdown', onScaleToolDown)
      .on('pointermove', onScaleToolMove)
      .on('pointerupoutside', onScaleToolUp)
      .on('pointerup', onScaleToolUp);
    // this.addChild(this.scaleHandle);

    function onScaleToolDown(downEvent) {
      this.downGlobalPosition = downEvent.data.global.clone();
      this.startScale = _this.element.scale.clone();
      this.resolutionStart = _this.element.resolution;
      this.elementStart = _this.element.position.clone();
      this.startBounds = _this.element.getBounds();
    }

    function onScaleToolMove(moveEvent) {
      if (!this.dragging) {
        return;
      }
      const distStart = calcDistance(this.downGlobalPosition, _this.element.position);
      const distEnd = calcDistance(moveEvent.data.global, _this.element.position);
      this.rescaleFactor = distEnd / distStart;

      if (_this.boundary && this.startBounds) {
        let boundsAnchor = {
          x: _this.element.anchor.x * this.startBounds.width,
          y: _this.element.anchor.y * this.startBounds.height,
        };

        let bounds = new PIXI.Rectangle(
          this.startBounds.x - boundsAnchor.x * this.rescaleFactor + boundsAnchor.x,
          this.startBounds.y - boundsAnchor.y * this.rescaleFactor + boundsAnchor.y,
          this.startBounds.width * this.rescaleFactor,
          this.startBounds.height * this.rescaleFactor,
        );

        const constrainedBounds = constrainRectTo(bounds.clone(), _this.boundary, true);
        const boundsPositionDelta = {
          x: bounds.x - constrainedBounds.x,
          y: bounds.y - constrainedBounds.y,
        };

        this.rescaleFactor = Math.min(
          constrainedBounds.width / this.startBounds.width,
          constrainedBounds.height / this.startBounds.height,
        );
        _this.element.position.x = this.elementStart.x - boundsPositionDelta.x;
        _this.element.position.y = this.elementStart.y - boundsPositionDelta.y;
      }
      _this.element.scale.x = this.startScale.x * this.rescaleFactor;
      _this.element.scale.y = this.startScale.y * this.rescaleFactor;

      _this.update();
    }

    function onScaleToolUp() {
      _this.element.resolution = this.resolutionStart * this.rescaleFactor;
      _this.update();
    }

    // ******************** 旋转控制 ******************** //
    this.rotateTool = this.createHandle('pointer');
    this.rotateTool.drawEllipse(
      this.handleSize / 2,
      this.handleSize / 2,
      this.handleSize / 2,
      this.handleSize / 2,
    );
    this.rotateTool.on('pointerdown', onRotateToolDown).on('pointermove', onRotateToolMove);
    // this.addChild(this.rotateTool);

    function onRotateToolDown(downEvent) {
      this.downGlobalPosition = downEvent.data.global.clone();
      this.startRotation = _this.element.rotation;
    }

    function onRotateToolMove(moveEvent) {
      if (!_this.dragging) {
        return;
      }
      // the drag point is relative to the display object x,y position on the stage (it's registration point)
      const relativeStartPoint = {
        x: this.downGlobalPosition.x - _this.element.x,
        y: this.downGlobalPosition.y - _this.element.y,
      };
      const relativeEndPoint = {
        x: moveEvent.data.global.x - _this.element.x,
        y: moveEvent.data.global.y - _this.element.y,
      };
      const endAngle = calcAngleRadians(relativeEndPoint.x, relativeEndPoint.y);
      const startAngle = calcAngleRadians(relativeStartPoint.x, relativeStartPoint.y);
      const deltaAngle = endAngle - startAngle;
      _this.element.rotation = this.startRotation + deltaAngle;
      _this.update();
    }
  }

  addResizeTool() {
    const bounds = this.getLocalBounds();
    // this.x = bounds.x;
    // this.y = bounds.y;

    let anchor;
    if (this.element.anchor) {
      anchor = this.element.anchor;
    } else if (this.element.pivot) {
      anchor = new PIXI.Point(this.element.pivot.x, this.element.pivot.y);
    } else {
      anchor = new PIXI.Point(0, 0);
    }

    this.left = this.x - bounds.width * anchor.x;
    this.top = this.y - bounds.height * anchor.y;
    this.bottom = this.y + bounds.height * (1 - anchor.y);
    this.right = this.x + bounds.width * (1 - anchor.x);

    // ******************** 预创建边框Graphics对象 ******************** //
    this.border = this.addChild(new PIXI.Graphics());
    this.border
      .lineStyle(this.lineWidth, 0xffffff)
      .drawRect(
        this.left,
        this.top,
        Math.abs(this.right - this.left),
        Math.abs(this.bottom - this.top),
      );

    // tools size should stay consistent
    const toolScaleX = 1 / this.scale.x;
    const toolScaleY = 1 / this.scale.y;

    // scale tool (bottom right)
    this.scaleHandle.x = this.right;
    this.scaleHandle.y = this.bottom;
    this.scaleHandle.scale.x = toolScaleX;
    this.scaleHandle.scale.y = toolScaleY;

    // hScale tool (right edge)
    this.hScaleHandle.x = this.right;
    this.hScaleHandle.y = this.top + bounds.height / 2;
    this.hScaleHandle.scale.x = toolScaleX;
    this.hScaleHandle.scale.y = toolScaleY;

    // vScale tool (bottom edge)
    this.vScaleHandle.x = this.left + bounds.width / 2;
    this.vScaleHandle.y = this.bottom;
    this.vScaleHandle.scale.x = toolScaleX;
    this.vScaleHandle.scale.y = toolScaleY;

    // rotate tool
    this.rotateTool.x = this.right;
    this.rotateTool.y = this.top;
    this.rotateTool.scale.x = toolScaleX;
    this.rotateTool.scale.y = toolScaleY;

    this.visible = true;
  }

  unselect() {}

  update() {}
}
