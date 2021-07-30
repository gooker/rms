const PermissionInfo = [
    {
        page: '/sorter/center/executionQueue', //执行队列
        children: [
          {
            key: '/center/executionQueue/sorter/delete',
            label: '删除',
          },
        ],
      },
      {
        page: '/sorter/center/taskQueue', //等待
        children: [
          {
            key: '/center/taskQueue/sorter/delete',
            label: '删除',
          },
          {
            key: '/center/taskQueue/sorter/updatePipLine',
            label: '调整优先级',
          },
        ],
      },
      {
        page: '/sorter/center/taskManger', //任务查询
        children: [
          {
            key: '/center/taskManger/sorter/cancel',
            label: '取消任务',
          },
        ],
      },
];
export default PermissionInfo
