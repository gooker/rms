import { AppCode } from '@/config/config';

export default [
  {
    path: `/${AppCode.ResourceManage}/container`,
    name: 'container',
    icon: 'container',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    routes: [
      {
        path: `/${AppCode.ResourceManage}/container/customType`,
        name: 'customType',
        component: '/ResourceManage/Container/CustomContainerType',
        authority: ['ADMIN', 'SUPERMANAGER'],
      },
      {
        path: `/${AppCode.ResourceManage}/container/management`,
        name: 'management',
        component: '/ResourceManage/Container/ContainerManage',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: `/${AppCode.ResourceManage}/container/group`,
        name: 'group',
        component: '/ResourceManage/Container/ContainerGroup',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: `/${AppCode.ResourceManage}/container/circulation`,
        name: 'circulation',
        component: '/ResourceManage/Container/ContainerCirculation',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
    ],
  },
  {
    path: `/${AppCode.ResourceManage}/storage`,
    name: 'storage',
    icon: 'storage',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    routes: [
      {
        path: `/${AppCode.ResourceManage}/storage/tote`,
        name: 'tote',
        component: '/ResourceManage/Storage/ToteStorage',
        authority: ['ADMIN', 'SUPERMANAGER'],
      },
      {
        path: `/${AppCode.ResourceManage}/storage/latentTote`,
        name: 'latentTote',
        component: '/ResourceManage/Storage/LatentToteStorage',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: `/${AppCode.ResourceManage}/storage/liftContainer`,
        name: 'liftContainer',
        component: '/ResourceManage/Storage/LiftContainerStorage',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: `/${AppCode.ResourceManage}/storage/group`,
        name: 'group',
        component: '/ResourceManage/Storage/StorageGroup',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: `/${AppCode.ResourceManage}/storage/delivery`,
        name: 'delivery',
        component: '/ResourceManage/Storage/Delivery',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
    ],
  },
  {
    path: `/${AppCode.ResourceManage}/agv`,
    name: 'agv',
    icon: 'agv',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    routes: [
      {
        path: `/${AppCode.ResourceManage}/agv/customType`,
        name: 'customType',
        component: '/ResourceManage/Agv/CustomAgvType',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: `/${AppCode.ResourceManage}/agv/list`,
        name: 'list',
        component: '/ResourceManage/Agv/AgvList/index',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: `/${AppCode.ResourceManage}/agv/realTime`,
        name: 'realTime',
        component: '/ResourceManage/Agv/AgvRealTime',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: `/${AppCode.ResourceManage}/agv/faultManagement`,
        name: 'faultManagement',
        component: '/ResourceManage/Agv/AgvFaultManagement',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: `/${AppCode.ResourceManage}/agv/OTA`,
        name: 'OTA',
        component: '/ResourceManage/Agv/OTA',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
    ],
  },
  {
    path: `/${AppCode.ResourceManage}/charger`,
    name: 'charger',
    icon: 'charger',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    routes: [
      {
        path: `/${AppCode.ResourceManage}/charger/customType`,
        name: 'customType',
        component: '/ResourceManage/Charger/CustomChargerType',
        authority: ['ADMIN', 'SUPERMANAGER'],
      },
      {
        path: `/${AppCode.ResourceManage}/charger/list`,
        name: 'list',
        component: '/ResourceManage/Charger/ChargeList',
        authority: ['ADMIN', 'SUPERMANAGER'],
      },
      {
        path: `/${AppCode.ResourceManage}/charger/faultManagement`,
        name: 'faultManagement',
        component: '/ResourceManage/Charger/ChargerFaultManagement',
        authority: ['ADMIN', 'SUPERMANAGER'],
      },
    ],
  },
  {
    path: `/${AppCode.ResourceManage}/equipment`,
    name: 'equipment',
    icon: 'equipment',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    routes: [
      {
        path: `/${AppCode.ResourceManage}/equipment/customType`,
        name: 'customType',
        component: '/ResourceManage/Equipment/CustomEquipmentType',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: `/${AppCode.ResourceManage}/equipment/list`,
        name: 'list',
        component: '/ResourceManage/Equipment/EquipmentList',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: `/${AppCode.ResourceManage}/equipment/faultManagement`,
        name: 'faultManagement',
        component: '/ResourceManage/Equipment/EquipmentFaultManagement',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
    ],
  },
  {
    path: `/${AppCode.ResourceManage}/resourceLock`,
    name: 'resourceLock',
    icon: 'lock',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    routes: [
      {
        path: `/${AppCode.ResourceManage}/resourceLock/targetLock`,
        name: 'targetLock',
        component: '/ResourceManage/ResourceLock/TargetLock',
        authority: ['ADMIN', 'SUPERMANAGER'],
      },
      {
        path: `/${AppCode.ResourceManage}/resourceLock/agvLock`,
        name: 'agvLock',
        component: '/ResourceManage/ResourceLock/AgvLock',
        authority: ['ADMIN', 'SUPERMANAGER'],
      },
      {
        path: `/${AppCode.ResourceManage}/resourceLock/stationLock`,
        name: 'stationLock',
        component: '/ResourceManage/ResourceLock/StationLock',
        authority: ['ADMIN', 'SUPERMANAGER'],
      },
      {
        path: `/${AppCode.ResourceManage}/resourceLock/containerLock`,
        name: 'containerLock',
        component: '/ResourceManage/ResourceLock/ContainerLock',
        authority: ['ADMIN', 'SUPERMANAGER'],
      },
      {
        path: `/${AppCode.ResourceManage}/resourceLock/storageLock`,
        name: 'storageLock',
        component: '/ResourceManage/ResourceLock/StorageLock',
        authority: ['ADMIN', 'SUPERMANAGER'],
      },
    ],
  },
  {
    path: `/${AppCode.ResourceManage}/integration`,
    name: 'integration',
    icon: 'layout',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    routes: [
      {
        path: `/${AppCode.ResourceManage}/integration/webHook`,
        name: 'webHook',
        component: '/ResourceManage/Integration/WebHook/index',
        authority: ['ADMIN', 'SUPERMANAGER'],
      },
      {
        path: `/${AppCode.ResourceManage}/integration/logManagement`,
        name: 'logManagement',
        component: '/ResourceManage/Integration/IntegrationLogManagement',
        authority: ['ADMIN', 'SUPERMANAGER'],
      },
    ],
  },
  {
    path: `/${AppCode.ResourceManage}/resourceBind`,
    name: 'resourceBind',
    icon: 'binding',
    component: '/ResourceManage/ResourceBind',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  },
];
