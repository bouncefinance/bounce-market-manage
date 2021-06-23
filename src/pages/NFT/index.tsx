import { PageContainer } from '@ant-design/pro-layout';
import {
  Card,
  Table,
  Button,
  Image,
  Tooltip,
  Switch,
  Input,
  Modal,
  message,
  Space,
} from 'antd';
import React from 'react';
import { useRequest } from 'umi';
import request from 'umi-request';

const { Column } = Table;
const { Search } = Input;
const { confirm } = Modal;

import placeholderImg from '@/assets/images/placeholderImg.svg';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface INftItem {
  artistpoolweight: number;
  category: string;
  channel: string;
  contractaddress: string;
  created_at: string;
  creator: string;
  description: string;
  externallink: string;
  fileurl: string;
  id: number;
  itemname: string;
  itemsymbol: string;
  likecount: number;
  litimgurl: string;
  metadata: string;
  poolweight: number;
  popularweight: number;
  standard: number;
  status: number;
  supply: number;
  tokenid: number;
  updated_at: string;
}

const getPoolsList = function (
  likename: string = '',
  offset: number,
  limit: number = 7,
) {
  return request.post('/api/bouadmin/main/auth/getpoolsbylikename', {
    data: {
      likename,
      limit,
      offset,
    },
  });
};

const handleDeleteItem = async function (
  contractaddress: string,
  tokenid: number,
  reload: () => void,
) {
  const deleteItem = async (contractaddress: string, tokenid: number) => {
    const res = await request.post('/api/bouadmin/main/auth/delpoolitem', {
      data: {
        contractaddress,
        tokenid,
      },
    });
    if (res.code === 1) {
      message.success('Deleted successfully');
    } else {
      message.error('Delete failed');
    }
  };

  confirm({
    // title: 'Delete',
    icon: <ExclamationCircleOutlined />,
    title: 'Do you Want to delete this item?',
    onOk() {
      deleteItem(contractaddress, tokenid).then(() => {
        reload();
      });
    },
    onCancel() {},
  });
};

const handleHideItem = async function (
  contractaddress: string,
  tokenid: number,
  actionType: 'hide' | 'show',
  reload: () => void,
) {
  const status = actionType === 'hide' ? 1 : 0;

  const hideItem = async (
    contractaddress: string,
    tokenid: number,
    actionType: 'hide' | 'show',
  ) => {
    const res = await request.post('/api/bouadmin/main/auth/updatepoolitem', {
      data: {
        contractaddress,
        tokenid,
        status, // status: 1:to hide, 2:to show
      },
    });
    if (res.code === 1) {
      actionType === 'hide'
        ? message.success('Hide successfully')
        : message.success('Show successfully');
    } else {
      actionType === 'hide' ? message.error('Failed to hide') : message.error('Failed to show');
    }
  };

  confirm({
    // title: 'Delete',
    icon: <ExclamationCircleOutlined />,
    title: `Do you Want to ${actionType} this item?`,
    onOk() {
      hideItem(contractaddress, tokenid, actionType).then(() => {
        reload();
      });
    },
    onCancel() {},
  });
};

const index: React.FC = () => {

  const {
    // data: itemData,
    // loading: itemLoading,
    // pagination: itemPagination,
    // params: itemParams,
    tableProps: itemProps,
    run: searchItem,
    refresh: reloadItem,
  } = useRequest(
    ({ pageSize: limit, current: offset }, searchText) => {
      return getPoolsList(searchText, (offset - 1) * limit, limit);
    },
    {
      paginated: true,
      cacheKey: 'items',
      defaultParams: [{ pageSize: 7, current: 1 }],
      formatResult(data: any) {
        return {
          list: data.data,
          total: data.total,
        };
      },
    },
  );

  return (
    <PageContainer>
      <Space direction={'vertical'} style={{ width: '100%' }}>
        <Search
          placeholder="input search text"
          allowClear
          onSearch={(value) => searchItem({ current: 1, pageSize: 7 }, value)}
          style={{ width: '75%' }}
          size="middle"
        />
        <Card>

          <Table {...itemProps}>
            <Column
              title="Image"
              dataIndex="fileurl"
              key="fileurl"
              width={110}
              align={'center'}
              render={(fileurl, record: INftItem) => {
                console.log('record: ', record);
                return record?.category === 'image' ? (
                  <Image
                    src={fileurl}
                    style={{ objectFit: 'contain' }}
                    width={64}
                    height={64}
                    placeholder={
                      <Image
                        preview={false}
                        src={placeholderImg}
                        width={64}
                        height={64}
                        style={{ background: 'white' }}
                      />
                    }
                  />
                ) : (
                  <video src={fileurl} width={70} height={70} controls={false} />
                );
              }}
            />

            <Column
              title="Name"
              dataIndex="itemname"
              key="itemname"
              align={'center'}
              ellipsis={{ showTitle: false }}
              render={(itemname) => {
                return (
                  <Tooltip placement="topLeft" title={itemname}>
                    {itemname}
                  </Tooltip>
                );
              }}
            />

            <Column title="Id" dataIndex="id" key="id" width={110}
              align={'center'} />

            <Column
              title="Contract Address"
              dataIndex="contractaddress"
              key="contractaddress"
              align={'center'}
              render={(contractaddress, record) => {
                return (
                  <Tooltip placement="top" title={<span>{contractaddress}</span>}>
                    {`${contractaddress.slice(0, 6)}...${contractaddress.slice(-4)}`}
                  </Tooltip>
                );
              }}
            />

            <Column
              title="Hide Creation"
              key="hide"
              width={110}
              align={'center'}
              render={(record: INftItem) => (
                <Switch
                  checked={record.status === 1 ? true : false}
                  checkedChildren="Hide"
                  unCheckedChildren="Show"
                  onChange={(checked: boolean) => {
                    checked
                      ? handleHideItem(record.contractaddress, record.tokenid, 'hide', reloadItem)
                      : handleHideItem(record.contractaddress, record.tokenid, 'show', reloadItem);
                  }}
                />
              )}
            />

            <Column
              title="Disable"
              key="disable"
              width={110}
              align={'center'}
              render={(record: INftItem) => (
                <Button
                  danger
                  key="list-loadmore-delete"
                  onClick={() => {
                    handleDeleteItem(record.contractaddress, record.tokenid, reloadItem);
                  }}
                >
                  Delete
                </Button>
              )}
            />
          </Table>
        </Card>
      </Space>
    </PageContainer>
  );
};

export default index;
