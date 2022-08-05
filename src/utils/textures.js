import * as PIXI from 'pixi.js';
import { CellSize, CellTypeColor, HeatCircleRadius, TaskPathColor } from '@/config/consts';
import { NavigationTypeView } from '@/config/config';

const graphics = new PIXI.Graphics();

function getQrCodeSelectBorderTexture(renderer, hasBorder) {
  graphics.clear();
  hasBorder && graphics.lineStyle(1, 0xff5722, 1);
  graphics.beginFill(0xff5722, 0.5);
  graphics.drawRect(0, 0, CellSize.width, CellSize.height);
  return renderer.generateTexture(graphics);
}

function getIntersectionDirectionTexture(renderer) {
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

function getTaskPathTexture(color, renderer) {
  const distance = 100; // 默认长度是100
  const lineWidth = CellSize.width / 3;
  graphics.clear();
  graphics.lineStyle(lineWidth, color, 1);
  graphics.moveTo(0, 0);
  graphics.lineTo(0, distance);
  return renderer.generateTexture(graphics, {
    scaleMode: 1,
    resolution: 2,
    region: new PIXI.Rectangle(-25, 0, 50, distance),
  });
}

function getCellHeatTexture(color, renderer) {
  graphics.clear();
  graphics.lineStyle(1, color, 1);
  graphics.beginFill(color, 1);
  graphics.drawCircle(0, 0, HeatCircleRadius);
  return renderer.generateTexture(graphics);
}

function getVehicleSelectBorderTexture(renderer) {
  graphics.clear();
  graphics.lineStyle(1, 0xffffff, 1);
  graphics.beginFill(0xffffff, 0.5);
  graphics.drawCircle(0, 0, 500);
  return renderer.generateTexture(graphics);
}

// 点圆材质
export function getCellCircleBodyTexture(brandColor, typeColor, renderer) {
  graphics.clear();
  graphics.lineStyle(CellSize.width * 0.4, typeColor, 1);
  graphics.beginFill(brandColor);
  graphics.drawCircle(0, 0, CellSize.width / 2);
  graphics.endFill();
  return renderer.generateTexture(graphics);
}

// 加载编辑器额外的自定义Texture
export function loadEditorExtraTextures(renderer) {
  return new Promise((resolve) => {
    // 点位选中的Texture
    PIXI.Texture.addToCache(
      getQrCodeSelectBorderTexture(renderer, true),
      'cellSelectBorderTexture',
    );

    // 生成点圆素材
    NavigationTypeView.forEach(({ code, color }) => {
      Object.keys(CellTypeColor).forEach((type) => {
        PIXI.Texture.addToCache(
          getCellCircleBodyTexture(color.replace('#', '0x'), CellTypeColor[type], renderer),
          `${code}_${type}`,
        );
      });
    });

    // 交汇点
    // PIXI.Texture.addToCache(getIntersectionDirectionTexture(renderer), 'intersectionDirection');

    resolve();
  });
}

// 加载监控额外的自定义Texture
export function loadMonitorExtraTextures(renderer) {
  return new Promise((resolve) => {
    // 背景
    PIXI.Texture.addToCache(getVehicleSelectBorderTexture(renderer), 'vehicleSelectBorderTexture');

    // 生成点圆素材
    NavigationTypeView.forEach(({ code, color }) => {
      Object.keys(CellTypeColor).forEach((type) => {
        PIXI.Texture.addToCache(
          getCellCircleBodyTexture(color.replace('#', '0x'), CellTypeColor[type], renderer),
          `${code}_${type}`,
        );
      });
    });

    // 任务路径
    PIXI.Texture.addToCache(getTaskPathTexture(TaskPathColor.passed, renderer), '_passedTaskPath');
    PIXI.Texture.addToCache(getTaskPathTexture(TaskPathColor.locked, renderer), '_lockedTaskPath');
    PIXI.Texture.addToCache(getTaskPathTexture(TaskPathColor.future, renderer), '_futureTaskPath');

    // 点位成本热度
    PIXI.Texture.addToCache(getCellHeatTexture('0x3366FF', renderer), '_cellHeat1');
    PIXI.Texture.addToCache(getCellHeatTexture('0x5984C3', renderer), '_cellHeat2');
    PIXI.Texture.addToCache(getCellHeatTexture('0x7FA387', renderer), '_cellHeat3');
    PIXI.Texture.addToCache(getCellHeatTexture('0xA5C14B', renderer), '_cellHeat4');
    PIXI.Texture.addToCache(getCellHeatTexture('0xC9D04B', renderer), '_cellHeat5');
    PIXI.Texture.addToCache(getCellHeatTexture('0xEEE04B', renderer), '_cellHeat6');
    PIXI.Texture.addToCache(getCellHeatTexture('0xF4B042', renderer), '_cellHeat7');
    PIXI.Texture.addToCache(getCellHeatTexture('0xF87636', renderer), '_cellHeat8');
    PIXI.Texture.addToCache(getCellHeatTexture('0xF03C2B', renderer), '_cellHeat9');
    PIXI.Texture.addToCache(getCellHeatTexture('0xCF2723', renderer), '_cellHeat10');

    // 交汇点
    // PIXI.Texture.addToCache(getIntersectionDirectionTexture(renderer), 'intersectionDirection');

    resolve();
  });
}

export function loadTexturesForMap() {
  return new Promise((resolve) => {
    PIXI.Loader.shared
      // 字体
      .add('mufont', '/fonts/mufont-hd.xml')

      // ************************* 车辆电池标识材质 ************************* //
      .add('0', '/images/0.png')
      .add('1-10', '/images/1-10.png')
      .add('11-20', '/images/11-20.png')
      .add('21-40', '/images/21-40.png')
      .add('41-60', '/images/41-60.png')
      .add('61-80', '/images/61-80.png')
      .add('81-100', '/images/81-100.png')

      // ************************* 车辆状态标识材质 ************************* //
      .add('vehicle_connected', '/images/vehicle_connected.png')
      .add('vehicle_error', '/images/vehicle_error.png')
      .add('vehicle_manually', '/images/vehicle_manually.png')
      .add('vehicle_offline', '/images/vehicle_offline.png')
      .add('vehicle_on_task', '/images/vehicle_on_task.png')
      .add('vehicle_stand_by', '/images/vehicle_stand_by.png')
      .add('vehicle_waiting', '/images/vehicle_waiting.png')

      // ************************* 潜伏车材质 ************************* //
      .add('latent_vehicle', '/images/latent_vehicle.png')
      .add('latent_vehicle_green', '/images/latent_vehicle_green.png')
      .add('latent_vehicle_grey', '/images/latent_vehicle_grey.png')
      .add('latent_vehicle_purple', '/images/latent_vehicle_purple.png')
      .add('latent_vehicle_red', '/images/latent_vehicle_red.png')
      .add('latent_vehicle_yellow', '/images/latent_vehicle_yellow.png')

      // ************************* 料箱车材质 ************************* //
      .add('tote_vehicle', '/images/tote_vehicle.png')
      .add('tote_vehicle_green', '/images/tote_vehicle_green.png')
      .add('tote_vehicle_grey', '/images/tote_vehicle_grey.png')
      .add('tote_vehicle_purple', '/images/tote_vehicle_purple.png')
      .add('tote_vehicle_red', '/images/tote_vehicle_red.png')
      .add('tote_vehicle_yellow', '/images/tote_vehicle_yellow.png')

      // ************************* 分拣车材质 ************************* //
      .add('sorter_vehicle', '/images/sorter.png')
      .add('sorter_vehicle_green', '/images/sorter_green.png')
      .add('sorter_vehicle_grey', '/images/sorter_grey.png')
      .add('sorter_vehicle_purple', '/images/sorter_purple.png')
      .add('sorter_vehicle_red', '/images/sorter_red.png')
      .add('sorter_vehicle_yellow', '/images/sorter_yellow.png')

      // ************************* 站点材质 ************************* //
      .add('common', '/images/common.png')
      .add('work_station', '/images/work_station.png')
      .add('work_station_1', '/images/work_station_1.png')
      .add('work_station_2', '/images/work_station_2.png')
      .add('work_station_3', '/images/work_station_3.png')
      .add('work_station_4', '/images/work_station_4.png')
      .add('work_station_5', '/images/work_station_5.png')
      .add('work_station_6', '/images/work_station_6.png')
      .add('work_station_7', '/images/work_station_7.png')
      .add('work_station_8', '/images/work_station_8.png')

      // ************************* 箭头材质 ************************* //
      .add('cost_10', '/images/cost_10.png')
      .add('cost_20', '/images/cost_20.png')
      .add('cost_100', '/images/cost_100.png')
      .add('cost_1000', '/images/cost_1000.png')
      .add('cost_10_p', '/images/cost_10_p.png')
      .add('cost_20_p', '/images/cost_20_p.png')
      .add('cost_100_p', '/images/cost_100_p.png')
      .add('cost_1000_p', '/images/cost_1000_p.png')

      // ************************* 错误等级材质 ************************* //
      .add('errorLevel_0', '/images/errorLevel_3.png')
      .add('errorLevel_1', '/images/errorLevel_1.png')
      .add('errorLevel_2', '/images/errorLevel_2.png')
      .add('errorLevel_3', '/images/errorLevel_3.png')

      // ************************* 地面潜伏货架材质 ************************* //
      .add('heat_0', '/images/heat_0.png')

      // ************************* 料箱材质 ************************* //
      .add('pod', '/images/pod.png')
      .add('pod_BOTH', '/images/pod_BOTH.png')
      .add('pod_FETCH', '/images/pod_FETCH.png')
      .add('pod_PUT', '/images/pod_PUT.png')
      .add('pod_grey', '/images/pod_grey.png')

      // ************************* 其他必需材质 ************************* //
      .add('barrier', '/images/barrier.png')
      .add('box', '/images/box.png')
      .add('charger', '/images/charger.png')
      .add('charging_unbind', '/images/charging_unbind.png')
      .add('elevator', '/images/elevator.png')
      .add('maintain', '/images/maintain.png')
      .add('non_stop', '/images/non_stop.png')
      .add('offline', '/images/offline.png')
      .add('store_cell', '/images/store_cell.png')
      .add('sourceLock', '/images/source_lock.png')
      .add('tmp_block_lock', '/images/tmp_block_lock.png')
      .add('tote_bin', '/images/tote_bin.png')
      .add('tote_shelf', '/images/tote_shelf.png')
      .add('traffic_control', '/images/traffic_control.png')
      .add('tiny_rotate', '/images/tiny_rotate.png')
      .add('delivery', '/images/delivery.png')
      .add('basket', '/images/basket.png')
      .add('pin', '/images/pin.png')

      .load(() => {
        resolve();
      });
  });
}
