import styles from './_nftHandle.less'
import { Input, Pagination, Spin, Button, Modal, message } from 'antd'
import { NFTCheckStatus } from './type';
import { useEffect, useState } from 'react';
import request from 'umi-request';
import { ImgFit } from '@/components/ImgFit';
const { Search } = Input
import { FormattedMessage } from 'umi';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

function showTotal (total: number) {
  return `Total ${total} items`;
}
interface INFTCheckHandle {
  type: NFTCheckStatus,
  tabType: NFTCheckStatus,
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
}

// TODO 分页
const defaultParams = {
  likename: ''
}
let params = JSON.parse(JSON.stringify(defaultParams))
// const testData = [{"id":16780,"brandid":6,"contractaddress":"0x7AD22017907F1313A9Cb3Bee8de64f1994cB827a","metadata":"","category":"image","channel":"Fine Arts","itemsymbol":"","standard":2,"itemname":"rouyuan","externallink":"","description":"a cat","fileurl":"https://market-test.bounce.finance/jpgfileget/微信图片_20210324113102-1616556820.jpg","properties":"","levels":"","stats":"","unlockablecontent":0,"supply":3,"ownername":"","owneraddress":"0x344ddf5a03afe67543fb23c674c6797599a0a507","price":"","status":1,"popularweight":0,"created_at":"2021-03-24T03:33:40Z","updated_at":"2021-03-24T03:33:40Z"}]

export default function NFTCheckHandle ({ type, tabType }: INFTCheckHandle) {
  const onSearch = (value: string) => {
    params.likename = value
    init()
  }
  const [list, setlist] = useState<Array<typeList>>([])
  const [loading, setloading] = useState(true)

  const init = async () => {
      setloading(true)
    const res = await request.post(`/api/bouadmin/main/auth/${
      type === 'item' ? 'getitemsbylikename' :
      type === 'brand' ? 'getbrandsbylikename' :
      type === 'account' ? 'getaccountsbylikename' :
    ''}`, { data: params })
    if(res.code === 200 || res.code === 1){
      const data = res.data
      // console.log(res)
      setlist(data)
      setloading(false)
    }else{
      message.info('api fail')
    }
  }
  useEffect(() => {
    // const init = async () => {
    //   // const res = await request.post('/api/v2/main/auth/xxx', { data: { accountaddress: "xx" } })
    //   await new Promise((ok) => setTimeout(ok, 500))
    //   setloading(false)
    // }
    params =  JSON.parse(JSON.stringify(defaultParams))
    type === tabType && init()
  }, [tabType])

  const onDel = async (e: typeList) => {
    // console.log(type, e)
    confirm({
    title: 'Are you sure delete this task?',
    icon: <ExclamationCircleOutlined />,
    content: 'is del ' + type,
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'No',
    async onOk() {
      // console.log('OK');
      const res = await request.post(`/api/bouadmin/main/auth/del${type}`, {data: {id: e.id}})
      if(res.code === 200 || res.code === 1){
        message.success('Del success')
      }
    },
    onCancel() {
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
      {type === 'item' && <div className={styles.type_item}>
        <div className={styles.row}>
          {list.map((e, index) => <div key={index} className={[styles.item, 'flex'].join(' ')}>
            <div>
              <ImgFit src={e.fileurl} width={260} height={262} />
            </div>
            <div className={styles.content}>
              <p className={styles.itemname}>{e.itemname}</p>
              <p className={styles.description}>{e.description}</p>
              <p className={styles.infoText}><em>owneraddress:</em> {e.owneraddress}</p>
              <p className={styles.infoText}><em>created_at:</em> {e.created_at}</p>
              <p className={styles.infoText}><em>updated_at:</em> {e.updated_at}</p>
            </div>
            <div className={'flex flex-center-y'}>
              <Button onClick={() => onDel(e)}><FormattedMessage id="component.button.del" /></Button>
            </div>
          </div>)}
          {list.length === 0 && <div className={styles.tablenull}><FormattedMessage id="component.table.null"></FormattedMessage> </div>}
        </div>
      </div>}
      {type === 'brand' && <div className={styles.type_item}>
        <div className={styles.row}>
          {list.map((e, index) => <div key={index} className={[styles.item, 'flex'].join(' ')}>
            <div>
              <ImgFit src={e.imgurl} width={260} height={262} />
            </div>
            <div className={styles.content}>
              <p className={styles.itemname}>{e.brandname}</p>
              <p className={styles.description}>{e.description}</p>
            </div>
            <div className={'flex flex-center-y'}>
              <Button onClick={() => onDel(e)}><FormattedMessage id="component.button.del" /></Button>
            </div>
          </div>)}
          {list.length === 0 && <div className={styles.tablenull}><FormattedMessage id="component.table.null"></FormattedMessage> </div>}
        </div>
      </div>}
      {type === 'account' && <div className={styles.type_item}>
        <div className={styles.row}>
          {list.map((e, index) => <div key={index} className={[styles.item, 'flex'].join(' ')}>
            <div>
              <ImgFit src={e.imgurl} width={260} height={262} />
            </div>
            <div className={styles.content}>
              <p className={styles.itemname}>{e.username}</p>
              <p className={styles.description}>{e.fullnam}</p>
              <p className={styles.infoText}><em>accountaddress:</em> {e.accountaddress}</p>
              <p className={styles.infoText}><em>created_at:</em> {e.created_at}</p>
            </div>
            <div className={'flex flex-center-y'}>
              <Button onClick={() => onDel(e)}><FormattedMessage id="component.button.del" /></Button>
            </div>
          </div>)}
          {list.length === 0 && <div className={styles.tablenull}><FormattedMessage id="component.table.null"></FormattedMessage> </div>}
        </div>
      </div>}
    </Spin>
    {/* <Pagination
      size="small"
      total={50}
      disabled={false}
      showTotal={showTotal}
      showSizeChanger
      showQuickJumper
    /> */}
  </div>
}