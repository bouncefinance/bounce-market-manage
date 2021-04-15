import request from 'umi-request';
import { ImgFit } from '@/components/ImgFit';
import { QueryMarketTradePools, QueryTradePools } from '@/tools/apollo';
import { AUCTION_TYPE } from '@/tools/const';
import { useQuery } from '@apollo/client';
import { Tabs, Menu, Dropdown, Button, Input, message, Spin, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useEffect, useState, } from 'react';
import styles from './index.less'
import barndStyles from '../usermanager/_nftHandle.less'
import { exportErc20Info, weiToNum } from '@/tools/conenct';
import { FormattedMessage } from 'umi'
import { getPriceByToken1 } from '@/tools';
const { Search } = Input
const { confirm } = Modal;

const { TabPane } = Tabs
type getpollsVariablesType = {
  contract: string;
  value: string;
  decimals: number;
}
const coinList = [
  { "value": "BNB", "contract": "0x0000000000000000000000000000000000000000", "decimals": 18 },
  { "value": "BUSD", "contract": "0xe9e7cea3dedca5984780bafc599bd69add087d56", "decimals": 18 },
  { "value": "USDT", "contract": "0x55d398326f99059ff775485246999027b3197955", "decimals": 6 },
  { "value": "USDC", "contract": "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d", "decimals": 18 }
]
const type = 'Image'
let weightMap: Map<string, number> = new Map()

