import { ExclamationCircleOutlined, StarOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, List, Image, Tag, Tabs, Input, Space, message, Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useRequest } from 'umi';
import request from 'umi-request';

const { TabPane } = Tabs;
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

interface IBrandInfo {
  auditor: string;
  bandimgurl: string;
  brandname: string;
  brandsymbol: string;
  contractaddress: string;
  created_at: string;
  description: string;
  faildesc: string;
  id: number;
  imgurl: string;
  owneraddress: string;
  ownername: string;
  popularweight: number;
  standard: number;
  status: number;
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

const getBrandsList = function (
  likename: string = '',
  offset: number,
  limit: number = 7,
  orderfield: 1 | 2 = 1,
) {
  return request.post('/api/bouadmin/main/auth/getbrandsbylikename', {
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

const handleDeleteBrand = async function (id: number, reload: () => void) {
  const deleteBrand = async (id: number) => {
    const res = await request.post('/api/bouadmin/main/auth/delbrand', {
      data: {
        id,
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
    title: 'Do you Want to delete this brand?',
    onOk() {
      deleteBrand(id).then(() => {
        reload();
      });
    },
    onCancel() {},
  });
};

const handleHideBrand = async function (
  tokenid: number,
  actionType: 'hide' | 'show',
  reload: () => void,
) {
  const status = actionType === 'hide' ? 1 : 0;

  const hideBrand = async (id: number, actionType: 'hide' | 'show') => {
    const res = await request.post('/api/bouadmin/main/auth/updatebrandstatus', {
      data: {
        id,
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
    title: `Do you Want to ${actionType} this Brand?`,
    onOk() {
      hideBrand(tokenid, actionType).then(() => {
        reload();
      });
    },
    onCancel() {},
  });
};

const index: React.FC = () => {
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

  const {
    data: brandData,
    loading: brandLoading,
    pagination: brandPagination,
    run: searchBrand,
    refresh: reloadBrand,
  } = useRequest(
    ({ pageSize: limit, current: offset }, searchText) =>
      getBrandsList(searchText, (offset - 1) * limit, limit),
    {
      paginated: true,
      cacheKey: 'brands',
      defaultParams: [{ pageSize: 7, current: 1 }],
      formatResult(data: any) {
        return {
          list: data.data,
          total: data.total,
        };
      },
    },
  );

  // console.log(brandData, '<<<<<<<<<<<<<<<');

  return (
    <PageContainer>
      <Tabs
        defaultActiveKey="1"
        // onChange={(key) => {
        //   setCurrentTabKey(key);
        // }}
      >
        <TabPane tab="Item" key="1">
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
                    style={{ height: 82 }}
                    actions={[
                      <a
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
                      </a>,
                      <a
                        style={{ color: 'red' }}
                        key="list-loadmore-delete"
                        onClick={() => {
                          handleDeleteItem(item.contractaddress, item.tokenid, reloadItem);
                        }}
                      >
                        Delete
                      </a>,
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
                          />
                        )
                      }
                      title={<span>{item.itemname}</span>}
                      description={
                        <>
                          <Tag color="default">Id: {item.id}</Tag>
                          <Tag color="default">Contract Address: {`${item.contractaddress.slice(0, 6)}...${item.contractaddress.slice(-4)}`}</Tag>
                          {item.status === 1 ? <Tag color="warning">Hiding</Tag> : <></>}
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Space>
        </TabPane>

        <TabPane tab="Brand" key="2">
          <Space direction={'vertical'} style={{ width: '100%' }}>
            <Search
              placeholder="input search text"
              allowClear
              onSearch={(value) => {
                searchBrand({ current: 1, pageSize: 7 }, value);
              }}
              style={{ width: '75%' }}
              size="middle"
            />
            <Card bordered={false}>
              <List
                loading={brandLoading}
                pagination={{
                  ...(brandPagination as any),
                  onShowSizeChange: brandPagination.onChange,
                  pageSize: 7,
                }}
                dataSource={brandData?.list}
                renderItem={(brand: IBrandInfo) => (
                  <List.Item
                    style={{ height: 82 }}
                    actions={[
                      <a
                        key="list-loadmore-hide"
                        onClick={() => {
                          brand.status === 0
                            ? handleHideBrand(brand.id, 'hide', reloadBrand)
                            : handleHideBrand(brand.id, 'show', reloadBrand);
                        }}
                      >
                        {brand.status === 0 ? 'Hide' : 'Show'}
                      </a>,
                      <a
                        style={{ color: 'red' }}
                        key="list-loadmore-delete"
                        onClick={() => {
                          handleDeleteBrand(brand.id, reloadBrand);
                        }}
                      >
                        Delete
                      </a>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Image
                          src={brand.imgurl}
                          width={70}
                          height={70}
                          style={{ objectFit: 'contain' }}
                        />
                      }
                      title={<span>{brand.brandname}</span>}
                      description={
                        <>
                          <Tag color="default">Pool Id: {brand.id}</Tag>
                          <Tag color="default">Contract Address: {`${brand.contractaddress.slice(0, 6)}...${brand.contractaddress.slice(-4)}`}</Tag>
                          <Tag color="default">Owner Address: {`${brand.owneraddress.slice(0, 6)}...${brand.owneraddress.slice(-4)}`}</Tag>
                          {brand.status === 1 ? <Tag color="warning">Hiding</Tag> : <></>}
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Space>
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};

export default index;
