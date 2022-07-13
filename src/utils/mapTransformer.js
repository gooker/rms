import { applyToPoint, compose, flipX, rotateDEG, scale, translate } from 'transformation-matrix';
import { NavigationTypeView } from '@/config/config';

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

// coordinateTransformer的逆运算
export function reverseCoordinateTransformer(coordinate, navigationCellType, transformParams) {
  const { coordinationType, zoom, compensationOffset, compensationAngle } =
    transformParams || getDefaultTransformParams(navigationCellType);

  const matrixParams = [];
  matrixParams.push(flipX());
  matrixParams.push(translate(-compensationOffset.x, -compensationOffset.y));
  matrixParams.push(scale(1 / zoom));
  matrixParams.push(rotateDEG(compensationAngle));
  if (coordinationType === 'L') {
    matrixParams.push(flipX());
  }
  const matrix = compose(...matrixParams);
  const { x, y } = applyToPoint(matrix, coordinate);
  return { ...coordinate, x, y, nx: x, ny: y };
}
