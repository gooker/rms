/* eslint-disable no-param-reassign */
import * as PIXI from 'pixi.js';
import Config from '@/config';
import { getTextureFromResources } from '@/utils/utils';
import { BitText } from '@/pages/MapTool/entities';

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
    this.alpha = Config.GlobalAlpha;
    this.zIndex = Config.zIndex.groundStorage;
    this.visible = true;
    this.sortableChildren = true;

    this.create();
    this.addCodeText();
    this.addChild(this.pod);

    // 因为Monitor页面料箱车需要被点击查看料箱信息
    // this.pod.interactive = true;
    // this.pod.buttonMode = true;
    // this.pod.on('click', () => {
    //   this.checkTote && this.checkTote(this.code);
    // });
  }

  create() {
    const totePodTexture = getTextureFromResources('bin');
    const scaleX = this._width / totePodTexture.width;
    const scaleY = this.depth / totePodTexture.height;
    const totePodSprite = new PIXI.Sprite(totePodTexture);
    totePodSprite.anchor.set(0.5);
    totePodSprite.setTransform(0, 0, scaleX, scaleY);
    totePodSprite.zIndex = 1;
    this.pod = totePodSprite;
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
}
