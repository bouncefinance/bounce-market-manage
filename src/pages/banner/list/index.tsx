import { useCallback, useEffect, useState } from 'react';
import { Form, Input, Button, Checkbox, Card, message, Spin, Table, Modal } from 'antd';
import request from 'umi-request';
import { FormattedMessage, Link, useHistory } from 'umi'
import { ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;

export default () => {
  const history = useHistory()
  const [data, stedata] = useState<bannerList>([])
  const [pagination] = useState({ current: 1, pageSize: 10, })
  const [bannerLoding, setbannerLoding] = useState(false)
  const [delLoding, setDekLoding] = useState(false)
  const initBannerList = async () => {
    setbannerLoding(true)
    const res = await request.get('/api/bouadmin/main/auth/allbanners', {})
    setbannerLoding(false)
    if (res.code === 1) {
      stedata(res.data)
    }
  }
  const handleTableChange = useCallback((pagination, filters, sorter) => {
    console.log(pagination, filters, sorter)
  }, [])
  useEffect(() => {
    initBannerList()
  }, [])
  return <Card title={'List'} bordered={false} style={{ width: '100%' }} extra={<Button type="primary" onClick={() => history.push('/banner/add')}>ADD</Button>}>
      <Table
        columns={columns(() => initBannerList(), delLoding, setDekLoding)}
        rowKey={record => record.id}
        dataSource={data}
        pagination={pagination}
        loading={bannerLoding}
        onChange={handleTableChange}
      />
    </Card>
}

const columns = (update: () => void, delLoding: boolean, setDekLoding: (delLoding: boolean) => void) => [
  {
    title: 'title',
    dataIndex: 'title',
  },
  {
    title: 'subhead',
    dataIndex: 'subhead',
  },
  {
    title: 'artistaddress',
    dataIndex: 'artistaddress',
  },
  {
    title: intl.formatMessage({ id: 'component.handle' }),
    dataIndex: 'id',
    render: (value: string, record: bannerItem, index: number) => <><Button
      loading={delLoding}
      onClick={async () => {
        confirm({
          title: '',
          icon: <ExclamationCircleOutlined />,
          content: `Are you del this banner?`,
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          async onOk () {
            setDekLoding(true)
            const res = await request.post('/api/bouadmin/main/auth/delbanner', {
              data: { id: value, }
            })
            setDekLoding(false)
            if (res.code === 1) {
              message.success('success')
              update()
            } else {
              message.error(res.meg || 'error')
            }
          },
          onCancel () {
            // message.info('Del Cancel')
          },
        })
        
      }}
    >{intl.formatMessage({ id: 'component.button.del' })}</Button>
    <Button style={{ marginLeft: '15px' }}>
      <Link to={`/banner/add/${value}`}>
        <FormattedMessage id="component.button.update" />
      </Link>
    </Button>
    </>,
  },
]

interface bannerItem {
  id: number;
  artistaddress: string;
  subhead: string;
  title: string
}
type bannerList = Array<bannerItem>

// { id: 1, title: 'xxx', subhead: 'subhead', artistaddress: 'artistaddress' }