require('babel-register')({
  presets: ['es2015'],
  plugins: ['transform-object-rest-spread'],
});
module.exports = function(path) {
  return require(path);
};
