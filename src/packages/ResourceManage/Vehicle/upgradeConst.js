export const VehicleUpgradeState = {
  downloading: 'firmdware.inDownloading', // 下载中 上传固件到小车
  downloadFail: 'firmdware.downloadFail', // 失败 1
  ready: 'firmdware.download.restartEffective', // 成功  显示 重启生效
};

//0：成功，1：升级中或下载中或上传中，2：失败
export function transformFireProgress(state) {
  switch (state) {
    case 'downloading':
      return ['1', 'UPLOAD'];
    case 'downloadFail':
      return ['2', 'UPLOAD'];
    case 'ready':
      return ['0', 'UPLOAD'];
    case 'upgrading':
      return ['1', 'UPGRADE'];
    case 'upgradeFail':
      return ['2', 'UPGRADE'];
    case 'upgradeSuccess':
      return ['0', 'UPGRADE'];
    default:
      return ['1', 'UPLOAD'];
  }
}
