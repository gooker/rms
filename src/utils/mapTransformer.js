import { applyToPoint, compose, flipX, rotateDEG, scale, translate } from 'transformation-matrix';
import { CoordinateType, NavigationTypeView } from '@/config/config';

/**
 * 右手坐标系
 * rotate || rotateDEG: 数学标准坐标系逆时针旋转
 */

/**
 * 将指定的点位(导航点位或者物理点位)根据参数转换成左手坐标系的具体坐标(只用于PIXI展示)
 * 1. 坐标转换(统一转换为右手坐标系(因为transformation-matrix是基于右手坐标系), 此时生成的坐标是最终在点位上显示的坐标)
 * 2. 角度转换
 * 2. 缩放转换
 * 4. 偏移转换
 * @tip 页面操作输入的补偿角度和旋转角度，默认顺时针为正，此时需要取反
 * @3rd-util https://github.com/chrvadala/transformation-matrix#readme
 */
// 获取转换参数默认值(navigationCellType就是brand)
function getDefaultTransformParams(navigationType) {
  return {
    coordinationType: NavigationTypeView.filter((item) => item.code === navigationType)[0]
      .coordinateSystemType,
    zoom: 1,
    compensationOffset: { x: 0, y: 0 },
    compensationAngle: 0,
  };
}

export function transformXYByParams(coordinate, navigationCellType, inputTransformParams) {
  const transformParams = inputTransformParams || getDefaultTransformParams(navigationCellType);
  const { coordinationType, zoom, compensationOffset, compensationAngle } = transformParams;

  const matrixParams = [];
  if (coordinationType === 'L') {
    matrixParams.push(flipX());
    matrixParams.push(rotateDEG(compensationAngle));
    matrixParams.push(scale(zoom));
    matrixParams.push(translate(compensationOffset.x, compensationOffset.y));
    matrixParams.push(flipX());
  } else {
    matrixParams.push(rotateDEG(-compensationAngle));
    matrixParams.push(scale(zoom));
    matrixParams.push(translate(compensationOffset.x, compensationOffset.y));
  }

  const matrix = compose(...matrixParams);
  const matrixResult = applyToPoint(matrix, coordinate);
  const x = Math.round(matrixResult.x);
  const y = Math.round(matrixResult.y);
  return { x, y };
}

export function reverseTransformXYByParams(coordinate, navigationCellType, inputTransformParams) {
  const transformParams = inputTransformParams || getDefaultTransformParams(navigationCellType);
  const { coordinationType, zoom, compensationOffset, compensationAngle } = transformParams;

  const matrixParams = [];
  if (coordinationType === 'L') {
    matrixParams.push(flipX());
    matrixParams.push(translate(compensationOffset.x, compensationOffset.y));
    matrixParams.push(scale(zoom));
    matrixParams.push(rotateDEG(compensationAngle));
    matrixParams.push(flipX());
  } else {
    matrixParams.push(translate(compensationOffset.x, compensationOffset.y));
    matrixParams.push(scale(zoom));
    matrixParams.push(rotateDEG(-compensationAngle));
  }

  const matrix = compose(...matrixParams);
  const matrixResult = applyToPoint(matrix, coordinate);
  const x = Math.round(matrixResult.x);
  const y = Math.round(matrixResult.y);
  return { x, y };
}

// 根据当前点位坐标类型和导航点类型获取转换后的坐标
export function getCoordinateBy2Types(source, navigationType, cellCoordinateType) {
  let viewX, viewY;
  if (cellCoordinateType === CoordinateType.NAVI) {
    const result = transformXYByParams(source, navigationType);
    viewX = result.x;
    viewY = result.y;
  } else {
    viewX = source.x;
    viewY = -source.y;
  }
  return [viewX, viewY];
}

/*********************** 通用转换方法 ********************/
// 将物理角度转换为PIXI角度
export function convertLandAngle2Pixi(landAngle) {
  let pixiAngle;
  if (landAngle >= 360) {
    landAngle = landAngle - 360;
  }
  if (landAngle >= 0 && landAngle <= 90) {
    pixiAngle = 90 - landAngle;
  } else {
    pixiAngle = 450 - landAngle;
  }
  return pixiAngle;
}

/*********************** 牧星转换方法 ********************/
// 物理角度转换成导航角度
// TIPS:因为牧星车的的坐标系与PIXI坐标系相同，所以这里直接引用convertLandAngle2Pixi方法
export function mushinyConvertLandAngle2Navi(landAngle) {
  return convertLandAngle2Pixi(landAngle);
}

// 牧星导航角度转换成物理角度
function correctAngle(angle) {
  let res = angle;
  if (res < 0) {
    res = res + 360;
  }
  if (res >= 360) {
    res = res - 360;
  }
  if (res < 0 || res >= 360) {
    return correctAngle(res);
  }
  return res;
}

export function mushinyConvertNaviAngle2Land(naviAngle) {
  return correctAngle(90 - naviAngle);
}
