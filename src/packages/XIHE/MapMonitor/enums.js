import React from 'react';
import { SettingOutlined } from '@ant-design/icons';
import { AGVType } from '@/config/config';
import { IconFont } from '@/components/IconFont';
import FormattedMessage from '@/components/FormattedMessage';

export const HeaderHeight = 35;
export const RightToolBarWidth = 60;

export const Category = {
  Prop: 'Prop',
  LatentAGV: 'LatentAGV',
  ToteAGV: 'ToteAGV',
  SorterAGV: 'SorterAGV',
  Report: 'Report',
  View: 'View',
  Select: 'Select',
  Alert: 'Alert',
  Simulator: 'Simulator',
  Navigation: 'Navigation',
  Emergency: 'Emergency',
  Resource: 'Resource',
  Message: 'Message',
};

export const MonitorRightTools = [
  {
    label: <FormattedMessage id={'app.common.prop'} />,
    value: Category.Prop,
    icon: <SettingOutlined />,
  },
  {
    label: <FormattedMessage id={'monitor.right.latent'} />,
    value: Category.LatentAGV,
    icon: 'latent_category.svg',
    style: { width: '38px' },
  },
  {
    label: <FormattedMessage id={'monitor.right.tote'} />,
    value: Category.ToteAGV,
    icon: 'tote_category.svg',
  },
  {
    label: <FormattedMessage id={'monitor.right.sorter'} />,
    value: Category.SorterAGV,
    icon: 'sorter_category.svg',
    style: { width: '33px', height: '45px' },
  },
  {
    label: <FormattedMessage id={'app.common.report'} />,
    value: Category.Report,
    icon: 'report_category.svg',
    style: { width: '28px' },
  },
  {
    label: <FormattedMessage id={'app.map.view'} />,
    value: Category.View,
    icon: 'view_category.svg',
    style: { width: '32px' },
  },
  {
    label: <FormattedMessage id={'app.common.select'} />,
    value: Category.Select,
    icon: 'selection_category.svg',
  },
  {
    label: <FormattedMessage id={'app.alert'} />,
    value: Category.Alert,
    icon: 'alert_category.svg',
    style: { width: '33px' },
  },
  {
    label: <FormattedMessage id={'monitor.right.simulator'} />,
    value: Category.Simulator,
    icon: 'simulator_category.svg',
    style: { width: '37px' },
  },
  {
    label: <FormattedMessage id={'monitor.right.navigation'} />,
    value: Category.Navigation,
    icon: 'navigation_category.svg',
    style: { width: '34px', paddingTop: '5px' },
  },
  {
    label: <FormattedMessage id={'app.map.emergencyStop'} />,
    value: Category.Emergency,
    icon: 'emergency_category.svg',
    style: { width: '32px', paddingTop: '5px' },
  },
  {
    label: <FormattedMessage id={'monitor.right.resource'} />,
    value: Category.Resource,
    icon: 'resource_category.svg',
    style: { width: '33px', paddingTop: '5px' },
  },
  {
    label: <FormattedMessage id={'monitor.right.message'} />,
    value: Category.Message,
    icon: <IconFont type={'icon-message'} />,
    style: { paddingTop: '5px' },
  },
];

export const AgvCategoryTools = [
  {
    label: <FormattedMessage id={'monitor.right.emptyRun'} />,
    icon: 'emptyRun_category.png',
    style: { width: '37px', height: 'auto' },
    value: 'emptyRun',
    module: [AGVType.LatentLifting, AGVType.Tote, AGVType.Sorter],
  },
  {
    label: <FormattedMessage id={'monitor.right.charge'} />,
    icon: 'charge_category.png',
    style: { width: '37px', height: 'auto' },
    value: 'charge',
    module: [AGVType.LatentLifting, AGVType.Tote, AGVType.Sorter],
  },
  {
    label: <FormattedMessage id={'monitor.right.goRest'} />,
    icon: 'goRest_category.png',
    style: { width: '37px', height: 'auto' },
    value: 'goRest',
    module: [AGVType.LatentLifting, AGVType.Tote, AGVType.Sorter],
  },
  {
    label: <FormattedMessage id={'monitor.right.carry'} />,
    icon: 'carry_category.png',
    style: { width: '37px', height: 'auto' },
    value: 'carry',
    module: [AGVType.LatentLifting],
  },
  {
    label: <FormattedMessage id={'monitor.right.advancedCarry'} />,
    icon: 'advancedCarry_category.png',
    style: { width: '37px', height: 'auto' },
    value: 'advancedCarry',
    module: [AGVType.LatentLifting],
  },
  {
    label: (agvType) => {
      if (agvType === AGVType.LatentLifting) {
        return <FormattedMessage id={'monitor.right.workStationTask'} />;
      } else {
        return <FormattedMessage id={'monitor.right.stationTask'} />;
      }
    },
    icon: 'workStationTask_category.png',
    style: { width: '37px', height: 'auto' },
    value: 'workStationTask',
    module: [AGVType.LatentLifting, AGVType.Tote, AGVType.Sorter],
  },
  {
    label: <FormattedMessage id={'monitor.right.autoCall'} />,
    icon: 'autoCall_category.png',
    style: { width: '37px', height: 'auto' },
    value: 'autoCall',
    module: [AGVType.LatentLifting, AGVType.Tote, AGVType.Sorter],
  },
  {
    label: <FormattedMessage id={'monitor.right.remoteControl'} />,
    icon: 'remoteCtrl_category.png',
    style: { width: '37px', height: 'auto' },
    value: 'remoteControl',
    module: [AGVType.LatentLifting, AGVType.Tote, AGVType.Sorter],
  },

  {
    label: <FormattedMessage id={'monitor.right.pickCargo'} />,
    icon: 'quhuo.png',
    style: { width: '37px', height: 'auto' },
    value: 'pickCargo',
    module: [AGVType.Sorter],
  },
  {
    label: <FormattedMessage id={'monitor.right.dumpCargo'} />,
    icon: 'paowu.png',
    style: { width: '37px', height: 'auto' },
    value: 'dumpCargo',
    module: [AGVType.Sorter],
  },

  {
    label: <FormattedMessage id={'app.common.custom'} />,
    icon: 'custom_category.png',
    style: { width: '37px', height: 'auto' },
    value: 'custom',
    module: [AGVType.LatentLifting, AGVType.Tote, AGVType.Sorter],
  },
];

// 显示二级
export const ViewCategoryTools = [
  {
    label: <FormattedMessage id={'monitor.right.pathLock'} />,
    icon: 'pathViewicon.png',
    style: { width: '37px', height: 'auto' },
    value: 'pathLock',
  },
  {
    label: <FormattedMessage id={'monitor.right.mapView'} />,
    icon: 'mapViewicon.png',
    style: { width: '37px', height: 'auto' },
    value: 'mapShow',
  },
];
