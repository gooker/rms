import { AppCode } from '@/config/config';
import SSORouter from './sso.router';
import SourceManager from './resourceManage.router';
import SmartTask from './smartTask.router';
import Map from './map.router';
import Strategy from './configuration.router';
import DevOps from './devOps.router';

export default {
  [AppCode.SSO]: SSORouter,
  [AppCode.ResourceManage]: SourceManager,
  [AppCode.SmartTask]: SmartTask,
  [AppCode.Map]: Map,
  [AppCode.Configuration]: Strategy,
  [AppCode.DevOps]: DevOps,

  // [AppCode.Report]: Report,
  // [AppCode.VehicleManned]: VehicleManned,
  // [AppCode.Cleaning]: Cleaning,
  // [AppCode.FlexibleSorting]: FlexibleSorting,
  // [AppCode.ForkLift]: ForkLift,
  // [AppCode.LatentPod]: LatentPod,
  // [AppCode.LatentTote]: LatentTote,
  // [AppCode.Tote]: Tote,
  // [AppCode.Customized]: Customized,
  // [AppCode.Carry]: Carry,
};
