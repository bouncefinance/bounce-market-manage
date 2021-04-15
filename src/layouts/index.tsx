import { FormattedHTMLMessage, IRouteComponentProps, Link, useHistory, useIntl } from 'umi'
import request from 'umi-request'
import { setLocale } from 'umi';
import styles from './index.less';
import { useEffect, useState } from 'react';
import { Button } from 'antd';
import ProLayout, { MenuDataItem, PageContainer } from '@ant-design/pro-layout';
import { ReactComponent as Logo } from '../assets/logo.svg'
import { getMenuData } from '@ant-design/pro-layout';
import { Menu, Switch, Dropdown } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
const { SubMenu } = Menu;
import { connect, SelectLang } from 'umi';
import Avatar from '../components/GlobalHeader/AvatarDropdown';

import { Web3Provider } from "@ethersproject/providers"
import { ApolloProvider } from '@apollo/client';
import { Web3ReactProvider } from "@web3-react/core"

import { ApolloClient, InMemoryCache } from '@apollo/client';
import { APIPrefixUrl, ApolloClientUrl } from '@/tools/const';
const client = new ApolloClient({
  uri: ApolloClientUrl,     // bsc test
  cache: new InMemoryCache(),
})

let _history : any = {}

const prefix = APIPrefixUrl
// request.extendOptions({
//   prefix,
// })
request.use(async (ctx, next) => {
  if (ctx.req.url.substring(0, 4) !== 'http') {
    ctx.req.url = prefix + ctx.req.url
  }
  ctx.req.options.headers = {
    ...ctx.req.options.headers,
    'token': localStorage.token || ''
  }
  await next()
  if (ctx.res.code === -1) {
    _history.replace('/user/login')
  }
})

const mathPath = (path: string, historyPath: string) => historyPath.match(path) ? historyPath : path

export default function Layout ({ children, location, route, history, match }: IRouteComponentProps) {
  const intl = useIntl();
  window.intl = intl

  const { routes = [] } = route;
  // const { breadcrumb, menuData } = getMenuData(routes);
  _history = history

  // console.log(location)


  type menu = {
    name: string;
    path: string;
    menuPath?: string;
    top?: boolean;
    children?: menu [];
  }
  type menuList = menu[]
  const menuList: menuList = [
    {
      name: intl.formatMessage({ id: 'menu.banner' }), path: '/banner', top: true, children: [
        {
          name: intl.formatMessage({ id: 'menu.banner.list' }), top: true, path: '/banner/list', children: [
            { name: intl.formatMessage({ id: 'menu.banner.addTitle' }),  path: '/banner/add'},
            { name: intl.formatMessage({ id: 'menu.banner.updateTitle' }), path: mathPath('/banner/add/\\d+', location.pathname)},
          ]
        },
      ]
    },
    { name: intl.formatMessage({ id: 'menu.homeManager' }), top: true,  path: '/homeManager'},
    { name: intl.formatMessage({ id: 'menu.usermanager.nft' }), top: true,  path: '/usermanager/nft'},
  ]
  const menuOpenKeyMap: Map<string, menu> = new Map()
  const menuKeyMap: Map<string, menu> = new Map()
  for (let item of menuList) {
    if (item.children) {
      for (let item2 of item.children) {
        menuOpenKeyMap.set(item2.path, item)
        menuKeyMap.set(item2.path, item2)
        if (item2.children) for (let item3 of item2.children) {
          menuOpenKeyMap.set(item3.path, item)
          menuKeyMap.set(item3.path, { ...item3, menuPath: item2.path})
        }
      }
    } else {
      menuKeyMap.set(item.path, item)
    }
  }

  useEffect(() => {
    // set default language
    if (!localStorage.umi_locale) {
      setLocale('en-US', false)
    }

    if(!localStorage.token){
      history.replace('/user/login')
    }

  }, [])

  const [openKeys, setOpenKeys] = useState<Array<string>>([menuOpenKeyMap.get(location.pathname)?.path ?? ''])
  const getSelectedKeys = (): Array<string>  => {
    // console.log(menuKeyMap.get(location.pathname)?.menuPath)
    return [menuKeyMap.get(location.pathname)?.menuPath ?? location.pathname]
  }


  const menuRender = (): React.ReactNode => <div className={styles.menubox} style={{ width: '220px', backgroundColor: '#fff' }}>
    <div style={{ padding: '10px 20px' }}>
      <Logo width={150}></Logo>
    </div>
    <Menu style={{userSelect: 'none'}} mode="inline" selectedKeys={getSelectedKeys()} openKeys={openKeys}>
      {menuList.map(item => {
        return item.children ? <SubMenu onTitleClick={(e) => {
          const keys = [e.key ?? '']
          if (keys.join(',') == openKeys.join(',')) {
            return setOpenKeys([])
          }
          setOpenKeys(keys)
        }} title={item.name} key={item.path}>
          {item.children.map(item => <Menu.Item title={item.name} key={item.path}>
            <Link to={item.path ?? ''} >{item.name}</Link>
          </Menu.Item>)}
        </SubMenu> : <Menu.Item title={item.name} key={item.path}>
          <Link to={item.path ?? ''} >{item.name}</Link>
        </Menu.Item>
      })}
    </Menu>
  </div>
  const headerRender = () => {
    return <div className={[styles.headbox, "flex flex-space-x flex-center-y"].join(' ')}>
      <div>
        {/* TODO breadcrumb */}
        {menuKeyMap.get(location.pathname)?.top || <Button onClick={() => history.goBack()} type="text" icon={<LeftOutlined />}></Button>}
        {menuKeyMap.get(location.pathname)?.name}</div>
      <div className="flex flex-center-y">
        <Avatar />
        <SelectLang className={styles.action} />
      </div>
    </div>
  }
  const getLibrary = (provider: any, _connector: any) => {
    const library = new Web3Provider(provider);
    library.pollingInterval = 8000;
    return library;
  }

  
  return <ApolloProvider client={client}>
      <Web3ReactProvider getLibrary={getLibrary}>{
      location.pathname === '/user/login' ? children : <div className={styles.box}>
        <ProLayout
          style={{ flexDirection: 'row', height: '100vh', }}
          title={' ' || intl.formatMessage({ id: 'component.globalHeader.title' })}
          logo={<Logo width={150}></Logo>}
          menuRender={menuRender}
          headerRender={headerRender}
        >
          <div style={{ width: 'calc(100vw - 232px)', overflow: 'hidden', marginTop: '0px' }}>
            {children}
          </div>
        </ProLayout>
      </div>}
    </Web3ReactProvider>
  </ApolloProvider>
}
