import styles from './index.less';
import { history } from 'umi'
import fetch from 'umi-request'
import { useEffect } from 'react';
// import '@ant-design/pro-form/dist/form.css';
// import '@ant-design/pro-table/dist/table.css';
// import '@ant-design/pro-layout/dist/layout.css';
import '@ant-design/pro-layout/dist/layout.min.css';

export default function IndexPage () {
  useEffect(() => {
    const init = async () => {
      const res = await fetch.post('/api/v2/main/auth/xxx', { data: { accountaddress: "xx" } })
      console.log(res)
    }
    init()
  }, [])

  return (<div>home</div>)
}
