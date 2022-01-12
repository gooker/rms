import * as PIXI from 'pixi.js';
import { BitText, LineArrow } from '@/entities';
import { calculateCellDistance } from './mapUtils';
import { CellSize, ToteAGVSize, CostColor, TaskPathColor, HeatCircleRadius } from '@/config/consts';

function getQrCodeSelectBorderTexture() {
  const tmpSelectedBorder = new PIXI.Graphics();
  tmpSelectedBorder.clear();
  tmpSelectedBorder.lineStyle(1, 0xff5722, 1);
  tmpSelectedBorder.beginFill(0xff5722, 0.5);
  tmpSelectedBorder.drawRect(0, 0, CellSize.width, CellSize.height);
  return window.PixiUtils.renderer.generateTexture(tmpSelectedBorder);
}

function getCostArrow(color) {
  // 默认长度是1125，宽度是15，后续可以通过Scale去调整尺寸
  const distanceInt = 1125;
  const lineWidth = 40;

  // 箭头主体
  const arrow = new PIXI.Graphics();

  arrow.clear();

  arrow.beginFill(color);

  // 画一个三角形，作为箭头
  arrow.drawPolygon([
    0,
    0, // Starting x, y coordinates
    -50,
    300,
    50,
    300,
  ]);
  arrow.endFill();

  arrow.lineStyle(lineWidth, color, 1);
  arrow.moveTo(0, 300);
  arrow.lineTo(0, distanceInt);

  // 路线纹理
  const textureWidth = 100; // 150
  return window.PixiUtils.renderer.generateTexture(arrow, {
    scaleMode: 1,
    resolution: 2,
    region: new PIXI.Rectangle(-textureWidth / 2, 0, textureWidth, distanceInt),
  });
}

function getBoldCostArrow(color) {
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
  const lineWidth = CellSize.width / 3;
  const arrow = new PIXI.Graphics();
  arrow.clear();
  arrow.lineStyle(lineWidth, color, 1);
  arrow.moveTo(0, 0);
  arrow.lineTo(0, distance);
  return window.PixiUtils.renderer.generateTexture(arrow, {
    scaleMode: 1,
    resolution: 2,
    region: new PIXI.Rectangle(-25, 0, 50, distance),
  });
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
  let x1;
  let y1;

  switch (true) {
    case angle > 0 && angle < 90: {
      x1 = beginCell.x + CellSize.width / 2;
      y1 = beginCell.y - CellSize.height / 2;
      break;
    }
    case angle > 90 && angle < 180: {
      x1 = beginCell.x + CellSize.width / 2;
      y1 = beginCell.y + CellSize.height / 2;
      break;
    }
    case angle > 180 && angle < 270: {
      x1 = beginCell.x - CellSize.width / 2;
      y1 = beginCell.y + CellSize.height / 2;
      break;
    }
    case angle > 270 && angle < 360: {
      x1 = beginCell.x - CellSize.width / 2;
      y1 = beginCell.y - CellSize.height / 2;
      break;
    }
    default:
      break;
  }
  return { x1, y1 };
}

/**
 * 获取当前线条的起始点坐标和角度
 * @param {*} relations
 * @param {*} beginCell
 * @param {*} endCell
 * @param {*} angle
 * @returns { fromX, fromY, length, distance }
 */
function getLineAnchor(relations, beginCell, endCell, angle) {
  let fromX;
  let fromY;
  let length;

  // 计算线条起点
  if (getHasOppositeDirection(relations, beginCell.id, endCell.id)) {
    fromX = (beginCell.x + endCell.x) / 2;
    fromY = (beginCell.y + endCell.y) / 2;
  } else {
    switch (angle) {
      case 0: {
        fromX = beginCell.x;
        fromY = beginCell.y - CellSize.height / 2;
        break;
      }
      case 90: {
        fromX = beginCell.x + CellSize.height / 2;
        fromY = beginCell.y;
        break;
      }
      case 180: {
        fromX = beginCell.x;
        fromY = beginCell.y + CellSize.width / 2;
        break;
      }
      case 270: {
        fromX = beginCell.x - CellSize.height / 2;
        fromY = beginCell.y;
        break;
      }
      default: {
        const data = getLineCorner(relations, beginCell, endCell, angle);
        fromX = data.x1;
        fromY = data.y1;
        break;
      }
    }
  }

  // 计算线条长度
  if ([0, 90, 180, 270].includes(angle)) {
    length = calculateCellDistance({ x: fromX, y: fromY }, endCell) - CellSize.height / 2;
  } else {
    length =
      calculateCellDistance({ x: fromX, y: fromY }, endCell) -
      Math.sqrt(CellSize.height ** 2 + CellSize.width ** 2) / 2;
  }

  const distance = calculateCellDistance(beginCell, endCell);
  return { fromX, fromY, length, distance };
}

