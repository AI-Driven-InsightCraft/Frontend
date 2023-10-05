export default [
  {
    path: '/user',
    layout: false,
    routes: [{ path: '/user/login', name: '管理3', component: './User/Login' }],
  },
  { path: '/', redirect: '/add_chart' },
  { path: '/add_chart', name: 'Create Chart', icon: 'barChart', component: './AddChart' },
  {
    path: '/add_chart_async',
    name: 'Create Chart (Async)',
    icon: 'barChart',
    component: './AddChartAsync',
  },
  { path: '/my_chart', name: 'My Charts', icon: 'PieChart', component: './MyChart' },

  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { path: '/admin', name: '管理1', redirect: '/admin/sub-page' },
      { path: '/admin/sub-page', name: '管理2', component: './Admin' },
    ],
  },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
