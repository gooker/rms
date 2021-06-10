// 最基础的地图组件，不包括DOM，只负责部分渲染逻辑
import React from 'react';

class BaseMap extends React.Component {
  // 点位
  renderCells = (cells, interact) => {
    // 只负责渲染点位
    // interact: 标记该点位是否可以点击
  };
  updateCells = ({ type, cells, data }) => {
    // type: delete, visible, move(移动点位), code(修改地址码), coordVisible(地址码可见)
    // cells
    // data: 操作附加数据
  };

  // 点位类型
  updateCellType = (cells, type, texture) => {
    // cells
    // type
    // texture: 图标材质, 如果不存在就默认删除该类型
  };

  // 线条
  renderRoutes = (routes) => {
    // 只负责优先级线条
  };
  updateRoutes = ({ type, data }) => {
    // type: delete, visible, distanceVisible(距离可见)
    // data: 类型操作附加数据, 包含: id, cost, direction
  };

  // 线条类型
  updateRouteType = (routes, type, texture) => {
    // routes
    // type
    // texture: 图标材质, 如果不存在就默认删除该类型
  };

  // 工作站
  addWorkstation = (workStation) => {};
  removeWorkstation = (workStation) => {};
  renderWorkstation = (workStations) => {};

  // 充电桩
  addCharger = (charger) => {};
  removeCharger = (charger) => {};
  renderCharger = (chargers) => {};

  // 电梯
  addElevator = (elevator) => {};
  removeElevator = (elevator) => {};
  renderElevator = (elevators) => {};

  // 通道
  addTunnel = (tunnel, interact) => {
    // interact: 标记该通道门禁口点位是否可以点击
  };
  addTunnelLineIcon = (entrance, exit) => {};
  removeTunnel = (tunnel, interact) => {};
  renderTunnel = (tunnels, interact) => {};

  // 交汇点
  addIntersection = (intersection) => {};
  removeIntersection = (intersection) => {};
  renderIntersection = (intersections) => {};

  // 抛物点
  addDumpFunctio = (dump) => {};
  removeDumpFunction = (dump) => {};
  renderDumpFunction = (dumps) => {};

  // 滚筒站
  addRollerFunction = (roller) => {};
  removeRollerFunction = (roller) => {};
  renderRollerFunction = (rollers) => {};

  // 通用功能点
  addCommonFunction = (common) => {};
  removeCommonFunction = (common) => {};
  renderCommonFunction = (commons) => {};
}

export default BaseMap;
