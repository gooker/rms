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
    value: 'cell',
    icon: <IconFont type={'icon-cell'} />,
  },
  {
    label: formatMessage({ id: 'app.map.routeMap' }),
    value: 'routeMap',
    icon: <IconFont type={'icon-routeMap'} />,
  },
  {
    label: formatMessage({ id: 'app.map.view' }),
    value: 'view',
    icon: <EyeOutlined />,
  },
  {
    label: formatMessage({ id: 'app.map.feature' }),
    value: 'feature',
    icon: <IconFont type={'icon-feature'} />,
  },
  {
    label: formatMessage({ id: 'app.map.workstation' }),
    value: 'workstation',
    icon: <IconFont type={'icon-station'} />,
  },
  {
    label: formatMessage({ id: 'app.map.station' }),
    value: 'station',
    icon: <BankOutlined />,
  },
  {
    label: formatMessage({ id: 'app.map.aisle' }),
    value: 'aisle',
    icon: <NodeExpandOutlined />,
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
    label: formatMessage({ id: 'mapEditor.tools.history' }),
    value: 'history',
    icon: <IconFont type={'icon-history'} />,
  },
];
