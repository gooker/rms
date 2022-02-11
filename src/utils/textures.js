import * as PIXI from 'pixi.js';
import { CellSize, HeatCircleRadius } from '@/config/consts';

export function getQrCodeSelectBorderTexture() {
  const tmpSelectedBorder = new PIXI.Graphics();
  tmpSelectedBorder.clear();
  tmpSelectedBorder.lineStyle(1, 0xff5722, 1);
  tmpSelectedBorder.beginFill(0xff5722, 0.5);
  tmpSelectedBorder.drawRect(0, 0, CellSize.width, CellSize.height);
  return window.PixiUtils.renderer.generateTexture(tmpSelectedBorder);
}

export function getCostArrow(renderer, color) {
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
  return renderer.generateTexture(arrow, {
    scaleMode: 1,
    resolution: 2,
    region: new PIXI.Rectangle(-textureWidth / 2, 0, textureWidth, distanceInt),
  });
}

export function getBoldCostArrow(color) {
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
  const headLength = 150;
  const theta = 25;
  const angle1 = ((90 + theta) * Math.PI) / 180;
  const topX = headLength * Math.cos(angle1);
  const topY = headLength * Math.sin(angle1);
  arrowX = topX;
  arrowY = topY;
  arrow.moveTo(arrowX, arrowY);
  arrow.lineTo(0, 0);

  // 箭头右帽
  const angle2 = ((90 - theta) * Math.PI) / 180;
  const botX = headLength * Math.cos(angle2);
  const botY = headLength * Math.sin(angle2);
  arrowX = botX;
  arrowY = botY;
  arrow.lineTo(arrowX, arrowY);

  // 路线纹理
  return window.PixiUtils.renderer.generateTexture(arrow);
}