/**
 * 获取线条实例
 * @param {*} relations
 * @param {*} beginCell
 * @param {*} endCell
 * @param {*} lineAngle
 * @param {*} cost
 * @param {*} clickCB
 * @param {*} mapMode
 */
export function getLineGraphics(relations, beginCell, endCell, lineAngle, cost, clickCB, mapMode) {
  const { fromX, fromY, length, distance } = getLineAnchor(
    relations,
    beginCell,
    endCell,
    lineAngle,
  );
  return new LineArrow({
    id: `${beginCell.id}-${endCell.id}`,
    fromX,
    fromY,
    lineAngle,
    cost,
    length,
    distance,
    interactive: !!clickCB,
    isClassic: mapMode === 'standard',
    mapMode: mapMode,
    click: clickCB,
  });
}

export function getFeatureTextures(text) {
  const alphabetText = new BitText(text, 10, 0, 0xffffff, 50);
  return window.PixiUtils.renderer.generateTexture(alphabetText, {
    scaleMode: 1,
    resolution: 2,
    region: new PIXI.Rectangle(0, 0, 50, 50),
  });
}

export function getRectLock(width, height) {
  const rectLock = new PIXI.Graphics();
  rectLock.clear();
  rectLock.lineStyle(20, 0xffffff, 1);
  rectLock.drawRect(0, 0, width, height);
  return window.PixiUtils.renderer.generateTexture(rectLock);
}

