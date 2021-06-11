import { StarOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, List, Image, Tag, Tabs, Input, Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useRequest } from 'umi';
import request from 'umi-request';

const { TabPane } = Tabs;
const { Search } = Input;

export interface IpoolItem {
  poolid: number;
  fileurl: string;
  likecount: number;
  pooltype: number; // 1: fixed swap, 2: English auction
  poolweight: number;
  price: string;
  state: number;
  token0: string;
  token1: string;
  tokenid: number;
  username: string;
  itemname: string;
  category: string;
  channel: string;
}

interface IBrandInfo {
  bandimgurl: string;
  brandname: string;
  brandsymbol: string;
  contractaddress: string;
  creator: string;
  description: string;
  id: number;
  imgurl: string;
  owneraddress: string;
  ownerimg: string;
  ownername: string;
  popularweight: number;
  standard: number;
  status: number;
}

const getBrandList = function (
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

const getPoolList = function (
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

// const getBrandList = function (offset: number, limit: number = 7, orderfield: 1 | 2 = 1) {
//   return request.post('[FGB_V2]/api/v2/main/getpoolsbylikename', {
//     data: {
//       limit,
//       offset,
//       orderfield,
//     },
//   });
// };

const handleDeleteItem = function (id: number) {
  return request.post('/api/bouadmin/main/auth/delitem', {
    data: {
      id,
    },
  });
};

const index: React.FC = () => {
  const [brandlikename, setBrandlikename] = useState('');

  const {
    data: itemData,
    loading: itemLoading,
    pagination: itemPagination,
    run: searchItem,
  } = useRequest(
    ({ pageSize: limit, current: offset }, searchText) => {
      console.log(limit, offset, searchText, '----------------');
      return getPoolList(searchText, (offset - 1) * limit, limit);
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
  } = useRequest(
    ({ pageSize: limit, current: offset }) =>
      getBrandList(brandlikename, (offset - 1) * limit, limit),
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
                bordered
                dataSource={itemData?.list}
                renderItem={(item: IpoolItem) => (
                  <List.Item
                    style={{ height: 82 }}
                    actions={[
                      <a key="list-loadmore-delete">Delete</a>,
                      <a key="list-loadmore-hide">Hide</a>,
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
                      title={<a>{item.itemname}</a>}
                      description={
                        <>
                          <Tag color="default">Pool Id: {item.poolid}</Tag>
                          <Tag color="default">Pool Type: {item.pooltype}</Tag>
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
              onSearch={() => {}}
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
                bordered
                dataSource={brandData?.list}
                renderItem={(item: IBrandInfo) => (
                  <List.Item
                    style={{ height: 82 }}
                    actions={[
                      <a key="list-loadmore-delete">Delete</a>,
                      <a key="list-loadmore-hide">Hide</a>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Image
                          src={item.imgurl}
                          width={70}
                          height={70}
                          style={{ objectFit: 'contain' }}
                        />
                      }
                      title={<a>{item.brandname}</a>}
                      description={
                        <>
                          <Tag color="default">Pool Id: {item.id}</Tag>
                          <Tag color="default">Creator: {item.creator}</Tag>
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
