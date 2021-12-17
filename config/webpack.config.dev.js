process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const configFactory = require('./webpack.config');
const chalk = require('react-dev-utils/chalk');

console.log(chalk.cyan('Starting the development server...\n'));

module.exports = {
  ...configFactory('development'),

  devServer: {
    port: 3333,
    open: true,
    compress: true,

    // 防止刷新页面报: Cannot GET '[route]' 问题
    historyApiFallback: true,
  },
};
