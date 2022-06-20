import * as PIXI from 'pixi.js';
import { SmoothGraphics } from '@pixi/graphics-smooth';
import BitText from './BitText';
import { isNull } from '@/utils/util';
import { getTextureFromResources, switchVehicleBatteryState, switchVehicleState } from '@/utils/mapUtil';
import { LatentVehicleSize, MonitorSelectableSpriteType, SelectionType, zIndex } from '@/config/consts';

export default class LatentVehicle extends PIXI.Container {
  constructor(props) {
    super();
    this.id = props.id;
    this.x = props.x;
    this.y = props.y;
    this.type = MonitorSelectableSpriteType.Vehicle;
    this.uniqueId = props.uniqueId;
    this.vehicleType = props.vehicleType;
    this.vehicleIcon = props.vehicleIcon;
    this.alpha = 0.8;
    this.cullable = true;
    this.$angle = props.angle; // 不作用于container, 所以不赋值到直接的angle属性
    this.zIndex = zIndex.vehicle;
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
    this.addVehicleStateIcon();
    this.addBatteryIcon();
    this.addManuallyModeIcon();
    this.addErrorLevelIcon();
    this.mainTain && this.addMaintainIcon();

    this.select = props.select;
    this.selected = false; // 是否被框选
    this.createSelectionBorder();

    this.vehicle.interactive = true;
    this.vehicle.buttonMode = true;
    this.vehicle.interactiveChildren = false;
    this.vehicle.on('pointerdown', this.click);
    // this.vehicle.on('rightclick', () => props.simpleCheckVehicle(this.id));
  }

  set angle(value) {
    this.$angle = value;
    if (this.vehicle) this.vehicle.angle = value;
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
    const latentState = switchVehicleState('latent', this.state)[0];
    if (latentState === undefined) {
      console.warn(`无法识别的小车状态: ${this.state}, 小车: ${this.id}`);
      return;
    }
    const vehicleTexture = getTextureFromResources(latentState);
    const scaleX = LatentVehicleSize.width / vehicleTexture.width;
    const scaleY = LatentVehicleSize.height / vehicleTexture.height;
    this.vehicle = new PIXI.Sprite(vehicleTexture);
    this.vehicle.anchor.set(0.5);
    this.vehicle.setTransform(0, 0, scaleX, scaleY);
    this.vehicle.angle = this.$angle;
    this.vehicle.zIndex = 2;
    this.addChild(this.vehicle);
  }

  addIdText() {
    const x = 0;
    const y = this.vehicle.height / 2.9;
    this.idText = new BitText(this.id, x, y, 0xffffff, 70);
    this.idText.anchor.set(0.5);
    this.idText.angle = -this.$angle;
    this.vehicle.addChild(this.idText);
  }

  addVehicleStateIcon() {
    const x = this.vehicle.width / 2 - 70;
    const y = -this.vehicle.height / 2 + 50;
    this.stateIcon = new PIXI.Sprite();
    this.stateIcon.anchor.set(0.5);
    this.stateIcon.setTransform(x, y, 0.08, 0.08, 0, 0, 0, 0);
    this.vehicle.addChild(this.stateIcon);
    this.updateVehicleState(this.state);
  }

  updateVehicleState(vehicleState) {
    this.state = vehicleState;

    // 更新小车状态
    const [vehicleStatue, state] = switchVehicleState('latent', vehicleState);
    const vehicleTexture = getTextureFromResources(vehicleStatue);
    if (vehicleTexture === undefined) {
      console.warn(`无法识别的小车状态: ${vehicleState}, 小车: ${this.id}`);
      return;
    }
    this.vehicle.texture = vehicleTexture;
    this.stateIcon.texture = getTextureFromResources(state);

    if (state === 'offline') {
      this.addOfflineIcon();
    } else {
      if (this.VehicleOfflineSprite) this.VehicleOfflineSprite.visible = false;
    }
  }

  // -----     手动模式   ------ //
  addManuallyModeIcon() {
    const manuallyTexture = getTextureFromResources('vehicle_manually');
    this.vehicleManuallySprite = new PIXI.Sprite(manuallyTexture);
    this.vehicleManuallySprite.anchor.set(0.5);
    this.vehicleManuallySprite.zIndex = 100;
    this.vehicleManuallySprite.visible = this.manualMode;
    this.vehicle.addChild(this.vehicleManuallySprite);
  }

  updateManuallyMode(manualMode) {
    this.manualMode = manualMode;
    this.vehicleManuallySprite.visible = manualMode;
  }
  // -----     手动模式   ------ //

  addOfflineIcon() {
    const offlineTexture = getTextureFromResources('offline');
    this.VehicleOfflineSprite = new PIXI.Sprite(offlineTexture);
    this.VehicleOfflineSprite.alpha = 0.8;
    this.VehicleOfflineSprite.anchor.set(0.5);
    this.VehicleOfflineSprite.zIndex = 100;
    this.vehicle.addChild(this.VehicleOfflineSprite);
  }

  addBatteryIcon() {
    if (this.battery === undefined || this.battery === null) return;
    const x = this.vehicle.width / 2;
    const y = 40;
    const batteryState = switchVehicleBatteryState(this.battery);
    const texture = getTextureFromResources(batteryState);
    const batteryIcon = new PIXI.Sprite(texture);
    batteryIcon.anchor.set(1);
    batteryIcon.setTransform(x, y, 0.2, 0.2);
    batteryIcon.angle = 90;
    this.batteryIcon = batteryIcon;
    this.vehicle.addChild(batteryIcon);
  }

  updateBatteryState(batteryState) {
    this.battery = batteryState;
    const state = switchVehicleBatteryState(batteryState);
    this.batteryIcon.texture = getTextureFromResources(state);
  }

  //  小车显示错误等级 0:无错误; 1:error错误;  2:warn错误; 3:info错误
  addErrorLevelIcon() {
    if (isNull(this.errorLevel)) return;
    const _textureName = `errorLevel_${this.errorLevel}`;
    if (!this.VehicleErrorSprite) {
      const ErrorMaskTexture = getTextureFromResources(_textureName);
      this.VehicleErrorSprite = new PIXI.Sprite(ErrorMaskTexture);
      this.VehicleErrorSprite.anchor.set(0.5, 0.62);
      this.vehicle.addChild(this.VehicleErrorSprite);
    }
    if (this.errorLevel === 0) {
      this.VehicleErrorSprite.visible = false;
    }
  }

  updateErrorLevel(errorLevel) {
    this.errorLevel = errorLevel;
    if (errorLevel === 0) {
      this.VehicleErrorSprite.visible = false;
    } else {
      const _textureName = `errorLevel_${errorLevel}`;
      this.VehicleErrorSprite.texture = getTextureFromResources(_textureName);
      this.VehicleErrorSprite.visible = true;
    }
  }

  addMaintainIcon() {
    const spannerTexture = getTextureFromResources('maintain');
    this.spannerSprite = new PIXI.Sprite(spannerTexture);
    this.spannerSprite.anchor.set(0.5);
    this.spannerSprite.setTransform(0, 0, 0.9, 0.9);
    this.spannerSprite.zIndex = 100;
    this.vehicle.addChild(this.spannerSprite);
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
    this.selectedBorderSprite = new PIXI.Sprite(PIXI.utils.TextureCache.vehicleSelectBorderTexture);
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
