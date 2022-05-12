export const MockMapDataMulti = {
  id: '627b9b3acec59534a8c0db8c',
  name: 'cs',
  desc: null,
  sectionId: 6,
  autoGenCellIdStart: 1,
  activeFlag: true,
  cellMap: {
    1: {
      id: 1,
      naviId: '1',
      navigationType: 'mqrcode',
      type: 'Normal',
      x: 0,
      y: 0,
      nx: 0,
      ny: 0,
      logicId: 0,
      additional: {},
    },
    2: {
      id: 2,
      naviId: '2',
      navigationType: 'mqrcode',
      type: 'Normal',
      x: 1225,
      y: 0,
      nx: 1225,
      ny: 0,
      logicId: 0,
      additional: {},
    },
    3: {
      id: 3,
      naviId: '3',
      navigationType: 'mqrcode',
      type: 'Normal',
      x: 2450,
      y: 0,
      nx: 2450,
      ny: 0,
      logicId: 0,
      additional: {},
    },
    4: {
      id: 4,
      naviId: '4',
      navigationType: 'mqrcode',
      type: 'Normal',
      x: 3675,
      y: 0,
      nx: 3675,
      ny: 0,
      logicId: 0,
      additional: {},
    },
    5: {
      id: 5,
      naviId: '5',
      navigationType: 'mqrcode',
      type: 'Normal',
      x: 4900,
      y: 0,
      nx: 4900,
      ny: 0,
      logicId: 0,
      additional: {},
    },
    6: {
      id: 6,
      naviId: '6',
      navigationType: 'mqrcode',
      type: 'Normal',
      x: 6125,
      y: 0,
      nx: 6125,
      ny: 0,
      logicId: 0,
      additional: {},
    },
    7: {
      id: 7,
      naviId: '7',
      navigationType: 'mqrcode',
      type: 'Normal',
      x: 0,
      y: -1000,
      nx: 0,
      ny: 0,
      logicId: 0,
      additional: {},
    },
    8: {
      id: 8,
      naviId: '8',
      navigationType: 'mqrcode',
      type: 'Normal',
      x: 1225,
      y: -1000,
      nx: 1225,
      ny: 0,
      logicId: 0,
      additional: {},
    },
    9: {
      id: 9,
      naviId: '9',
      navigationType: 'mqrcode',
      type: 'Normal',
      x: 2450,
      y: -1000,
      nx: 2450,
      ny: 0,
      logicId: 0,
      additional: {},
    },
    10: {
      id: 10,
      naviId: 'LM1',
      navigationType: 'seerslam',
      type: 'Normal',
      x: 0,
      y: 0,
      nx: 0,
      ny: 0,
      logicId: 0,
      additional: {},
    },
  },
  connectCellMap: null,
  logicAreaList: [
    {
      id: 0,
      name: 'DEFAULT',
      routeMap: {
        DEFAULT: {
          name: 'DEFAULT',
          code: 'DEFAULT',
          desc: null,
          waitCellIds: null,
          followCellIds: null,
          blockCellIds: null,
          nonStopCellIds: null,
          relations: [
            {
              source: 2,
              target: 3,
              type: 'StraightPath',
              angle: 90,
              cost: 10,
              distance: 1225,
              control1: null,
              control2: null,
            },
            {
              source: 8,
              target: 9,
              type: 'StraightPath',
              angle: 90,
              cost: 10,
              distance: 1225,
              control1: null,
              control2: null,
            },
            {
              source: 3,
              target: 2,
              type: 'StraightPath',
              angle: 270,
              cost: 20,
              distance: 1225,
              control1: null,
              control2: null,
            },
            {
              source: 9,
              target: 8,
              type: 'StraightPath',
              angle: 270,
              cost: 20,
              distance: 1225,
              control1: null,
              control2: null,
            },
            {
              source: 8,
              target: 2,
              type: 'StraightPath',
              angle: 0,
              cost: 100,
              distance: 1000,
              control1: null,
              control2: null,
            },
            {
              source: 9,
              target: 3,
              type: 'StraightPath',
              angle: 0,
              cost: 100,
              distance: 1000,
              control1: null,
              control2: null,
            },
            {
              source: 2,
              target: 8,
              type: 'StraightPath',
              angle: 180,
              cost: 1000,
              distance: 1000,
              control1: null,
              control2: null,
            },
            {
              source: 3,
              target: 9,
              type: 'StraightPath',
              angle: 180,
              cost: 1000,
              distance: 1000,
              control1: null,
              control2: null,
            },
          ],
          rotateAreaMap: null,
          relationMap: null,
          tunnels: null,
          cellCostMap: null,
          turnCellId: null,
          storeCellDTOList: null,
        },
      },
      obstacles: [],
      restCells: [],
      storeCellIds: [],
      taskCellIds: null,
      rotateCellIds: null,
      safeAreaCellIds: null,
      workstationList: [],
      dumpStations: [],
      chargerList: [],
      commonList: [],
      intersectionList: null,
      emergencyStopFixedList: null,
      backGround: null,
      zoneMarker: null,
      labels: null,
    },
  ],
  elevatorList: null,
  transform: {},
  intMapCell: null,
  elevatorInnerCells: null,
  innerCellMap: null,
  assistRotateCellIds: null,
  deepStoreCellMap: null,
  targetCellRelationMap: null,
  localUpdateTime: '2022-05-11T19:47:45.209',
  naviCellMap: null,
  createdByUser: null,
  createTime: '2022-05-11 19:17:14',
  updatedByUser: null,
  updateTime: '2022-05-11 19:17:14',
  ever: '1.0.0',
  mver: '1.0.0',
};

