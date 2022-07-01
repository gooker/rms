import * as PIXI from 'pixi.js';
import BitText from './BitText';
import { getTextureFromResources, switchVehicleBatteryState, switchVehicleState } from '@/utils/mapUtil';
import { MonitorSelectableSpriteType, SelectionType, SorterVehicleSize, zIndex } from '@/config/consts';
import { isNull } from '@/utils/util';
import { SmoothGraphics } from '@pixi/graphics-smooth';

const BoxWidth = 230;
const BoxHeight = 200;

export default class SorterVehicle extends PIXI.Container {
  constructor(props) {
    super();
    this.type = MonitorSelectableSpriteType.Vehicle;
    this.id = props.id;
    this.x = props.x;
    this.y = props.y;
    this.uniqueId = props.uniqueId;
    this.cullable = true;
    this.vehicleType = props.vehicleType;
    this.vehicleIcon = props.vehicleIcon;
    this.vehicleType = 'sorter';
    this.alpha = 0.8;
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
    this.addPod();
    this.addIdText();
    this.addVehicleStateIcon();
    this.addBatteryIcon();
    this.addManuallyModeIcon();
    this.mainTain && this.addMaintainIcon();

    this.addErrorLevelIcon();

    this.select = props.select;
    this.selected = false; // 是否被框选
    this.createSelectionBorder();

    if (props.active) {
      this.vehicle.interactive = true;
      this.vehicle.buttonMode = true;
      this.vehicle.interactiveChildren = false;
      this.vehicle.on('pointerdown', this.click);
      // this.vehicle.on('rightclick', () => props.simpleCheckVehicle(this.id));
    }
  }

  set angle(value) {
    this.$angle = value;
    if (this.vehicle) this.vehicle.angle = value;
    if (this.idText) this.idText.angle = -value;
  }

  // 创建选择边框
  createSelectionBorder() {
    this.selectionBorder = new SmoothGraphics();
    this.selectionBorder.lineStyle(5, 0xff0000);
    const { width, height } = this.getLocalBounds();
    this.selectionBorder.drawRect(0, 0, width * 1.3, height);
    this.selectionBorder.alpha = 0.8;
    this.selectionBorder.pivot = { x: (width * 1.3) / 2, y: height / 2 };
    this.selectionBorder.visible = false;
    this.addChild(this.selectionBorder);
  }

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
    const sorterState = switchVehicleState('sorter', this.state)[0];
    if (sorterState === undefined) {
      console.warn(`无法识别的小车状态: ${this.state}, 小车: ${this.id}`);
      return;
    }
    const vehicleTexture = getTextureFromResources(sorterState);
    const scaleX = SorterVehicleSize.width / vehicleTexture?.width;
    const scaleY = SorterVehicleSize.height / vehicleTexture?.height;
    this.vehicle = new PIXI.Sprite(vehicleTexture);
    this.vehicle.anchor.set(0.5);
    this.vehicle.setTransform(0, 0, scaleX, scaleY);
    this.vehicle.angle = this.$angle;
    this.vehicle.zIndex = 2;
    this.addChild(this.vehicle);
  }

  addIdText() {
    const x = 0;
    const y = -this.vehicle.height / 3.5;
    this.idText = new BitText(this.id, x, y, 0xffffff, 100);
    this.idText.anchor.set(0.5);
    this.idText.angle = -this.$angle;
    this.vehicle.addChild(this.idText);
  }

  addVehicleStateIcon() {
    const x = this.vehicle.width / 2 - 100;
    const y = -this.vehicle.height / 2 + 40;
    this.stateIcon = new PIXI.Sprite();
    this.stateIcon.anchor.set(0.5);
    this.stateIcon.setTransform(x, y, 0.08, 0.08, 0, 0, 0, 0);
    this.vehicle.addChild(this.stateIcon);
    this.updateVehicleState(this.state);
  }

  updateVehicleState(vehicleState) {
    this.state = vehicleState;

    // 更新小车状态
    const [vehicleStatue, state] = switchVehicleState('sorter', vehicleState);
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

  //  小车显示错误等级 0:无错误; 1:error错误;  2:warn错误; 3:info错误
  addErrorLevelIcon() {
    if (isNull(this.errorLevel)) return;
    const _textureName = `errorLevel_${this.errorLevel}`;
    if (!this.VehicleErrorSprite) {
      const ErrorMaskTexture = getTextureFromResources(_textureName);
      this.VehicleErrorSprite = new PIXI.Sprite(ErrorMaskTexture);
      this.VehicleErrorSprite.anchor.set(0.5);
      this.VehicleErrorSprite.setTransform(0, 0, 0.7, 0.7);
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

  addBatteryIcon() {
    if (this.battery === undefined || this.battery === null) return;
    const x = this.vehicle.width / 2 - 40;
    const y = 30;
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

  addPod() {
    const boxTexture = getTextureFromResources('box');

    // 前货物
    this.frontBox = new PIXI.Sprite(boxTexture);
    this.frontBox.x = 0;
    this.frontBox.y = -145;
    this.frontBox.width = BoxWidth;
    this.frontBox.height = BoxHeight;
    this.frontBox.anchor.set(0.5);
    this.frontBox.angle = -this.$angle;
    this.frontBox.visible = false;
    this.vehicle.addChild(this.frontBox);

    // 后货物
    this.rearBox = new PIXI.Sprite(boxTexture);
    this.rearBox.x = 0;
    this.rearBox.y = 140;
    this.rearBox.width = BoxWidth;
    this.rearBox.height = BoxHeight;
    this.rearBox.anchor.set(0.5);
    this.rearBox.angle = -this.$angle;
    this.rearBox.visible = false;
    this.vehicle.addChild(this.rearBox);

    // 大件货
    this.bigBox = new PIXI.Sprite(boxTexture);
    this.bigBox.x = 0;
    this.bigBox.y = 0;
    this.bigBox.width = BoxWidth;
    this.bigBox.height = BoxHeight * 2;
    this.bigBox.anchor.set(0.5);
    this.bigBox.angle = -this.$angle;
    this.bigBox.visible = false;
    this.vehicle.addChild(this.bigBox);
  }

  /**
   * 0 - 没货
   * 1 - 前滚筒有货
   * 2 - 后滚筒有货
   * 3 - 前后都有货
   * 4 - 有大件
   */
  updatePod(roValue) {
    this.frontBox.visible = roValue === 1 || roValue === 3;
    this.rearBox.visible = roValue === 2 || roValue === 3;
    this.bigBox.visible = roValue === 4;

    this.frontBox.angle = -this.$angle;
    this.rearBox.angle = -this.$angle;
    this.bigBox.angle = 0;
  }

  addMaintainIcon() {
    const spannerTexture = getTextureFromResources('maintain');
    this.spannerSprite = new PIXI.Sprite(spannerTexture);
    this.spannerSprite.alpha = 0.8;
    this.spannerSprite.anchor.set(0.5);
    this.spannerSprite.zIndex = 100;
    this.vehicle.addChild(this.spannerSprite);
  }

  addOfflineIcon() {
    const offlineTexture = getTextureFromResources('offline');
    this.VehicleOfflineSprite = new PIXI.Sprite(offlineTexture);
    this.VehicleOfflineSprite.alpha = 0.8;
    this.VehicleOfflineSprite.anchor.set(0.5);
    this.VehicleOfflineSprite.zIndex = 100;
    this.vehicle.addChild(this.VehicleOfflineSprite);
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
