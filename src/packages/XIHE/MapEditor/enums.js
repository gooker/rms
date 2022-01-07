import React from 'react';
import { formatMessage } from '@/utils/utils';
import { IconFont } from '@/components/IconFont';
import {
  SettingOutlined,
  BankOutlined,
  StopOutlined,
  NodeExpandOutlined,
  EyeOutlined,
  DropboxOutlined,
} from '@ant-design/icons';

export const Category = {
  Cell: 'CELL',
  Cost: 'COST',
  CellType: 'CELL_TYPE',
  Elevator: 'ELEVATOR',
  WorkStation: 'WORK_STATION',
  Station: 'COMMON_STATION',
  Charger: 'CHARGER',
  View: 'VIEW',
};

export const EditorLeftTools = [
  {
    label: formatMessage({ id: 'mapEditor.tools.choose' }),
    value: 'choose',
    icon: <IconFont type={'icon-click'} />,
  },
  {
    label: formatMessage({ id: 'mapEditor.tools.drag' }),
    value: 'drag',
    icon: <IconFont type={'icon-drag'} />,
  },
  {
    label: formatMessage({ id: 'mapEditor.tools.insertPicture' }),
    value: 'image',
    icon: <IconFont type={'icon-image'} />,
  },
  {
    label: formatMessage({ id: 'mapEditor.tools.insertFont' }),
    value: 'font',
    icon: <IconFont type={'icon-font'} />,
  },
  {
    label: formatMessage({ id: 'mapEditor.tools.insertRect' }),
    value: 'rectangle',
    icon: <IconFont type={'icon-rectangle'} />,
  },
  {
    label: formatMessage({ id: 'mapEditor.tools.insertCircle' }),
    value: 'circle',
    icon: <IconFont type={'icon-circle'} />,
  },
  {
    label: formatMessage({ id: 'mapEditor.tools.useTemplate' }),
    value: 'template',
    icon: <IconFont type={'icon-template'} />,
  },
];

export const EditorRightTools = [
  {
    label: formatMessage({ id: 'mapEditor.tools.props' }),
    value: 'props',
    icon: <SettingOutlined />,
  },
  {
    label: formatMessage({ id: 'app.map.cell' }),
    value: Category.Cell,
    icon: <IconFont type={'icon-cell'} />,
  },
  {
    label: formatMessage({ id: 'app.map.routeMap' }),
    value: Category.Cost,
    icon: <IconFont type={'icon-routeMap'} />,
  },
  {
    label: formatMessage({ id: 'app.map.feature' }),
    value: Category.CellType,
    icon: <IconFont type={'icon-feature'} />,
  },
  {
    label: formatMessage({ id: 'app.map.workstation' }),
    value: Category.WorkStation,
    icon: <IconFont type={'icon-station'} />,
  },
  {
    label: formatMessage({ id: 'app.map.station' }),
    value: Category.Station,
    icon: <BankOutlined />,
  },
  {
    label: formatMessage({ id: 'app.map.elevator' }),
    value: 'elevator',
    icon: <IconFont type={'icon-elevator'} />,
  },
  {
    label: formatMessage({ id: 'app.map.charger' }),
    value: 'charger',
    icon: <IconFont type={'icon-charger2'} />,
  },
  {
    label: formatMessage({ id: 'app.map.emergencyStop' }),
    value: 'emergencyStop',
    icon: <StopOutlined />,
  },
  {
    label: formatMessage({ id: 'app.map.restArea' }),
    value: 'restArea',
    icon: <IconFont type={'icon-rest2'} />,
  },
  {
    label: formatMessage({ id: 'app.map.aisle' }),
    value: 'aisle',
    icon: <NodeExpandOutlined />,
  },
  {
    label: formatMessage({ id: 'app.map.delivery' }),
    value: 'delivery',
    icon: <DropboxOutlined />,
  },
  {
    label: formatMessage({ id: 'app.map.intersection' }),
    value: 'intersection',
    icon: <IconFont type={'icon-intersection'} />,
  },
  {
    label: formatMessage({ id: 'app.map.programing' }),
    value: 'programing',
    icon: <IconFont type={'icon-programing'} />,
  },
  {
    label: formatMessage({ id: 'mapEditor.tools.createTemplate' }),
    value: 'template',
    icon: <IconFont type={'icon-template'} />,
  },
  {
    label: formatMessage({ id: 'app.map.view' }),
    value: Category.View,
    icon: <EyeOutlined />,
  },
  {
    label: formatMessage({ id: 'mapEditor.tools.history' }),
    value: 'history',
    icon: <IconFont type={'icon-history'} />,
  },
];

export const CellTypeSetting = [
  // 不可走点
  {
    type: 'blockCellIds',
    picture: 'block_cell.png',
    i18n: 'editor.cellType.forbid',
    scope: 'routeMap',
    texture: 'block_cell',
  },
  // 存储点
  {
    type: 'storeCellIds',
    picture: 'store_cell.png',
    i18n: 'editor.cellType.storage',
    scope: 'logic',
    texture: 'store_cell',
  },
  // 跟车点
  {
    type: 'followCellIds',
    picture: 'follow_cell.png',
    i18n: 'editor.cellType.follow',
    scope: 'routeMap',
    texture: 'follow_cell',
  },
  // 等待点
  {
    type: 'waitCellIds',
    picture: 'wait_cell.png',
    i18n: 'editor.cellType.waiting',
    scope: 'routeMap',
    texture: 'wait_cell',
  },
  // 接任务点
  {
    type: 'taskCellIds',
    picture: 'get_task.png',
    i18n: 'editor.cellType.getTask',
    scope: 'logic',
    texture: 'get_task',
  },
  // 安全区
  {
    type: 'safeAreaCellIds',
    picture: 'safe_spot.png',
    i18n: 'editor.cellType.safe',
    scope: 'logic',
    texture: 'safe_spot',
  },
  // 独立旋转点
  {
    type: 'rotateCellIds',
    picture: 'round.png',
    i18n: 'editor.cellType.rotation',
    scope: 'logic',
    texture: 'round',
  },
];

export const CostOptions = [
  {
    value: '10',
    label: 'app.cost.green',
    key: '10',
  },
  {
    value: '20',
    label: 'app.cost.blue',
    key: '20',
  },
  {
    value: '100',
    label: 'app.cost.yellow',
    key: '100',
  },
  {
    value: '1000',
    label: 'app.cost.red',
    key: '1000',
  },
];

export const DirectionOption = [
  { value: '0', label: 'app.direction.top' },
  { value: '1', label: 'app.direction.right' },
  { value: '2', label: 'app.direction.bottom' },
  { value: '3', label: 'app.direction.left' },
];
