import * as PIXI from 'pixi.js';
import { find, isPlainObject } from 'lodash';
import { BitText } from '@/entities';
import { isNull, isStrictNull, radToAngle } from '@/utils/util';
import { getKeyByCoordinateType, getTextureFromResources } from '@/utils/mapUtil';
import { NavigationTypeView } from '@/config/config';
import { CellSize, MapSelectableSpriteType, SelectionType, zIndex } from '@/config/consts';

const HitAreaSize = 280;
const InnerIndex = { direction: 1, navigation: 2, type: 3, text: 3, bg: 4 };

export default class Cell extends PIXI.Container {
  constructor(props) {
    super();
    this.type = MapSelectableSpriteType.CELL;
    this.navigationType = props.navigationType; // 导航点类型
    this.coordinateType = props.coordinateType; // 当前显示的坐标类型
    this.coordinate = props.coordinate; // 记录点位在地图数据里的两种坐标，导航坐标为原始坐标
    this.additional = props.additional;

    const navigationType = find(NavigationTypeView, { code: this.navigationType });
    if (!isNull(navigationType)) {
      this.coordinateSystemType = navigationType.coordinateSystemType;
      this.brandColor = navigationType.color.replace('#', '0x');
    } else {
      this.brandColor = '0xffffff';
      console.error(`Cell: 未识别的导航类型 > ${this.navigationType}`);
    }

    this.id = props.id;
    this.naviId = props.naviId;
    this.pid = props.pid;

    this.x = props.x;
    this.y = props.y;
    this.width = CellSize.width;
    this.height = CellSize.height;
    this.zIndex = zIndex.cell;

    this.cullable = true;
    this.sortableChildren = true;
    this.interactiveChildren = false;
    this.hitArea = new PIXI.Rectangle(
      -HitAreaSize / 2,
      -HitAreaSize / 2 + 50,
      HitAreaSize,
      HitAreaSize,
    );
    this.selected = false; // 标记点位是否被选中
    this.select = props.select;

    this.data = {
      types: new Set(),
    };

    this.states = {
      shown: true,
      coordinatorVisible: false,
    };

    this.addNavigation();
    this.addDirection();
    this.addCoordination();
    this.addSelectedBackGround(HitAreaSize, HitAreaSize);
    this.interact(props.interactive);
  }

  // 导航点标记（实心圆）
  addNavigation() {
    this.renderNavigation();

    // 导航点id
    this.navigationId = new BitText(this.naviId, 0, 0, 0xffffff, 100);
    this.navigationId.anchor.set(0.5, 0);
    this.navigationId.y = CellSize.height / 2 + 30;
    this.addChild(this.navigationId);

    // pId
    // this.pidSprite = new BitText(this.pid, 0, 0, 0x00aeff);
    // this.pidSprite.anchor.set(0.5, 1);
    // this.pidSprite.y = -CellSize.height / 2 - 30;
    // this.addChild(this.pidSprite);
  }

  updateNaviId(naviId) {
    if (this.navigationId) {
      this.removeChild(this.navigationId);
      this.navigationId.destroy();
      this.navigationId = null;
    }

    this.naviId = naviId;
    this.navigationId = new BitText(naviId, 0, 0, 0xffffff, 100);
    this.navigationId.anchor.set(0.5, 0);
    this.navigationId.y = CellSize.height / 2 + 30;
    this.addChild(this.navigationId);
  }

  renderNavigation(cellType = 'blank') {
    this.navigation = new PIXI.Sprite(
      getTextureFromResources(`${this.navigationType}_${cellType}`),
    );
    this.navigation.anchor.set(0.5);
    this.navigation.zIndex = InnerIndex.navigation;
    this.addChild(this.navigation);
  }

  addDirection() {
    if (isPlainObject(this.additional) && !isNull(this.additional.dir)) {
      const brandConfig = find(NavigationTypeView, { code: this.navigationType });
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
        console.error(`RMS: 发现未知的导航点类型[${this.navigationType}]`);
      }
    }
  }

  // 坐标
  addCoordination() {
    if (this.coordX) {
      this.removeChild(this.coordX);
      this.coordX.destroy(true);
      this.coordX = null;
    }

    const [xKey, yKey] = getKeyByCoordinateType(this.coordinateType);
    this.coordX = new BitText(
      this['coordinate'][xKey],
      -CellSize.width / 2,
      -CellSize.height / 2,
      this.brandColor,
      35,
    );
    this.coordX.anchor.set(1, 1);
    this.coordX.zIndex = InnerIndex.text;
    this.coordX.visible = false;
    this.addChild(this.coordX);

    if (this.coordY) {
      this.removeChild(this.coordY);
      this.coordY.destroy(true);
      this.coordY = null;
    }
    this.coordY = new BitText(
      this['coordinate'][yKey],
      CellSize.width / 2,
      -CellSize.height / 2,
      this.brandColor,
      35,
    );
    this.coordY.anchor.set(0, 1);
    this.coordY.zIndex = InnerIndex.text;
    this.coordY.visible = false;
    this.addChild(this.coordY);
  }

  // 坐标切换为左手坐标系; 坐标Label切换为有事坐标系
  updateCoordination(posX, poxY, coordinate) {
    this.x = posX;
    this.y = poxY;
    this.coordinate = coordinate;
    this.addCoordination();
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
    this.selectedBorderSprite.y = 50;
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

    let cellType = 'normal';
    if (type === 'store_cell') {
      cellType = 'storeType';
    }
    if (type === 'block_cell') {
      cellType = 'blockType';
    }
    this.removeChild(this.navigation);
    this.navigation.destroy();
    this.renderNavigation(cellType);
    this.data.types.add(type);
  }

  removeType(type) {
    if (isStrictNull(type)) return;
    this.data.types.delete(type);

    let cellType;
    if (type === 'block_cell') {
      cellType = 'blank';
    } else if (type === 'store_cell') {
      if (this.data.types.size === 0) {
        cellType = 'blank';
      } else {
        cellType = 'normal';
      }
    } else {
      if (this.data.types.size === 0) {
        cellType = 'blank';
      }
    }

    if (!isNull(cellType)) {
      this.removeChild(this.navigation);
      this.navigation.destroy();
      this.renderNavigation(cellType);
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

  // ************ 模式切换  ************ //
  switchShown(selected) {
    this.states.shown = selected; // 用来标记当前Cell是否显示
    if (this.navigation) this.navigation.visible = selected;
    if (this.navigationId) this.navigationId.visible = selected;
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
