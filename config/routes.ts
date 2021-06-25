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
  // {
  //   name: 'delete',
  //   path: '/usermanager/nft',
  //   component: './usermanager/nft',
  // },
  // {
  //   name: 'deleteAndHide',
  //   path: '/deleteAndHide',
  //   icon: 'Edit',
  //   component: './deleteAndHide',
  // },
  {
    name: 'Overview',
    path: '/overview',
    icon: 'BarChart',
    component: './overview',
  },
  {
    name: 'LandingPage',
    path: '/landingPage',
    icon: 'Home',
    component: './landingPage',
  },
  {
    name: 'Marketplace',
    path: '/marketplace',
    icon: 'Shop',
    component: './recommend',
  },
  {
    name: 'Drops',
    path: '/drops',
    icon: 'Fire',
    component: './drops',
  },
  {
    name: 'NFT',
    path: '/nft',
    icon: 'icon-cube',
    component: './NFT',
  },
  // {
  //   name: 'brand',
  //   path: '/Brand',
  //   icon: 'icon-brand',
  //   component: './brand',
  // },
  {
    name: 'Authority',
    // path: '/authority'
    icon: 'key',
    routes: [
      {
        name: 'User',
        path: 'user',
        icon: 'User',
        component: './account',
      },
      {
        name: 'Administor',
        path: 'administor',
        icon: 'Key',
        component: './authority',
      },
      {
        name: 'History',
        path: 'history',
        icon: 'History',
        component: './history',
      },
    ],
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
  {
    name: 'test',
    path: '/test',
    icon: 'BorderInner',
    component: './test',
    routes: [
      {
        name: 'hhh',
        path: 'hhh',
        icon: 'DownSquare',
        component: './test/edit.tsx',
      },
    ],
  },
  {
    component: './404',
  },
];

export default routes;
