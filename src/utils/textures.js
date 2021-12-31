import * as PIXI from 'pixi.js';
import {
  SpotSize,
  CostColor,
  ToteAGVSize,
  TaskPathColor,
  ForkLiftAGVSize,
  HeatCircleRadius,
} from '@/config/consts';
import { BitText, LineArrow } from '@/packages/XIHE/entities';

function getHasOppositeDirection(relations, source, target) {
  let result = false;
  for (let index = 0; index < relations.length; index++) {
    const element = relations[index];
    if (element.source === target && element.target === source) {
      result = true;
      break;
    }
  }
  return result;
}

function getLineCorner(relations, beginCell, endCell, angle) {
  const intAngle = parseInt(angle, 10);
  let x1;
  let y1;
  let x2;
  let y2;
  let rotation;
  const hasOppositeDirection = getHasOppositeDirection(relations, beginCell.id, endCell.id);
  switch (true) {
    case intAngle > 0 && intAngle < 90: {
      if (!hasOppositeDirection) {
        x1 = beginCell.x + SpotSize.width / 2;
        y1 = beginCell.y - SpotSize.height / 2;
      } else {
        x1 = beginCell.x + SpotSize.width / 2;
        y1 = beginCell.y - SpotSize.height / 2 + SpotSize.height / 5;
      }
      break;
    }
    case intAngle > 90 && intAngle < 180: {
      if (!hasOppositeDirection) {
        x1 = beginCell.x + SpotSize.width / 2;
        y1 = beginCell.y + SpotSize.height / 2;
      } else {
        x1 = beginCell.x + SpotSize.width / 2 - SpotSize.width / 5;
        y1 = beginCell.y + SpotSize.height / 2;
      }
      break;
    }
    case intAngle > 180 && intAngle < 270: {
      if (!hasOppositeDirection) {
        x1 = beginCell.x - SpotSize.width / 2;
        y1 = beginCell.y + SpotSize.height / 2;
      } else {
        x1 = beginCell.x - SpotSize.width / 2;
        y1 = beginCell.y + SpotSize.height / 2 - SpotSize.height / 5;
      }
      break;
    }
    case intAngle > 270 && intAngle < 360: {
      if (!hasOppositeDirection) {
        x1 = beginCell.x - SpotSize.width / 2;
        y1 = beginCell.y - SpotSize.height / 2;
      } else {
        x1 = beginCell.x - SpotSize.width / 2 + SpotSize.width / 5;
        y1 = beginCell.y - SpotSize.height / 2;
      }
      break;
    }
    default:
      break;
  }
  return { x1, y1, x2, y2, rotation };
}

function getQrCodeSelectBorderTexture() {
  const tmpSelectedBorder = new PIXI.Graphics();
  tmpSelectedBorder.clear();
  tmpSelectedBorder.lineStyle(1, 0xff5722, 1);
  tmpSelectedBorder.beginFill(0xff5722, 0.5);
  tmpSelectedBorder.drawRect(0, 0, SpotSize.width, SpotSize.height);
  return window.PixiUtils.renderer.generateTexture(tmpSelectedBorder);
}

function getCostArrow(color) {
  // 默认长度是1125，宽度是15，后续可以通过Scale去调整尺寸
  const distanceInt = 1125;
  const lineWidth = 15;

  // 箭头主体
  const arrow = new PIXI.Graphics();
  arrow.clear();
  arrow.lineStyle(lineWidth, color, 1);
  arrow.moveTo(0, distanceInt);
  arrow.lineTo(0, 0);

  // 箭头左帽
  let arrowX;
  let arrowY;
  const headlen = 160;
  const theta = 6; // 20;
  const angle1 = ((90 + theta) * Math.PI) / 180;
  const topX = headlen * Math.cos(angle1);
  const topY = headlen * Math.sin(angle1);
  arrowX = 0 + topX;
  arrowY = 0 + topY;
  arrow.moveTo(arrowX, arrowY);
  arrow.lineTo(0, 0);

  // 箭头右帽
  const angle2 = ((90 - theta) * Math.PI) / 180;
  const botX = headlen * Math.cos(angle2);
  const botY = headlen * Math.sin(angle2);
  arrowX = 0 + botX;
  arrowY = 0 + botY;
  arrow.lineTo(arrowX, arrowY);

  // 路线纹理
  const textureWidth = 50; // 150
  return window.PixiUtils.renderer.generateTexture(
    arrow,
    1,
    2,
    new PIXI.Rectangle(-25, 0, textureWidth, distanceInt),
  );
}

