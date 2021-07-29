require('@babel/register')({
  extends: './.babelrc',
  ignore: [],
});
process.env.NODE_ENV = 'development';
process.env.BABEL_ENV = 'development';
module.exports = function (path) {
  return require(path);
};
