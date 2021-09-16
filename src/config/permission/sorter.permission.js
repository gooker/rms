export default [
  {
    page: '/sorter/center/executionQueue', //执行队列
    children: [
      {
        key: '/sorter/center/executionQueue/sorter/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/sorter/center/taskQueue', //等待
    children: [
      {
        key: '/sorter/center/taskQueue/sorter/delete',
        label: '删除',
      },
      {
        key: '/sorter/center/taskQueue/sorter/updatePipLine',
        label: '调整优先级',
      },
    ],
  },
  {
    page: '/sorter/center/taskManger', //任务查询
    children: [
      {
        key: '/sorter/center/taskManger/sorter/cancel',
        label: '取消任务',
      },
    ],
  },
];