function getBlodCostArrow(color) {
  // 默认长度是1125，宽度是15，后续可以通过Scale去调整尺寸
  const distanceInt = 200;
  const lineWidth = 40;

  // 箭头主体
  const arrow = new PIXI.Graphics();
  arrow.clear();
  arrow.lineStyle(lineWidth, color, 1);
  arrow.moveTo(0, distanceInt);
  arrow.lineTo(0, 0);

  // 箭头左帽
  let arrowX;
  let arrowY;
  const headlen = 150;
  const theta = 25;
  const angle1 = ((90 + theta) * Math.PI) / 180;
  const topX = headlen * Math.cos(angle1);
  const topY = headlen * Math.sin(angle1);
  arrowX = 0 + topX;
  arrowY = 0 + topY;
  arrow.moveTo(arrowX, arrowY);
  arrow.lineTo(0, 0);

  // 箭头右帽
  const angle2 = ((90 - theta) * Math.PI) / 180;
  const botX = headlen * Math.cos(angle2);
  const botY = headlen * Math.sin(angle2);
  arrowX = 0 + botX;
  arrowY = 0 + botY;
  arrow.lineTo(arrowX, arrowY);

  // 路线纹理
  return window.PixiUtils.renderer.generateTexture(arrow);
}

function getTaskPathTexture(color) {
  const distance = 100; // 默认长度是100
  const lineWidth = SpotSize.width / 3;
  const arrow = new PIXI.Graphics();
  arrow.clear();
  arrow.lineStyle(lineWidth, color, 1);
  arrow.moveTo(0, 0);
  arrow.lineTo(0, distance);
  return window.PixiUtils.renderer.generateTexture(
    arrow,
    1,
    2,
    new PIXI.Rectangle(-25, 0, 50, distance),
  );
}

function getCellHeatTexture(color) {
  const heatCircle = new PIXI.Graphics();
  heatCircle.clear();
  heatCircle.lineStyle(1, color, 1);
  heatCircle.beginFill(color, 1);
  heatCircle.drawCircle(0, 0, HeatCircleRadius);
  return window.PixiUtils.renderer.generateTexture(heatCircle);
}

function getAgvSelectBorderTexture() {
  const tmpSelectedBorder = new PIXI.Graphics();
  tmpSelectedBorder.clear();
  tmpSelectedBorder.lineStyle(1, 0xffffff, 1);
  tmpSelectedBorder.beginFill(0xffffff, 0.5);
  tmpSelectedBorder.drawCircle(0, 0, 500);
  return window.PixiUtils.renderer.generateTexture(tmpSelectedBorder);
}

