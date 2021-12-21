import request from '@/utils/request';
import { NameSpace } from '@/config/config';

const { Coordinator} =NameSpace;



  export async function fetchGetAllScopeActions() {
    return request(`/${Coordinator}/actionScope/getAllActionScope`, {
        method: 'GET',
      });
  }

  // 获取当前已激活的地图
export async function fetchGetActiveMap() {
    return request(`/${Coordinator}/map/getActiveMap`, { method: 'GET' });
  }