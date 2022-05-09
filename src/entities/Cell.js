import * as PIXI from 'pixi.js';
import { BitText } from '@/entities';
import { isNull, isStrictNull, radToAngle } from '@/utils/util';
import {
  zIndex,
  CellSize,
  CellTypeSize,
  CellTypeColor,
  SelectionType,
  MapSelectableSpriteType,
} from '@/config/consts';
import { find, isPlainObject } from 'lodash';
import { NavigationCellType } from '@/config/config';

const ScaledCellSize = 800;
const ScaledTypeIconSize = 120;
const ClearCellTint = '0xFFFFFF';
const NormalScaledCellTint = '0xD8BFD8';
const InnerIndex = { direction: 1, navigation: 2, type: 3, text: 3, bg: 4 };

export default class Cell extends PIXI.Container {
  constructor(props) {
    super(props);
    this.type = MapSelectableSpriteType.CELL;
    this.brand = props.brand; // 导航点类型
    this.brandColor = props.color.replace('#', '0x');

    this.id = props.id; // Integer ID
    this.naviId = props.naviId; // 车型导航点的原始ID

    this.x = props.x;
    this.y = props.y;
    this.xLabel = props.xLabel;
    this.yLabel = props.yLabel;
    this.additional = props.additional;

    this.width = CellSize.width;
    this.height = CellSize.height;
    this.zIndex = zIndex.cell;
    this.sortableChildren = true;
    this.interactiveChildren = false;
    this.hitArea = new PIXI.Rectangle(-175, -175, 350, 350);
    this.selected = false; // 标记点位是否被选中
    this.select = props.select;

    this.data = {
      types: new Set(),
    };

    this.states = {
      mode: 'standard',
      shown: true,
      coordinatorVisible: false,
    };

    this.addNavigation();
    this.addDirection();
    this.addCoordination();
    this.addSelectedBackGround(350, 350);
    this.interact(props.interactive);
  }

  get mode() {
    return this.states.mode;
  }

  get $$size() {
    return this.states.coordinatorVisible ? 218 : 90;
  }

  // 导航点标记（实心圆）
  addNavigation() {
    this.renderNavigation();

    // 导航点id
    this.navigationId = new BitText(this.naviId, 0, 0, this.brandColor, 70);
    this.navigationId.anchor.set(0.5, 0);
    this.navigationId.y = CellSize.height / 2 + 30;
    this.addChild(this.navigationId);

    // 二维码点
    // this.qrId = new BitText(this.id, 0, 0, 0x00aeff);
    // this.qrId.anchor.set(0.5, 1);
    // this.qrId.y = -CellSize.height / 2 - 30;
    // this.addChild(this.qrId);
  }

  renderNavigation(flagColor = 0xffffff) {
    this.navigation = new PIXI.Graphics();
    this.navigation.lineStyle(CellSize.width * 0.4, flagColor, 1);
    this.navigation.beginFill(this.brandColor);
    this.navigation.drawCircle(0, 0, CellSize.width / 2);
    this.navigation.endFill();
    this.navigation.zIndex = InnerIndex.navigation;
    this.addChild(this.navigation);
  }

  addDirection() {
    if (isPlainObject(this.additional) && !isNull(this.additional.dir)) {
      const brandConfig = find(NavigationCellType, { code: this.brand });
      if (!isNull(brandConfig)) {
        const { coordinationType } = brandConfig;
        let angle; // 这里的角度基准是标准数学坐标系
        if (coordinationType === 'R') {
          angle = radToAngle(-this.additional.dir);
        } else {
          angle = radToAngle(this.additional.dir);
        }
        const polygonPath = [
          0,
          0,

          0,
          -CellSize.width / 2,

          CellSize.width * 1.2,
          0,

          0,
          CellSize.width / 2,

          0,
          0,
        ];
        this.direction = new PIXI.Graphics();
        this.direction.lineStyle(0);
        this.direction.beginFill(this.brandColor);
        this.direction.drawPolygon(polygonPath);
        this.direction.angle = angle;
        this.direction.alpha = 0.8;
        this.direction.zIndex = InnerIndex.direction;
        this.addChild(this.direction);
      } else {
        console.error(`RMS: 发现未知的导航点类型[${this.brand}]`);
      }
    }
  }

  updateNaviId(naviId) {
    if (this.navigationId) {
      this.removeChild(this.navigationId);
      this.navigationId.destroy(true);
      this.navigationId = null;
    }
    this.navigationId = new BitText(naviId, 0, 0, this.brandColor);
    this.navigationId.anchor.set(0.5, 0);
    this.navigationId.y = CellSize.height / 2 + 30;
    this.addChild(this.navigationId);
  }

  // 坐标
  addCoordination() {
    this.coordX = new BitText(
      this.xLabel,
      -CellSize.width / 2,
      -CellSize.height / 2,
      this.brandColor,
      70,
    );
    this.coordX.anchor.set(1, 1);
    this.coordX.zIndex = InnerIndex.text;
    this.coordX.visible = false;
    this.addChild(this.coordX);

    this.coordY = new BitText(
      this.yLabel,
      CellSize.width / 2,
      -CellSize.height / 2,
      this.brandColor,
      70,
    );
    this.coordY.anchor.set(0, 1);
    this.coordY.zIndex = InnerIndex.text;
    this.coordY.visible = false;
    this.addChild(this.coordY);
  }

