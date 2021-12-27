const paths = require('./paths');
const BaseConfig = require('./webpack.config.base');
const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

console.log('Creating an optimized RMS production build...');

module.exports = merge(BaseConfig.getWebPackBaseConfig('production'), {
  mode: 'production',
  devtool: 'source-map',

  entry: paths.appIndexJs,

  output: {
    path: paths.appBuild,
    filename: 'static/js/[name].[contenthash:8].js',
    chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
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
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          parser: safePostCssParser,
          map: { inline: false, annotation: true },
        },
        cssProcessorPluginOptions: {
          preset: ['default', { minifyFontValues: { removeQuotes: false } }],
        },
      }),
    ],

    runtimeChunk: {
      name: (entrypoint) => `runtime-${entrypoint.name}`,
    },
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
    }),

    new CompressionPlugin({
      minRatio: 0.8,
      threshold: 10240,
      algorithm: 'gzip',
      test: new RegExp('\\.(js|less|css)$'),
    }),

    process.env.ANALYZE === '1' && new BundleAnalyzerPlugin(),
  ].filter(Boolean),
});
