import * as PIXI from 'pixi.js';
import { getTextureFromResources } from '@/utils/mapUtils';
import { BitText } from '@/entities';
import { GlobalAlpha, zIndex } from '@/config/consts';

export default class TotePod extends PIXI.Container {
  constructor(props) {
    super();
    this.x = props.x;
    this.y = props.y;
    this.angle = props.angle;
    this.side = props.side;
    this.code = props.code;
    this._width = props.width;
    this.depth = props.depth;
    this.disable = props.disable;
    this.binCellId = props.binCellId;
    this.checkTote = props.checkTote;
    this.alpha = GlobalAlpha;
    this.zIndex = zIndex.functionIcon;
    this.visible = true;
    this.sortableChildren = true;

    this.create('pod');
    this.addCodeText();

    // 因为Monitor页面料箱车需要被点击查看料箱信息
    // this.pod.interactive = true;
    // this.pod.buttonMode = true;
    // this.pod.on('click', () => {
    //   this.checkTote && this.checkTote(this.code);
    // });
  }

  create(textureKey) {
    const totePodTexture = getTextureFromResources(textureKey);
    const scaleX = this._width / totePodTexture.width;
    const scaleY = this.depth / totePodTexture.height;
    const totePodSprite = new PIXI.Sprite(totePodTexture);
    totePodSprite.anchor.set(0.5);
    totePodSprite.setTransform(0, 0, scaleX, scaleY);
    totePodSprite.zIndex = 1;
    this.pod = totePodSprite;
    this.addChild(this.pod);
  }

  addCodeText() {
    this.codeText = new BitText(this.code, 0, 0, 0xffffff, 40);
    this.codeText.anchor.set(0.5);
    this.codeText.zIndex = 2;
    this.codeText.angle = -this.angle;
    this.addChild(this.codeText);
  }

  switchShown(flag) {
    this.children.forEach((child) => {
      child.visible = flag;
    });
  }

  highlight(textureKey) {
    if (this.pod) {
      this.removeChild(this.pod);
      this.pod.destroy({ children: true });
      this.pod = null;
    }
    this.create(textureKey);
  }
}
