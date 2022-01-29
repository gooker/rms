import * as PIXI from 'pixi.js';
import { BitText } from '@/entities';
import { isNull } from '@/utils/util';
import { CellSize, zIndex, CellTypeSize, CellTypeColor } from '@/config/consts';
import { getTextureFromResources } from '@/utils/mapUtil';

const ScaledCellSize = 800;
const ScaledTypeIconSize = 120;
const ClearCellTint = '0xFFFFFF';
const NormalScaledCellTint = '0xD8BFD8';
const InnerIndex = { QR: 1, type: 2, text: 3, bg: 4 };

export default class Cell extends PIXI.Container {
  constructor(props) {
    super(props);
    this.id = props.id;
    this.x = props.x;
    this.y = props.y;
    this.width = CellSize.width;
    this.height = CellSize.height;
    this.zIndex = zIndex.cell;
    this.sortableChildren = true;
    this.interactiveChildren = false;
    this.hitArea = new PIXI.Rectangle(-225, -160, 450, 400);
    this.selected = false; // 标记点位是否被选中
    this.select = props.select;
    this.ctrlSelect = props.ctrlSelect;
    this.shiftSelect = props.shiftSelect;

    this.data = {
      types: new Map(),
    };

    this.states = {
      mode: 'standard',
      shownData: {
        shown: true,
        coord: props.showCoordinate,
      },
    };

    this.addQR();
    this.addCellId();
    this.addCoordination();
    this.addSelectedBackGround(450, 400);
    this.interact(props.interactive);
  }

  get mode() {
    return this.states.mode;
  }

  addQR() {
    const QrTexture = getTextureFromResources('qrcode');
    this.QR = new PIXI.Sprite(QrTexture);
    this.QR.anchor.set(0.5);
    this.QR.width = CellSize.width;
    this.QR.height = CellSize.height;
    this.QR.zIndex = InnerIndex.QR;
    this.addChild(this.QR);
  }

  addCellId(cellId) {
    this.idText = new BitText(cellId ?? this.id, 0, CellSize.height / 2 + 5, 0xffffff, 70);
    this.idText.anchor.set(0.5, 0);
    this.idText.zIndex = InnerIndex.text;
    this.addChild(this.idText);
  }

  updateCellId(cellId) {
    const { mode } = this.states;
    let cellIdX = 0;
    let cellIdY = CellSize.height / 2 + 5;
    let textColor = 0xffffff;
    let cellIdFontSize = 70;
    if (mode === 'scaled') {
      textColor = 0x000000;
      cellIdFontSize = 140;
      cellIdX = -ScaledCellSize / 2 + 20;
      cellIdY = ScaledCellSize / 2;
    }

    this.id = cellId;
    if (!isNull(this.idText)) {
      this.removeChild(this.idText);
      this.idText.destroy(true);
      this.idText = null;
    }

    // 更新点位ID文本位置和样式
    this.idText = new BitText(cellId ?? this.id, cellIdX, cellIdY, textColor, cellIdFontSize);
    mode === 'standard' ? this.idText.anchor.set(0.5, 0) : this.idText.anchor.set(0, 1);
    this.idText.zIndex = InnerIndex.text;
    this.addChild(this.idText);
  }

  addCoordination() {
    this.coordX = new BitText(this.x, -CellSize.width / 2, -CellSize.height / 2, 0xffffff, 40);
    this.coordX.anchor.set(1, 1);
    this.coordX.zIndex = InnerIndex.text;
    this.coordX.visible = this.states.shownData.coord;
    this.addChild(this.coordX);

    this.coordY = new BitText(this.y, CellSize.width / 2, -CellSize.height / 2, 0xffffff, 40);
    this.coordY.anchor.set(0, 1);
    this.coordY.zIndex = InnerIndex.text;
    this.coordY.visible = this.states.shownData.coord;
    this.addChild(this.coordY);
  }

  updateCoordination(x, y) {
    this.removeChild(this.coordX);
    this.removeChild(this.coordY);
    this.coordX.destroy(true);
    this.coordY.destroy(true);
    this.coordX = null;
    this.coordY = null;

    this.x = x;
    this.y = y;
    this.addCoordination();
  }

