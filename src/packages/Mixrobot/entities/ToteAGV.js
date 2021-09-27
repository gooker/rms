/* eslint-disable no-console */
import * as PIXI from 'pixi.js';
import { GlobalAlpha, ToteAGVSize, zIndex } from '@/consts';
import { AGVType } from '@/config/config';
import BitText from './BitText';
import { isStrictNull } from '@/utils/utils';
import { switchAGVState, switchAGVBatteryState, getTextureFromResources } from '@/utils/mapUtils';

export default class ToteAGV extends PIXI.Container {
  constructor(props) {
    super();
    this.id = props.id;
    this.x = props.x;
    this.y = props.y;
    this.type = AGVType.Tote;
    this.width = ToteAGVSize.width;
    this.height = ToteAGVSize.height;
    this.currentCellId = props.cellId;
    this.angle = props.angle;
    this.alpha = GlobalAlpha;
    this.zIndex = zIndex.agv;
    this.state = props.state;
    this.battery = props.battery;
    this.mainTain = props.mainTain;
    this.shelfs = props.shelfs;
    this.toteCodes = props.toteCodes;
    this.inCharging = props.inCharging;
    this.shelfMap = new Map(); // {层数: Shelf}; 料箱车身货架,从1开始
    this.toteMap = new Map(); // {层数: Bin}; 料箱车上的料箱, 从1开始

    this.data = {};
    this.employer = null; // 标记当前正在为那个工作站服务
    this.employerColor = null; // 标记当前服务的工作站颜色

    this.create();
    this.addIdText();
    this.addShelfs();
    this.addBatteryIcon();
    this.addAGVStateIcon();
    this.updateTotes(this.toteCodes);
    this.mainTain && this.addMaintainIcon();

    if (props.active) {
      this.agv.interactive = true;
      this.agv.buttonMode = true;
      this.agv.interactiveChildren = false;
      this.agv.on('click', () => props.checkAGV(this.id, this.type));
      this.agv.on('rightclick', () => props.simpleCheckAgv(this.id));
    }
  }

  setAngle(value) {
    this.angle = value;
    if (this.idText) this.idText.angle = -value;
  }

  create() {
    const toteState = switchAGVState('tote', this.state)[0];
    if (toteState === undefined) {
      console.warn(`无法识别的小车状态: ${this.state}, 小车: ${this.id}`);
      return;
    }
    const toteAGVTexture = getTextureFromResources(toteState);
    this.agv = new PIXI.Sprite(toteAGVTexture);
    this.agv.anchor.set(0.5);
    this.agv.width = ToteAGVSize.width;
    this.agv.height = ToteAGVSize.height;
    this.addChild(this.agv);
  }

  addIdText() {
    const y = -ToteAGVSize.height / 4 - 30;
    this.idText = new BitText(this.id, -60, y, 0xffffff, 200);
    this.idText.anchor.set(0.5);
    this.idText.angle = -this.angle;
    this.addChild(this.idText);
  }

  // 料箱车状态
  addAGVStateIcon() {
    const x = ToteAGVSize.width / 2;
    const y = -ToteAGVSize.height / 2;
    this.stateIcon = new PIXI.Sprite();
    this.stateIcon.anchor.set(1);
    this.stateIcon.setTransform(x, y, 0.15, 0.15, 0, 0, 0, 0);
    this.addChild(this.stateIcon);
    this.updateAGVState(this.state);
  }

  updateAGVState(agvState) {
    this.state = agvState;
    // 重置状态
    if (this.AGVErrorSprite) this.AGVErrorSprite.visible = false;

    // 更新小车状态
    const [agvStatue, state] = switchAGVState('tote', agvState);
    const agvTexture = getTextureFromResources(agvStatue);
    if (agvTexture === undefined) {
      console.warn(`无法识别的小车状态: ${agvState}, 小车: ${this.id}`);
      return;
    }
    this.agv.texture = agvTexture;
    this.stateIcon.texture = getTextureFromResources(state);

    // 如果是 error或者offline 小车要添加特殊纹理
    if (state === 'error') {
      this.addErrorMaskState();
    }
  }

  addErrorMaskState() {
    if (!this.AGVErrorSprite) {
      const ErrorMaskTexture = getTextureFromResources('agv_error');
      this.AGVErrorSprite = new PIXI.Sprite(ErrorMaskTexture);
      this.AGVErrorSprite.anchor.set(0.5, 0.62);
      this.AGVErrorSprite.setTransform(0, 0, 1.3, 1.3);
      this.addChild(this.AGVErrorSprite);
    } else {
      this.AGVErrorSprite.visible = true;
    }
  }

  // 料箱车电池状态
  addBatteryIcon() {
    if (this.battery === undefined || this.battery === null) return;
    const x = 0;
    const y = -ToteAGVSize.height / 2 - 30;
    const batteryState = switchAGVBatteryState(this.battery);
    const texture = getTextureFromResources(batteryState);
    this.batteryIcon = new PIXI.Sprite(texture);
    this.batteryIcon.anchor.set(0.5, 1);
    this.batteryIcon.setTransform(x, y, 0.3, 0.3);
    this.addChild(this.batteryIcon);
  }