function getLineAnchor(relations, beginCell, endCell, angle) {
  let fromX;
  let fromY;
  let toX;
  let toY;
  let rotation;
  switch (parseInt(angle, 10)) {
    case 0: {
      if (getHasOppositeDirection(relations, beginCell.id, endCell.id)) {
        fromX = beginCell.x + SpotSize.width / 5;
        fromY = beginCell.y - SpotSize.width / 2;
      } else {
        fromX = beginCell.x;
        fromY = beginCell.y - SpotSize.width / 2;
      }
      break;
    }
    case 90: {
      if (getHasOppositeDirection(relations, beginCell.id, endCell.id)) {
        fromX = beginCell.x + SpotSize.height / 2;
        fromY = beginCell.y + SpotSize.width / 5;
      } else {
        fromX = beginCell.x + SpotSize.height / 2;
        fromY = beginCell.y;
      }
      break;
    }
    case 180: {
      if (getHasOppositeDirection(relations, beginCell.id, endCell.id)) {
        fromX = beginCell.x - SpotSize.width / 5;
        fromY = beginCell.y + SpotSize.width / 2;
      } else {
        fromX = beginCell.x;
        fromY = beginCell.y + SpotSize.width / 2;
      }
      break;
    }
    case 270: {
      if (getHasOppositeDirection(relations, beginCell.id, endCell.id)) {
        fromX = beginCell.x - SpotSize.height / 2;
        fromY = beginCell.y - SpotSize.width / 5;
      } else {
        fromX = beginCell.x - SpotSize.height / 2;
        fromY = beginCell.y;
      }
      break;
    }
    default: {
      const data = getLineCorner(relations, beginCell, endCell, angle);
      fromX = data.x1;
      fromY = data.y1;
      toX = data.x2;
      toY = data.y2;
      rotation = data.rotation;
      break;
    }
  }
  return { fromX, fromY, toX, toY, rotation };
}

/**
 * 获取线条实例
 * @param {*} relations
 * @param {*} beginCell
 * @param {*} endCell
 * @param {*} lineAngle
 * @param {*} cost
 * @param {*} distance
 * @param {*} clickCB
 * @param {*} mapMode
 */
export function getLineGraphics(
  relations,
  beginCell,
  endCell,
  lineAngle,
  cost,
  distance,
  clickCB,
  mapMode,
) {
  const { fromX, fromY, rotation } = getLineAnchor(relations, beginCell, endCell, lineAngle);
  return new LineArrow({
    id: `${beginCell.id}-${endCell.id}`,
    fromX,
    fromY,
    lineAngle,
    rotation,
    cost,
    distance,
    interactive: !!clickCB,
    isClassic: mapMode === 'standard',
    click: clickCB,
  });
}

export function getFeatureTextures(text) {
  const alphabetText = new BitText(text, 10, 0, 0xffffff, 50);
  return window.PixiUtils.renderer.generateTexture(
    alphabetText,
    1,
    2,
    new PIXI.Rectangle(0, 0, 50, 50),
  );
}

export function getRectLock(width, height) {
  const rectLock = new PIXI.Graphics();
  rectLock.clear();
  rectLock.lineStyle(20, 0xffffff, 1);
  rectLock.drawRect(0, 0, width, height);
  return window.PixiUtils.renderer.generateTexture(rectLock);
}

