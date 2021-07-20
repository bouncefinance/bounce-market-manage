import { PageContainer } from '@ant-design/pro-layout';
import { Card, Table, Button, Tooltip, Input, Modal, message, Space, Select } from 'antd';
import React, { useState } from 'react';
import { useRequest } from 'umi';
import request from 'umi-request';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CopyOutlined, ExclamationCircleOutlined, StarFilled } from '@ant-design/icons';
import Image from '@/components/Image';
import { Apis } from '@/services';
import { RECOMMEND_BRANDS_AMOUNT } from '@/tools/const';

const { Column } = Table;
const { Search } = Input;
const { confirm } = Modal;
const { Option } = Select;

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

// get brands weight
const getRecommendBrands = () => {
  return request.post(Apis.getbrandsbylikename, {
    data: {
      offset: 0,
      limit: RECOMMEND_BRANDS_AMOUNT,
    },
  });
};

const getBrandsListByFilter = (
  filterType: 'likestr' | 'creator' | 'brandid' = 'likestr',
  searchText: string = '',
  offset: number,
  limit: number = 7,
) => {
  let filter;
  let data;
  switch (filterType) {
    case 'likestr':
      filter = 1;
      data = {
        filter,
        likestr: searchText,
        limit,
        offset,
      };
      break;

    case 'creator':
      filter = 2;
      data = {
        filter,
        creator: searchText,
        limit,
        offset,
      };
      break;

    case 'brandid':
      filter = 3;
      data = {
        filter,
        brandid: Number(searchText),
        limit,
        offset,
      };
      break;

    default:
      filter = 1;
      data = {
        filter,
        likestr: searchText,
        limit,
        offset,
      };
      break;
  }

  return request.post(Apis.getbrandsbylikename, {
    data,
  });
};

const handleDeleteBrand = async (id: number, reload: () => void) => {
  const deleteBrand = async (_id: number) => {
    const res = await request.post(Apis.delbrand, {
      data: {
        _id,
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

const NFT: React.FC = () => {
  const [brandSearchType, setBrandSearchType] = useState<'likestr' | 'creator' | 'brandid'>(
    'likestr',
  );

  const {
    data: recommendBrands,
    // loading: recommendBrandsLoading,
    // refresh: brandRefresh,
  } = useRequest(() => {
    return getRecommendBrands();
  });

  const {
    // data: brandData,
    // loading: brandLoading,
    // pagination: brandPagination,
    tableProps: brandTableProps,
    run: searchBrand,
    refresh: reloadBrand,
  } = useRequest(
    ({ pageSize: limit, current: offset }, searchText) =>
      getBrandsListByFilter(brandSearchType, searchText, (offset - 1) * limit, limit), // Filter out brand which id = 10 and which id =11
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

  return (
    <PageContainer>
      <Space direction={'vertical'} style={{ width: '100%' }}>
        <Input.Group>
          <Select
            defaultValue="likestr"
            onChange={(value) => {
              setBrandSearchType(value);
            }}
          >
            <Option value="likestr">Brand Name</Option>
            <Option value="creator">Creator Address</Option>
            <Option value="brandid">Brand ID</Option>
          </Select>
          <Search
            placeholder="input search text"
            allowClear
            onSearch={(value) => {
              searchBrand({ current: 1, pageSize: 7 }, value);
            }}
            style={{ width: '75%' }}
            size="middle"
          />
        </Input.Group>
        <Card>
          <Table rowKey="id" {...brandTableProps}>
            <Column
              title="Image"
              dataIndex="imgurl"
              key="imgurl"
              width={110}
              align={'center'}
              render={(imgurl) => {
                return (
                  <Image src={imgurl} style={{ objectFit: 'contain' }} width={64} height={64} />
                );
              }}
            />

            <Column
              title="Brand Name"
              dataIndex="brandname"
              key="brandname"
              align={'center'}
              ellipsis={{ showTitle: false }}
              render={(brandname) => {
                return (
                  <Tooltip placement="topLeft" title={brandname}>
                    {brandname}
                  </Tooltip>
                );
              }}
            />

            <Column title="Id" dataIndex="id" key="id" width={110} align={'center'} />

            <Column
              title="Contract Address"
              dataIndex="contractaddress"
              key="contractaddress"
              align={'center'}
              render={(contractaddress) => {
                return (
                  <Space>
                    <Tooltip placement="top" title={<span>{contractaddress}</span>}>
                      {`${contractaddress.slice(0, 6)}...${contractaddress.slice(-4)}`}
                    </Tooltip>
                    <Tooltip placement="top" title={'Copy'}>
                      <CopyToClipboard text={contractaddress}>
                        <CopyOutlined />
                      </CopyToClipboard>
                    </Tooltip>
                  </Space>
                );
              }}
            />

            <Column
              title="Creator Name"
              dataIndex="ownername"
              key="ownername"
              width={130}
              align={'center'}
              render={(ownername) => {
                return ownername ? (
                  <Tooltip placement="top" title={<span>{ownername}</span>}>
                    {ownername}
                  </Tooltip>
                ) : (
                  '--'
                );
              }}
            />

            <Column
              title="Creator Address"
              dataIndex="owneraddress"
              key="owneraddress"
              align={'center'}
              render={(owneraddress) => {
                return (
                  <Space>
                    <Tooltip placement="top" title={<span>{owneraddress}</span>}>
                      {`${owneraddress.slice(0, 6)}...${owneraddress.slice(-4)}`}
                    </Tooltip>
                    <Tooltip placement="top" title={'Copy'}>
                      <CopyToClipboard text={owneraddress}>
                        <CopyOutlined />
                      </CopyToClipboard>
                    </Tooltip>
                  </Space>
                );
              }}
            />

            <Column
              title="Delete"
              key="delete"
              width={110}
              align={'center'}
              render={(record: IBrandInfo) => {
                return recommendBrands?.find((recommendBrand: IBrandInfo) => {
                  // console.log(recommendBrand.id, record.id, recommendBrand.id === record.id);
                  return recommendBrand.id === record.id;
                }) ? (
                  <StarFilled style={{ color: '#f58220', fontSize: 20 }} />
                ) : (
                  <Button
                    danger
                    key="list-loadmore-delete"
                    disabled={
                      !!(
                        record.id === 10 ||
                        record.id === 11 ||
                        recommendBrands?.find((recommendBrand: IBrandInfo) => {
                          return recommendBrand.id === record.id;
                        })
                      )
                    }
                    onClick={() => {
                      handleDeleteBrand(record.id, reloadBrand);
                    }}
                  >
                    Delete
                  </Button>
                );
              }}
            />
          </Table>
        </Card>
      </Space>
    </PageContainer>
  );
};

export default NFT;
