import { AppCode } from '@/config/config';
import SSORouter from './sso.router';
import SourceManager from './resourceManage.router';
import FlexibleSorting from './flexibleSorting.router';
import SmartTask from './smartTask.router';
import LatentPod from './latentPod.router';
import LatentTote from './latentTote.router';
import Report from './report.router';
import Scene from './scene.router';
import Strategy from './strategy.router';
import Tote from './tote.router';
import Carry from './carry.router';

export default {
  [AppCode.SSO]: SSORouter,
  [AppCode.ResourceManage]: SourceManager,
  // [AppCode.AgvManned]: AgvManned,
  // [AppCode.Cleaning]: Cleaning,
  [AppCode.FlexibleSorting]: FlexibleSorting,
  // [AppCode.ForkLift]: ForkLift,
  [AppCode.SmartTask]: SmartTask,
  [AppCode.LatentPod]: LatentPod,
  [AppCode.LatentTote]: LatentTote,
  [AppCode.Report]: Report,
  [AppCode.Scene]: Scene,
  [AppCode.Strategy]: Strategy,
  // [AppCode.Tool]: Tool,
  [AppCode.Tote]: Tote,
  // [AppCode.Customized]: Customized,
  [AppCode.Carry]: Carry,
};
