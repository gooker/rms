### 目录说明

- public： 存放公共资源
- src/components: 存放共用组件和大部分页面的封装组件
- src/config: 存放项目配置文件，包括路由配置
- src/layout: 存放布局页面文件
- src/locales: 存放国际化数据文件
- src/packages: 存放实际项目文件
- src/services: 存放接口数据文件
- src/utils: 存放工具类函数文件
- src/workers: Web Worker 函数集
- src/common.module.less: 项目通用样式文件
- src/global.less: 项目顶层样式文件
- src/AgvAdapter.js: 项目入口文件

### config.js 与 consts.js

> config.js 用于管理页面业务处理时配置信息，比如: namespace、pixi 等等 consts.js 用于管理页面渲染时常量，比如：下拉框数据、颜色等等

### 需要移除的模块

1. size-sensor
2. bizCharts

### 菜单hook
> 渲染角色权限树时候用到

### extraConfig 设计

```json
{
  "sso": "http://...",
  "coordinator": "http://...",
  "i18n": ["zh-CN", "en-US"],
  "name": "Mushiny"
}
```

> i18n 可显示的语种; name 平台主体名称

### zoneMarker 和 labels 数据结构

```json
{
  "zoneMarker": [
    {
      "code":"string",
      "type": "string",
      "x": 0,
      "y": 0,
      "width": 0,
      "height": 0,
      "radius": 0,
      "color":"string",
      "data": "string"
    }
  ],
  "labels": [
    {
      "code":"string",
      "x": 0,
      "y": 0,
      "color":"string",
      "text": "string",
      "width": 0,
      "height": 0
    }
  ]
}
```

### 如何新增场景
1. src/config/config 新增AppCode
2. src/config/router 新增路由数据
3. 新增AppCode为名称的png图片
4. PortalEntry文件新增图标配置
