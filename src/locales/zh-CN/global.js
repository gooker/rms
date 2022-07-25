export default {
  'app.global.initFailed': '应用初始化失败',
  'app.global.fetchGlobalDataFailed': '获取全局应用数据失败',
  'app.global.wsInvalid': 'Socket URL配置错误',
  'app.global.chrome.suggested': '使用谷歌浏览器可获得更好的使用体验',
  'app.global.browser.clipboardNotSupport':
    '当前浏览器不支持 Clipboard API; 请更换Chrome浏览器再次尝试',
  'app.section.not.exist': '当前用户没有已激活的Section',
  'app.global.requestCancelled': '请求已取消',

  'app.login.login': '登录',
  'app.login.cancelLogin': '取消登录',
  'app.login.username.required': '请输入用户名',
  'app.login.password.required': '请输入密码',
  'app.login.password.environment': '请选择登录环境',

  'app.mushiny.title': '牧星智能调度系统',
  'app.mushiny.purpose.smart': '灵动',
  'app.mushiny.purpose.safe': '安全',
  'app.mushiny.purpose.stable': '稳定',
  'app.mushiny.purpose.efficient': '高效',
  'app.mushiny.purpose.power': '为仓储物流赋能',

  'menu.account.logout': '退出登录',
  'menu.account.roleList': '权限列表',
  'menu.account.apiList': '页面配置信息',

  // request
  'app.request.error': '请求错误',
  'app.request.failed': '请求失败, 网络连接可能出现异常',
  'app.request.concurrent.failed': '网络请求中存在一个或多个异常',
  'app.request.addressError': '请求地址错误',
  'app.request.headers': '请求头',
  'app.require.namespace': '{namespace} 相关接口未配置',

  'app.request.400': '请求参数错误',
  'app.request.401': '用户没有权限（令牌、用户名、密码错误）',
  'app.request.403': '用户得到授权，但是访问是被禁止的',
  'app.request.404': '发出的请求针对的是不存在的记录，服务器没有进行操作',
  'app.request.406': '请求的格式不可得',
  'app.request.410': '请求的资源被永久删除，且不会再得到的',
  'app.request.422': '当创建一个对象时，发生一个验证错误',
  'app.request.500': '服务器发生错误，请检查服务器',
  'app.request.502': '网关错误',
  'app.request.503': '服务不可用，服务器暂时过载或维护',
  'app.request.504': '网关超时',

  // 页面配置信息弹窗
  'app.configInfo.header.moduleName': '模块名称',
  'app.configInfo.header.moduleURL': '模块地址',
  'app.configInfo.header.moduleVersion': '模块版本',
  'app.configInfo.header.adapter': '适配器',
  'app.configInfo.header.adapterName': '适配器名称',
  'app.configInfo.header.adapterURL': '适配器地址',

  'app.header.option.switchEnvSuccess': '环境切换成功',
  'app.header.option.switchSectionSuccess': 'Section切换成功',
  'app.header.option.switchLanguageSuccess': '语言切换成功',
  'app.header.refreshGlobal': '刷新全局资源',
  'app.header.timezoneDetail': '时区详情',

  'app.selectLang.editMode': '编辑模式',

  // Socket
  'app.socket.reconnecting': 'Socket重连中...',
  'app.socket.reConnected': 'Socket连接成功',
  'app.socket.accountNoAuth': 'Socket当前使用的账号没有权限',
  'app.socket.connectFailed': 'Socket连接出错, 连接断开',

  // 多标签页
  'app.tabs.closeLeft': '关闭左侧所有',
  'app.tabs.closeRight': '关闭右侧所有',
  'app.tabs.closeOthers': '关闭其它',

  // 高可用
  'app.navBar.haMode': '高可用模式',
  'app.navBar.haMode.get': '知道了',
  'app.navBar.haMode.serverList': '服务列表信息',
  'app.navBar.haMode.serverName': '服务名称',
  'app.navBar.haMode.serverDomain': '服务域名',
  'app.navBar.haMode.switchHistory': '服务切换历史',
  'app.navBar.haMode.heatBeatTimeout': '心跳延时',
  'app.navBar.haMode.heatBeatTimeout.tip': '标准 <= 10s',
  'app.navBar.haMode.main': '主',
  'app.navBar.haMode.spare': '备',
};
