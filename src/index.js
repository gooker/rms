import React from 'react';
import ReactDOM from 'react-dom';
import { isPlainObject } from 'lodash';
import { LINE_SCALE_MODE, settings } from '@pixi/graphics-smooth';
import createRcsDva from '@/utils/RmsDva';
import App from '@/pages/App';
import models from '@/models';
import './global.less';
import { message } from 'antd';

// https://github.com/pixijs/graphics-smooth
settings.LINE_SCALE_MODE = LINE_SCALE_MODE.NONE;

// 判定当前是否是产品环境
window.$$isProduction = isPlainObject(window.extraConfig);

// 1. 初始化Dva对象(包含dva层统一错误处理)
const dvaOption = {};
if (window.$$isProduction) {
  dvaOption.onError = function(e, dispatch) {
    console.log('Dva Error occurred:', e.message);
  };
} else {
  dvaOption.onError = function(e, dispatch) {
    message.error('Dva Error occurred');
    console.log(e.message);
  };
}
const DvaProvider = createRcsDva(dvaOption, models);

ReactDOM.render(
  <DvaProvider>
    <App />
  </DvaProvider>,
  document.getElementById('root'),
);
