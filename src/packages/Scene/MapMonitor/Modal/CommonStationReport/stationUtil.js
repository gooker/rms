import { fetchCommonPointInstrument, fetchCommonPointPre30Waiting } from '@/services/monitor';
import {
  transitionVehicles,
  transformCommonTrafficData,
  generateGoodsCountData,
  transformCommonWaitingData,
} from './commonStationEchart';
import { isNull, dealResponse } from '@/utils/util';

export const commonStationCallback = async (commonOb, dispatch, commonPointTaskHistoryData) => {
  const { stopCellId, angle } = commonOb;
  if (!isNull(stopCellId) && !isNull(angle)) {
    const [_trafficDataRes, waitingDataResponse] = await Promise.all([
      // 任务数据
      fetchCommonPointInstrument({ stopCellId, stopDirection: angle }),
      // 最近30次等待时间
      fetchCommonPointPre30Waiting({ stopCellId, stopDirection: angle }),
    ]);
    const trafficDataRes = { ..._trafficDataRes };
    const _commonPointTaskHistoryData = { ...commonPointTaskHistoryData };
    const _trafficData = {};
    let _commonWaitingData = {};

    // 任务个数
    if (!dealResponse(trafficDataRes)) {
      // 任务数据
      const TaskCountData = { ...trafficDataRes };
      const vehicleIdMap = transitionVehicles(TaskCountData);
      const taskHistoryData = transformCommonTrafficData(TaskCountData);
      _commonPointTaskHistoryData[`${stopCellId}`] = {
        vehicleIdMap,
        taskHistoryData,
      };
    }
    // 到站个数
    if (!dealResponse(trafficDataRes)) {
      const TaskNumData = generateGoodsCountData(trafficDataRes);
      _trafficData[`${stopCellId}`] = transformCommonTrafficData(TaskNumData);
    }
    if (!dealResponse(waitingDataResponse)) {
      // 最近30次等待时间
      _commonWaitingData[`${stopCellId}`] = transformCommonWaitingData(waitingDataResponse);
    }

    dispatch({
      type: 'monitorView/saveCommonStationView',
      payload: {
        commonPointTrafficData: _trafficData,
        commonPointWaitingData: _commonWaitingData,
        commonPointTaskHistoryData: _commonPointTaskHistoryData,
      },
    });
  }
};
