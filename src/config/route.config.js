export default [
  {
    name: 'aaa页',
    icon: 'user',
    path: '/aaa',
    models: () => [import('../models/aaa')], //models可多个
    component: () => import('../routes/AAA'),
  },
  {
    name: 'bbb页',
    icon: 'user',
    path: '/bbb',
    models: () => [import('../models/bbb')], //models可多个
    component: () => import('../routes/BBB'),
  },
  {
    name: 'ccc页',
    icon: 'user',
    path: '/ccc',
    models: () => [import('../models/ccc')], //models可多个
    component: () => import('../routes/CCC'),
  },
];
