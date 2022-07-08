export const VehicleUpgradeState = {
  downloading: 'firmdware.inDownloading', // 下载中
  downloadFail: 'firmdware.downloadFail', // 下载失败 1
  ready: 'firmdware.download.success', // 下载成功 准备升级
  upgrading: 'firmdware.inUpgradeing', //升级中
  upgradeSuccess: 'firmdware.upgrade.success', // 升级成功 1
  upgradeFail: 'firmdware.upgradeFail', //升级失败 1
};

//0：成功，1：升级中或下载中或上传中，2：失败
export function transformFireProgress(state) {
  switch (state) {
    case 'downloading':
      return ['1', 'DOWNLOAD'];
    case 'downloadFail':
      return ['2', 'DOWNLOAD'];
    case 'ready':
      return ['0', 'DOWNLOAD'];
    case 'upgrading':
      return ['1', 'UPGRADE'];
    case 'upgradeFail':
      return ['2', 'UPGRADE'];
    case 'upgradeSuccess':
      return ['0', 'UPGRADE'];
    default:
      return ['1', 'DOWNLOAD'];
  }
}
