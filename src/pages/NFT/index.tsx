import { ExclamationCircleOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, List, Image, Tag, Input, Space, message, Modal, Button, Tooltip } from 'antd';
import React from 'react';
import { useRequest } from 'umi';
import request from 'umi-request';

import placeholderImg from '@/assets/images/placeholderImg.svg';

const { Search } = Input;
const { confirm } = Modal;

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
  orderfield: 1 | 2 = 1,
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

  // requests items
  const {
    data: itemData,
    loading: itemLoading,
    pagination: itemPagination,
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
            <Card bordered={false}>
              <List
                loading={itemLoading}
                pagination={{
                  ...(itemPagination as any),
                  onShowSizeChange: itemPagination.onChange,
                  pageSize: 7,
                }}
                dataSource={itemData?.list}
                renderItem={(item: INftItem) => (
                  <List.Item
                    style={{ height: 78 }}
                    actions={[
                      <Button
                        key="list-loadmore-hide"
                        onClick={() => {
                          item.status === 0
                            ? handleHideItem(item.contractaddress, item.tokenid, 'hide', reloadItem)
                            : handleHideItem(
                                item.contractaddress,
                                item.tokenid,
                                'show',
                                reloadItem,
                              );
                        }}
                      >
                        {item.status === 0 ? 'Hide' : 'Show'}
                      </Button>,
                      <Button
                        danger
                        key="list-loadmore-delete"
                        onClick={() => {
                          handleDeleteItem(item.contractaddress, item.tokenid, reloadItem);
                        }}
                      >
                        Delete
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        item.category === 'video' ? (
                          <video src={item.fileurl} width={70} height={70} controls={false}></video>
                        ) : (
                          <Image
                            src={item.fileurl}
                            width={70}
                            height={70}
                            style={{ objectFit: 'contain' }}
                            placeholder={
                              <Image
                                preview={false}
                                src={placeholderImg}
                                width={70}
                                height={70}
                                style={{ background: 'white' }}
                              />
                            }
                          />
                        )
                      }
                      title={<span>{item.itemname}</span>}
                      description={
                        <>
                          <Tag color="default">Id: {item.id}</Tag>
                          <Tooltip placement="top" title={<span>{item.contractaddress}</span>}>
                            <Tag color="default">
                              Contract Address:{' '}
                              {`${item.contractaddress.slice(0, 6)}...${item.contractaddress.slice(
                                -4,
                              )}`}
                            </Tag>
                          </Tooltip>
                          {item.status === 1 ? <Tag color="warning">Hiden</Tag> : <></>}
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Space>
    </PageContainer>
  );
};

export default index;