export function loadTexturesForMap(cb) {
  window.PixiUtils.loader
    // 字体
    .add('mufont', './fonts/mufont-hd.xml')

    // 纹理图集
    .add('spritesheet-0.json')
    .add('spritesheet-1.json')
    .add('spritesheet-2.json')
    .add('spritesheet-3.json')
    .add('spritesheet-4.json')
    .add('spritesheet-5.json')
    .add('spriteSheets/spritesheet-1.json')
    .add('spriteSheets/spritesheet-2.json')
    .add('spriteSheets/spritesheet-3.json')
    .add('spriteSheets/spritesheet-4.json')
    .add('spriteSheets/spritesheet-5.json')
    .add('spriteSheets/spritesheet-6.json')

    // 图片素材
    .add('get_task', 'get_task.png') // 接任务点
    .add('box', 'pic/box.png') // 分拣车货物
    .add('offline', 'pic/offline.png') // 断网图标
    .add('waiting', 'pic/waiting.png') // 小车等待状态小图标
    .add('charging_unbind', 'pic/charging_unbind.png') // 充电桩未绑定硬件图标
    .add('traffic_control', 'pic/traffic_control.png') // 交通管控图标
    .add('safe_spot', 'pic/safe_cell.png') // 安全区图标

    // 小车
    .add('tote_agv_purple', 'pic/tote_agv_purple.png')
    .add('latent_agv_purple', 'pic/latent_agv_purple.png')
    .add('sorter_agv', 'pic/sorter.png')
    .add('sorter_agv_green', 'pic/sorter_green.png')
    .add('sorter_agv_grey', 'pic/sorter_grey.png')
    .add('sorter_agv_purple', 'pic/sorter_purple.png')
    .add('sorter_agv_red', 'pic/sorter_red.png')
    .add('sorter_agv_yellow', 'pic/sorter_yellow.png')

    // 工作站预制图标
    .add('work_station_1', 'work_station_1.png')
    .add('work_station_2', 'work_station_2.png')
    .add('work_station_3', 'work_station_3.png')
    .add('work_station_4', 'work_station_4.png')
    .add('work_station_5', 'work_station_5.png')
    .add('work_station_6', 'work_station_6.png')
    .add('work_station_7', 'work_station_7.png')
    .add('work_station_8', 'work_station_8.png')

    // 临时新增
    .add('cad_1', 'pixi_map_pic_1.png')
    .add('cad_6', 'pixi_map_pic_6.png')

    .load(() => {
      // 背景
      PIXI.Texture.addToCache(getAgvSelectBorderTexture(), 'agvSelectBorderTexture');
      PIXI.Texture.addToCache(getQrCodeSelectBorderTexture(), 'cellSelectBorderTexture');

      // Cost线条
      PIXI.Texture.addToCache(getCostArrow(CostColor[10]), '_10CostArrow');
      PIXI.Texture.addToCache(getCostArrow(CostColor[20]), '_20CostArrow');
      PIXI.Texture.addToCache(getCostArrow(CostColor[100]), '_100CostArrow');
      PIXI.Texture.addToCache(getCostArrow(CostColor[1000]), '_1000CostArrow');

      // 方向
      PIXI.Texture.addToCache(getBlodCostArrow('0xFFFFFF'), 'boldDirection');

      // 任务路径
      PIXI.Texture.addToCache(getTaskPathTexture(TaskPathColor.passed), '_passedTaskPath');
      PIXI.Texture.addToCache(getTaskPathTexture(TaskPathColor.locked), '_lockedTaskPath');
      PIXI.Texture.addToCache(getTaskPathTexture(TaskPathColor.future), '_futureTaskPath');

      // 锁格
      PIXI.Texture.addToCache(getRectLock(1050, 1050), 'LatentRectLock');
      PIXI.Texture.addToCache(getRectLock(ToteAGVSize.width, ToteAGVSize.height), 'ToteRectLock');
      PIXI.Texture.addToCache(
        getRectLock(ForkLiftAGVSize.width, ForkLiftAGVSize.height),
        'ForkRectLock',
      );

      // 点位成本热度
      PIXI.Texture.addToCache(getCellHeatTexture('0x3366FF'), '_cellHeat1');
      PIXI.Texture.addToCache(getCellHeatTexture('0x5984C3'), '_cellHeat2');
      PIXI.Texture.addToCache(getCellHeatTexture('0x7FA387'), '_cellHeat3');
      PIXI.Texture.addToCache(getCellHeatTexture('0xA5C14B'), '_cellHeat4');
      PIXI.Texture.addToCache(getCellHeatTexture('0xC9D04B'), '_cellHeat5');
      PIXI.Texture.addToCache(getCellHeatTexture('0xEEE04B'), '_cellHeat6');
      PIXI.Texture.addToCache(getCellHeatTexture('0xF4B042'), '_cellHeat7');
      PIXI.Texture.addToCache(getCellHeatTexture('0xF87636'), '_cellHeat8');
      PIXI.Texture.addToCache(getCellHeatTexture('0xF03C2B'), '_cellHeat9');
      PIXI.Texture.addToCache(getCellHeatTexture('0xCF2723'), '_cellHeat10');

      cb && cb();
    });
}
