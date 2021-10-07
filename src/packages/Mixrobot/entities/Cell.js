/* eslint-disable no-param-reassign */
import * as PIXI from 'pixi.js';
import { BitText } from '@/packages/Mixrobot/entities';
import { isNull } from '@/utils/utils';
import { getTextureFromResources } from '@/utils/mapUtils';
import { SpotSize, zIndex, CellTypeSize, CellTypeColor } from '@/config/consts';

const ScaledCellSize = 800;
const ScaledTypeIconSize = 120;
const ClearCellTint = '0xFFFFFF';
const NormalScaledCellTint = '0xD8BFD8';
const innerzIndex = { QR: 1, type: 2, text: 3, bg: 4 };

export default class Cell extends PIXI.Container {
  constructor(props) {
    super(props);
    this.id = props.id;
    this.x = props.x;
    this.y = props.y;
    this.width = SpotSize.width;
    this.height = SpotSize.height;
    this.zIndex = zIndex.cell;
    this.sortableChildren = true;
    this.interactiveChildren = false;
    this.propsInteractive = props.interactive || false;
    this.select = props.select;
    this.ctrlSelect = props.ctrlSelect;
    this.shiftSelect = props.shiftSelect;

    this.data = {
      types: new Map(),
      mode: 'standard',
    };

    this.states = {
      shownData: {
        shown: true,
        coord: props.showCoordinate,
        selectedBG: false,
      },
    };

    this.addQR();
    this.addCellId();
    this.addCoordination();
    this.interact(this.propsInteractive);
  }

  get mode() {
    return this.data.mode;
  }

  addQR() {
    const QRtexture = getTextureFromResources('qrcode');
    this.QR = new PIXI.Sprite(QRtexture);
    this.QR.anchor.set(0.5);
    this.QR.width = SpotSize.width;
    this.QR.height = SpotSize.height;
    this.QR.zIndex = innerzIndex.QR;
    this.addChild(this.QR);
  }

  addCellId(cellId) {
    this.idText = new BitText(cellId ?? this.id, 0, SpotSize.height / 2 + 5, 0xffffff, 70);
    this.idText.anchor.set(0.5, 0);
    this.idText.zIndex = innerzIndex.text;
    this.addChild(this.idText);
  }

  updateCellId(cellId) {
    const { mode } = this.data;
    let cellIdX = 0;
    let cellIdY = SpotSize.height / 2 + 5;
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
    // this.addCellId(cellId);
    // 更新点位ID文本位置和样式
    this.idText = new BitText(cellId ?? this.id, cellIdX, cellIdY, textColor, cellIdFontSize);
    mode === 'standard' ? this.idText.anchor.set(0.5, 0) : this.idText.anchor.set(0, 1);
    this.idText.zIndex = innerzIndex.text;
    this.addChild(this.idText);
  }

  addCoordination() {
    this.coordX = new BitText(this.x, -SpotSize.width / 2, -SpotSize.height / 2, 0xffffff, 40);
    this.coordX.anchor.set(1, 1);
    this.coordX.zIndex = innerzIndex.text;
    this.coordX.visible = this.states.shownData.coord;
    this.addChild(this.coordX);

    this.coordY = new BitText(this.y, SpotSize.width / 2, -SpotSize.height / 2, 0xffffff, 40);
    this.coordY.anchor.set(0, 1);
    this.coordY.zIndex = innerzIndex.text;
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
    this.selectedBorderSprite.zIndex = innerzIndex.bg;
    this.addChild(this.selectedBorderSprite);
  }

  removeSelectedBackGround() {
    if (this.selectedBorderSprite) {
      this.removeChild(this.selectedBorderSprite);
      // 特殊case, 会出现 _texture 为 null的 Sprite
      if (this.selectedBorderSprite._texture) {
        this.selectedBorderSprite.destroy({ children: true });
      }
    }
  }

  switchCoordinationShown(flag) {
    if (this.states.shownData.shown) {
      this.coordX.visible = flag;
      this.coordY.visible = flag;
    }
    this.states.shownData.coord = flag;
  }

  // 交互(支持动态添加交互): TODO: 处理多次绑定事件
  /// / 用dynamic来标识点位点击操作是Monitor动态新增的，否则就是Editor
  interact(interactive = false, dynamic = false, showBG = true, callBack) {
    this.interactive = interactive;
    this.buttonMode = interactive;
    if (interactive) {
      this.hitArea = new PIXI.Rectangle(-225, -160, 450, 400);
      this.addSelectedBackGround(450, 400);
      this.on('pointerdown', (ev) => this.onClick(ev, showBG));
      // 如果是动态新增交互就用参数回调来覆盖原有回调
      if (dynamic) {
        this.select = callBack;
      }
    } else {
      // 清除HitArea、BG和回调
      this.hitArea = null;
      this.removeSelectedBackGround();
      if (dynamic) {
        this.select = null;
      }
    }
  }

