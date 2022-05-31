/* eslint-disable no-console */
import * as PIXI from 'pixi.js';
import BitText from './BitText';
import { isNull, isStrictNull } from '@/utils/util';
import { switchVehicleState, switchVehicleBatteryState, getTextureFromResources } from '@/utils/mapUtil';
import { ToteVehicleSize, GlobalAlpha, zIndex, MonitorSelectableSpriteType } from '@/config/consts';
import { VehicleType } from '@/config/config';

export default class ToteVehicle extends PIXI.Container {
  constructor(props) {
    super();
    this.type = MonitorSelectableSpriteType.Tote;
    this.id = props.id;
    this.x = props.x;
    this.y = props.y;
    this.type = VehicleType.Tote;
    this.uniqueId = props.uniqueId;
    this.vehicleType = props.vehicleType;
    this.vehicleIcon = props.vehicleIcon;
    this.width = ToteVehicleSize.width;
    this.height = ToteVehicleSize.height;
    this.currentCellId = props.cellId;
    this.angle = props.angle;
    this.alpha = GlobalAlpha;
    this.zIndex = zIndex.vehicle;
    this.state = props.state;
    this.battery = props.battery;
    this.mainTain = props.mainTain;
    this.manualMode = props.manualMode;
    this.shelfs = props.shelfs;
    this.toteCodes = props.toteCodes;
    this.inCharging = props.inCharging;
    this.errorLevel = props.errorLevel;
    this.shelfMap = new Map(); // {层数: Shelf}; 料箱车身货架,从1开始
    this.toteMap = new Map(); // {层数: Bin}; 料箱车上的料箱, 从1开始

    this.data = {};
    this.employer = null; // 标记当前正在为那个工作站服务
    this.employerColor = null; // 标记当前服务的工作站颜色

    this.create();
    this.addIdText();
    this.addShelfs();
    this.addBatteryIcon();
    this.addVehicleStateIcon();
    this.updateTotes(this.toteCodes);
    this.addManuallyModeIcon();
    this.mainTain && this.addMaintainIcon();
    this.addErrorLevelIcon();

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
    const toteState = switchVehicleState('tote', this.state)[0];
    if (toteState === undefined) {
      console.warn(`无法识别的小车状态: ${this.state}, 小车: ${this.id}`);
      return;
    }
    const toteVehicleTexture = getTextureFromResources(toteState);
    this.vehicle = new PIXI.Sprite(toteVehicleTexture);
    this.vehicle.anchor.set(0.5);
    this.vehicle.width = ToteVehicleSize.width;
    this.vehicle.height = ToteVehicleSize.height;
    this.addChild(this.vehicle);
  }

  addIdText() {
    const y = -ToteVehicleSize.height / 4 - 30;
    this.idText = new BitText(this.id, -60, y, 0xffffff, 200);
    this.idText.anchor.set(0.5);
    this.idText.angle = -this.angle;
    this.addChild(this.idText);
  }

  // 料箱车状态
  addVehicleStateIcon() {
    const x = ToteVehicleSize.width / 2;
    const y = -ToteVehicleSize.height / 2;
    this.stateIcon = new PIXI.Sprite();
    this.stateIcon.anchor.set(1);
    this.stateIcon.setTransform(x, y, 0.15, 0.15, 0, 0, 0, 0);
    this.addChild(this.stateIcon);
    this.updateVehicleState(this.state);
  }

  updateVehicleState(vehicleState) {
    this.state = vehicleState;
    // 重置状态
    if (this.VehicleErrorSprite) this.VehicleErrorSprite.visible = false;

    // 更新小车状态
    const [vehicleStatue, state] = switchVehicleState('tote', vehicleState);
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

  addOfflineIcon() {
    const offlineTexture = getTextureFromResources('offline');
    this.VehicleOfflineSprite = new PIXI.Sprite(offlineTexture);
    this.VehicleOfflineSprite.alpha = 0.8;
    this.VehicleOfflineSprite.anchor.set(0.5);
    this.VehicleOfflineSprite.zIndex = 100;
    this.vehicle.addChild(this.VehicleOfflineSprite);
  }

  //  小车显示错误等级 0:无错误; 1:error错误;  2:warn错误; 3:info错误
  addErrorLevelIcon() {
    if (isNull(this.errorLevel)) return;
    const _textureName = `errorLevel_${this.errorLevel}`;
    if (!this.VehicleErrorSprite) {
      const ErrorMaskTexture = getTextureFromResources(_textureName);
      this.VehicleErrorSprite = new PIXI.Sprite(ErrorMaskTexture);
      this.VehicleErrorSprite.anchor.set(0.5);
      this.VehicleErrorSprite.setTransform(0, 0, 0.5, 0.5);
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

  // 料箱车电池状态
  addBatteryIcon() {
    if (this.battery === undefined || this.battery === null) return;
    const x = 0;
    const y = -ToteVehicleSize.height / 2 - 30;
    const batteryState = switchVehicleBatteryState(this.battery);
    const texture = getTextureFromResources(batteryState);
    this.batteryIcon = new PIXI.Sprite(texture);
    this.batteryIcon.anchor.set(0.5, 1);
    this.batteryIcon.setTransform(x, y, 0.3, 0.3);
    this.addChild(this.batteryIcon);
  }

  updateBatteryState(batteryState) {
    this.battery = batteryState;
    const state = switchVehicleBatteryState(batteryState);
    this.batteryIcon.texture = getTextureFromResources(state);
  }

  // 料箱车维护状态
  addMaintainIcon() {
    const spannerTexture = getTextureFromResources('maintain');
    const spannerSprite = new PIXI.Sprite(spannerTexture);
    spannerSprite.anchor.set(0.5);
    const x = this.vehicle.width / 2 + 60;
    const y = 200;
    spannerSprite.setTransform(x, y, 0.25, 0.25, 0, 0, 0, 0);
    this.spannerSprite = spannerSprite;
    this.vehicle.addChild(spannerSprite);
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
        ToteVehicleSize.height / 2 + 220,
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

  addToteHolding() {
    const holdingTexture = getTextureFromResources('bin');
    this.holdingSprite = new PIXI.Sprite(holdingTexture);
    this.holdingSprite.anchor.set(0.5);
    this.holdingSprite.setTransform(-20, -115, 0.6, 0.55, -Math.PI / 2);
    this.vehicle.addChild(this.holdingSprite);
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
