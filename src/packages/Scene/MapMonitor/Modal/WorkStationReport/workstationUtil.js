import {
  covertData2ChartsData,
  convertWaitingData2Chart,
} from '@/packages/Scene/MapMonitor/Modal/WorkStationReport/workStationEchart';
import {
  fetchWorkStationInstrument,
  fetchWorkStationPre30Waiting,
} from '@/services/monitorService';
import { isNull, dealResponse } from '@/utils/util';

export const workStationCallback = async (
  data,
  dispatch,
  workStationTaskHistoryData = {},
  workStationWaitingData = {},
) => {
  const { stopCellId, direction } = data;
  if (!isNull(stopCellId) && !isNull(direction)) {
    Promise.all([
      fetchWorkStationInstrument({ stopCellId, stopDirection: direction }),
      fetchWorkStationPre30Waiting({ stopCellId, stopDirection: direction }),
    ]).then((response) => {
      const [taskHistoryResponse, waitingDataResponse] = response;
      let _workStationTaskHistoryData;
      let _workStationWaitingData;
      // 任务数据
      if (!dealResponse(taskHistoryResponse)) {
        const { vehicleIds = [], taskCountMap } = taskHistoryResponse;
        _workStationTaskHistoryData = { ...workStationTaskHistoryData };
        const taskHistoryData = covertData2ChartsData(taskCountMap);
        _workStationTaskHistoryData[`${stopCellId}`] = { vehicleIds, taskHistoryData };
      }

      // 最近30次等待时间
      if (!dealResponse(waitingDataResponse)) {
        _workStationWaitingData = { ...workStationWaitingData };
        _workStationWaitingData[`${stopCellId}`] = convertWaitingData2Chart(waitingDataResponse);
      }
      dispatch({
        type: 'monitorView/saveWorkStationView',
        payload: {
          workStationWaitingData: _workStationWaitingData,
          workStationTaskHistoryData: _workStationTaskHistoryData,
        },
      });
    });
  }
};
