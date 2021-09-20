/* eslint-disable no-console */
import * as PIXI from 'pixi.js';
import Config from '@/config';
import BitText from './BitText';
import { switchAGVState, switchAGVBatteryState, getTextureFromResources } from '@/utils/utils';

export default class LatentAGV extends PIXI.Container {
  constructor(props) {
    super();
    this.id = props.id;
    this.x = props.x;
    this.y = props.y;
    this.type = Config.AGVType.LatentLifting;
    this.alpha = 0.8;
    this.$angle = props.angle; // 不作用于container, 所以不赋值到直接的angle属性
    this.zIndex = Config.zIndex.agv;
    this.state = props.state;
    this.battery = props.battery;
    this.mainTain = props.mainTain;
    this.currentCellId = props.cellId;
    this.inCharging = props.inCharging;
    this.sortableChildren = true;

    this.employer = null; // 标记当前正在为那个工作站服务
    this.employerColor = null; // 标记当前服务的工作站颜色

    this.data = {};
    this.create();
    this.addIdText();
    this.addAGVStateIcon();
    this.addBatteryIcon();
    this.mainTain && this.addMaintainIcon();

    if (props.active) {
      this.agv.interactive = true;
      this.agv.buttonMode = true;
      this.agv.interactiveChildren = false;
      this.agv.on('click', () => props.checkAGV(this.id, this.type));
      this.agv.on('rightclick', () => props.simpleCheckAgv(this.id));
    }
  }

  set angle(value) {
    this.$angle = value;
    if (this.agv) this.agv.angle = value;
    if (this.idText) this.idText.angle = -value;
  }

  get pod() {
    if (this.data.pod) {
      return this.data.pod;
    }
    return null;
  }

  get podId() {
    if (this.data.pod) {
      return this.data.pod.id;
    }
    return null;
  }

  create() {
    const latentState = switchAGVState('latent', this.state)[0];
    if (latentState === undefined) {
      console.warn(`无法识别的小车状态: ${this.state}, 小车: ${this.id}`);
      return;
    }
    const agvTexture = getTextureFromResources(latentState);
    const scaleX = Config.LatentAGVSize.width / agvTexture.width;
    const scaleY = Config.LatentAGVSize.height / agvTexture.height;
    this.agv = new PIXI.Sprite(agvTexture);
    this.agv.anchor.set(0.5);
    this.agv.setTransform(0, 0, scaleX, scaleY);
    this.agv.angle = this.$angle;
    this.agv.zIndex = 2;
    this.addChild(this.agv);
  }

  addIdText() {
    const x = 0;
    const y = this.agv.height / 2.9;
    this.idText = new BitText(this.id, x, y, 0xffffff, 70);
    this.idText.anchor.set(0.5);
    this.idText.angle = -this.$angle;
    this.agv.addChild(this.idText);
  }

  addAGVStateIcon() {
    const x = this.agv.width / 2 - 70;
    const y = -this.agv.height / 2 + 50;
    this.stateIcon = new PIXI.Sprite();
    this.stateIcon.anchor.set(0.5);
    this.stateIcon.setTransform(x, y, 0.08, 0.08, 0, 0, 0, 0);
    this.agv.addChild(this.stateIcon);
    this.updateAGVState(this.state);
  }

  updateAGVState(agvState) {
    this.state = agvState;
    // 重置状态
    if (this.AGVErrorSprite) this.AGVErrorSprite.visible = false;

    // 更新小车状态
    const [agvStatue, state] = switchAGVState('latent', agvState);
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

  addBatteryIcon() {
    if (this.battery === undefined || this.battery === null) return;
    const x = this.agv.width / 2;
    const y = 40;
    const batteryState = switchAGVBatteryState(this.battery);
    const texture = getTextureFromResources(batteryState);
    const batteryIcon = new PIXI.Sprite(texture);
    batteryIcon.anchor.set(1);
    batteryIcon.setTransform(x, y, 0.2, 0.2);
    batteryIcon.angle = 90;
    this.batteryIcon = batteryIcon;
    this.agv.addChild(batteryIcon);
  }

  updateBatteryState(batteryState) {
    this.battery = batteryState;
    const state = switchAGVBatteryState(batteryState);
    this.batteryIcon.texture = getTextureFromResources(state);
  }

  addErrorMaskState() {
    if (!this.AGVErrorSprite) {
      const ErrorMaskTexture = getTextureFromResources('agv_error');
      this.AGVErrorSprite = new PIXI.Sprite(ErrorMaskTexture);
      this.AGVErrorSprite.anchor.set(0.5, 0.62);
      this.AGVErrorSprite.setTransform(0, 0, 0.7, 0.7);
      this.agv.addChild(this.AGVErrorSprite);
    } else {
      this.AGVErrorSprite.visible = true;
    }
  }

  addMaintainIcon() {
    const spannerTexture = getTextureFromResources('maintain_2');
    this.spannerSprite = new PIXI.Sprite(spannerTexture);
    this.spannerSprite.anchor.set(0.5);
    this.spannerSprite.setTransform(0, 0, 0.9, 0.9);
    this.spannerSprite.zIndex = 100;
    this.agv.addChild(this.spannerSprite);
  }

  updateMainTainState(mainTain) {
    this.mainTain = mainTain;
    if (!this.spannerSprite) {
      this.addMaintainIcon();
    }
    this.spannerSprite.visible = mainTain;
  }

  upPod(pod) {
    // 已经驮着就直接返回此Pod的id
    if (this.data.pod && this.data.pod.id) {
      return this.data.pod.id;
    }
    this.data.pod = pod;
    this.addChild(this.data.pod);
    return this.data.pod.id;
  }

  downPod() {
    if (this.data.pod) {
      const podId = this.data.pod.id;
      this.removeChild(this.data.pod);
      this.data.pod.destroy({ children: true });
      this.data.pod = null;
      return podId;
    }
    return null;
  }

  // Marker
  createEmployerMark(color) {
    this.destroyEmployerMark();
    this.selectedBorderSprite = new PIXI.Sprite(PIXI.utils.TextureCache.agvSelectBorderTexture);
    this.selectedBorderSprite.anchor.set(0.5);
    this.selectedBorderSprite.width = 1350;
    this.selectedBorderSprite.height = 1350;
    this.selectedBorderSprite.zIndex = 1;
    this.selectedBorderSprite.tint = color.replace('#', '0x');
    this.addChild(this.selectedBorderSprite);
  }

  destroyEmployerMark() {
    if (this.selectedBorderSprite) {
      this.removeChild(this.selectedBorderSprite);
      this.selectedBorderSprite.destroy();
      this.selectedBorderSprite = null;
    }
  }

  switchMarkerShown = (isShown, workStation, color) => {
    if (isShown) {
      this.createEmployerMark(color);
    } else {
      this.destroyEmployerMark();
    }
    this.employer = workStation;
    this.employerColor = color;
  };
}
