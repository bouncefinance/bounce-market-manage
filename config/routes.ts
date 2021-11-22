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
    access: 'dropAdmin',
  },
  {
    name: 'dropsEdit',
    path: '/drops/edit',
    hideInMenu: true,
    component: './drops/edit',
  },

  {
    name: 'blindboxs',
    path: '/blindboxs',
    icon: 'Dropbox',
    component: './blindBoxs',
    access: 'dropAdmin',
  },
  {
    name: 'blindboxEdit',
    path: '/blindboxs/edit',
    hideInMenu: true,
    component: './blindBoxs/edit',
  },

  {
    name: 'airdrop',
    path: '/airdrop',
    icon: 'CloudDownload',
    component: './airdrop',
    access: 'dropAdmin',
  },
  {
    name: 'airdropEdit',
    path: '/airdrop/edit',
    hideInMenu: true,
    component: './airdrop/edit',
  },

  {
    name: 'nft',
    path: '/nft',
    icon: 'icon-cube',
    component: './NFT',
  },

  {
    name: 'collections',
    path: '/collections',
    icon: 'FolderOpen',
    component: './collections',
  },
  {
    name: 'collectionEdit',
    path: '/collection/edit',
    hideInMenu: true,
    component: './collections/edit',
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
    access: 'superAdmin', // 权限定义返回值的某个 key
    icon: 'Key',
    routes: [
      {
        name: 'administrator',
        path: 'admin',
        access: 'superAdmin', // 权限定义返回值的某个 key
        component: './authority',
      },
      {
        name: 'history',
        path: 'history',
        // icon: 'History',
        component: './log',
      },
    ],
  },
  {
    component: './404',
  },
];

export default routes;
