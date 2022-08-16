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

### 菜单 hook

> 渲染角色权限树时候用到

> i18n 可显示的语种; name 平台主体名称

### zoneMarker 和 labels 数据结构

```json
{
  "zoneMarker": [
    {
      "code": "string",
      "type": "string",
      "x": 0,
      "y": 0,
      "width": 0,
      "height": 0,
      "radius": 0,
      "color": "string",
      "data": "string"
    }
  ],
  "labels": [
    {
      "code": "string",
      "x": 0,
      "y": 0,
      "color": "string",
      "text": "string",
      "width": 0,
      "height": 0
    }
  ]
}
```

### 如何新增场景

1. src/config/config 新增 AppCode
2. src/config/router 新增路由数据
3. 新增 AppCode 为名称的 png 图片
4. PortalEntry 文件新增图标配置

### 地图点位转换逻辑

1. 点位 xy 属性是已经经历过转置的坐标，包括：坐标、角度、缩放等等，重要的是该坐标是基于右手坐标，这是为了统一业务处理
2. 点位 nx 和 ny 属性为点位原始坐标，不经过任何转换。但是地图渲染时候需要转置，包括：坐标、角度、缩放等等，重要的是最后一步需要转换成左手坐标，这是为了统一展示

### id 与 code

1. id是用来标识对象的唯一值
2. code只是对对象进行编码
