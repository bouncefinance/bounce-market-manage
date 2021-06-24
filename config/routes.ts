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
    name: 'overview',
    path: '/Overview',
    icon: 'BarChart',
    component: './overview',
  },
  {
    name: 'landingPage',
    path: '/LandingPage',
    icon: 'Home',
    component: './landingPage',
  },
  {
    name: 'marketplace',
    path: '/',
    icon: 'Shop',
    component: './recommend',
  },
  {
    name: 'drops',
    path: '/Drops',
    icon: 'Fire',
    component: './drops',
  },
  {
    name: 'NFT',
    path: '/NFT',
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
        name: 'Account',
        path: 'account',
        icon: 'User',
        component: './account',
      },
      {
        name: 'Authority',
        path: 'authority',
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