  // ************ QR Code Selection ************ //
  onSelect() {
    if (!this.states.shownData.selectedBG) {
      this.selectedBorderSprite.visible = true;
      this.states.shownData.selectedBG = true;
    }
  }

  onUnSelect() {
    if (this.states.shownData.selectedBG) {
      this.selectedBorderSprite.visible = false;
      this.states.shownData.selectedBG = false;
    }
  }

  onClick(event, showBG = true) {
    if (event?.data.originalEvent.shiftKey) {
      if (!this.states.shownData.selectedBG) {
        showBG && this.onSelect();
        this.shiftSelect && this.shiftSelect({ id: this.id, x: this.x, y: this.y });
      }
    } else if (event?.data.originalEvent.ctrlKey || event?.data.originalEvent.metaKey) {
      if (!this.states.shownData.selectedBG) {
        showBG && this.onSelect();
        this.ctrlSelect && this.ctrlSelect({ id: this.id, x: this.x, y: this.y });
      }
    } else {
      if (this.states.shownData.selectedBG) {
        this.onUnSelect();
        this.select &&
          this.select(
            { id: this.id, x: this.x, y: this.y, data: [...this.data.types.keys()] },
            true,
          );
      } else {
        showBG && this.onSelect();
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

  // ************ 二维码功能  ************ //
  reCalculatePosition() {
    const isStandard = this.data.mode === 'standard';
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
        SpotSize.width / 2 -
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
    const isStandard = this.data.mode === 'standard';

    // typeData 有可能是 Texture 也有可能是 Sprite
    if (typeData) {
      let sprite;
      if (typeData instanceof PIXI.Texture) {
        sprite = new PIXI.Sprite(typeData);
        sprite.width = isStandard ? CellTypeSize.width : ScaledTypeIconSize;
      } else {
        sprite = typeData;
        sprite.scale.x = 0.55;
      }
      sprite.height = isStandard ? CellTypeSize.height : ScaledTypeIconSize;
      sprite.anchor.set(0.5);
      sprite.zIndex = innerzIndex.type;

      // Y轴定位
      sprite.y = isStandard
        ? SpotSize.height * 1.9
        : SpotSize.height / 2 - ScaledTypeIconSize / 2 - 40;

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
    let tint = this.data.mode === 'scaled' ? NormalScaledCellTint : ClearCellTint;
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
      this.data.mode = 'standard';
      textColor = 0xffffff;
      cellWidth = SpotSize.width;
      cellHeight = SpotSize.height;
      cellIdFontSize = 70;
      cellIdX = 0;
      cellIdY = SpotSize.height / 2 + 5;
      coordFontSize = 40;
      coordXx = -SpotSize.width / 2;
      coordXy = -SpotSize.height / 2;
      coordYx = SpotSize.width / 2;
      coordYy = -SpotSize.height / 2;
    } else {
      this.data.mode = 'scaled';
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
      if (this.data.mode === 'scaled') {
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
    this.idText.zIndex = innerzIndex.text;
    this.addChild(this.idText);

    // 更新坐标
    this.removeChild(this.coordX);
    this.coordX.destroy({ children: true });
    this.coordX = new BitText(this.x, coordXx, coordXy, textColor, coordFontSize);
    mode === 'standard' ? this.coordX.anchor.set(1, 1) : this.coordX.anchor.set(0, 0);
    this.coordX.zIndex = innerzIndex.text;
    this.addChild(this.coordX);

    this.removeChild(this.coordY);
    this.coordY.destroy({ children: true });
    this.coordY = new BitText(this.y, coordYx, coordYy, textColor, coordFontSize);
    mode === 'standard' ? this.coordY.anchor.set(0, 1) : this.coordY.anchor.set(1, 0);
    this.coordY.zIndex = innerzIndex.text;
    this.addChild(this.coordY);

    // 更新点位类型图标
    this.data.types.forEach((sprite) => {
      sprite.width = mode === 'standard' ? CellTypeSize.width : ScaledTypeIconSize;
      sprite.height = mode === 'standard' ? CellTypeSize.height : ScaledTypeIconSize;
      sprite.y =
        mode === 'standard'
          ? SpotSize.height * 1.9
          : SpotSize.height / 2 - ScaledTypeIconSize / 2 - 40;
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
      if (this.selectedBorderSprite) this.selectedBorderSprite.visible = shownData.selectedBG;
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
      this.replaceId = new BitText(replaceId, 0, -SpotSize.height / 2 - 40, 0x00acee, 65);
      this.replaceId.anchor.set(0.5);
      this.replaceId.zIndex = innerzIndex.text;
      this.addChild(this.replaceId);
    }
  }
}
