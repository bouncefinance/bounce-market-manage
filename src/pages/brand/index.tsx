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
  Tag,
} from 'antd';
import React from 'react';
import { useRequest } from 'umi';
import request from 'umi-request';

const { Column } = Table;
const { Search } = Input;
const { confirm } = Modal;

import placeholderImg from '@/assets/images/placeholderImg.svg';
import { ExclamationCircleOutlined, StarFilled } from '@ant-design/icons';
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
const getRecommendBrands = function () {
  return request.post('[FGB_V2]/api/v2/main/getpopularbrands', {
    data: {
      accountaddress: '',
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

const Test: React.FC = () => {
  const {
    data: recommendBrands,
    // loading: recommendBrandsLoading,
    // refresh: brandRefresh,
  } = useRequest(() => {
    return getRecommendBrands();
  });

  //   console.log('recommendBrands: ', recommendBrands);

  // request brands
  const {
    data: brandData,
    loading: brandLoading,
    pagination: brandPagination,
    run: searchBrand,
    refresh: reloadBrand,
    tableProps: tableProps,
  } = useRequest(
    ({ pageSize: limit, current: offset }, searchText) =>
      getBrandsList(searchText, (offset - 1) * limit, limit), // Filter out brand which id = 10 and which id =11
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
        <Card>
          <Table {...tableProps}>
            <Column
              title="Image"
              dataIndex="imgurl"
              key="imgurl"
              width={110}
              align={'center'}
              render={(imgurl, record: IBrandInfo) => {
                console.log('record: ', record);
                return (
                  <Image
                    src={imgurl}
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
              render={(contractaddress, record) => {
                return (
                  <Tooltip placement="top" title={<span>{contractaddress}</span>}>
                    {`${contractaddress.slice(0, 6)}...${contractaddress.slice(-4)}`}
                  </Tooltip>
                );
              }}
            />

            <Column
              title="Ownner Name"
              dataIndex="ownername"
              key="ownername"
              width={130}
              align={'center'}
              render={(ownername, record) => {
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
              title="Ownner Address"
              dataIndex="owneraddress"
              key="owneraddress"
              align={'center'}
              render={(owneraddress, record) => {
                return (
                  <Tooltip placement="top" title={<span>{owneraddress}</span>}>
                    {`${owneraddress.slice(0, 6)}...${owneraddress.slice(-4)}`}
                  </Tooltip>
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
                  console.log(recommendBrand.id, record.id, recommendBrand.id === record.id);
                  return recommendBrand.id === record.id;
                }) ? (
                  <StarFilled style={{ color: '#f58220', fontSize: 20 }} />
                ) : (
                  <Button
                    danger
                    key="list-loadmore-delete"
                    disabled={
                      record.id === 10 ||
                      record.id === 11 ||
                      recommendBrands?.find((recommendBrand: IBrandInfo) => {
                        return recommendBrand.id === record.id;
                      })
                        ? true
                        : false
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

export default Test;
