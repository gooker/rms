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

export default class PixiTransformTool extends PIXI.Container {
  constructor(refresh) {
    super();
    this.refresh = refresh;
    this.visible = false;

    this.rotateTool = null;
    this.target = null;
    this.border = null;
    this.boundary = null;

    this.initialize();
  }

  initialize() {
    // 边框线条颜色
    this.lineColor = 0xffffff;
    // 边框线条宽度
    this.lineWidth = 6;
    // 控制点尺寸
    this.handleSize = 60;
    // 控制点颜色
    this.handleColor = 0xffffff;

    const _this = this;

    // ******************** 预创建边框Graphics对象 ******************** //
    this.border = new PIXI.Graphics();
    this.addChild(this.border);

    // ******************** 创建控制点 ******************** //
    function createHandle(name, cursor) {
      const handle = new PIXI.Graphics();
      handle.interactive = true;
      handle.lineStyle(_this.lineWidth, _this.lineColor).beginFill(_this.handleColor);
      handle.pivot.set(_this.handleSize / 2, _this.handleSize / 2);
      handleHandleEvents(handle);
      addToolTip(handle, name, cursor);
      return handle;
    }

    function addToolTip(shape, name, cursor) {
      shape.on('pointerover', function () {
        _this.setTitle(name);
        _this.setCursor(cursor);
      });
      shape.on('pointerout', function () {
        _this.setTitle();
        _this.setCursor('default');
      });
    }

    function handleHandleEvents(handle) {
      handle
        .on('pointerdown', onHandleDown)
        .on('pointermove', onHandleMove)
        .on('pointerup', onHandleUp)
        .on('pointerupoutside', onHandleUp);
    }

    function onHandleDown() {
      this.dragging = true;
    }

    function onHandleMove() {
      if (this.dragging) {
        _this.alpha = _this.controlsDim;
      }
    }

    function onHandleUp() {
      _this.alpha = 1;
      _this.update();
      this.dragging = false;
    }

    // ******************** 移动元素 ******************** //
    this.moveHandle = new PIXI.Graphics();
    this.moveHandle.hitArea = new PIXI.Rectangle();
    this.moveHandle.interactive = true;
    this.moveHandle
      .on('pointerdown', onMoveHandleDown)
      .on('pointermove', onMoveHandleMove)
      .on('pointerup', onMoveHandleUp)
      .on('pointerupoutside', onMoveHandleUp);
    handleHandleEvents(this.moveHandle);
    addToolTip(this.moveHandle, 'Move', 'move');
    this.addChild(this.moveHandle);

    function onMoveHandleDown(downEvent) {
      if (_this.target && !this.dragging) {
        this.targetStart = _this.target.position.clone();
        this.downGlobal = downEvent.data.global.clone();
        this.dragDistance = 0;
        this.dragging = true;
        this.startBounds = _this.target.getBounds();
      }
    }

    function onMoveHandleMove(moveEvent) {
      moveEvent.stopPropagation();
      if (!this.dragging) {
        return;
      }
      const moveDelta = new PIXI.Point(
        moveEvent.data.global.x - this.downGlobal.x,
        moveEvent.data.global.y - this.downGlobal.y,
      );
      if (_this.boundary && this.startBounds) {
        let newBounds = new PIXI.Rectangle(
          moveDelta.x + this.startBounds.x,
          moveDelta.y + this.startBounds.y,
          this.startBounds.width,
          this.startBounds.height,
        );
        const constrainedBounds = constrainRectTo(newBounds, _this.boundary);
        moveDelta.x = constrainedBounds.x - this.startBounds.x;
        moveDelta.y = constrainedBounds.y - this.startBounds.y;
      }
      _this.target.position.x = this.targetStart.x + moveDelta.x;
      _this.target.position.y = this.targetStart.y + moveDelta.y;
      this.dragDistance = calcDistance(moveEvent.data.global, this.downGlobal);
      _this.update();
    }

    function onMoveHandleUp(upEvent) {
      upEvent.stopPropagation();
      if (this.dragging) {
        _this.alpha = 1;
        this.downGlobal = null;
        this.targetStart = null;
        this.dragging = false;
        if (!this.dragDistance || this.dragDistance < _this.movedThreshold) {
          _this.unselect();
        }
      }
    }

    // ******************** 横向缩放控制 ******************** //
    this.hScaleHandle = createHandle('Stretch', 'e-resize');
    this.hScaleHandle.drawRect(0, 0, this.handleSize, this.handleSize);
    this.hScaleHandle.on('pointerdown', onHScaleToolDown).on('pointermove', onHScaleToolMove);
    this.addChild(this.hScaleHandle);

    function onHScaleToolDown(downEvent) {
      this.globalStart = downEvent.data.global.clone();
      this.scaleStart = _this.target.scale.clone();
    }

    function onHScaleToolMove(moveEvent) {
      if (!this.dragging) {
        return;
      }
      const distStart = calcDistance(this.globalStart, _this.target.position);
      const distEnd = calcDistance(moveEvent.data.global, _this.target);
      const rescaleFactor = distEnd / distStart;
      _this.target.scale.x = this.scaleStart.x * rescaleFactor;
      _this.update();
    }

    // ******************** 纵向缩放控制 ******************** //
    this.vScaleHandle = createHandle('Stretch', 's-resize');
    this.vScaleHandle.drawRect(0, 0, this.handleSize, this.handleSize);
    this.vScaleHandle.on('pointerdown', onVScaleToolDown).on('pointermove', onVScaleToolMove);
    this.addChild(this.vScaleHandle);

    function onVScaleToolDown(downEvent) {
      this.globalStart = downEvent.data.global.clone();
      this.scaleStart = _this.target.scale.clone();
    }

    function onVScaleToolMove(moveEvent) {
      if (!this.dragging) {
        return;
      }
      const distStart = calcDistance(this.globalStart, _this.target.position);
      const distEnd = calcDistance(moveEvent.data.global, _this.target);
      const rescaleFactor = distEnd / distStart;
      _this.target.scale.y = this.scaleStart.y * rescaleFactor;
      _this.update();
    }

    // ******************** 角缩放控制 ******************** //
    this.scaleHandle = createHandle('Resize', 'se-resize');
    this.scaleHandle.drawRect(0, 0, this.handleSize, this.handleSize);
    this.scaleHandle
      .on('pointerdown', onScaleToolDown)
      .on('pointermove', onScaleToolMove)
      .on('pointerupoutside', onScaleToolUp)
      .on('pointerup', onScaleToolUp);
    this.addChild(this.scaleHandle);

    function onScaleToolDown(downEvent) {
      this.downGlobalPosition = downEvent.data.global.clone();
      this.startScale = _this.target.scale.clone();
      this.resolutionStart = _this.target.resolution;
      this.targetStart = _this.target.position.clone();
      this.startBounds = _this.target.getBounds();
    }

    function onScaleToolMove(moveEvent) {
      if (!this.dragging) {
        return;
      }
      const distStart = calcDistance(this.downGlobalPosition, _this.target.position);
      const distEnd = calcDistance(moveEvent.data.global, _this.target.position);
      this.rescaleFactor = distEnd / distStart;

      if (_this.boundary && this.startBounds) {
        let boundsAnchor = {
          x: _this.target.anchor.x * this.startBounds.width,
          y: _this.target.anchor.y * this.startBounds.height,
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
        _this.target.position.x = this.targetStart.x - boundsPositionDelta.x;
        _this.target.position.y = this.targetStart.y - boundsPositionDelta.y;
      }
      _this.target.scale.x = this.startScale.x * this.rescaleFactor;
      _this.target.scale.y = this.startScale.y * this.rescaleFactor;

      _this.update();
    }

    function onScaleToolUp() {
      _this.target.resolution = this.resolutionStart * this.rescaleFactor;
      _this.update();
    }

    // ******************** 旋转控制 ******************** //
    this.rotateTool = createHandle('Rotate', 'pointer');
    this.rotateTool.drawEllipse(
      this.handleSize / 2,
      this.handleSize / 2,
      this.handleSize / 2,
      this.handleSize / 2,
    );
    this.rotateTool.on('pointerdown', onRotateToolDown).on('pointermove', onRotateToolMove);
    this.addChild(this.rotateTool);

    function onRotateToolDown(downEvent) {
      this.downGlobalPosition = downEvent.data.global.clone();
      this.startRotation = _this.target.rotation;
    }

    function onRotateToolMove(moveEvent) {
      if (!_this.dragging) {
        return;
      }
      // the drag point is relative to the display object x,y position on the stage (it's registration point)
      const relativeStartPoint = {
        x: this.downGlobalPosition.x - _this.target.x,
        y: this.downGlobalPosition.y - _this.target.y,
      };
      const relativeEndPoint = {
        x: moveEvent.data.global.x - _this.target.x,
        y: moveEvent.data.global.y - _this.target.y,
      };
      const endAngle = calcAngleRadians(relativeEndPoint.x, relativeEndPoint.y);
      const startAngle = calcAngleRadians(relativeStartPoint.x, relativeStartPoint.y);
      const deltaAngle = endAngle - startAngle;
      _this.target.rotation = this.startRotation + deltaAngle;
      _this.update();
    }
  }

  select(target) {
    if (!target) {
      this.unselect();
      return;
    }

    this.target = target;
    const bounds = target.getLocalBounds();
    this.x = bounds.x;
    this.y = bounds.y;
    this.width = bounds.width;
    this.height = bounds.height;
    this.scale.x = target.scale.x;
    this.scale.y = target.scale.y;
    this.rotation = target.rotation;

    let anchor;
    if (target.anchor) {
      anchor = target.anchor;
    } else if (target.pivot) {
      anchor = new PIXI.Point(target.pivot.x, target.pivot.y);
    } else {
      anchor = new PIXI.Point(0, 0);
    }
    target.anchor = anchor;

    this.left = -bounds.width * anchor.x;
    this.top = -bounds.height * anchor.y;
    this.bottom = bounds.height * (1 - anchor.y);
    this.right = bounds.width * (1 - anchor.x);

    // borders
    this.border.clear();
    this.border
      .lineStyle(this.lineWidth / this.scale.y, 0xffffff)
      .moveTo(this.left, this.top)
      .lineTo(this.right, this.top)
      .moveTo(this.right, this.bottom)
      .lineTo(this.left, this.bottom);
    this.border
      .lineStyle(this.lineWidth / this.scale.x, 0xffffff)
      .moveTo(this.left, this.top)
      .lineTo(this.left, this.bottom)
      .moveTo(this.right, this.bottom)
      .lineTo(this.right, this.top);

    // tools size should stay consistent
    const toolScaleX = 1 / this.scale.x;
    const toolScaleY = 1 / this.scale.y;

    // draw move hit area
    this.moveHandle.hitArea.x = this.left;
    this.moveHandle.hitArea.y = this.top;

    this.moveHandle.hitArea.width = bounds.width;
    this.moveHandle.hitArea.height = bounds.height;

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

  unselect() {
    this.target = null;
    this.visible = false;
    this.refresh();
  }

  update() {
    if (this.target) {
      this.select(this.target);
      this.refresh();
    }
  }

  setTitle(title) {
    this.accessibleTitle = title || '';
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
      let rotation = this.target.rotation;
      rotation = rotation + angle / 2;
      let newIndex = index + Math.floor(rotation / angle);
      newIndex = newIndex % cursors.length;
      editorPixiContainer.style.cursor = cursors[newIndex];
    } else {
      editorPixiContainer.style.cursor = cursor;
    }
  }
}
