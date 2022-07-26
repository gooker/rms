import { AppCode } from '@/config/config';
import SSORouter from './sso.router';
import SourceManager from './resourceManage.router';
import SmartTask from './smartTask.router';
import Report from './report.router';
import Map from './map.router';
import Strategy from './configuration.router';
import DevOps from './devOps.router';

export default {
  [AppCode.SSO]: SSORouter,
  [AppCode.ResourceManage]: SourceManager,
  [AppCode.SmartTask]: SmartTask,
  [AppCode.Report]: Report,
  [AppCode.Map]: Map,
  [AppCode.Configuration]: Strategy,
  [AppCode.DevOps]: DevOps,

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
