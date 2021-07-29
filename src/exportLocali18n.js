const fs = require('fs');
const path = require('path');
const babelTool = require('./babelTransForm');

const output = {};
const outputTypes = ['en-US', 'zh-CN', 'ko-KR'];
outputTypes.forEach(language => {
  const filePath = path.resolve(__dirname, `../src/locales/${language}.js`);
  const content = babelTool(filePath).default;
  output[language] = content;
});

const distDir = path.resolve(__dirname, '../dist');
fs.access(distDir, err => {
  if (err && err.code === 'ENOENT') {
    fs.mkdirSync(distDir);
  }
  fs.writeFileSync(
    path.resolve(__dirname, '../dist/latentlifting-gui-i18n.json'),
    JSON.stringify(output, null, '\t')
  );
});