  switchCoordinationShown(visible) {
    this.states.coordinatorVisible = visible;
    this.coordX.visible = visible;
    this.coordY.visible = visible;
  }

  addSelectedBackGround(width, height) {
    this.removeSelectedBackGround();
    this.selectedBorderSprite = new PIXI.Sprite(PIXI.utils.TextureCache.cellSelectBorderTexture);
    this.selectedBorderSprite.anchor.set(0.5);
    this.selectedBorderSprite.width = width;
    this.selectedBorderSprite.height = height;
    this.selectedBorderSprite.visible = false;
    this.selectedBorderSprite.zIndex = InnerIndex.bg;
    this.addChild(this.selectedBorderSprite);
  }

  removeSelectedBackGround() {
    if (this.selectedBorderSprite) {
      this.removeChild(this.selectedBorderSprite);
      this.selectedBorderSprite = null;
    }
  }

  /**
   * 点位类型展示现在不需要显示具体的小图标，只需要把点位外圈改个颜色
   * 1. 不可走点与其他类型互斥
   * 2. 点位只要存在存储点属性，就显示存储点颜色
   */
  plusType(type) {
    if (this.data.types.has(type)) return;
    if (this.data.types.has('store_cell')) return;

    let flagColor = CellTypeColor.normal;
    if (type === 'store_cell') {
      flagColor = CellTypeColor.storeType;
    }
    if (type === 'block_cell') {
      flagColor = CellTypeColor.blockType;
    }
    this.removeChild(this.navigation);
    this.navigation.destroy();
    this.renderNavigation(flagColor);
    this.data.types.add(type);
  }

  removeType(type) {
    if (isStrictNull(type)) return;
    this.data.types.delete(type);

    let flagColor;
    if (type === 'block_cell') {
      flagColor = 0xffffff;
    } else if (type === 'store_cell') {
      if (this.data.types.size === 0) {
        flagColor = 0xffffff;
      } else {
        flagColor = CellTypeColor.normal;
      }
    } else {
      if (this.data.types.size === 0) {
        flagColor = 0xffffff;
      }
    }

    if (!isNull(flagColor)) {
      this.removeChild(this.navigation);
      this.navigation.destroy();
      this.renderNavigation(flagColor);
    }
  }

  /**
   * 支持动态添加交互
   * 用dynamic来标识点位点击操作是Monitor动态新增的，否则就是Editor
   * @param interactive
   * @param callBack
   */
  interact(interactive = false, callBack) {
    this.interactive = interactive;
    this.buttonMode = interactive;
    if (interactive) {
      // 支持覆盖原有回调
      if (typeof callBack === 'function') {
        this.select = callBack;
      }

      this.on('pointerdown', this.onClick);
    } else {
      this.off('pointerdown', this.onClick);
    }
  }

  // ************ QR Code Selection ************ //
  onSelect() {
    this.selected = true;
    this.selectedBorderSprite.visible = true;
  }

  onUnSelect() {
    this.selected = false;
    this.selectedBorderSprite.visible = false;
  }

  onClick(event) {
    if (event?.data.originalEvent.shiftKey) {
      if (!this.selected) {
        this.onSelect();
        this.select && this.select(this, SelectionType.SHIFT);
      }
    } else if (event?.data.originalEvent.ctrlKey || event?.data.originalEvent.metaKey) {
      if (!this.selected) {
        this.onSelect();
        this.select && this.select(this, SelectionType.CTRL);
      }
    } else {
      this.selected ? this.onUnSelect() : this.onSelect();
      this.select && this.select(this, SelectionType.SINGLE);
    }
  }

  // 重新计算点位类型图标位置
  reCalculatePosition() {
    const isStandard = this.states.mode === 'standard';
    // 图标在水平方向的间隔距离
    const offset = isStandard ? 30 : 50;
    // 重算每一个类型图标的位置，逻辑是把所有的类型Sprite水平拼接成一个矩形，该矩形的锚点的和二维码的锚点在同一条垂直线。然后所有的Sprite就可以以此为基准分布开来
    const spriteCount = this.data.types.size;
    let beginX;
    if (isStandard) {
      beginX =
        -(spriteCount * CellTypeSize.width + (spriteCount - 1) * offset) / 2 +
        CellTypeSize.width / 2;
    } else {
      beginX =
        CellSize.width / 2 -
        (spriteCount * ScaledTypeIconSize + (spriteCount - 1) * offset) +
        ScaledTypeIconSize / 2 -
        20;
    }
    const typeIconWidth = isStandard ? CellTypeSize.width : ScaledTypeIconSize;
    this.data.types.forEach((sprite) => {
      sprite.x = beginX;
      beginX = beginX + typeIconWidth + offset;
    });
  }

