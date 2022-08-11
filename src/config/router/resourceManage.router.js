import { AppCode } from '@/config/config';

export default [
  {
    path: `/${AppCode.ResourceManage}/load`,
    name: 'load',
    icon: 'load',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    routes: [
      {
        path: `/${AppCode.ResourceManage}/load/customSpecification`,
        name: 'customSpecification',
        component: '/ResourceManage/Load/CustomLoadSpecification',
        authority: ['ADMIN', 'SUPERMANAGER'],
      },
      {
        path: `/${AppCode.ResourceManage}/load/loadManagement`,
        name: 'management',
        component: '/ResourceManage/Load/LoadManagement',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: `/${AppCode.ResourceManage}/load/circulation`,
        name: 'circulation',
        component: '/ResourceManage/Load/LoadCirculation',
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
        path: `/${AppCode.ResourceManage}/storage/storageManagement`,
        name: 'management',
        component: '/ResourceManage/Storage/StorageManagement',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
    ],
  },
  {
    path: `/${AppCode.ResourceManage}/vehicle`,
    name: 'vehicle',
    icon: 'vehicle',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    routes: [
      {
        path: `/${AppCode.ResourceManage}/vehicle/customType`,
        name: 'customType',
        component: '/ResourceManage/Vehicle/CustomVehicleType',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: `/${AppCode.ResourceManage}/vehicle/vehicleList`,
        name: 'list',
        component: '/ResourceManage/Vehicle/VehicleList/index',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: `/${AppCode.ResourceManage}/vehicle/realTime`,
        name: 'realTime',
        component: '/ResourceManage/Vehicle/VehicleRealTime/index',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: `/${AppCode.ResourceManage}/vehicle/faultManagement`,
        name: 'faultManagement',
        component: '/ResourceManage/Vehicle/VehicleFaultManagement',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: `/${AppCode.ResourceManage}/vehicle/faultDefinition`,
        name: 'faultDefinition',
        component: '/ResourceManage/Vehicle/VehicleFaultDefinition',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: `/${AppCode.ResourceManage}/vehicle/vehicleLog`,
        name: 'vehicleLog',
        component: '/ResourceManage/Vehicle/VehicleLog',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: `/${AppCode.ResourceManage}/vehicle/vehicleUpgrade`,
        name: 'vehicleUpgrade',
        component: '/ResourceManage/Vehicle/VehicleFirmWareUpgrade',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
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
        path: `/${AppCode.ResourceManage}/equipment/equipmentList`,
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
        path: `/${AppCode.ResourceManage}/charger/chargerList`,
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
        path: `/${AppCode.ResourceManage}/resourceLock/vehicleLock`,
        name: 'vehicleLock',
        component: '/ResourceManage/ResourceLock/VehicleLock',
        authority: ['ADMIN', 'SUPERMANAGER'],
      },
      {
        path: `/${AppCode.ResourceManage}/resourceLock/loadLock`,
        name: 'loadLock',
        component: '/ResourceManage/ResourceLock/LoadLock',
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
    path: `/${AppCode.ResourceManage}/resourceBind`,
    name: 'resourceGroupMapping',
    icon: 'binding',
    component: '/ResourceManage/ResourceBind/index',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  },
];
