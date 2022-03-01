const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolvePath = (relativePath) => path.resolve(appDirectory, relativePath);

const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
];

const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find((extension) =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`)),
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

module.exports = {
  appPath: resolvePath('.'),
  appBuild: resolvePath('dist'),
  appPublic: resolvePath('public'),
  appHtml: resolvePath('public/index.html'),
  appFavicon: resolvePath('public/favicon.ico'),
  appPackageJson: resolvePath('package.json'),
  appSrc: resolvePath('src'),
  appNodeModules: resolvePath('node_modules'),
  appJsConfig: resolvePath('jsconfig.json'),
  appIndexJs: resolveModule(resolvePath, 'src/index'),
};
module.exports.resolvePath = resolvePath;
module.exports.moduleFileExtensions = moduleFileExtensions;
