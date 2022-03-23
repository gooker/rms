const paths = require('./paths');
const BaseConfig = require('./webpack.base.config');
const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

console.log('Creating an optimized RMS production build...');

module.exports = merge(BaseConfig.getWebPackBaseConfig('production'), {
  mode: 'production',
  devtool: 'source-map',

  entry: paths.appIndexJs,

  output: {
    path: paths.appBuild,
    filename: 'js/[name].[contenthash:8].js',
    chunkFilename: 'js/[name].[contenthash:8].chunk.js',
    publicPath: '/',
  },

  optimization: {
    // 告知 webpack 使用 TerserPlugin 或其它在 optimization.minimizer定义的插件压缩 bundle
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
        // 多进程/多实例: 并行压缩
        parallel: true,
      }),

      // This is only used in production mode
      new CssMinimizerPlugin(),
    ],

    runtimeChunk: {
      name: (entrypoint) => `runtime-${entrypoint.name}`,
    },
  },

  plugins: [
    new CompressionPlugin({
      minRatio: 0.8,
      threshold: 10240,
      algorithm: 'gzip',
      test: new RegExp('\\.(js|less|css)$'),
    }),

    /**
     * PIXI Texture图片文件和字体文件不是经过import或者require方式访问
     * 所以并不会被Webpack所处理，所以这里使用这个插件将这些文件拷贝到指定目录
     * TODO: 部分图片已经存在于images，所以需要额外判断是否要拷贝，比如：welcome
     */
    new CopyWebpackPlugin({
      patterns: [
        {
          from: `${paths.appPublic}/images`,
          to: 'images',
        },
        {
          from: `${paths.appPublic}/fonts`,
          filter: (resourcePath) => !resourcePath.endsWith('.ttf'),
          to: 'fonts',
        },
      ],
    }),

    process.env.ANALYZE === '1' && new BundleAnalyzerPlugin(),
  ].filter(Boolean),
});
