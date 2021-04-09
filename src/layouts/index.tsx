import { FormattedHTMLMessage, IRouteComponentProps, Link, useHistory, useIntl } from 'umi'
import request from 'umi-request'
import { setLocale } from 'umi';
import styles from './index.less';
import { useEffect } from 'react';
import { Button } from 'antd';
import ProLayout, { MenuDataItem, PageContainer } from '@ant-design/pro-layout';
import { ReactComponent as Logo } from '../assets/logo.svg'
import { getMenuData } from '@ant-design/pro-layout';
import { Menu, Switch, Dropdown } from 'antd';
const { SubMenu } = Menu;
import { connect, SelectLang } from 'umi';
import Avatar from '../components/GlobalHeader/AvatarDropdown';

import { Web3Provider } from "@ethersproject/providers"
import { ApolloProvider } from '@apollo/client';
import { Web3ReactProvider } from "@web3-react/core"

import { ApolloClient, InMemoryCache } from '@apollo/client';
const client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/winless/bouncenft2',     // bsc test
  cache: new InMemoryCache(),
})

let _history : any = {}

const prefix = 'http://market-test.bounce.finance:11001'
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




const blackList = ['/404', '/', '/user/login']
export default function Layout ({ children, location, route, history, match }: IRouteComponentProps) {
  const intl = useIntl();
  window.intl = intl

  const { routes = [] } = route;
  const { breadcrumb, menuData } = getMenuData(routes);
  _history = history


  const routerInfo: { [key: string]: { name: string } } = {
    '/homeManager': { name: intl.formatMessage({ id: 'menu.homeManager' }) },
    '/usermanager/nft': { name: intl.formatMessage({ id: 'menu.usermanager.nft' }) },
  }

  useEffect(() => {
    // set default language
    if (!localStorage.umi_locale) {
      setLocale('en-US', false)
    }

    if(!localStorage.token){
      history.replace('/user/login')
    }
    // getMetaMskAccount().then((account) => {
    //   alert(account)
    // })
    // onConnect(type)

  }, [])


  const menuRender = (): React.ReactNode => <div className={styles.menubox} style={{ width: '220px', backgroundColor: '#fff' }}>
    <div style={{ padding: '10px 20px' }}>
      <Logo width={150}></Logo>
    </div>
    <Menu defaultSelectedKeys={[location.pathname]} mode="inline">{menuData.filter((e) => !(blackList.includes(e.path ?? ''))).map((item) => {
      return <Menu.Item title={item.path} key={item.key}>
        <Link to={item.path ?? ''} >{routerInfo[item.path ?? '']?.name}</Link>
      </Menu.Item>
    })}</Menu>
  </div>
  const headerRender = () => {
    return <div className={[styles.headbox, "flex flex-space-x flex-center-y"].join(' ')}>
      <div></div>
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
          <div style={{ marginTop: '0px' }}>
            {children}
          </div>
        </ProLayout>
      </div>}
    </Web3ReactProvider>
  </ApolloProvider>
}



// request.interceptors.request.use(
//   (url, options) => {
//     return {
//       url: `https://market-test.bounce.finance/${url}`,
//       options: { ...options, interceptors: true },
//     }
//   },
//   { global: true }
// );
