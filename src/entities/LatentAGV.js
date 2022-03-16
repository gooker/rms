import * as PIXI from 'pixi.js';
import { SmoothGraphics } from '@pixi/graphics-smooth';
import BitText from './BitText';
import { isNull } from '@/utils/util';
import { switchAGVState, switchAGVBatteryState, getTextureFromResources } from '@/utils/mapUtil';
import { zIndex, LatentAGVSize, SelectionType, MonitorSelectableSpriteType } from '@/config/consts';

export default class LatentAGV extends PIXI.Container {
  constructor(props) {
    super();
    this.id = props.id;
    this.x = props.x;
    this.y = props.y;
    this.type = MonitorSelectableSpriteType.LatentLifting;
    this.alpha = 0.8;
    this.$angle = props.angle; // 不作用于container, 所以不赋值到直接的angle属性
    this.zIndex = zIndex.agv;
    this.state = props.state;
    this.battery = props.battery;
    this.mainTain = props.mainTain;
    this.manualMode = props.manualMode;
    this.currentCellId = props.cellId;
    this.inCharging = props.inCharging;
    this.errorLevel = props.errorLevel;

    this.employer = null; // 标记当前正在为那个工作站服务

    this.data = {};
    this.create();
    this.addIdText();
    this.addAGVStateIcon();
    this.addBatteryIcon();
    this.addManuallyModeIcon();
    this.addErrorLevelIcon();
    this.mainTain && this.addMaintainIcon();

    this.select = props.select;
    this.selected = false; // 是否被框选
    this.createSelectionBorder();

    this.agv.interactive = true;
    this.agv.buttonMode = true;
    this.agv.interactiveChildren = false;
    this.agv.on('pointerdown', this.click);
    // this.agv.on('rightclick', () => props.simpleCheckAgv(this.id));
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

  // 创建选择边框
  createSelectionBorder() {
    const scaleBase = 1.2;
    this.selectionBorder = new SmoothGraphics();
    this.selectionBorder.lineStyle(5, 0xff0000);
    const { width, height } = this.getLocalBounds();
    this.selectionBorder.drawRect(0, 0, width * scaleBase, height * scaleBase);
    this.selectionBorder.alpha = 0.8;
    this.selectionBorder.pivot = { x: (width * scaleBase) / 2, y: (height * scaleBase) / 2 };
    this.selectionBorder.visible = false;
    this.addChild(this.selectionBorder);
  }

  // 选择相关
  onSelect = () => {
    if (!this.selected) {
      this.selected = true;
      this.selectionBorder.visible = true;
    }
  };

  onUnSelect = () => {
    if (this.selected) {
      this.selected = false;
      this.selectionBorder.visible = false;
    }
  };

  click = (event) => {
    if (event?.data.originalEvent.ctrlKey || event?.data.originalEvent.metaKey) {
      if (!this.selected) {
        this.onSelect();
        this.select && this.select(this, SelectionType.CTRL);
      }
    } else {
      this.selected ? this.onUnSelect() : this.onSelect();
      this.select && this.select(this, SelectionType.SINGLE);
    }
  };

  create() {
    const latentState = switchAGVState('latent', this.state)[0];
    if (latentState === undefined) {
      console.warn(`无法识别的小车状态: ${this.state}, 小车: ${this.id}`);
      return;
    }
    const agvTexture = getTextureFromResources(latentState);
    const scaleX = LatentAGVSize.width / agvTexture.width;
    const scaleY = LatentAGVSize.height / agvTexture.height;
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

    // 更新小车状态
    const [agvStatue, state] = switchAGVState('latent', agvState);
    const agvTexture = getTextureFromResources(agvStatue);
    if (agvTexture === undefined) {
      console.warn(`无法识别的小车状态: ${agvState}, 小车: ${this.id}`);
      return;
    }
    this.agv.texture = agvTexture;
    this.stateIcon.texture = getTextureFromResources(state);

    if (state === 'offline') {
      this.addOfflineIcon();
    } else {
      if (this.AGVOfflineSprite) this.AGVOfflineSprite.visible = false;
    }
  }

  // -----     手动模式   ------ //
  addManuallyModeIcon() {
    const manuallyTexture = getTextureFromResources('agv_manually');
    this.agvManuallySprite = new PIXI.Sprite(manuallyTexture);
    this.agvManuallySprite.anchor.set(0.5);
    this.agvManuallySprite.zIndex = 100;
    this.agvManuallySprite.visible = this.manualMode;
    this.agv.addChild(this.agvManuallySprite);
  }

  updateManuallyMode(manualMode) {
    this.manualMode = manualMode;
    this.agvManuallySprite.visible = manualMode;
  }
  // -----     手动模式   ------ //

  addOfflineIcon() {
    const offlineTexture = getTextureFromResources('offline');
    this.AGVOfflineSprite = new PIXI.Sprite(offlineTexture);
    this.AGVOfflineSprite.alpha = 0.8;
    this.AGVOfflineSprite.anchor.set(0.5);
    this.AGVOfflineSprite.zIndex = 100;
    this.agv.addChild(this.AGVOfflineSprite);
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

  //  小车显示错误等级 0:无错误; 1:error错误;  2:warn错误; 3:info错误
  addErrorLevelIcon() {
    if (isNull(this.errorLevel)) return;
    const _textureName = `errorLevel_${this.errorLevel}`;
    if (!this.AGVErrorSprite) {
      const ErrorMaskTexture = getTextureFromResources(_textureName);
      this.AGVErrorSprite = new PIXI.Sprite(ErrorMaskTexture);
      this.AGVErrorSprite.anchor.set(0.5, 0.62);
      this.agv.addChild(this.AGVErrorSprite);
    }
    if (this.errorLevel === 0) {
      this.AGVErrorSprite.visible = false;
    }
  }

  updateErrorLevel(errorLevel) {
    this.errorLevel = errorLevel;
    if (errorLevel === 0) {
      this.AGVErrorSprite.visible = false;
    } else {
      const _textureName = `errorLevel_${errorLevel}`;
      this.AGVErrorSprite.texture = getTextureFromResources(_textureName);
      this.AGVErrorSprite.visible = true;
    }
  }

  addMaintainIcon() {
    const spannerTexture = getTextureFromResources('maintain');
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