const defaultItemParams = {
  likename: ''
}
let itemParams = JSON.parse(JSON.stringify(defaultItemParams))
const getPoolTypeNumber = (e: string) => e === 'english-auction' ? 2 : 1
const getStandardTypeValue = (e: number) => e === 2 ? 'english-auction' : 'fixed-swap'
export default function HomeManagerPage () {
  const setGetPollsVariables = (v: getpollsVariablesType) => {
    _setGetPollsVariables(v)
  }
  const [getpollsVariables, _setGetPollsVariables] = useState<getpollsVariablesType>(coinList[0])
  // { variables: getpollsVariables }
  const { loading, error, data } = useQuery(QueryTradePools)

  const [tokenList, setTokenList] = useState([]);
  const [filterList, setFilterList] = useState([]);
  const [loading2, setLoding2] = useState(true)
  const [loading3, setLoding3] = useState(true)
  if (error) return <p>Query Error ~~(</p>
  // const [weightMap, setWeightMap] = useState<Map<number, number>>(new Map())
  const [pools, setpools] = useState([])
  const getPoolsWeight = async (pools: Array<any>, list: Array<any>) => {
    setLoding3(true)
    weightMap = new Map()
    const res = await request.post('/api/bouadmin/main/auth/getpoolsinfo', {
      data: {
        poolids: list.map((e: { poolId: number }) => e.poolId),
        standards: list.map((e: { poolType: string }) => getPoolTypeNumber(e.poolType)),
      }
    })
    setLoding3(false)
    if (res.code === 1) {
      res.data
        .map((item: any) => {
          weightMap.set(`${item.poolid}_${getStandardTypeValue(item.standard)}`, item.poolweight)
        })
      const _list: any = list.map((item: any) => {
        return {
          ...item,
          defaultWeight: weightMap.get(`${item.poolId}_${item.poolType}`) ?? 0
        }
      })
        .sort((a: any, b: any) => b.defaultWeight - a.defaultWeight)
      setFilterList(_list);
    }
  }
  const onSearch = (value: string) => {
    // itemParams.likename = value
    // init()
    const list = tokenList.filter((item: any) => item.itemname.toLowerCase().indexOf(value) > -1
      || item.owneraddress.toLowerCase().indexOf(value) > -1);
    setFilterList(list);
  }
  const init = () => {
    // console.log(data)
    const tradePools = data.tradePools.map((item: any) => ({
      ...item,
      poolType: AUCTION_TYPE.FixedSwap
    })).filter((item: any) => item.state !== 1)
    const tradeAuctions = data.tradeAuctions.map((item: any) => ({
      ...item,
      price: item.lastestBidAmount !== '0' ? item.lastestBidAmount : item.amountMin1,
      poolType: AUCTION_TYPE.EnglishAuction
    }))
      .filter((item: any) => item.state !== 1 && item.poolId !== 0)

    const pools = tradePools.concat(tradeAuctions);
    const list = pools.map((item: any) => item.tokenId);
    // console.log(pools)
    setpools(pools)

      ; (async () => {
        try {
          const res = await request.post('/api/bouadmin/main/auth/getitemsbyfilter', {
            data: {
              ids: list,
              category: type,
              channel: '',
              // ...itemParams,
            }
          })
          if (res.code !== 1) {
            return setLoding2(false)
          }
          const _list = pools.map((pool: any) => {
            const itemInfo = res.data.find((item: any) => pool.tokenId === item.id);
            return {
              ...itemInfo,
              poolType: pool.poolType,
              poolId: pool.poolId,
              price: pool.price,
              createTime: pool.createTime,
              token1: pool.token1
            }
          })
            .filter((item: any) => item.fileurl)
            .sort((a: any, b: any) => b.createTime - a.createTime);
          // console.log(_list)
          setTokenList(_list);
          // setFilterList(_list);
          getPoolsWeight(pools, _list)
          setLoding2(false)
          // console.log('_list')
          // console.log(_list)
        } catch (error) {
          console.log(error)
          setLoding2(false)
        }

      })()
  }
  useEffect(() => {
    if (!loading) {
      init()
    }
  }, [loading])

  const menu = (
    <Menu>
      {coinList.map(e => (<Menu.Item key={e.value} onClick={() => setGetPollsVariables(e)}>{e.value}</Menu.Item>))}
    </Menu>
  );
  return <div>
    <Tabs defaultActiveKey="1">
      <TabPane tab="Fast movers" key="1">
        {/* <Dropdown overlay={menu} trigger={['click']}>
          <Button className={styles.dropdown} onClick={e => e.preventDefault()}>Coin: {getpollsVariables.value}</Button>
        </Dropdown> */}
        <Spin spinning={loading3} tip="Loading...">  
          <div style={{ width: 500 }}>
            <Search
              placeholder={intl.formatMessage({ id: 'component.input.searchPlaceholder' })}
              allowClear
              enterButton={intl.formatMessage({ id: 'component.input.search' })}
              size="large"
              onSearch={onSearch}
            />
          </div>
          <div style={{minHeight: 500}}>
            {
              filterList.map((item: ItemInterface, key: number) => {
                return <Item {...{ ...item, update: () => getPoolsWeight(pools, tokenList) }} key={`${item.poolId}_${item.poolType}`} />
              })
            }
          </div>
        </Spin>
    </TabPane>
      <TabPane tab="Name droppers" key="2">
        <BrandRow />
    </TabPane>
    </Tabs>
  </div>
}
interface ItemInterface {
  fileurl: string; price: string; token1: string; itemname: string; poolType: string; poolId: number; defaultWeight: number; standard: number
}
interface ItemProps extends ItemInterface{
  update: () => void
}
const Item = ({ fileurl, price, token1, itemname, poolType, poolId, defaultWeight, standard, update }: ItemProps) => {
  const [newPrice, setNewPrice] = useState('Loading Price ...')
  const onSearch = async (weight: string) => {
    // 数字校验
    console.log('update weight: ', weight)
    const res = await request.post('/api/bouadmin/main/auth/dealpoolinfo', { data: { poolid: poolId, weight: parseInt(weight), standard: getPoolTypeNumber(poolType) } })
    if (res.code === 1) {
      message.success('success')
      update()
    } else {
      message.error('error')
    }
  }
  useEffect(() => {
    getPriceByToken1(price, token1).then((e: string) => setNewPrice(e))
  }, [token1, price])
  return (<div className={"flex " + styles.itemRow}>
    <ImgFit src={fileurl} width={162} height={162} />
    <div className={styles.infoWrapper}>
      <div className="info_top">
        <span className={styles.itemName}>{itemname}</span>
      </div>
      <div className="info_bottom">
        <span className="type">{poolType === 'fixed-swap' ? 'Price' : 'Top Bid'}</span>
        <p className="cardId"># {poolId}</p>
        <span className="price">price: {newPrice}</span>
      </div>
    </div>
    <div className={'flex flex-center-y'}>
      <Search
        placeholder="input weight text"
        // allowClear
        enterButton={intl.formatMessage({ id: 'component.button.update'})}
        width={100}
        defaultValue={defaultWeight || '0'}
        className={styles.updateSearch}
        onSearch={onSearch}
      />
    </div>
  </div>)
}


type typeList = {
  fileurl: string;
  itemname: string;
  description: string;
  id: string;
  imgurl: string;
  brandname: string;
  owneraddress: string;
  created_at: string;
  updated_at: string;
  username: string;
  fullnam: string;
  accountaddress: string;
  popularweight: number;
  standard: number;
  ownername: string;
  contractaddress: string;
}

const defaultParams = {
  likename: ''
}
let params = JSON.parse(JSON.stringify(defaultParams))
const BrandRow = () => {
  const styles = barndStyles
  const onSearch = (value: string) => {
    params.likename = value
    init()
  }
  const [list, setlist] = useState<Array<typeList>>([])
  const [loading, setloading] = useState(true)

  const init = async () => {
    setloading(true)
    const res = await request.post('/api/bouadmin/main/auth/getbrandsbylikename', { data: params })
    if (res.code === 200 || res.code === 1) {
      const data = res.data.sort((a: typeList, b: typeList) => b.popularweight - a.popularweight)
      // console.log(res)
      setlist(data)
      setloading(false)
    } else {
      message.info('api fail')
    }
  }
  useEffect(() => {
    params = JSON.parse(JSON.stringify(defaultParams))
    init()
  }, [])

  const onUpdate = async (value: string, e: typeList) => {
    console.log(value, e)
    // TODO value filter

    confirm({
      title: 'Are you sure update this task?',
      icon: <ExclamationCircleOutlined />,
      content: `is update  brandname: ${e.brandname}, weight: ${value}`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      async onOk () {
        // console.log('OK');
        const res = await request.post(`/api/bouadmin/main/auth/updateweight`, { data: { id: e.id, popularweight: parseInt(value), standard: e.standard } })
        if (res.code === 200 || res.code === 1) {
          message.success('success')
          init()
        }
      },
      onCancel () {
        // message.info('Del Cancel')
      },
    });
  }
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
      
      <div className={styles.type_item}>
        <div className={styles.row}>
          {list.map((e, index) => <div key={index} className={[styles.item, 'flex'].join(' ')}>
            <div>
              <ImgFit src={e.imgurl} width={260} height={262} />
            </div>
            <div className={styles.content}>
              <p className={styles.itemname}>{e.brandname}</p>
              <p className={styles.description}>description: {e.description}</p>
              <p>id: {e.id}</p>
              <p>ownername: {e.ownername}</p>
              <p>contractaddress: {e.contractaddress}</p>
            </div>
            <div className={'flex flex-center-y'}>
              {/* <Button onClick={() => onUpdate(e)}><FormattedMessage id="component.button.update" /></Button> */}
              <Search
                placeholder="input weight text"
                // allowClear
                enterButton={intl.formatMessage({ id: 'component.button.update' })}
                width={100}
                defaultValue={e.popularweight || '0'}
                className={styles.updateSearch}
                onSearch={(value: string) => onUpdate(value, e)}
              />
            </div>
          </div>)}
          {list.length === 0 && <div className={styles.tablenull}><FormattedMessage id="component.table.null"></FormattedMessage> </div>}
        </div>
      </div>
    </Spin>
  </div>
}