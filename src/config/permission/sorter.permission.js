export default [
  {
    page: '/sorter/center/executionQueue', //执行队列
    children: [
      {
        key: '/sorter/center/executionQueue/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/sorter/center/taskQueue', //等待队列
    children: [
      {
        key: '/sorter/center/taskQueue/delete',
        label: '删除',
      },
      {
        key: '/sorter/center/taskQueue/updatePipLine',
        label: '调整优先级',
      },
    ],
  },
  {
    page: '/sorter/center/taskManger', //任务查询
    children: [
      {
        key: '/sorter/center/taskManger/cancel',
        label: '取消任务',
      },
    ],
  },
];
