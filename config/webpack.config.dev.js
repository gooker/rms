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
    hot: true,
    compress: true,
  },
};
