import React, { PureComponent } from 'react';
import { Modal } from 'antd';
// import Gantt from 'time-gantt';

const data = {
  title: '业务甘特图', // 图表名
  showPercent: 0.1, // 显示百分比
  showStartPercent: 0.2, // 起始位置百分比
  showDate: '2018-04-01 00:00', // 展示的日期
  nodes: [
    {
      id: '1',
      name: '小鹿1', // 任务名
      yAxis: '任务1', // Y 轴
      value: {
        // 运行时间
        startTime: '2018-03-31 23:30',
        endTime: '2018-04-01 02:25',
      },
      averageValue: 3600000, // 历史运行时间 // 毫秒
      highlightPoints: [
        {
          // 错误点
          time: '2018-04-01 02:10',
        },
      ],
    },
  ],
};
export default class GanttModal extends PureComponent {
  render() {
    const { visible, onCancel } = this.props;
    return (
      <Modal destroyOnClose visible={visible} title="详情甘特图" onCancel={onCancel} footer={null}>
        {/* <Gantt data={data} /> */}
      </Modal>
    );
  }
}
