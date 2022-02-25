export default [
  {
    page: '/Sorter/task/executionQueue', //执行队列
    children: [
      {
        key: '/Sorter/task/executionQueue/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/Sorter/task/taskQueue', //等待队列
    children: [
      {
        key: '/Sorter/task/taskQueue/delete',
        label: '删除',
      },
      {
        key: '/Sorter/task/taskQueue/updatePipLine',
        label: '调整优先级',
      },
    ],
  },
  {
    page: '/Sorter/task/taskManger', //任务查询
    children: [
      {
        key: '/Sorter/task/taskManger/cancel',
        label: '取消任务',
      },
    ],
  },
];