export function getTaskPathTexture(color) {
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

export function getCellHeatTexture(color) {
  const heatCircle = new PIXI.Graphics();
  heatCircle.clear();
  heatCircle.lineStyle(1, color, 1);
  heatCircle.beginFill(color, 1);
  heatCircle.drawCircle(0, 0, HeatCircleRadius);
  return window.PixiUtils.renderer.generateTexture(heatCircle);
}

export function getAgvSelectBorderTexture() {
  const tmpSelectedBorder = new PIXI.Graphics();
  tmpSelectedBorder.clear();
  tmpSelectedBorder.lineStyle(1, 0xffffff, 1);
  tmpSelectedBorder.beginFill(0xffffff, 0.5);
  tmpSelectedBorder.drawCircle(0, 0, 500);
  return window.PixiUtils.renderer.generateTexture(tmpSelectedBorder);
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
      .add('0', '/images/0.png')
      .add('1-10', '/images/1-10.png')
      .add('11-20', '/images/11-20.png')
      .add('21-40', '/images/21-40.png')
      .add('41-60', '/images/41-60.png')
      .add('61-80', '/images/61-80.png')
      .add('81-100', '/images/81-100.png')
      .add('actions', '/images/actions.png')
      .add('agv_connected', '/images/agv_connected.png')
      .add('agv_error', '/images/agv_error.png')
      .add('agv_manually', '/images/agv_manually.png')
      .add('agv_offline', '/images/agv_offline.png')
      .add('agv_on_task', '/images/agv_on_task.png')
      .add('agv_sorter', '/images/agv_sorter.png')
      .add('agv_stand_by', '/images/agv_stand_by.png')
      .add('agv_tote', '/images/agv_tote.png')
      .add('agv_waiting', '/images/agv_waiting.png')
      .add('barrier', '/images/barrier.png')
      .add('bifurcation', '/images/bifurcation.png')
      .add('block_cell', '/images/block_cell.png')
      .add('box', '/images/box.png')
      .add('buffer_cell', '/images/buffer_cell.png')
      .add('charger', '/images/charger.png')
      .add('charger_cell', '/images/charger_cell.png')
      .add('charging', '/images/charging.png')
      .add('charging_unbind', '/images/charging_unbind.png')
      .add('common', '/images/common.png')
      .add('elevator', '/images/elevator.png')
      .add('elevator_in', '/images/elevator_in.png')
      .add('elevator_out', '/images/elevator_out.png')
      .add('enter_cell', '/images/enter_cell.png')
      .add('error', '/images/error.png')
      .add('follow_cell', '/images/follow_cell.png')
      .add('forbidden', '/images/forbidden.png')
      .add('get_task', '/images/get_task.png')
      .add('heat_0', '/images/heat_0.png')
      .add('intersection', '/images/intersection.png')
      .add('latent_agv', '/images/latent_agv.png')
      .add('latent_agv_green', '/images/latent_agv_green.png')
      .add('latent_agv_grey', '/images/latent_agv_grey.png')
      .add('latent_agv_purple', '/images/latent_agv_purple.png')
      .add('latent_agv_red', '/images/latent_agv_red.png')
      .add('latent_agv_yellow', '/images/latent_agv_yellow.png')
      .add('leave_cell', '/images/leave_cell.png')
      .add('lock', '/images/lock.png')
      .add('maintain', '/images/maintain.png')
      .add('non_stop', '/images/non_stop.png')
      .add('offline', '/images/offline.png')
      .add('parking', '/images/parking.png')
      .add('pod', '/images/pod.png')
      .add('pod_BOTH', '/images/pod_BOTH.png')
      .add('pod_FETCH', '/images/pod_FETCH.png')
      .add('pod_PUT', '/images/pod_PUT.png')
      .add('pod_grey', '/images/pod_grey.png')
      .add('qrcode', '/images/qrcode.png')
      .add('rest_cell', '/images/rest_cell.png')
      .add('risk', '/images/risk.png')
      .add('rotate_lock', '/images/rorate_lock.png')
      .add('rotate_cell', '/images/round.png')
      .add('safe_cell', '/images/safe_spot.png')
      .add('scan_cell', '/images/scan_cell.png')
      .add('sorter', '/images/sorter.png')
      .add('sorter_green', '/images/sorter_green.png')
      .add('sorter_grey', '/images/sorter_grey.png')
      .add('sorter_purple', '/images/sorter_purple.png')
      .add('sorter_red', '/images/sorter_red.png')
      .add('sorter_yellow', '/images/sorter_yellow.png')
      .add('stop', '/images/stop.png')
      .add('store_cell', '/images/store_cell.png')
      .add('tmp_block_lock', '/images/tmp_block_lock.png')
      .add('tote_agv', '/images/tote_agv.png')
      .add('tote_agv_green', '/images/tote_agv_green.png')
      .add('tote_agv_grey', '/images/tote_agv_grey.png')
      .add('tote_agv_purple', '/images/tote_agv_purple.png')
      .add('tote_agv_red', '/images/tote_agv_red.png')
      .add('tote_agv_yellow', '/images/tote_agv_yellow.png')
      .add('tote_bin', '/images/tote_bin.png')
      .add('tote_shelf', '/images/tote_shelf.png')
      .add('traffic_control', '/images/traffic_control.png')
      .add('wait_cell', '/images/wait_cell.png')
      .add('waiting', '/images/waiting.png')
      .add('warning', '/images/warning.png')
      .add('work_station', '/images/work_station.png')
      .add('work_station_1', '/images/work_station_1.png')
      .add('work_station_2', '/images/work_station_2.png')
      .add('work_station_3', '/images/work_station_3.png')
      .add('work_station_4', '/images/work_station_4.png')
      .add('work_station_5', '/images/work_station_5.png')
      .add('work_station_6', '/images/work_station_6.png')
      .add('work_station_7', '/images/work_station_7.png')
      .add('work_station_8', '/images/work_station_8.png')
      .add('errorLevel_1', '/images/errorLevel_1.png')
      .add('errorLevel_2', '/images/errorLevel_2.png')
      .add('errorLevel_3', '/images/errorLevel_3.png')
      .add('tiny_rotate', '/images/tiny_rotate.png')
      .load(() => {
        resolve();
      });
  });
}
