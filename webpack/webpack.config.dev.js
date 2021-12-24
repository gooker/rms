process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const paths = require('./paths');
const BaseConfig = require('./webpack.config.base');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

console.log('Starting the development server...\n');

module.exports = merge(BaseConfig.getWebPackBaseConfig('development'), {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  target: 'web',

  entry: paths.appIndexJs,

  output: {
    path: paths.appBuild,
    filename: 'static/js/[name].bundle.js', // 这里必须是[name],否则会报文件名冲突错误
    chunkFilename: 'static/js/[name].chunk.js',
    publicPath: '/',
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
    }),
    new ReactRefreshWebpackPlugin(),
  ],

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
