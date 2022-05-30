import * as PIXI from 'pixi.js';
import BitText from './BitText';
import ForkFreight from './ForkFreight';
import { getTextureFromResources, switchVehicleBatteryState, switchVehicleState } from '@/utils/mapUtil';
import { isNull } from '@/utils/util';
import { VehicleType } from '@/config/config';
import { ForkLiftVehicleSize, MonitorSelectableSpriteType, zIndex } from '@/config/consts';

export default class ForkLiftVehicle extends PIXI.Container {
  constructor(props) {
    super();
    this.type = MonitorSelectableSpriteType.ForkLifting;
    this.id = props.id;
    this.x = props.x;
    this.y = props.y;
    this.alpha = 0.8;
    this.type = VehicleType.ForkLifting;
    this.width = ForkLiftVehicleSize.width;
    this.height = ForkLiftVehicleSize.height;
    this.currentCellId = props.currentCellId;
    this.angle = props.angle;
    this.state = props.state;
    this.battery = props.battery;
    this.mainTain = props.mainTain;
    this.manualMode = props.manualMode;
    this.zIndex = zIndex.vehicle;
    this.inCharging = props.inCharging;
    this.anchorPercent = ForkLiftVehicleSize.radius / ForkLiftVehicleSize.height;

    this.employer = null; // 标记当前正在为那个工作站服务

    this.data = {};
    this.create();
    this.addIdText();
    this.addVehicleStateIcon();
    this.addBatteryIcon();
    this.addManuallyModeIcon();
    this.mainTain && this.addMaintainIcon();

    if (props.active) {
      this.vehicle.interactive = true;
      this.vehicle.buttonMode = true;
      this.vehicle.interactiveChildren = false;
      this.vehicle.on('click', () => props.checkVehicle(this.id, this.type));
      this.vehicle.on('rightclick', () => props.simpleCheckVehicle(this.id));
    }
  }

  setAngle(value) {
    this.angle = value;
    if (this.idText) this.idText.angle = -value;
  }

  create() {
    const forliftState = switchVehicleState('forklift', this.state)[0];
    if (forliftState === undefined) {
      console.warn(`无法识别的小车状态: ${this.state}, 小车: ${this.id}`);
      return;
    }
    const vehicleTexture = getTextureFromResources(forliftState);
    const scaleX = ForkLiftVehicleSize.width / vehicleTexture.width;
    const scaleY = ForkLiftVehicleSize.height / vehicleTexture.height;
    this.vehicle = new PIXI.Sprite(vehicleTexture);
    this.vehicle.anchor.set(0.5, this.anchorPercent);
    this.vehicle.setTransform(0, 0, scaleX, scaleY);
    this.addChild(this.vehicle);
  }

  addIdText() {
    const x = 0;
    const y = -this.vehicle.height * 0.8;
    this.idText = new BitText(this.id, x, y, 0xffffff, 200);
    this.idText.anchor.set(0.5);
    this.idText.angle = -this.angle;
    this.addChild(this.idText);
  }

  addVehicleStateIcon() {
    const x = this.vehicle.width / 2 - 70;
    const y = -this.vehicle.height * 0.75;
    this.stateIcon = new PIXI.Sprite();
    this.stateIcon.anchor.set(0.5);
    this.stateIcon.setTransform(x, y, 0.15, 0.15);
    this.addChild(this.stateIcon);
    this.updateVehicleState(this.state);
  }

  updateVehicleState(vehicleState) {
    this.state = vehicleState;
    // 重置状态
    if (this.VehicleErrorSprite) this.VehicleErrorSprite.visible = false;

    // 更新小车状态
    const [vehicleStatue, state] = switchVehicleState('forklift', vehicleState);
    const vehicleTexture = getTextureFromResources(vehicleStatue);
    if (vehicleTexture === undefined) {
      console.warn(`无法识别的小车状态: ${vehicleState}, 小车: ${this.id}`);
      return;
    }
    this.vehicle.texture = vehicleTexture;
    this.stateIcon.texture = getTextureFromResources(state);

    // 如果是 error或者offline 小车要添加特殊纹理
    if (state === 'error') {
      this.addErrorMaskState();
    } else {
      if (this.VehicleErrorSprite) this.VehicleErrorSprite.visible = false;
    }

    if (state === 'offline') {
      this.addOfflineIcon();
    } else {
      if (this.VehicleOfflineSprite) this.VehicleOfflineSprite.visible = false;
    }
  }

  addOfflineIcon() {
    const offlineTexture = getTextureFromResources('offline');
    this.VehicleOfflineSprite = new PIXI.Sprite(offlineTexture);
    this.VehicleOfflineSprite.alpha = 0.8;
    this.VehicleOfflineSprite.anchor.set(0.5);
    this.VehicleOfflineSprite.zIndex = 100;
    this.vehicle.addChild(this.VehicleOfflineSprite);
  }

  addErrorMaskState() {
    if (!this.VehicleErrorSprite) {
      const ErrorMaskTexture = getTextureFromResources('vehicle_error');
      this.VehicleErrorSprite = new PIXI.Sprite(ErrorMaskTexture);
      this.VehicleErrorSprite.anchor.set(0.5);
      this.VehicleErrorSprite.setTransform(0, -this.vehicle.height * 0.45, 1, 1);
      this.addChild(this.VehicleErrorSprite);
    } else {
      this.VehicleErrorSprite.visible = true;
    }
  }

  addBatteryIcon() {
    if (isNull(this.battery)) return;
    const x = this.vehicle.width / 1.7;
    const y = -this.vehicle.height * 0.5;
    const batteryState = switchVehicleBatteryState(this.battery);
    const texture = getTextureFromResources(batteryState);
    const batteryIcon = new PIXI.Sprite(texture);
    batteryIcon.anchor.set(0.5);
    batteryIcon.setTransform(x, y, 0.3, 0.3);
    batteryIcon.angle = 90;
    this.batteryIcon = batteryIcon;
    this.addChild(batteryIcon);
  }

  updateBatteryState(batteryState) {
    const state = switchVehicleBatteryState(batteryState);
    if (this.batteryIcon) {
      this.batteryIcon.texture = getTextureFromResources(state);
    }
  }

  addMaintainIcon() {
    const spannerTexture = getTextureFromResources('maintain');
    const spannerSprite = new PIXI.Sprite(spannerTexture);
    spannerSprite.anchor.set(0.5);
    const x = this.vehicle.width / 1.7;
    const y = -this.vehicle.height / 4.3;
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

  upPod(pod) {
    if (this.data.pod) {
      return this.data.pod;
    }
    const { longSide, shortSide } = pod;
    this.data.pod = new ForkFreight({
      x: 0,
      y: 0,
      width: longSide,
      height: shortSide,
    });
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
    this.selectedBorderSprite = new PIXI.Sprite(PIXI.utils.TextureCache.vehicleSelectBorderTexture);
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
