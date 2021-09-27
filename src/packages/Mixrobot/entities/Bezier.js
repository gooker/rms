import * as PIXI from 'pixi.js';
import { zIndex, CostColor, CellWidth } from '@/consts';

export default class Bezier extends PIXI.Container {
  constructor(props) {
    super();
    this.id = props.id;
    this.$x = props.x;
    this.$y = props.y;
    this.cost = props.cost;
    this.primary = props.primary;
    this.type = 'curve';
    this.secondary = props.secondary;
    this.third = props.third;
    this.selectLine = props.click;
    this.distance = props.distance;
    this.$interactive = props.interactive;
    this.isStandard = props.isStandard;
    this.zIndex = this.isStandard ? zIndex.line : 100;
    this.data = {
      selected: false,
      shownData: {
        arrow: true,
        distance: false,
      },
    };
    this.createArrow();
  }

  fetchBezierPoints = () => {
    const firtsCtrlPoints = { x: this.primary.x, y: this.primary.y };
    const secondCtrlPoints = { x: this.secondary.x, y: this.secondary.y };
    const destinationPoints = { x: this.third.x, y: this.third.y };
    const capPoints = { left: {}, right: {} };
    const theta = 12;
    const headlen = 160;
    const angle = (theta * Math.PI) / 180;
    const cosOffset = headlen * Math.cos(angle);
    const sinOffset = headlen * Math.sin(angle);
    const direction = this.getBezierDirection(secondCtrlPoints, destinationPoints);

    if (direction === 'TOP') {
      capPoints.left.x = destinationPoints.x - sinOffset;
      capPoints.left.y = destinationPoints.y + cosOffset;
      capPoints.right.x = destinationPoints.x + sinOffset;
      capPoints.right.y = destinationPoints.y + cosOffset;
    }

    if (direction === 'RIGHT') {
      capPoints.left.x = destinationPoints.x - cosOffset;
      capPoints.left.y = destinationPoints.y - sinOffset;
      capPoints.right.x = destinationPoints.x - cosOffset;
      capPoints.right.y = destinationPoints.y + sinOffset;
    }

    if (direction === 'BTM') {
      capPoints.left.x = destinationPoints.x - sinOffset;
      capPoints.left.y = destinationPoints.y - cosOffset;
      capPoints.right.x = destinationPoints.x + sinOffset;
      capPoints.right.y = destinationPoints.y - cosOffset;
    }

    if (direction === 'LEFT') {
      capPoints.left.x = destinationPoints.x + cosOffset;
      capPoints.left.y = destinationPoints.y + sinOffset;
      capPoints.right.x = destinationPoints.x + cosOffset;
      capPoints.right.y = destinationPoints.y - sinOffset;
    }
    return { firtsCtrlPoints, secondCtrlPoints, destinationPoints, capPoints };
  };

  getBezierDirection = (secondCtrlPoints, destinationPoints) => {
    let coordBase = 'x';
    if (secondCtrlPoints.x === destinationPoints.x) {
      coordBase = 'y';
    }

    let direction;
    if (coordBase === 'x') {
      if (destinationPoints.x > secondCtrlPoints.x) {
        direction = 'RIGHT';
      } else {
        direction = 'LEFT';
      }
    } else {
      if (destinationPoints.y > secondCtrlPoints.y) {
        direction = 'BTM';
      } else {
        direction = 'TOP';
      }
    }
    return direction;
  };

  createArrow = () => {
    const lineWidth = 15;
    const color = CostColor[this.cost];
    const {
      firtsCtrlPoints,
      secondCtrlPoints,
      destinationPoints,
      capPoints: { left, right },
    } = this.fetchBezierPoints();

    //  曲线主体
    this.arrow = new PIXI.Graphics();
    this.arrow.lineStyle(lineWidth, color, 1);
    this.arrow.moveTo(firtsCtrlPoints.x, firtsCtrlPoints.y);
    this.arrow.bezierCurveTo(
      firtsCtrlPoints.x,
      firtsCtrlPoints.y,
      secondCtrlPoints.x,
      secondCtrlPoints.y,
      destinationPoints.x,
      destinationPoints.y,
    );

    // 箭头左帽 && 右帽
    this.arrow.moveTo(left.x, left.y);
    this.arrow.lineTo(destinationPoints.x, destinationPoints.y);
    this.arrow.lineTo(right.x, right.y);
    this.addChild(this.arrow);

    // HitArea
    // this.arrow.hitArea = this.arrow.getBounds();
    // this.arrow.buttonMode = this.$interactive;
    // this.arrow.interactive = this.$interactive;
    // this.arrow.on('click', this.click);

    // 选中的背景色
    // this.selectedBorderSprite = new PIXI.Graphics();
    // this.selectedBorderSprite.lineStyle(40, 0xff5722, 1);
    // this.selectedBorderSprite.moveTo(firtsCtrlPoints.x, firtsCtrlPoints.y);
    // this.selectedBorderSprite.bezierCurveTo(
    //   firtsCtrlPoints.x,
    //   firtsCtrlPoints.y,
    //   secondCtrlPoints.x,
    //   secondCtrlPoints.y,
    //   destinationPoints.x,
    //   destinationPoints.y
    // );
    // this.selectedBorderSprite.alpha = 0.7;
    // this.selectedBorderSprite.visible = false;
    // this.addChild(this.selectedBorderSprite);
  };

  click = () => {
    if (this.data.selected) {
      this.unSelect();
      this.selectLine && this.selectLine(this.id, false);
    } else {
      this.select();
      this.selectLine && this.selectLine(this.id);
    }
  };

  select = () => {
    if (!this.data.selected) {
      this.data.selected = true;
      this.selectedBorderSprite.visible = true;
    }
  };

  unSelect = () => {
    if (this.data.selected) {
      this.data.selected = false;
      this.selectedBorderSprite.visible = false;
    }
  };

  switchShown(flag) {
    this.data.shownData.arrow = flag;
    this.arrow.visible = flag;
    // if (flag) {
    //   this.selectedBorderSprite.visible = this.data.selected;
    // } else {
    //   this.selectedBorderSprite.visible = false;
    // }
  }

  plusAction(texture) {
    if (texture) {
      const distanceInt = parseInt(this.distance, 10) - CellWidth;
      const actionSprite = new PIXI.Sprite(texture);
      actionSprite.x = 180;
      actionSprite.y = -distanceInt * 0.3;
      actionSprite.width = 250;
      actionSprite.height = 250;
      actionSprite.anchor.set(0.5);
      actionSprite.alpha = 0.8;
      this.addChild(actionSprite);
      this.data.set('$action', actionSprite);
    }
  }

  removeAction() {
    const actionSprite = this.data.get('$action');
    if (actionSprite) {
      this.removeChild(actionSprite);
      actionSprite.destroy();
      this.data.delete('$action');
    }
  }
}
