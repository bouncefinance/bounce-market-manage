import { MenuDataItem } from '@ant-design/pro-layout';

const routes: MenuDataItem[] = [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
    ],
  },
  {
    name: 'recommend',
    path: '/',
    icon: 'OrderedList',
    component: './recommend',
  },
  // {
  //   name: 'delete',
  //   path: '/usermanager/nft',
  //   component: './usermanager/nft',
  // },
  {
    name: 'deleteAndHide',
    path: '/deleteAndHide',
    icon: 'Edit',
    component: './deleteAndHide',
  },
  // {
  //   name: 'test',
  //   path: '/test',
  //   icon: 'BorderInner',
  //   component: './test',
  //   routes:[
  //     {
  //       name: 'hhh',
  //       path: 'hhh',
  //       icon: 'DownSquare',
  //       component: './test/edit.tsx',
  //     }
  //   ]
  // },
  {
    component: './404',
  },
];

export default routes;
