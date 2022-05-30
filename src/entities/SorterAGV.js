import * as PIXI from 'pixi.js';
import BitText from './BitText';
import { switchAGVState, switchAGVBatteryState, getTextureFromResources } from '@/utils/mapUtil';
import { zIndex, SorterAGVSize, SelectionType } from '@/config/consts';
import { AGVType } from '@/config/config';
import { isNull } from '@/utils/util';
import { SmoothGraphics } from '@pixi/graphics-smooth';

const BoxWidth = 230;
const BoxHeight = 200;

export default class SorterAGV extends PIXI.Container {
  constructor(props) {
    super();
    this.id = props.id;
    this.x = props.x;
    this.y = props.y;
    this.uniqueId = props.uniqueId;
    this.type = AGVType.Sorter;
    this.agvType = 'sorter';
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
    this.addPod();
    this.addIdText();
    this.addAGVStateIcon();
    this.addBatteryIcon();
    this.addManuallyModeIcon();
    this.mainTain && this.addMaintainIcon();

    this.addErrorLevelIcon();

    this.select = props.select;
    this.selected = false; // 是否被框选
    this.createSelectionBorder();

    if (props.active) {
      this.agv.interactive = true;
      this.agv.buttonMode = true;
      this.agv.interactiveChildren = false;
      this.agv.on('pointerdown', this.click);
      // this.agv.on('rightclick', () => props.simpleCheckAgv(this.id));
    }
  }

  set angle(value) {
    this.$angle = value;
    if (this.agv) this.agv.angle = value;
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
    const sorterState = switchAGVState('sorter', this.state)[0];
    if (sorterState === undefined) {
      console.warn(`无法识别的小车状态: ${this.state}, 小车: ${this.id}`);
      return;
    }
    const agvTexture = getTextureFromResources(sorterState);
    const scaleX = SorterAGVSize.width / agvTexture?.width;
    const scaleY = SorterAGVSize.height / agvTexture?.height;
    this.agv = new PIXI.Sprite(agvTexture);
    this.agv.anchor.set(0.5);
    this.agv.setTransform(0, 0, scaleX, scaleY);
    this.agv.angle = this.$angle;
    this.agv.zIndex = 2;
    this.addChild(this.agv);
  }

  addIdText() {
    const x = 0;
    const y = -this.agv.height / 3.5;
    this.idText = new BitText(this.id, x, y, 0xffffff, 100);
    this.idText.anchor.set(0.5);
    this.idText.angle = -this.$angle;
    this.agv.addChild(this.idText);
  }

  addAGVStateIcon() {
    const x = this.agv.width / 2 - 100;
    const y = -this.agv.height / 2 + 40;
    this.stateIcon = new PIXI.Sprite();
    this.stateIcon.anchor.set(0.5);
    this.stateIcon.setTransform(x, y, 0.08, 0.08, 0, 0, 0, 0);
    this.agv.addChild(this.stateIcon);
    this.updateAGVState(this.state);
  }

  updateAGVState(agvState) {
    this.state = agvState;

    // 更新小车状态
    const [agvStatue, state] = switchAGVState('sorter', agvState);
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

  //  小车显示错误等级 0:无错误; 1:error错误;  2:warn错误; 3:info错误
  addErrorLevelIcon() {
    if (isNull(this.errorLevel)) return;
    const _textureName = `errorLevel_${this.errorLevel}`;
    if (!this.AGVErrorSprite) {
      const ErrorMaskTexture = getTextureFromResources(_textureName);
      this.AGVErrorSprite = new PIXI.Sprite(ErrorMaskTexture);
      this.AGVErrorSprite.anchor.set(0.5);
      this.AGVErrorSprite.setTransform(0, 0, 0.7, 0.7);
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

  addBatteryIcon() {
    if (this.battery === undefined || this.battery === null) return;
    const x = this.agv.width / 2 - 40;
    const y = 30;
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
    this.agv.addChild(this.frontBox);

    // 后货物
    this.rearBox = new PIXI.Sprite(boxTexture);
    this.rearBox.x = 0;
    this.rearBox.y = 140;
    this.rearBox.width = BoxWidth;
    this.rearBox.height = BoxHeight;
    this.rearBox.anchor.set(0.5);
    this.rearBox.angle = -this.$angle;
    this.rearBox.visible = false;
    this.agv.addChild(this.rearBox);

    // 大件货
    this.bigBox = new PIXI.Sprite(boxTexture);
    this.bigBox.x = 0;
    this.bigBox.y = 0;
    this.bigBox.width = BoxWidth;
    this.bigBox.height = BoxHeight * 2;
    this.bigBox.anchor.set(0.5);
    this.bigBox.angle = -this.$angle;
    this.bigBox.visible = false;
    this.agv.addChild(this.bigBox);
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
    this.agv.addChild(this.spannerSprite);
  }

  addOfflineIcon() {
    const offlineTexture = getTextureFromResources('offline');
    this.AGVOfflineSprite = new PIXI.Sprite(offlineTexture);
    this.AGVOfflineSprite.alpha = 0.8;
    this.AGVOfflineSprite.anchor.set(0.5);
    this.AGVOfflineSprite.zIndex = 100;
    this.agv.addChild(this.AGVOfflineSprite);
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
