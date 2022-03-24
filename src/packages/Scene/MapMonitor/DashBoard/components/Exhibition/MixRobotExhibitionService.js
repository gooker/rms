import request from '@/utils/request';
import { NameSpace } from '@/config/config';

export default class MixRobotExhibitionService {
  refreshLatentLiftCharts() {
    return request(`/${NameSpace.LatentLifting}/agv-task/getInstrumentData`, {
      method: 'GET',
    });
  }

  refreshToteCharts() {
    return request(`/${NameSpace.Tote}/agv-task/getInstrumentData`, { method: 'GET' });
  }

  refreshForkLiftCharts() {}

  refreshSorterCharts() {}
}