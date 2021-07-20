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
    name: 'overview',
    path: '/overview',
    icon: 'BarChart',
    routes: [
      {
        name: 'overview',
        path: 'statstics',
        component: './overview',
      },
      {
        name: 'transcations',
        path: 'transcations',
        component: './transcations',
      },
    ],
  },
  {
    name: 'landingPage',
    path: '/landingPage',
    icon: 'Home',
    component: './landingPage',
  },
  {
    name: 'marketplace',
    path: '/marketplace',
    icon: 'Shop',
    routes: [
      {
        name: 'pools',
        path: 'pools',
        component: './marketplace/pools',
      },
      {
        name: 'collections',
        path: 'collections',
        component: './marketplace/brands',
      },
    ],
  },
  {
    name: 'drops',
    path: '/drops',
    icon: 'Fire',
    component: './drops',
  },
  {
    name: 'dropsEdit',
    path: '/drops/edit',
    hideInMenu: true,
    component: './drops/edit',
  },
  {
    name: 'nft',
    path: '/nft',
    icon: 'icon-cube',
    routes: [
      {
        name: 'items',
        path: 'item',
        component: './nft/items',
      },
      {
        name: 'brands',
        path: 'brands',
        // icon: 'History',
        component: './nft/brands',
      },
    ],
  },
  {
    name: 'users',
    path: 'account',
    icon: 'User',
    component: './account',
  },
  {
    name: 'administrator',
    path: 'admin',
    icon: 'Key',
    routes: [
      {
        name: 'administrator',
        path: 'admin',
        component: './authority',
      },
      {
        name: 'history',
        path: 'history',
        icon: 'History',
        // component: './history',
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
    component: './404',
  },
];

export default routes;