  // ************ 模式切换  ************ //
  switchMode(mode = 'standard') {
    let cellWidth;
    let cellHeight;
    let cellIdX;
    let cellIdY;
    let textColor;
    let coordXx;
    let coordXy;
    let coordYx;
    let coordYy;
    let coordFontSize;
    let cellIdFontSize;

    if (mode === 'standard') {
      this.states.mode = 'standard';
      textColor = 0xffffff;
      cellWidth = CellSize.width;
      cellHeight = CellSize.height;
      cellIdFontSize = 70;
      cellIdX = 0;
      cellIdY = CellSize.height / 2 + 5;
      coordFontSize = 40;
      coordXx = -CellSize.width / 2;
      coordXy = -CellSize.height / 2;
      coordYx = CellSize.width / 2;
      coordYy = -CellSize.height / 2;
    } else {
      this.states.mode = 'scaled';
      textColor = 0x000000;
      cellWidth = ScaledCellSize;
      cellHeight = ScaledCellSize;
      cellIdFontSize = 140;
      cellIdX = -ScaledCellSize / 2 + 20;
      cellIdY = ScaledCellSize / 2;
      coordFontSize = 80;
      coordXx = -ScaledCellSize / 2 + 20;
      coordXy = -ScaledCellSize / 2;
      coordYx = ScaledCellSize / 2 - 20;
      coordYy = -ScaledCellSize / 2;
    }

    // 更新tint
    if (!this.data.types.has('store_cell') && !this.data.types.has('block_cell')) {
      if (this.states.mode === 'scaled') {
        this.QR.tint = NormalScaledCellTint;
      } else {
        this.QR.tint = ClearCellTint;
      }
    }

    // 更新点位尺寸
    this.QR.width = cellWidth;
    this.QR.height = cellHeight;

    // 交互区域 和 选中效果
    if (mode === 'standard') {
      this.hitArea = new PIXI.Rectangle(-225, -160, 450, 400);
      this.addSelectedBackGround(450, 400);
    } else {
      this.hitArea = new PIXI.Rectangle(-400, -400, 800, 800);
      this.addSelectedBackGround(800, 800, false);
    }

    // 更新点位ID文本位置和样式
    this.removeChild(this.idText);
    this.idText.destroy({ children: true });
    this.idText = new BitText(this.id, cellIdX, cellIdY, textColor, cellIdFontSize);
    mode === 'standard' ? this.idText.anchor.set(0.5, 0) : this.idText.anchor.set(0, 1);
    this.idText.zIndex = InnerIndex.text;
    this.addChild(this.idText);

    // 更新坐标
    this.removeChild(this.coordX);
    this.coordX.destroy({ children: true });
    this.coordX = new BitText(this.x, coordXx, coordXy, textColor, coordFontSize);
    mode === 'standard' ? this.coordX.anchor.set(1, 1) : this.coordX.anchor.set(0, 0);
    this.coordX.zIndex = InnerIndex.text;
    this.addChild(this.coordX);

    this.removeChild(this.coordY);
    this.coordY.destroy({ children: true });
    this.coordY = new BitText(this.y, coordYx, coordYy, textColor, coordFontSize);
    mode === 'standard' ? this.coordY.anchor.set(0, 1) : this.coordY.anchor.set(1, 0);
    this.coordY.zIndex = InnerIndex.text;
    this.addChild(this.coordY);

    // 更新点位类型图标
    this.data.types.forEach((sprite) => {
      sprite.width = mode === 'standard' ? CellTypeSize.width : ScaledTypeIconSize;
      sprite.height = mode === 'standard' ? CellTypeSize.height : ScaledTypeIconSize;
      sprite.y =
        mode === 'standard'
          ? CellSize.height * 1.9
          : CellSize.height / 2 - ScaledTypeIconSize / 2 - 40;
    });
    this.reCalculatePosition();
  }

  switchShown(selected) {
    this.states.shown = selected; // 用来标记当前Cell是否显示
    if (this.QR) this.QR.visible = selected;
    if (this.idText) this.idText.visible = selected;
    this.data.types.forEach((type) => {
      type.visible = selected;
    });

    if (selected) {
      if (this.coordX) this.coordX.visible = this.states.coordinatorVisible;
      if (this.coordY) this.coordY.visible = this.states.coordinatorVisible;
      if (this.selectedBorderSprite) this.selectedBorderSprite.visible = this.selected;
    } else {
      if (this.coordX) this.coordX.visible = false;
      if (this.coordY) this.coordY.visible = false;
      if (this.selectedBorderSprite) this.selectedBorderSprite.visible = false;
    }
  }

  addReplaceId(replaceId) {
    if (this.replaceId) {
      this.removeChild(this.replaceId);
      this.replaceId.destroy();
    }
    if (!isNull(replaceId)) {
      this.replaceId = new BitText(replaceId, 0, -CellSize.height / 2 - 40, 0x00acee, 65);
      this.replaceId.anchor.set(0.5);
      this.replaceId.zIndex = InnerIndex.text;
      this.addChild(this.replaceId);
    }
  }
}
