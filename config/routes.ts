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
    path: '/',
    redirect: './overview/statstics',
  },
  {
    name: 'Overview',
    path: '/overview',
    icon: 'BarChart',
    routes: [
      {
        name: 'Overview',
        path: 'statstics',
        component: './overview',
      },
      {
        name: 'Transcations',
        path: 'transcations',
        component: './transcations',
      },
    ],
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
    // component: './recommend',
    routes: [
      {
        name: 'Pools',
        path: 'pools',
        component: './marketplace/pools',
      },
      {
        name: 'Collections',
        path: 'collections',
        component: './marketplace/brands',
      },
    ],
  },
  {
    name: 'Drops',
    path: '/drops',
    icon: 'Fire',
    component: './drops',
  },
  {
    name: 'DropsEdit',
    path: '/drops/edit',
    hideInMenu: true,
    component: './drops/edit',
  },
  {
    name: 'NFT',
    path: '/nft',
    icon: 'icon-cube',
    component: './nft',
  },
  {
    name: 'Users',
    path: 'account',
    icon: 'User',
    component: './account',
  },
  {
    name: 'Administrator',
    path: 'administrator',
    icon: 'Key',
    component: './authority',
  },
  {
    name: 'History',
    path: 'history',
    icon: 'History',
    component: './history',
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
    component: './404',
  },
];

export default routes;
