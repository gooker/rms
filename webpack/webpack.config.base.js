const os = require('os');
const paths = require('./paths');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const postcssNormalize = require('postcss-normalize');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;

function getWebPackBaseConfig(webpackEnv) {
  const isEnvDevelopment = webpackEnv === 'development';
  const isEnvProduction = webpackEnv === 'production';

  const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
      isEnvDevelopment && require.resolve('style-loader'),
      isEnvProduction && MiniCssExtractPlugin.loader,
      {
        loader: require.resolve('css-loader'),
        options: cssOptions,
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          ident: 'postcss',
          plugins: () => [
            require('postcss-flexbugs-fixes'),
            require('postcss-preset-env')({
              autoprefixer: { flexbox: 'no-2009' },
              stage: 3,
            }),
            postcssNormalize(),
          ],
          sourceMap: true,
        },
      },
    ].filter(Boolean);

    // 这里只有 less-loader
    if (preProcessor) {
      loaders.push({
        loader: preProcessor,
        options: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
      });
    }
    return loaders;
  };

  return {
    resolve: {
      modules: ['node_modules', paths.appNodeModules],
      extensions: paths.moduleFileExtensions.map((ext) => `.${ext}`),
      alias: {
        '@': paths.appSrc,
      },
    },

    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          include: paths.appSrc,
          exclude: paths.appNodeModules,
          use: 'happypack/loader?id=js',
        },

        // css
        {
          test: cssRegex,
          exclude: cssModuleRegex,
          use: getStyleLoaders({
            importLoaders: 1,
            sourceMap: true,
          }),
          sideEffects: true,
        },
        {
          test: cssModuleRegex,
          use: getStyleLoaders({
            importLoaders: 1,
            sourceMap: true,
            modules: {
              localIdentName: '[local]-[hash:5]',
            },
          }),
        },

        // less
        {
          test: lessRegex,
          exclude: lessModuleRegex,
          use: getStyleLoaders(
            {
              importLoaders: 3,
              sourceMap: isEnvProduction && true,
            },
            'less-loader',
          ),
          sideEffects: true,
        },
        {
          test: lessModuleRegex,
          use: getStyleLoaders(
            {
              importLoaders: 3,
              sourceMap: isEnvProduction && true,
              modules: {
                /**
                 * [path] 表示样式表相对于项目根目录所在路径
                 * [name] 表示样式表文件名称
                 * [local] 表示样式的类名定义名称
                 * [hash:length] 表示32位的hash值
                 */
                localIdentName: '[local]-[hash:5]',
              },
            },
            'less-loader',
          ),
        },

        {
          test: /\.(woff|eot|ttf|svg)$/,
          loader: 'url-loader',
          options: {
            limit: 10,
            name: 'static/fonts/[name].[hash:8].[ext]',
          },
        },

        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },
      ],
    },

    plugins: [
      new WebpackBar(),
      new MomentLocalesPlugin(),
      new CaseSensitivePathsPlugin(),
      new webpack.IgnorePlugin({ resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/ }),
      new HappyPack({
        id: 'js',
        loaders: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [isEnvDevelopment && require.resolve('react-refresh/babel')].filter(Boolean),
            },
          },
        ],
        //共享进程池threadPool: HappyThreadPool 代表共享进程池，即多个 HappyPack 实例都使用同一个共享进程池中的子进程去处理任务，以防止资源占用过多。
        threadPool: happyThreadPool,
        //允许 HappyPack 输出日志
        verbose: true,
      }),

      new MiniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
      }),

      // 这里有个坑记录下: https://blog.csdn.net/vv_bug/article/details/113845376
      new HtmlWebpackPlugin(
        Object.assign(
          {},
          {
            inject: true,
            template: paths.appHtml,
            favicon: paths.appFavicon,
          },
          isEnvProduction
            ? {
                minify: {
                  removeComments: true,
                  collapseWhitespace: true,
                  removeRedundantAttributes: true,
                  useShortDoctype: true,
                  removeEmptyAttributes: true,
                  removeStyleLinkTypeAttributes: true,
                  keepClosingSlash: true,
                  minifyJS: true,
                  minifyCSS: true,
                  minifyURLs: true,
                },
              }
            : undefined,
        ),
      ),
    ],
  };
}
module.exports.getWebPackBaseConfig = getWebPackBaseConfig;
