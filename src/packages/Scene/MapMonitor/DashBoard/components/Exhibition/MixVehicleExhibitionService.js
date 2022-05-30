import request from '@/utils/request';
import { NameSpace } from '@/config/config';

export default class MixVehicleExhibitionService {
  refreshLatentLiftCharts() {
    return request(`/${NameSpace.LatentLifting}/vehicle-task/getInstrumentData`, {
      method: 'GET',
    });
  }

  refreshToteCharts() {
    return request(`/${NameSpace.Platform}/vehicle-task/getInstrumentData`, { method: 'GET' });
  }

  refreshForkLiftCharts() {}

  refreshSorterCharts() {}
}
