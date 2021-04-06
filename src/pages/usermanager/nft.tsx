import styles from './nft.less';
import { history } from 'umi'
import fetch from 'umi-request'
import { useEffect, useState } from 'react';
import '@ant-design/pro-layout/dist/layout.min.css';
import { Tabs } from 'antd';
import NFTCheckHandle from './_nftHandle'
import { NFTCheckStatus } from './type';

const { TabPane } = Tabs;


export default function IndexPage () {
  useEffect(() => {
    // const init = async () => {
    //   const res = await fetch.post('/api/bouadmin/main/auth/getitemsbylikename', { data: { } })
    //   const data = res.data
    //   console.log(res)
    // }
    // init()
  }, [])
  const [tabType, setTabType] = useState<NFTCheckStatus>('item')
  function callback (key: string) {
    console.log(key);
    setTabType(key as NFTCheckStatus)
  }
  return (<div>
    <Tabs defaultActiveKey="1" onChange={callback}>
      {([
        // { tab: intl.formatMessage({ id: 'pages.nft.handile.notAudit' }), key: "await" },
        // { tab: intl.formatMessage({ id: 'pages.nft.handile.theApproved' }), key: "ok" },
        // { tab: intl.formatMessage({ id: 'pages.nft.handile.hasBanned' }), key: "no" },
        { tab: 'Item', key: "item" },
        { tab: 'Brand', key: "brand" },
        { tab: 'Account', key: "account" },
      ] as {
        tab: string;
        key: NFTCheckStatus;
      }[]).map(e => <TabPane tab={e.tab} key={e.key}>
        <NFTCheckHandle tabType={tabType} type={e.key} />
      </TabPane>)}
    </Tabs>
  </div>)
}