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
  //     name: 'box',
  //     path: '/box',
  //     icon: 'PlusSquare',
  //     component: './box/createBox.tsx',
  //     routes:[
  //       {
  //         name: 'view',
  //         path: 'View',
  //         // icon: 'DownSquare',
  //         component: './box/viewBoxs.tsx',
  //       },
  //       {
  //         name: 'create',
  //         path: 'Create',
  //         // icon: 'DownSquare',
  //         component: './box/createBox.tsx',
  //       }
  //     ]
  //   },
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
