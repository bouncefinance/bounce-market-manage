# 预备
## 初始化项目
```
yarn create @umijs/umi-app
```

这时候，项目搞定了，安装依赖后执行`start`即可启动，如`yarn start`，会获得如下目录结构
```
tree ./src

├─.umi
│  ├─.cache
│  │  └─babel-loader
│  ├─core
│  ├─plugin-helmet
│  ├─plugin-initial-state
│  │  └─models
│  ├─plugin-model
│  └─plugin-request
└─pages
```

```!
.umi可以暂时忽略(不影响编程)
```
现在已经跑起来了，就两行命令就开启一个项目。这时候pages下面只有index.tsx, 我们添加一个登陆页吧

[可参考项目实战](https://ant.design/docs/react/practical-projects-cn)

## 约定式路由

路由，我们用约定式路由，也就是根据pages下面的文件自动生成路由，不用手动去管理。

路由配置，删除手动路由，使用[约定式路由](https://umijs.org/zh-CN/docs/convention-routing),在根目录找到`.umirc.ts`删除下面代码
```
- layout: {},
```

这时加一个login.tsx吧, 假设页码写好了，这时候我们需要进行请求，我们配置下请求吧。

这时候，我们在`src`下面新建一个`layouts/index.tsx`，代码参考如下
```ts
import { IRouteComponentProps } from 'umi'
import request from 'umi-request'

export default function Layout ({ children, location, route, history, match }: IRouteComponentProps) {
  request.extendOptions({
    prefix: 'https://xxxxx.com'
  })
  return children
}
```
[umi-request详细文档](https://github.com/umijs/umi-request)


这时候就可以开始在页面使用请求，如下代码
```
import styles from './index.less';
import { history } from 'umi'
import fetch from 'umi-request'
import { useEffect } from 'react';

export default function IndexPage () {
  useEffect(() => {
    const init = async () => {
      const res = await fetch.post('/api/v2/main/auth/xxx', { data: { accountaddress: "xx" } })
      console.log(res)
    }
    init()
  }, [])

  return (
    <div>
      <h1 className={styles.title}>Page index</h1>
    </div>
  );
}

```



### 打包编译
```
tree ./dist

./dist
├── index.html
├── umi.css
└── umi.js
```

# 开始
上面已经是完成了一个基本环境，这时候开始主题。我们开启快速构建的登陆页面和菜单栏跟列表吧。


### plugin-locale
依赖 `@ant-design/pro-layout`


开启配置
``` js
locale: {
    // default lang
    default: 'en-US',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
},
```

全局化
``` ts
import { useIntl } from 'umi'
const intl = useIntl();
window.intl = intl
```

使用方式 FormattedMessage or intl.formatMessage({ id: 'pages.login.successfully' })

类型
``` ts
type intl = {
  formatMessage (option: { id: string; defaultMessage?: string }): string;
}
```

### 全局less
src/global.less就可以，不过得注意下，需要重启启动项目


### 左侧栏
layout/index.tsx， 自定义左右栏，
```tsx
({ children, location, route, history, match }) => {
  const { routes = [] } = route;
  const { breadcrumb, menuData } = getMenuData(routes);
  // --- 根据menuData渲染自己需要的左侧栏
  return location.pathname === '/user/login' ? children : <div className={styles.box}>
    <ProLayout
      style={{ flexDirection: 'row', height: '100vh' }}
      title={' ' || intl.formatMessage({ id: 'component.globalHeader.title' })}
      logo={<Logo width={150}></Logo>}
      menuRender={menuRender}
      headerRender={headerRender}
    >
      {children}
    </ProLayout>
  </div>
}
```

如果用的是不是约定式路由，那么菜单栏基本上不需要改动，并且还会自动生成面包屑，但是约定式路由就需要自己手动操作了


多语言切换可以用`<SelectLang />`组件，在`umi`上面.

### 列表页的实现
```tsx
import styles from './_nftHandle.less'
import { Input, Pagination, Spin } from 'antd'
import { NFTCheckStatus } from './type';
import { useEffect, useState } from 'react';
import request from 'umi-request';
import { ImgFit } from '@/components/ImgFit';
const { Search } = Input

function showTotal (total: number) {
  return `Total ${total} items`;
}
interface INFTCheckHandle {
  type: NFTCheckStatus
}
export default function NFTCheckHandle ({ type }: INFTCheckHandle) {
  const onSearch = (value: string) => console.log(value)
  const list: { src: string; name: string }[] = new Array(20).fill({ src: '', name: 'name' })
  const [loading, setloading] = useState(true)

  useEffect(() => {
    const init = async () => {
      // const res = await request.post('/api/v2/main/auth/xxx', { data: { accountaddress: "xx" } })
      await new Promise((ok) => setTimeout(ok, 500))
      setloading(false)
    }
    init()
  }, [])
  return <div>
    <Spin spinning={loading} tip="Loading...">
      <div style={{ width: 500 }}>
        <Search
          placeholder={intl.formatMessage({ id: 'component.input.searchPlaceholder' })}
          allowClear
          enterButton={intl.formatMessage({ id: 'component.input.search' })}
          size="large"
          onSearch={onSearch}
        />
      </div>
      <div className={styles.row}>
        {list.map((e, index) => <div key={index} className={[styles.item, 'flex'].join(' ')}>
          <div>
            <ImgFit src={e.src} width={260} height={262} />
          </div>
          <p>{type} {e.name}</p>
        </div>)}
      </div>
    </Spin>
    <Pagination
      size="small"
      total={50}
      disabled={false}
      showTotal={showTotal}
      showSizeChanger
      showQuickJumper
    />
  </div>
}
```

### 使用pro table 

后面更新


# 相关链接

[精读《@umijs/use-request》源码](https://juejin.cn/post/6844904161583054855)\
[umi-request 网络请求之路](https://juejin.cn/post/6844903982867939342)\
[umiJs文档](https://umijs.org/zh-CN/docs)\
[umiJs plugin-locale](https://umijs.org/zh-CN/plugins/plugin-locale)
