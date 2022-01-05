import * as PIXI from 'pixi.js';
import BitText from './BitText';
import { isNull } from '@/utils/utils';
import { hasPermission } from '@/utils/Permission';
import { getTextureFromResources } from '@/utils/mapUtils';
import { zIndex, ChargerSize, ChargerStateColor } from '@/config/consts';

export default class Charger extends PIXI.Container {
  constructor(props) {
    super();
    this.x = props.x;
    this.y = props.y;
    this.name = props.name;
    this.angle = props.angle;
    this.zIndex = zIndex.groundStorage;
    this.state = props.state;
    this.hardwareId = props.hardwareId;
    this.sortableChildren = true;

    this.create();
    this.name && this.addName();

    if (hasPermission('/map/monitor/chargerMaintain') && props.active) {
      this.addLightningIcon(); // 充电中标记
      this.addErrorMaskState(); // 错误状态标记
      this.addOfflineMaskState(); // 离线标记
      this.addChargeUnbindState(); // 未绑定硬件标记

      this.charger.interactive = true;
      this.charger.buttonMode = true;
      this.charger.interactiveChildren = false;
      this.charger.on('click', () => {
        props.check({
          x: this.x,
          y: this.y,
          name: this.name,
          angle: this.angle,
          state: this.state,
        });
      });
    }
  }

  create() {
    const chargerTexture = getTextureFromResources('charger');
    if (isNull(chargerTexture)) {
      console.log('材质:[charger] 丢失');
      return;
    }
    this.charger = new PIXI.Sprite(chargerTexture);
    this.charger.zIndex = 1;
    this.charger.anchor.set(0.5);
    const scaleX = ChargerSize.width / chargerTexture.width;
    const scaleY = ChargerSize.height / chargerTexture.height;
    this.charger.setTransform(0, 0, scaleX, scaleY);
    this.addChild(this.charger);
  }

  addName() {
    if (isNull(this.charger)) return;

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
    this.nameSprite = new BitText(name, 0, -y, 0xffffff, 200);
    this.nameSprite.anchor.set(0.5);
    this.addChild(this.nameSprite);
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
