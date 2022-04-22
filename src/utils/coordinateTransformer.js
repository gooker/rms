import { scale, rotateDEG, translate, compose, applyToPoint, flipX } from 'transformation-matrix';

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
 * 5. 坐标转换(转换为左手坐标系坐标)
 * 6. 显示时旋转(最终生成的点位坐标为PIXI坐标)
 * @tip 页面操作输入的补偿角度和旋转角度，默认顺时针为正，此时需要取反
 * @3rd-util https://github.com/chrvadala/transformation-matrix#readme
 * @param coordinate {{x:Number, y:Number}}
 * @param transformParams {{type:String, rotation:Number, zoom:Number, offset:{x:number, y:number}, pixiRotation:Number}}
 */
export function coordinateTransformer(coordinate, transformParams) {
  const { coordType, zoom, compensationOffset, compensationAngle, pixiAngle } = transformParams;
  let cell = { ...coordinate };
  const matrixParams = [];
  let xLabel, yLabel;
  if (coordType === 'L') {
    matrixParams.push(flipX());
    const matrix = compose(...matrixParams);
    const { x, y } = applyToPoint(matrix, coordinate);
    cell = { ...cell, x, y };
  } else {
    xLabel = cell.x;
    yLabel = cell.y;
  }
  matrixParams.push(rotateDEG(-compensationAngle));
  matrixParams.push(scale(zoom));
  matrixParams.push(translate(compensationOffset.x, compensationOffset.y));
  matrixParams.push(flipX());
  matrixParams.push(rotateDEG(-pixiAngle));
  const matrix = compose(...matrixParams);
  const matrixResult = applyToPoint(matrix, cell);
  const x = Math.round(matrixResult.x);
  const y = Math.round(matrixResult.y);
  return { ...cell, x, y, nx: x, ny: y, xLabel, yLabel };
}

// coordinateTransformer的逆运算
export function reverseCoordinateTransformer(coordinate, params) {
  // 左右手，
}