  addSelectedBackGround(width, height, isStandard = true) {
    this.removeSelectedBackGround();
    this.selectedBorderSprite = new PIXI.Sprite(PIXI.utils.TextureCache.cellSelectBorderTexture);
    isStandard
      ? this.selectedBorderSprite.anchor.set(0.5, 0.4)
      : this.selectedBorderSprite.anchor.set(0.5);
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

  switchCoordinationShown(flag) {
    if (this.states.shownData.shown) {
      this.coordX.visible = flag;
      this.coordY.visible = flag;
    }
    this.states.shownData.coord = flag;
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
        this.shiftSelect && this.shiftSelect({ id: this.id, x: this.x, y: this.y });
      }
    } else if (event?.data.originalEvent.ctrlKey || event?.data.originalEvent.metaKey) {
      if (!this.selected) {
        this.onSelect();
        this.ctrlSelect && this.ctrlSelect({ id: this.id, x: this.x, y: this.y });
      }
    } else {
      if (this.selected) {
        this.onUnSelect();
        this.select &&
          this.select(
            { id: this.id, x: this.x, y: this.y, data: [...this.data.types.keys()] },
            true,
          );
      } else {
        this.onSelect();
        this.select &&
          this.select({
            id: this.id,
            x: this.x,
            y: this.y,
            data: [...this.data.types.keys()],
          });
      }
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

  // 点位类型编辑
  plusType(type, typeData) {
    if (this.data.types.has(type)) return;
    const isStandard = this.states.mode === 'standard';

    // typeData 有可能是 Texture 也有可能是 Sprite
    if (typeData) {
      let sprite;
      if (typeData instanceof PIXI.Texture) {
        sprite = new PIXI.Sprite(typeData);
        sprite.width = isStandard ? CellTypeSize.width : ScaledTypeIconSize;
      } else {
        sprite = typeData;
        sprite.scale.x = 1.5;
      }
      sprite.height = isStandard ? CellTypeSize.height : ScaledTypeIconSize;
      sprite.anchor.set(0.5);
      sprite.zIndex = InnerIndex.type;

      // Y轴定位
      sprite.y = isStandard
        ? CellSize.height * 1.9
        : CellSize.height / 2 - ScaledTypeIconSize / 2 - 40;

      this.data.types.set(type, sprite);
      // 渲染当前添加的类型
      this.addChild(sprite);
      // 重算每一个类型Sprite的位置
      this.reCalculatePosition();
      // 对于不同类型的点位可能需要添加不同的颜色, 比如: 存储点是绿色、不可走点灰色; 优先不可走点
      let tint = ClearCellTint;
      if (this.data.types.has('store_cell')) {
        tint = CellTypeColor.storeType;
      }
      if (this.data.types.has('block_cell')) {
        tint = CellTypeColor.blockType;
      }
      this.QR.tint = tint;
    }
  }

  removeType(type, destroyAll = false) {
    if (!type) return;
    const sprite = this.data.types.get(type);
    if (!sprite) return;
    this.removeChild(sprite);
    destroyAll ? sprite.destroy(true) : sprite.destroy({ children: true });
    this.data.types.delete(type);

    // 对于不同类型的点位可能需要添加不同的颜色, 比如: 存储点是绿色、不可走点灰色; 优先不可走点
    let tint = this.states.mode === 'scaled' ? NormalScaledCellTint : ClearCellTint;
    if (this.data.types.has('store_cell')) {
      tint = CellTypeColor.storeType;
    }
    if (this.data.types.has('block_cell')) {
      tint = CellTypeColor.blockType;
    }
    this.QR.tint = tint;

    // 重算每一个类型Sprite的位置
    this.reCalculatePosition();
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
    const { shownData } = this.states;
    this.states.shownData.shown = selected; // 用来标记当前Cell是否显示
    if (this.QR) this.QR.visible = selected;
    if (this.idText) this.idText.visible = selected;
    this.data.types.forEach((type) => {
      type.visible = selected;
    });

    if (selected) {
      if (this.coordX) this.coordX.visible = shownData.coord;
      if (this.coordY) this.coordY.visible = shownData.coord;
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

  // 置灰(与高亮相反)
  obscure(flag) {
    if (flag) {
      this.QR.tint = CellTypeColor.blockType;
    } else {
      // 对于不同类型的点位可能需要添加不同的颜色, 比如: 存储点是绿色、不可走点灰色; 优先不可走点
      let tint = this.states.mode === 'scaled' ? NormalScaledCellTint : ClearCellTint;
      if (this.data.types.has('store_cell')) {
        tint = CellTypeColor.storeType;
      }
      if (this.data.types.has('block_cell')) {
        tint = CellTypeColor.blockType;
      }
      this.QR.tint = tint;
    }
  }
}