export const AllAdapters = {
  MUSHINY_SORTER_ADAPTER: {
    adapterType: {
      id: 'MUSHINY_SORTER_ADAPTER',
      code: 'MUSHINY_SORTER_ADAPTER',
      name: '分拣',
      description: null,
      agvConnectType: '',
      agvTypes: [
        {
          id: null,
          code: 'sorter',
          sectionId: null,
          isReadOnly: true,
          isUserVisible: true,
          name: '分拣',
          fixTureModel: null,
          robotModel: {
            code: 'sorter',
            name: '分拣模型',
            icon: null,
            geoModel: {
              dimension: { front: 455, rear: 455, left: 370, right: 370, radius: 480, height: 0 },
              position: { x: 0, y: 0, z: 0 },
              angle: 0.0,
            },
          },
          actionTemplate: {
            id: null,
            code: 'sorter',
            name: '分拣动作模型',
            actionModels: {
              Go: {
                id: null,
                actionCode: 'A',
                actionName: '行驶',
                robotAction: {
                  params: null,
                  priority: 0,
                  indActionCmdAndMsg: null,
                  indActionFinishCmd: 0,
                  actionList: ['DISTANCE', 'SPEED'],
                  actionParams: null,
                  blockingType: 'NONE',
                  simulatorIndex: null,
                  simulatorSpeed: null,
                  robotActionMsg: null,
                  indAction: false,
                  slowAction: false,
                },
                robotActionRelation: null,
                mutualExclusiveActionType: null,
              },
              Turn: {
                id: null,
                actionCode: 'B',
                actionName: '转弯',
                robotAction: {
                  params: null,
                  priority: 0,
                  indActionCmdAndMsg: null,
                  indActionFinishCmd: 0,
                  actionList: ['ANGLE'],
                  actionParams: null,
                  blockingType: 'SOFT',
                  simulatorIndex: null,
                  simulatorSpeed: null,
                  robotActionMsg: null,
                  indAction: false,
                  slowAction: false,
                },
                robotActionRelation: null,
                mutualExclusiveActionType: null,
              },
              Finish: {
                id: null,
                actionCode: 'H2',
                actionName: '完成',
                robotAction: {
                  params: null,
                  priority: 0,
                  indActionCmdAndMsg: null,
                  indActionFinishCmd: 0,
                  actionList: [],
                  actionParams: null,
                  blockingType: 'SOFT',
                  simulatorIndex: null,
                  simulatorSpeed: null,
                  robotActionMsg: null,
                  indAction: false,
                  slowAction: false,
                },
                robotActionRelation: null,
                mutualExclusiveActionType: null,
              },
            },
          },
          navigationType: 'cell',
          agvAdapter: 'MUSHINY_SORTER_ADAPTER',
          lockStrategy: null,
          supportScene: ['EMPTY_RUN', 'CHARGE_RUN', 'REST_RUN'],
        },
      ],
      taskHandlerClass: null,
      otherInfo: null,
    },
    adapterModel: null,
  },
};

// VEHICLE, SYSTEM, EQUIPMENT
export const ProgramingConfigurationList = {
  SYSTEM: [
    {
      actionType: 'SYSTEM_ACTION_NotifyAction',
      actionId: 'SYSTEM_ACTION_NotifyAction',
      actionDescription: '到点位上报一个事件',
      sequenceId: null,
      levels: null,
      blockingType: 'NONE',
      released: false,
      actionState: null,
      adapterType: 'SYSTEM',
      isReadOnly: false,
      isUserVisible: true,
      actionParameters: [
        {
          key: null,
          value: null,
          valueDataType: 'INTEGER',
          description: '小车id',
          isOptional: null,
          name: '小车id',
          code: 'AGV',
        },
        {
          key: null,
          value: null,
          valueDataType: 'STRING',
          description: '任务id',
          isOptional: null,
          name: '任务id',
          code: 'TASK',
        },
        {
          key: null,
          value: null,
          valueDataType: 'INTEGER',
          description: '任务步骤',
          isOptional: null,
          name: '任务步骤',
          code: 'STEP',
        },
        {
          key: null,
          value: null,
          valueDataType: 'INTEGER',
          description: '货架id',
          isOptional: null,
          name: '货架id',
          code: 'POD',
        },
      ],
      targetId: null,
      targetType: null,
      targetMethodType: null,
    },
  ],
};
