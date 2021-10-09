import echarts from 'echarts';
import {
  getCarStatePieOption,
  getTaskStatePieOption,
  getTaskTrendLineOption,
  getCarBatteryStatePieOption,
} from './option';

export default function initDashboard() {
  // 任务状态 Bar
  const taskStatePie = echarts.init(document.getElementById('taskStatePie'));
  const taskStatePieOption = getTaskStatePieOption();
  taskStatePie.setOption(taskStatePieOption, true);

  // 任务历史  Line
  const taskTrendLine = echarts.init(document.getElementById('taskTrendLine'));
  const taskTrendLineOption = getTaskTrendLineOption();
  taskTrendLine.setOption(taskTrendLineOption, true);

  // 小车状态  Pie
  const carStatePie = echarts.init(document.getElementById('carStatePie'));
  const carStatusOption = getCarStatePieOption();
  carStatePie.setOption(carStatusOption, true);

  // 小车电量状态  Pie
  const carBatteryStatePie = echarts.init(document.getElementById('carBatteryStatePie'));
  const carBatteryOption = getCarBatteryStatePieOption();
  carBatteryStatePie.setOption(carBatteryOption, true);

  return { taskStatePie, taskTrendLine, carStatePie, carBatteryStatePie };
}
