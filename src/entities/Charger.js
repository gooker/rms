import * as PIXI from 'pixi.js';
import Text from './Text';
import { isNull, isStrictNull } from '@/utils/util';
import { hasPermission } from '@/utils/Permission';
import { getTextureFromResources } from '@/utils/mapUtil';
import { zIndex, ChargerSize, ChargerStateColor, SelectionType } from '@/config/consts';
import { SmoothGraphics } from '_@pixi_graphics-smooth@0.0.22@@pixi/graphics-smooth';

export default class Charger extends PIXI.Container {
  constructor(props) {
    super();
    this.x = props.x;
    this.y = props.y;
    this.name = props.name;
    this.angle = props.angle;
    this.zIndex = zIndex.functionIcon;
    this.state = props.state;
    this.hardwareId = props.hardwareId;
    this.sortableChildren = true;
    this.select = props.select;
    this.selected = false; // 标记该工作站是否被选中

    this.create();
    this.addName();
    this.createSelectionBorder();

    // 处理点击事件
    this.charger.interactive = true;
    this.charger.buttonMode = true;
    this.charger.interactiveChildren = false;
    this.charger.on('click', this.click);

    if (hasPermission('/map/monitor/chargerMaintain')) {
      this.addLightningIcon(); // 充电中标记
      this.addErrorMaskState(); // 错误状态标记
      this.addOfflineMaskState(); // 离线标记
      this.addChargeUnbindState(); // 未绑定硬件标记
    }
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
    const chargerTexture = getTextureFromResources('charger');
    this.charger = new PIXI.Sprite(chargerTexture);
    this.charger.zIndex = 1;
    this.charger.anchor.set(0.5);
    const scaleX = ChargerSize.width / chargerTexture.width;
    const scaleY = ChargerSize.height / chargerTexture.height;
    this.charger.setTransform(0, 0, scaleX, scaleY);
    this.addChild(this.charger);
  }

  addName() {
    if (isStrictNull(this.charger)) return;
    if (this.nameSprite) {
      this.removeChild(this.nameSprite);
      this.nameSprite.destroy(true);
      this.nameSprite = null;
    }

    const y = this.charger.height / 2 + 200;
    let name = this.name;
    if (this.hardwareId) {
      name = `${name} [${this.hardwareId}]`;
    }
    this.nameSprite = new Text(name, 0, -y, 0xffffff, false, 150);
    this.nameSprite.angle = -this.angle;
    this.nameSprite.anchor.set(0.5);
    this.addChild(this.nameSprite);
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

  // 充电桩实时状态背景色
  addChargerStateIcon() {
    this.stateIcon = new PIXI.Sprite(PIXI.Texture.WHITE);
    this.stateIcon.anchor.set(0.5);
    this.OfflineMaskSprite.alpha = 0.8;
    this.stateIcon.width = ChargerSize.width * 1.5;
    this.stateIcon.height = ChargerSize.height * 1.5;
    this.addChild(this.stateIcon);
  }

  // 小闪电图标，只有在充电时才会显示
  addLightningIcon = () => {
    const lightningTexture = getTextureFromResources('lightning');
    this.LightningSprite = new PIXI.Sprite(lightningTexture);
    this.LightningSprite.visible = false;
    this.LightningSprite.anchor.set(0.5, 1);
    this.LightningSprite.setTransform(
      ChargerSize.width / 2 + 40,
      ChargerSize.height / 2 + 40,
      0.3,
      0.3,
    );
    this.addChild(this.LightningSprite);
  };

  // 离线图标
  addOfflineMaskState() {
    const OfflineTexture = getTextureFromResources('offline');
    this.OfflineMaskSprite = new PIXI.Sprite(OfflineTexture);
    this.OfflineMaskSprite.visible = false;
    this.OfflineMaskSprite.alpha = 0.7;
    this.OfflineMaskSprite.zIndex = 3;
    this.OfflineMaskSprite.anchor.set(0.5);
    this.OfflineMaskSprite.scale.x = 1.5;
    this.OfflineMaskSprite.scale.y = 1.5;
    this.addChild(this.OfflineMaskSprite);
  }

  // 故障图标
  addErrorMaskState() {
    const ErrorMaskTexture = getTextureFromResources('agv_error');
    this.ErrorMaskSprite = new PIXI.Sprite(ErrorMaskTexture);
    this.ErrorMaskSprite.visible = false;
    this.ErrorMaskSprite.zIndex = 5;
    this.ErrorMaskSprite.anchor.set(0.5);
    this.ErrorMaskSprite.scale.x = 1.5;
    this.ErrorMaskSprite.scale.y = 1.5;
    this.addChild(this.ErrorMaskSprite);
  }

  // 为绑定图表
  addChargeUnbindState() {
    const unbindMaskTexture = getTextureFromResources('charging_unbind');
    this.UnbindMaskSprite = new PIXI.Sprite(unbindMaskTexture);
    this.UnbindMaskSprite.visible = false;
    this.UnbindMaskSprite.zIndex = 2;
    this.UnbindMaskSprite.y = 80;
    this.UnbindMaskSprite.anchor.set(0.5);
    this.UnbindMaskSprite.scale.x = 1.5;
    this.UnbindMaskSprite.scale.y = 1.5;
    this.addChild(this.UnbindMaskSprite);
  }

  // 更新绑定的硬件ID
  updateHardwareId = (hardwareId) => {
    this.hardwareId = hardwareId;
    this.addName();
    this.UnbindMaskSprite.visible = isNull(hardwareId);
  };

  // 更新充电桩状态
  updateChargerState(chargerState) {
    if (chargerState) {
      this.LightningSprite.visible = chargerState === 'CHARGING'; // 充电中标记
      this.OfflineMaskSprite.visible = chargerState === 'OFFLINE'; // 离线标记
      this.ErrorMaskSprite.visible = chargerState === 'ERROR'; // 错误状态标记

      // 只显示有颜色的状态
      if (ChargerStateColor[chargerState]) {
        if (!this.stateIcon) {
          this.addChargerStateIcon();
        }
        this.stateIcon.tint = ChargerStateColor[chargerState];
      } else {
        if (this.stateIcon) {
          this.removeChild(this.stateIcon);
          this.stateIcon.destroy(true);
          this.stateIcon = null;
        }
      }
    }
  }
}
