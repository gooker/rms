const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '../dist');

fs.access(distDir, (err) => {
  if (err && err.code === 'ENOENT') {
    fs.mkdirSync(distDir);
  }
  fs.writeFileSync(
    path.resolve(__dirname, '../dist/config.js'),
    'window.extraConfig = { platform: "http://192.168.0.80:8088", ws: "ws://192.168.0.80:8081/ws" }',
  );
});