  updateBatteryState(batteryState) {
    this.battery = batteryState;
    const state = switchAGVBatteryState(batteryState);
    this.batteryIcon.texture = getTextureFromResources(state);
  }

  // 料箱车维护状态
  addMaintainIcon() {
    const spannerTexture = getTextureFromResources('maintain_2');
    const spannerSprite = new PIXI.Sprite(spannerTexture);
    spannerSprite.anchor.set(0.5);
    const x = this.agv.width / 2 + 60;
    const y = 200;
    spannerSprite.setTransform(x, y, 0.25, 0.25, 0, 0, 0, 0);
    this.spannerSprite = spannerSprite;
    this.agv.addChild(spannerSprite);
  }

  updateMainTainState(mainTain) {
    this.mainTain = mainTain;
    if (!this.spannerSprite) {
      this.addMaintainIcon();
    }
    this.spannerSprite.visible = mainTain;
  }

  // 料箱车货架设置
  refreshShelfs(shelf) {
    // 如果料箱车已经存在料箱就不用刷新
    if (this.shelfs !== 0 || this.shelfMap.size === 0) {
      this.shelfs = shelf;
      this.addShelfs();
    }
  }

  // 渲染车身背篓
  addShelfs() {
    // offset是左右货架的间隔距离
    const offset = 30;
    // 缓存货架尺寸用于放置料箱时计算料箱尺寸
    this.shelfSize = 400;
    const beginX =
      -(this.shelfs * this.shelfSize + (this.shelfs - 1) * offset) / 2 + this.shelfSize / 2;
    for (let index = 0; index < this.shelfs; index++) {
      const shelfTexture = getTextureFromResources('tote_shelf');
      const shelf = new PIXI.Sprite(shelfTexture);
      shelf.anchor.set(0.5);
      const scaleX = this.shelfSize / shelfTexture.width;
      const scaleY = this.shelfSize / shelfTexture.height;
      shelf.setTransform(
        beginX + (this.shelfSize + offset) * index,
        ToteAGVSize.height / 2 + 220,
        scaleX,
        scaleY,
      );
      this.addChild(shelf);
      // 缓存货架对象
      this.shelfMap.set(`${index + 1}`, shelf);
    }
  }

  // 更新车身背篓里的料箱
  updateTotes(totes) {
    // const toteBinTexture = getTextureFromResources('tote_bin');
    // 缓存料箱信息
    this.data.totes = totes;

    // 清除料箱车上所有料箱
    this.toteMap.forEach((toteBin) => {
      this.removeChild(toteBin);
      toteBin.destroy();
    });
    this.toteMap.clear();

    // 渲染新的料箱
    const totesCount = totes.filter((tote) => tote !== null).length;
    for (let shelfIndex = 1; shelfIndex <= totesCount; shelfIndex++) {
      const shelfEntity = this.shelfMap.get(`${shelfIndex}`);
      if (shelfEntity) {
        const toteSize = this.shelfSize * 0.6;
        const toteBin = new PIXI.Sprite(PIXI.Texture.WHITE);
        toteBin.x = shelfEntity.x;
        toteBin.y = shelfEntity.y;
        toteBin.width = toteSize;
        toteBin.height = toteSize;
        toteBin.anchor.set(0.5);
        toteBin.tint = 0xf48924;
        this.addChild(toteBin);
        this.toteMap.set(`${shelfIndex}`, toteBin);
      }
    }
  }

  // 更新抱夹上的料箱
  updateHolding(holdingTote) {
    // 缓存抱夹上的料箱信息
    this.data.holdingTote = holdingTote;

    // 切换显示抱夹状态
    if (!isStrictNull(holdingTote)) {
      if (this.holdingSprite) {
        this.holdingSprite.visible = true;
      } else {
        this.addToteHolding();
      }
    } else {
      if (this.holdingSprite) {
        this.holdingSprite.visible = false;
      }
    }
  }

  addToteHolding() {
    const holdingTexture = getTextureFromResources('bin');
    this.holdingSprite = new PIXI.Sprite(holdingTexture);
    this.holdingSprite.anchor.set(0.5);
    this.holdingSprite.setTransform(-20, -115, 0.6, 0.55, -Math.PI / 2);
    this.agv.addChild(this.holdingSprite);
  }

  // Marker
  createEmployerMark(color) {
    this.selectedBorderSprite = new PIXI.Sprite(PIXI.utils.TextureCache.agvSelectBorderTexture);
    this.selectedBorderSprite.anchor.set(0.5);
    this.selectedBorderSprite.width = 1350;
    this.selectedBorderSprite.height = 1350;
    this.selectedBorderSprite.zIndex = 1;
    this.selectedBorderSprite.tint = color.replace('#', '0x');
    this.addChild(this.selectedBorderSprite);
  }

  switchMarkerShown = (isShown, workStation, color) => {
    if (isShown) {
      if (this.selectedBorderSprite) {
        this.selectedBorderSprite.tint = color.replace('#', '0x');
        this.selectedBorderSprite.visible = true;
      } else {
        this.createEmployerMark(color);
      }
    } else {
      this.selectedBorderSprite.visible = false;
    }
    this.employer = workStation;
    this.employerColor = color;
  };
}
