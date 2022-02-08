import React from 'react';
import { IconFont } from '@/components/IconFont';
import {
  SettingOutlined,
  BankOutlined,
  StopOutlined,
  NodeExpandOutlined,
  EyeOutlined,
  DropboxOutlined,
} from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';

export const HeaderHeight = 35;
export const LeftToolBarWidth = 65;
export const RightToolBarWidth = 50;

export const LeftCategory = {
  Drag: 'Drag',
  Choose: 'Choose',
  Image: 'Image',
  Font: 'Font',
  Rectangle: 'Rectangle',
  Circle: 'Circle',
  Template: 'Template',
};
export const EditorLeftTools = [
  {
    label: <FormattedMessage id={'app.common.select'} />,
    value: LeftCategory.Choose,
    icon: <IconFont type={'icon-click'} />,
  },
  {
    label: <FormattedMessage id={'app.common.drag'} />,
    value: LeftCategory.Drag,
    icon: <IconFont type={'icon-drag'} />,
  },
  {
    label: <FormattedMessage id={'mapEditor.tools.insertFont'} />,
    value: LeftCategory.Font,
    icon: <IconFont type={'icon-font'} />,
  },
  {
    label: <FormattedMessage id={'mapEditor.tools.insertRect'} />,
    value: LeftCategory.Rectangle,
    icon: <IconFont type={'icon-rectangle'} />,
  },
  {
    label: <FormattedMessage id={'mapEditor.tools.insertCircle'} />,
    value: LeftCategory.Circle,
    icon: <IconFont type={'icon-circle'} />,
  },
  {
    label: <FormattedMessage id={'mapEditor.tools.insertPicture'} />,
    value: LeftCategory.Image,
    icon: <IconFont type={'icon-image'} />,
  },
  {
    label: <FormattedMessage id={'mapEditor.tools.useTemplate'} />,
    value: LeftCategory.Template,
    icon: <IconFont type={'icon-template'} />,
  },
];

export const Category = {
  Aisle: 'AISLE',
  Cell: 'CELL',
  Cost: 'COST',
  CellType: 'CELL_TYPE',
  Elevator: 'ELEVATOR',
  WorkStation: 'WORK_STATION',
  Station: 'COMMON_STATION',
  Charger: 'CHARGER',
  View: 'VIEW',
};
export const EditorRightTools = [
  {
    label: <FormattedMessage id={'app.common.prop'} />,
    value: 'props',
    icon: <SettingOutlined />,
  },
  {
    label: <FormattedMessage id={'app.map.cell'} />,
    value: Category.Cell,
    icon: <IconFont type={'icon-cell'} />,
  },
  {
    label: <FormattedMessage id={'app.map.routeMap'} />,
    value: Category.Cost,
    icon: <IconFont type={'icon-routeMap'} />,
  },
  {
    label: <FormattedMessage id={'app.map.feature'} />,
    value: Category.CellType,
    icon: <IconFont type={'icon-feature'} />,
  },
  {
    label: <FormattedMessage id={'app.map.workstation'} />,
    value: Category.WorkStation,
    icon: <IconFont type={'icon-station'} />,
  },
  {
    label: <FormattedMessage id={'app.map.station'} />,
    value: Category.Station,
    icon: <BankOutlined />,
  },
  {
    label: <FormattedMessage id={'app.map.elevator'} />,
    value: Category.Elevator,
    icon: <IconFont type={'icon-elevator'} />,
  },
  {
    label: <FormattedMessage id={'app.map.charger'} />,
    value: Category.Charger,
    icon: <IconFont type={'icon-charger2'} />,
  },
  {
    label: <FormattedMessage id={'app.map.emergencyStop'} />,
    value: 'emergencyStop',
    icon: <StopOutlined />,
  },
  {
    label: <FormattedMessage id={'app.map.restArea'} />,
    value: 'restArea',
    icon: <IconFont type={'icon-rest2'} />,
  },
  {
    label: <FormattedMessage id={'app.map.aisle'} />,
    value: Category.Aisle,
    icon: <NodeExpandOutlined />,
  },
  {
    label: <FormattedMessage id={'app.map.delivery'} />,
    value: 'delivery',
    icon: <DropboxOutlined />,
  },
  {
    label: <FormattedMessage id={'app.map.intersection'} />,
    value: 'intersection',
    icon: <IconFont type={'icon-intersection'} />,
  },
  {
    label: <FormattedMessage id={'app.map.programing'} />,
    value: 'programing',
    icon: <IconFont type={'icon-programing'} />,
  },
  {
    label: <FormattedMessage id={'mapEditor.tools.createTemplate'} />,
    value: 'template',
    icon: <IconFont type={'icon-template'} />,
  },
  {
    label: <FormattedMessage id={'app.map.view'} />,
    value: Category.View,
    icon: <EyeOutlined />,
  },
  {
    label: <FormattedMessage id={'mapEditor.tools.history'} />,
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
    texture: 'safe_cell',
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
  { value: 10, label: 'app.cost.green' },
  { value: 20, label: 'app.cost.blue' },
  { value: 100, label: 'app.cost.yellow' },
  { value: 1000, label: 'app.cost.red' },
];

export const DirectionOption = [
  { value: 0, label: 'app.direction.top' },
  { value: 1, label: 'app.direction.right' },
  { value: 2, label: 'app.direction.bottom' },
  { value: 3, label: 'app.direction.left' },
];
