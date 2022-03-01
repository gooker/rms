import * as PIXI from 'pixi.js';

export default class BackImg extends PIXI.Container {
  constructor(props) {
    super();
    this.x = props.x;
    this.y = props.y;
    this.zIndex = 0.5;
    // this.alpha = 0.7;
    this.code = props.code;
    this.angle = props.angle || 0;
    this.$visible = props.showBackImg;
    this.$alpha = props.opacity || 1;
    this.$angle = props.angle || 0; //// 仅用于纠正名称角度
    this.color = props.labelColor ? props.labelColor.replace('#', '0x') : '0x3697B4';
    this.drawBack(props);
    if (props.name) {
      this.addName(props);
    }
  }
  drawBack(props) {
    let boxType = null;
    if (props.type === 'image') {
      boxType = 'image';
    } else {
      if (props.shape === 'Rect') {
        boxType = 'Rect';
      } else {
        boxType = 'Circle';
      }
    }
    this.boxType = boxType;
    switch (boxType) {
      case 'image':
        this.drawImg(props);
        break;
      case 'Rect':
        this.drawRect(props);
        break;
      case 'Circle':
        this.drawCircle(props);
        break;
      default:
        break;
    }
    return boxType;
  }

  drawImg(props) {
    // 图片
    const base = new PIXI.BaseTexture(props.imageUrl);
    const texture = new PIXI.Texture(base);
    this.sprite = new PIXI.Sprite(texture);
    this.sprite.height = props.height;
    this.sprite.width = props.width;
    this.sprite.visible = this.$visible;
    this.sprite.alpha = this.$alpha;
    this.sprite.anchor.set(0.5);
    this.addChild(this.sprite);
  }

  drawRect(props) {
    // 线框
    const graphicsRect = new SmoothGraphics();
    graphicsRect.clear();
    graphicsRect.lineStyle(45, this.color, 1);
    graphicsRect.beginFill(this.color, this.$alpha);
    graphicsRect.drawRect(0, 0, props.width, props.height);
    graphicsRect.endFill();

    const texture = window.PixiUtils.renderer.generateTexture(graphicsRect);
    this.graphicsRectSprite = new PIXI.Sprite(texture);
    this.graphicsRectSprite.visible = this.$visible;
    this.graphicsRectSprite.anchor.set(0.5);
    this.addChild(this.graphicsRectSprite);
  }

  drawCircle(props) {
    const circle = new SmoothGraphics();
    circle.clear();
    circle.lineStyle(45, this.color, 1);
    circle.beginFill(this.color, this.$alpha);
    circle.drawCircle(0, 0, props.radius);
    circle.endFill();
    const texture = window.PixiUtils.renderer.generateTexture(circle);
    this.circleBackSprite = new PIXI.Sprite(texture);
    this.circleBackSprite.visible = this.$visible;
    this.circleBackSprite.anchor.set(0.5);
    this.addChild(this.circleBackSprite);
  }

  addName(props) {
    let _leftwidth = null;
    let _leftheight = null;
    let _offsetX = (props.xoffset / 100).toFixed(2) * 1;
    let _offsetY = (props.yoffset / 100).toFixed(2) * 1;
    if (props.height && props.width) {
      _leftwidth = -props.width / 2 + props.width * _offsetX;
      _leftheight = -props.height / 2 + props.height * _offsetY;
    } else {
      _leftwidth = -props.radius + props.radius * 2 * _offsetX;
      _leftheight = -props.radius + props.radius * 2 * _offsetY;
    }
    const style = {
      fontFamily: 'Arial',
      fontSize: props.fontSize,
      fontWeight: 'bold',
      fill: '0xFFFFFF',
    };
    this.labelSprite = new PIXI.Text(props.name, style);
    this.labelSprite.visible = this.$visible;
    this.labelSprite.anchor.set(0.5);
    this.labelSprite.angle = -this.$angle;
    this.labelSprite.x = _leftwidth;
    this.labelSprite.y = _leftheight;

    this.addChild(this.labelSprite);
  }

  switchBackImgEntityShown(flag) {
    if (this.sprite) {
      this.sprite.visible = flag;
    }
    if (this.graphicsRectSprite) {
      this.graphicsRectSprite.visible = flag;
    }
    if (this.circleBackSprite) {
      this.circleBackSprite.visible = flag;
    }

    if (this.labelSprite) {
      this.labelSprite.visible = flag;
    }
  }
}
