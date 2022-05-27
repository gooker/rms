import request from '@/utils/request';
import { dealResponse } from '@/utils/util';
import { NameSpace } from '@/config/config';

export default class ExhibitionService {
  /**
   * @description 获取当前执行队列和等待队列中所有任务状态的实时统计信息
   * @param {Function} sucCb 成功后回调
   * @param {Function} falCb 失败后回调
   */
  refreshTaskStatePie(sucCb, falCb) {
    request(`/${NameSpace.Platform}/map/detail`, { method: 'GET' })
      .then((response) => {
        if (dealResponse(response)) {
          falCb && falCb(response);
        } else {
          sucCb && sucCb(response);
        }
      })
      .catch((error) => {
        falCb && falCb(error);
      });
  }

  /**
   * @description 获取当前执行队列和等待队列中所有任务类型的实时统计信息
   * @param {Function} sucCb 成功后回调
   * @param {Function} falCb 失败后回调
   */
  refreshTaskTypePie(sucCb, falCb) {
    request(`/${NameSpace.Platform}/map/detail`, { method: 'GET' })
      .then((response) => {
        if (dealResponse(response)) {
          falCb && falCb(response);
        } else {
          sucCb && sucCb(response);
        }
      })
      .catch((error) => {
        falCb && falCb(error);
      });
  }

  /**
   * @description 获取前8小时中执行队列和等待惠烈的所有任务统计信息且按整点返回; 统计方式: 7~8 --> 8，任务开始时间小于8 & 任务结束时间大于等于7
   * @param {Function} sucCb 成功后回调
   * @param {Function} falCb 失败后回调
   */
  refreshTaskTrendLine(sucCb, falCb) {
    request(`/${NameSpace.Platform}/map/detail`, { method: 'GET' })
      .then((response) => {
        if (dealResponse(response)) {
          falCb && falCb(response);
        } else {
          sucCb && sucCb(response);
        }
      })
      .catch((error) => {
        falCb && falCb(error);
      });
  }

  /**
   * @description 获取当前所有小车的状态统计信息 (已存在)
   * @param {Function} sucCb 成功后回调
   * @param {Function} falCb 失败后回调
   */
  refreshCarStatePie(sucCb, falCb) {
    request(`/${NameSpace.Platform}/map/detail`, { method: 'GET' })
      .then((response) => {
        if (dealResponse(response)) {
          falCb && falCb(response);
        } else {
          sucCb && sucCb(response);
        }
      })
      .catch((error) => {
        falCb && falCb(error);
      });
  }

  /**
   * @description 获取当前所有小车电量的状态统计信息 (已存在)
   * @param {Function} sucCb 成功后回调
   * @param {Function} falCb 失败后回调
   */
  refreshCarBatteryStatePie(sucCb, falCb) {
    request(`/${NameSpace.Platform}/map/detail`, { method: 'GET' })
      .then((response) => {
        if (dealResponse(response)) {
          falCb && falCb(response);
        } else {
          sucCb && sucCb(response);
        }
      })
      .catch((error) => {
        falCb && falCb(error);
      });
  }

  /**
   * @description 获取当前货架、工作站、充电桩、存储区的统计信息
   * @param {Function} sucCb 成功后回调
   * @param {Function} falCb 失败后回调
   */
  refreshOverview(sucCb, falCb) {
    request(`/${NameSpace.Platform}/map/detail`, { method: 'GET' })
      .then((response) => {
        if (dealResponse(response)) {
          falCb && falCb(response);
        } else {
          sucCb && sucCb(response);
        }
      })
      .catch((error) => {
        falCb && falCb(error);
      });
  }
}
