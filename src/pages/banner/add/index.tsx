import { QueryAirMarketTradePools, QueryMarketTradePools } from '@/tools/apollo';
import { getPoolTypeNumber, getTradeList } from '@/tools/pools';
import { useQuery } from '@apollo/client';
import { Form, Input, Button, Checkbox, Card, message, Spin, Table } from 'antd';
import { ImgFit } from '@/components/ImgFit';
import { useCallback, useEffect, useState } from 'react';
import homeStyles from '../../homeManager/index.less'
import request from 'umi-request';
import { FormattedMessage, useHistory } from 'umi'
const { Search } = Input

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default () => {
  const history = useHistory()
  const [variables, setVariables] = useState({ creator: '' })
  const [nftLoding, setNftLoding] = useState(false)
  const [submitLoding, setSubmitLoding] = useState(false)
  const [tradeList, setTradeList] = useState <tradeList>([])
  const [pagination] = useState({ current: 1, pageSize: 10, })
  const { loading, error, data, refetch } = useQuery(QueryAirMarketTradePools, {
    variables: variables,
    skip: !variables.creator
  })
  const onFinish = async (data: { artistaddress: string; subhead: string; title: string}) => {
    setSubmitLoding(true)
    const res = await request.post('/api/bouadmin/main/auth/dealbanner', { data })
    if (res.code === 1) {
      message.success('success')
      history.goBack()
    } else {
      message.error('fail')
      setSubmitLoding(false)
    }
  }

  const onFinishFailed = (errorInfo: any) => {
  }
  const onSearch = (v: string) => {
    if (!v) {
      return
    }
    if (v.substring(0, 2) !== '0x') {
      return message.error('error address')
    }
    setNftLoding(true)
    setVariables({ ...variables, creator: v})
  }

  // poolsToTradeList
  const initTradeList = async (data: any) => {
    const list: tradeList = await getTradeList(data, 'artistpoolweight') ?? []
    // console.log(list)
    setNftLoding(false)
    setTradeList(list)
  }
  useEffect(() => {
    if (loading) {
      return
    }
    console.log(data)
    if (!data) {
      return
    }
    initTradeList(data)
  }, [loading])
  const handleTableChange = useCallback((pagination, filters, sorter) => {
    // TODO
    console.log(pagination, filters, sorter)
  }, [])

  return <div>
    <Card title={intl.formatMessage({ id: 'pages.banner.add.titleText'})} bordered={false} style={{ width: '100%' }}>
      <Form
        {...layout}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        labelCol={{ span: 4 }}
      >
        <Card title={intl.formatMessage({ id: 'pages.banner.add.BaseInfo' })} bordered={false} style={{ width: '100%' }}>
          <Form.Item name="title" label={intl.formatMessage({ id: 'pages.banner.add.baseInfoTitle' })} rules={[{ required: true, message: 'Please input this title!' }]} >
            <Input />
          </Form.Item>
          <Form.Item name="subhead" label={intl.formatMessage({ id: 'pages.banner.add.baseInfoSubtitle' })} rules={[{ required: true, message: 'Please input this subtitle!' }]} >
            <Input />
          </Form.Item>
          <Form.Item name="artistaddress" label={intl.formatMessage({ id: 'pages.banner.add.baseInfoAirAddress' })} rules={[{ required: true, message: 'Please input this Air Address!' }]} >
            <Search
              placeholder={'Please input Air NFT'}
              allowClear
              enterButton={intl.formatMessage({ id: 'pages.banner.add.SearchAirNft'})}
              size="large"
              onSearch={onSearch}
              loading={nftLoding}
            />
        </Form.Item>
        </Card>
        <Card title={intl.formatMessage({ id: 'pages.banner.add.setAirNftWeight' })} bordered={false} style={{ width: '100%' }}>
          <Spin tip="await loading NFTs" spinning={nftLoding}>
            <Table
              columns={columns(() => initTradeList(data) )}
              rowKey={record => record.poolId}
              dataSource={tradeList}
              pagination={pagination}
              loading={nftLoding}
              onChange={handleTableChange}
            />
          </Spin>
        </Card>
        <Form.Item {...tailLayout}>
          <Button loading={submitLoding} type="primary" htmlType="submit">
            <FormattedMessage id="pages.banner.add.submit" />
          </Button>
        </Form.Item>
      </Form>
    </Card>
  </div>
}

const columns = (update: () => void) => [
  {
    title: 'fileurl',
    dataIndex: 'fileurl',
    render: (item: string) => <ImgFit src={item} width={200} height={200} />,
  },
  {
    title: 'itemname',
    dataIndex: 'itemname',
  },
  {
    title: 'poolId',
    dataIndex: 'poolId',
  },
  {
    title: 'status',
    dataIndex: 'status',
  },
  {
    title: 'poolType',
    dataIndex: 'poolType',
  },
  {
    title: 'price',
    dataIndex: 'price',
  }, {
    title: 'defaultWeight',
    dataIndex: 'defaultWeight',
    render: (sort: string, record: tradeItem, index: number) => <Search
      placeholder="input weight text"
      // allowClear
      enterButton={intl.formatMessage({ id: 'component.button.update' })}
      width={100}
      defaultValue={sort || '0'}
      className={homeStyles.updateSearch}
      onSearch={async (weight) => {
        console.log('update weight: ', weight, record, index, )
        const res = await request.post('/api/bouadmin/main/auth/dealartistpoolinfo', {
          data: {
            poolid: record.poolId,
            artistpoolweight: parseInt(weight),
            standard: getPoolTypeNumber(record.poolType)
          }
        })
        if (res.code === 1) {
          message.success('success')
          update()
        } else {
          message.error('error')
        }
      }}
    />,
    // width: '20%',
  },
]

interface tradeItem {
  id: number;
  brandid: number;
  contractaddress: string;
  metadata: string;
  category: string;
  channel: string;
  itemsymbol: string;
  standard: number;
  itemname: string;
  externallink: string;
  description: string;
  fileurl: string;
  properties: string;
  levels: string;
  stats: string;
  unlockablecontent: number;
  supply: number;
  ownername: string;
  owneraddress: string;
  price: string;
  status: number;
  popularweight: number;
  created_at: Date;
  updated_at: Date;
  poolType: string;
  poolId: number;
  createTime: number;
  token1: string;
  defaultWeight: number;
}
type tradeList = Array<tradeItem>


// 0x891aab34cc082c0c7325c1349a2f9b815a4ad4a6