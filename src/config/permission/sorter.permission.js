export default [
  {
    page: '/sorter/task/executionQueue', //执行队列
    children: [
      {
        key: '/sorter/task/executionQueue/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/sorter/task/taskQueue', //等待队列
    children: [
      {
        key: '/sorter/task/taskQueue/delete',
        label: '删除',
      },
      {
        key: '/sorter/task/taskQueue/updatePipLine',
        label: '调整优先级',
      },
    ],
  },
  {
    page: '/sorter/task/taskManger', //任务查询
    children: [
      {
        key: '/sorter/task/taskManger/cancel',
        label: '取消任务',
      },
    ],
  },
];