export function loadTexturesForMap() {
  return new Promise((resolve) => {
    PIXI.Loader.shared
      // 字体
      .add('mufont', '/fonts/mufont-hd.xml')

      // 材质图片
      .add('0', '/textures/0.png')
      .add('1-10', '/textures/1-10.png')
      .add('11-20', '/textures/11-20.png')
      .add('21-40', '/textures/21-40.png')
      .add('41-60', '/textures/41-60.png')
      .add('61-80', '/textures/61-80.png')
      .add('81-100', '/textures/81-100.png')
      .add('actions', '/textures/actions.png')
      .add('agv_connected', '/textures/agv_connected.png')
      .add('agv_error', '/textures/agv_error.png')
      .add('agv_manually', '/textures/agv_manually.png')
      .add('agv_offline', '/textures/agv_offline.png')
      .add('agv_on_task', '/textures/agv_on_task.png')
      .add('agv_sorter', '/textures/agv_sorter.png')
      .add('agv_stand_by', '/textures/agv_stand_by.png')
      .add('agv_tote', '/textures/agv_tote.png')
      .add('agv_waiting', '/textures/agv_waiting.png')
      .add('barrier', '/textures/barrier.png')
      .add('bifurcation', '/textures/bifurcation.png')
      .add('block_cell', '/textures/block_cell.png')
      .add('box', '/textures/box.png')
      .add('buffer_cell', '/textures/buffer_cell.png')
      .add('charger', '/textures/charger.png')
      .add('charger_cell', '/textures/charger_cell.png')
      .add('charging', '/textures/charging.png')
      .add('charging_unbind', '/textures/charging_unbind.png')
      .add('common', '/textures/common.png')
      .add('elevator', '/textures/elevator.png')
      .add('elevator_in', '/textures/elevator_in.png')
      .add('elevator_out', '/textures/elevator_out.png')
      .add('enter_cell', '/textures/enter_cell.png')
      .add('error', '/textures/error.png')
      .add('follow_cell', '/textures/follow_cell.png')
      .add('forbidden', '/textures/forbidden.png')
      .add('get_task', '/textures/get_task.png')
      .add('heat_0', '/textures/heat_0.png')
      .add('intersection', '/textures/intersection.png')
      .add('latent_agv', '/textures/latent_agv.png')
      .add('latent_agv_green', '/textures/latent_agv_green.png')
      .add('latent_agv_grey', '/textures/latent_agv_grey.png')
      .add('latent_agv_purple', '/textures/latent_agv_purple.png')
      .add('latent_agv_red', '/textures/latent_agv_red.png')
      .add('latent_agv_yellow', '/textures/latent_agv_yellow.png')
      .add('leave_cell', '/textures/leave_cell.png')
      .add('lock', '/textures/lock.png')
      .add('maintain', '/textures/maintain.png')
      .add('non_stop', '/textures/non_stop.png')
      .add('offline', '/textures/offline.png')
      .add('parking', '/textures/parking.png')
      .add('pod', '/textures/pod.png')
      .add('pod_BOTH', '/textures/pod_BOTH.png')
      .add('pod_FETCH', '/textures/pod_FETCH.png')
      .add('pod_PUT', '/textures/pod_PUT.png')
      .add('pod_grey', '/textures/pod_grey.png')
      .add('qrcode', '/textures/qrcode.png')
      .add('rest_cell', '/textures/rest_cell.png')
      .add('risk', '/textures/risk.png')
      .add('rorate_lock', '/textures/rorate_lock.png')
      .add('round', '/textures/round.png')
      .add('safe_spot', '/textures/safe_spot.png')
      .add('scan_cell', '/textures/scan_cell.png')
      .add('sorter', '/textures/sorter.png')
      .add('sorter_green', '/textures/sorter_green.png')
      .add('sorter_grey', '/textures/sorter_grey.png')
      .add('sorter_purple', '/textures/sorter_purple.png')
      .add('sorter_red', '/textures/sorter_red.png')
      .add('sorter_yellow', '/textures/sorter_yellow.png')
      .add('stop', '/textures/stop.png')
      .add('store_cell', '/textures/store_cell.png')
      .add('tmp_block_lock', '/textures/tmp_block_lock.png')
      .add('tote_agv', '/textures/tote_agv.png')
      .add('tote_agv_green', '/textures/tote_agv_green.png')
      .add('tote_agv_grey', '/textures/tote_agv_grey.png')
      .add('tote_agv_purple', '/textures/tote_agv_purple.png')
      .add('tote_agv_red', '/textures/tote_agv_red.png')
      .add('tote_agv_yellow', '/textures/tote_agv_yellow.png')
      .add('tote_bin', '/textures/tote_bin.png')
      .add('tote_shelf', '/textures/tote_shelf.png')
      .add('traffic_control', '/textures/traffic_control.png')
      .add('wait_cell', '/textures/wait_cell.png')
      .add('waiting', '/textures/waiting.png')
      .add('warning', '/textures/warning.png')
      .add('welcome', '/textures/welcome.png')
      .add('work_station', '/textures/work_station.png')
      .add('work_station_1', '/textures/work_station_1.png')
      .add('work_station_2', '/textures/work_station_2.png')
      .add('work_station_3', '/textures/work_station_3.png')
      .add('work_station_4', '/textures/work_station_4.png')
      .add('work_station_5', '/textures/work_station_5.png')
      .add('work_station_6', '/textures/work_station_6.png')
      .add('work_station_7', '/textures/work_station_7.png')
      .add('work_station_8', '/textures/work_station_8.png')
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
        PIXI.Texture.addToCache(getBoldCostArrow('0xFFFFFF'), 'boldDirection');

        // 任务路径
        PIXI.Texture.addToCache(getTaskPathTexture(TaskPathColor.passed), '_passedTaskPath');
        PIXI.Texture.addToCache(getTaskPathTexture(TaskPathColor.locked), '_lockedTaskPath');
        PIXI.Texture.addToCache(getTaskPathTexture(TaskPathColor.future), '_futureTaskPath');

        // 小车锁格
        PIXI.Texture.addToCache(getRectLock(1050, 1050), 'LatentRectLock');
        PIXI.Texture.addToCache(getRectLock(ToteAGVSize.width, ToteAGVSize.height), 'ToteRectLock');
        // PIXI.Texture.addToCache(
        //   getRectLock(ForkLiftAGVSize.width, ForkLiftAGVSize.height),
        //   'ForkRectLock',
        // );

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

        resolve();
      });
  });
}
