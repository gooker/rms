import * as PIXI from 'pixi.js';
import { getTextureFromResources } from '@/utils/mapUtils';
import { GlobalAlpha, zIndex } from '@/config/consts';

export default class Intersection extends PIXI.Container {
  constructor(props) {
    super();
    this.x = props.x;
    this.y = props.y;
    this.cellId = props.cellId;
    this.directions = props.directions;
    this.isTrafficCell = props.isTrafficCell;
    this.alpha = GlobalAlpha;
    this.zIndex = zIndex.temporaryLock;
    this.create();
    this.addDireaction();
  }

  create() {
    const intersectionTexture = getTextureFromResources(
      this.isTrafficCell ? 'traffic_control' : 'intersection',
    );
    this.pod = new PIXI.Sprite(intersectionTexture);
    this.pod.height = 500;
    this.pod.width = 500;
    this.pod.anchor.set(0.5);
    this.addChild(this.pod);
  }

  addDireaction() {
    const boldDirectionTexture = PIXI.utils.TextureCache.boldDirection;
    if (!Array.isArray(this.directions)) return;
    const direction = this.directions.map((item) => item.direction).map((item) => `${item}`);

    // 渲染向上的箭头
    if (direction.includes('0')) {
      this.up = new PIXI.Sprite(boldDirectionTexture);
      this.up.angle = 0;
      this.up.anchor.set(0.5, 1);
      this.up.y = -215;
      this.addChild(this.up);
    }

    // 渲染向右的箭头
    if (direction.includes('90')) {
      this.right = new PIXI.Sprite(boldDirectionTexture);
      this.right.angle = 90;
      this.right.anchor.set(0.5, 1);
      this.right.x = 210;
      this.addChild(this.right);
    }

    // 渲染向下的箭头
    if (direction.includes('180')) {
      this.down = new PIXI.Sprite(boldDirectionTexture);
      this.down.angle = 180;
      this.down.anchor.set(0.5, 1);
      this.down.y = 215;
      this.addChild(this.down);
    }

    // 渲染向左的箭头
    if (direction.includes('270')) {
      this.left = new PIXI.Sprite(boldDirectionTexture);
      this.left.angle = 270;
      this.left.anchor.set(0.5, 1);
      this.left.x = -210;
      this.addChild(this.left);
    }
  }
}
