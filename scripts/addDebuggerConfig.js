const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '../dist');

fs.access(distDir, (err) => {
  if (err && err.code === 'ENOENT') {
    fs.mkdirSync(distDir);
  }
  fs.writeFileSync(
    path.resolve(__dirname, '../dist/config.js'),
    // 'window.extraConfig = { platform: "http://192.168.0.76:8088", ws: "ws://192.168.0.76:8081/ws" }',
    'window.extraConfig = { platform: "http://52.83.193.245:10220", ws: "ws://52.83.193.245:10220/ws" }',
  );
});
