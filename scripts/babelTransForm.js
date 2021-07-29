require('babel-register')({
  presets: ['@babel/preset-es2015'],
  plugins: ['transform-object-rest-spread'],
});
module.exports = function(path) {
  return require(path);
};
