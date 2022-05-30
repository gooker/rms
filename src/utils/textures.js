import * as PIXI from 'pixi.js';
import { CellSize, HeatCircleRadius } from '@/config/consts';

const graphics = new PIXI.Graphics();
export function getQrCodeSelectBorderTexture(renderer, hasBorder) {
  graphics.clear();
  hasBorder && graphics.lineStyle(1, 0xff5722, 1);
  graphics.beginFill(0xff5722, 0.5);
  graphics.drawRect(0, 0, CellSize.width, CellSize.height);
  return renderer.generateTexture(graphics);
}

export function getIntersectionDirectionTexture(renderer) {
  graphics.clear();

  const length = 250;
  const CAP_WIDTH = 40;
  const CAP_HEIGHT = 80;
  const polygonPath = [
    0,
    0,
    -CAP_WIDTH,
    CAP_HEIGHT,
    -CAP_WIDTH / 2,
    CAP_HEIGHT,
    -CAP_WIDTH / 2,
    length,
    CAP_WIDTH / 2,
    length,
    CAP_WIDTH / 2,
    CAP_HEIGHT,
    CAP_WIDTH,
    CAP_HEIGHT,
  ];
  graphics.lineStyle(0);
  graphics.beginFill(0xffffff, 1);
  graphics.drawPolygon(polygonPath);
  graphics.endFill();
  return renderer.generateTexture(graphics);
}

export function getTaskPathTexture(color) {
  const distance = 100; // 默认长度是100
  const lineWidth = CellSize.width / 3;
  graphics.clear();
  graphics.lineStyle(lineWidth, color, 1);
  graphics.moveTo(0, 0);
  graphics.lineTo(0, distance);
  return window.PixiUtils.renderer.generateTexture(graphics, {
    scaleMode: 1,
    resolution: 2,
    region: new PIXI.Rectangle(-25, 0, 50, distance),
  });
}

export function getCellHeatTexture(color) {
  graphics.clear();
  graphics.lineStyle(1, color, 1);
  graphics.beginFill(color, 1);
  graphics.drawCircle(0, 0, HeatCircleRadius);
  return window.PixiUtils.renderer.generateTexture(graphics);
}

export function getVehicleSelectBorderTexture() {
  graphics.clear();
  graphics.lineStyle(1, 0xffffff, 1);
  graphics.beginFill(0xffffff, 0.5);
  graphics.drawCircle(0, 0, 500);
  return window.PixiUtils.renderer.generateTexture(graphics);
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
      .add('vehicle_connected', '/images/vehicle_connected.png')
      .add('vehicle_error', '/images/vehicle_error.png')
      .add('vehicle_manually', '/images/vehicle_manually.png')
      .add('vehicle_offline', '/images/vehicle_offline.png')
      .add('vehicle_on_task', '/images/vehicle_on_task.png')
      .add('vehicle_sorter', '/images/vehicle_sorter.png')
      .add('vehicle_stand_by', '/images/vehicle_stand_by.png')
      .add('vehicle_tote', '/images/vehicle_tote.png')
      .add('vehicle_waiting', '/images/vehicle_waiting.png')
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
      .add('entrance_cell', '/images/enter_cell.png')
      .add('error', '/images/error.png')
      .add('follow_cell', '/images/follow_cell.png')
      .add('forbidden', '/images/forbidden.png')
      .add('get_task', '/images/get_task.png')
      .add('heat_0', '/images/heat_0.png')
      .add('intersection', '/images/intersection.png')
      .add('latent_vehicle', '/images/latent_vehicle.png')
      .add('latent_vehicle_green', '/images/latent_vehicle_green.png')
      .add('latent_vehicle_grey', '/images/latent_vehicle_grey.png')
      .add('latent_vehicle_purple', '/images/latent_vehicle_purple.png')
      .add('latent_vehicle_red', '/images/latent_vehicle_red.png')
      .add('latent_vehicle_yellow', '/images/latent_vehicle_yellow.png')
      .add('exit_cell', '/images/leave_cell.png')
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
      .add('rest_cell', '/images/rest_cell.png')
      .add('risk', '/images/risk.png')
      .add('rotate_lock', '/images/rorate_lock.png')
      .add('rotate_cell', '/images/round.png')
      .add('safe_cell', '/images/safe_cell.png')
      .add('scan_cell', '/images/scan_cell.png')
      // .add('sorter', '/images/sorter.png')
      .add('sorter_vehicle', '/images/sorter.png')
      .add('sorter_vehicle_green', '/images/sorter_green.png')
      .add('sorter_vehicle_grey', '/images/sorter_grey.png')
      .add('sorter_vehicle_purple', '/images/sorter_purple.png')
      .add('sorter_vehicle_red', '/images/sorter_red.png')
      .add('sorter_vehicle_yellow', '/images/sorter_yellow.png')
      .add('stop', '/images/stop.png')
      .add('store_cell', '/images/store_cell.png')
      .add('tmp_block_lock', '/images/tmp_block_lock.png')
      .add('tote_vehicle', '/images/tote_vehicle.png')
      .add('tote_vehicle_green', '/images/tote_vehicle_green.png')
      .add('tote_vehicle_grey', '/images/tote_vehicle_grey.png')
      .add('tote_vehicle_purple', '/images/tote_vehicle_purple.png')
      .add('tote_vehicle_red', '/images/tote_vehicle_red.png')
      .add('tote_vehicle_yellow', '/images/tote_vehicle_yellow.png')
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
      .add('delivery', '/images/delivery.png')
      .add('basket', '/images/basket.png')
      .add('pin', '/images/pin.png')
      .add('cost_10', '/images/cost_10.png')
      .add('cost_20', '/images/cost_20.png')
      .add('cost_100', '/images/cost_100.png')
      .add('cost_1000', '/images/cost_1000.png')
      .add('cost_10_p', '/images/cost_10_p.png')
      .add('cost_20_p', '/images/cost_20_p.png')
      .add('cost_100_p', '/images/cost_100_p.png')
      .add('cost_1000_p', '/images/cost_1000_p.png')
      .load(() => {
        resolve();
      });
  });
}
