/* eslint-disable no-console */
import * as PIXI from 'pixi.js';
import { AGVType } from '@/config/config';
import { ForkLiftAGVSize, zIndex } from '@/config/consts';
import BitText from './BitText';
import ForkFreight from './ForkFreight';
import { isNull } from '@/utils/utils';
import { switchAGVState, switchAGVBatteryState, getTextureFromResources } from '@/utils/mapUtils';

export default class ForkLiftAGV extends PIXI.Container {
  constructor(props) {
    super();
    this.id = props.id;
    this.x = props.x;
    this.y = props.y;
    this.alpha = 0.8;
    this.type = AGVType.ForkLifting;
    this.width = ForkLiftAGVSize.width;
    this.height = ForkLiftAGVSize.height;
    this.currentCellId = props.currentCellId;
    this.angle = props.angle;
    this.state = props.state;
    this.battery = props.battery;
    this.mainTain = props.mainTain;
    this.zIndex = zIndex.agv;
    this.inCharging = props.inCharging;
    this.anchorPercent = ForkLiftAGVSize.radius / ForkLiftAGVSize.height;

    this.data = {};
    this.employer = null; // 标记当前正在为那个工作站服务
    this.employerColor = null; // 标记当前服务的工作站颜色

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

  setAngle(value) {
    this.angle = value;
    if (this.idText) this.idText.angle = -value;
  }

  create() {
    const forliftState = switchAGVState('forklift', this.state)[0];
    if (forliftState === undefined) {
      console.warn(`无法识别的小车状态: ${this.state}, 小车: ${this.id}`);
      return;
    }
    const agvTexture = getTextureFromResources(forliftState);
    const scaleX = ForkLiftAGVSize.width / agvTexture.width;
    const scaleY = ForkLiftAGVSize.height / agvTexture.height;
    this.agv = new PIXI.Sprite(agvTexture);
    this.agv.anchor.set(0.5, this.anchorPercent);
    this.agv.setTransform(0, 0, scaleX, scaleY);
    this.addChild(this.agv);
  }

  addIdText() {
    const x = 0;
    const y = -this.agv.height * 0.8;
    this.idText = new BitText(this.id, x, y, 0xffffff, 200);
    this.idText.anchor.set(0.5);
    this.idText.angle = -this.angle;
    this.addChild(this.idText);
  }

  addAGVStateIcon() {
    const x = this.agv.width / 2 - 70;
    const y = -this.agv.height * 0.75;
    this.stateIcon = new PIXI.Sprite();
    this.stateIcon.anchor.set(0.5);
    this.stateIcon.setTransform(x, y, 0.15, 0.15);
    this.addChild(this.stateIcon);
    this.updateAGVState(this.state);
  }

  updateAGVState(agvState) {
    this.state = agvState;
    // 重置状态
    if (this.AGVErrorSprite) this.AGVErrorSprite.visible = false;

    // 更新小车状态
    const [agvStatue, state] = switchAGVState('forklift', agvState);
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
      this.AGVErrorSprite.anchor.set(0.5);
      this.AGVErrorSprite.setTransform(0, -this.agv.height * 0.45, 1, 1);
      this.addChild(this.AGVErrorSprite);
    } else {
      this.AGVErrorSprite.visible = true;
    }
  }

  addBatteryIcon() {
    if (isNull(this.battery)) return;
    const x = this.agv.width / 1.7;
    const y = -this.agv.height * 0.5;
    const batteryState = switchAGVBatteryState(this.battery);
    const texture = getTextureFromResources(batteryState);
    const batteryIcon = new PIXI.Sprite(texture);
    batteryIcon.anchor.set(0.5);
    batteryIcon.setTransform(x, y, 0.3, 0.3);
    batteryIcon.angle = 90;
    this.batteryIcon = batteryIcon;
    this.addChild(batteryIcon);
  }

  updateBatteryState(batteryState) {
    const state = switchAGVBatteryState(batteryState);
    if (this.batteryIcon) {
      this.batteryIcon.texture = getTextureFromResources(state);
    }
  }

  addMaintainIcon() {
    const spannerTexture = getTextureFromResources('maintain_2');
    const spannerSprite = new PIXI.Sprite(spannerTexture);
    spannerSprite.anchor.set(0.5);
    const x = this.agv.width / 1.7;
    const y = -this.agv.height / 4.3;
    spannerSprite.setTransform(x, y, 0.4, 0.4);
    this.spannerSprite = spannerSprite;
    this.addChild(spannerSprite);
  }

  updateMainTainState(mainTain) {
    this.mainTain = mainTain;
    if (!this.spannerSprite) {
      this.addMaintainIcon();
    }
    this.spannerSprite.visible = mainTain;
  }

  upPod(pod) {
    if (this.data.pod) {
      return this.data.pod;
    }
    const { longSide, shortSide } = pod;
    const forkPod = new ForkFreight({
      x: 0,
      y: 0,
      width: longSide,
      height: shortSide,
    });
    this.data.pod = forkPod;
    this.addChild(this.data.pod);
  }

  downPod() {
    if (this.data.pod) {
      this.removeChild(this.data.pod);
      this.data.pod.destroy({ children: true });
      this.data.pod = null;
    }
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
