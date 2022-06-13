const { merge } = require('webpack-merge');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const paths = require('./paths');
const BaseConfig = require('./webpack.base.config');

console.log('Starting RMS development server...\n');

module.exports = merge(BaseConfig.getWebPackBaseConfig('development'), {
  mode: 'development',
  devtool: 'cheap-module-source-map',

  entry: paths.appIndexJs,

  output: {
    path: paths.appBuild,
    filename: 'js/[name].bundle.js', // 这里必须是[name],否则会报文件名冲突错误
    chunkFilename: 'js/[name].chunk.js',
    publicPath: '/',
  },

  plugins: [new ReactRefreshWebpackPlugin({ overlay: false })],

  /**
   * webpack-dev-server v4.0.0+ 要求 node >= v12.13.0 和 webpack >= v4.37.0
   * 但是推荐使用 webpack >= v5.0.0 和 webpack-cli >= v4.7.0
   * # https://webpack.docschina.org/configuration/dev-server/
   */
  devServer: {
    port: 3333,
    // 防止刷新页面报: Cannot GET '[route]' 问题
    historyApiFallback: true,
    // 可访问开发服务器的地址
    allowedHosts: 'all',
  },
});
