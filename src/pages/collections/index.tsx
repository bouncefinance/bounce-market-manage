import { PageContainer } from '@ant-design/pro-layout';
import { Card, Table, Button, Tooltip, Input, Modal, message, Space, Select, Tag } from 'antd';
import React, { useState } from 'react';
import { Link, useRequest } from 'umi';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CopyOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import Image from '@/components/Image';
import type { BrandFilterType, IBrandResponse } from '@/services/brand/types';
import { BrandFilterEnum } from '@/services/brand/types';
import { deleteBrand, getBrandsListByFilter, getRecommendBrands } from '@/services/brand';

const { Column } = Table;
const { Search } = Input;
const { confirm } = Modal;
const { Option } = Select;

const handleDeleteBrand = async (id: number, reload: () => void) => {
  confirm({
    // title: 'Delete',
    icon: <ExclamationCircleOutlined />,
    title: 'Are you sure you want to delete this brand?',
    onOk() {
      deleteBrand({ id }).then((res) => {
        if (res.code === 1) {
          message.success('Deleted successfully');
          reload();
        } else {
          message.error('Delete failed');
        }
      });
    },
    onCancel() {},
  });
};

const CollectionPage: React.FC = () => {
  const [brandSearchType, setBrandSearchType] = useState<BrandFilterType>(BrandFilterEnum.likestr);

  const { data: recommendBrands } = useRequest(() => getRecommendBrands());

  const {
    tableProps: brandTableProps,
    run: searchBrand,
    refresh: reloadBrand,
  } = useRequest(
    ({ pageSize: limit, current: offset }, searchText) =>
      getBrandsListByFilter(brandSearchType, searchText, (offset - 1) * limit, limit),
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
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Input.Group style={{ display: 'flex' }}>
            <Select
              defaultValue={BrandFilterEnum.likestr}
              onChange={(value) => {
                setBrandSearchType(value);
              }}
            >
              <Option value={BrandFilterEnum.likestr}>Brand Name</Option>
              <Option value={BrandFilterEnum.creator}>Creator Address</Option>
              <Option value={BrandFilterEnum.brandid}>Brand ID</Option>
            </Select>
            <Search
              placeholder="input search text"
              allowClear
              onSearch={(value) => {
                searchBrand({ current: 1, pageSize: 7 }, value);
              }}
              style={{ width: 400 }}
              size="middle"
            />
          </Input.Group>

          <Link to="/collection/edit">
            <Button>Add</Button>
          </Link>
        </Space>

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
              render={(record: IBrandResponse) => {
                return recommendBrands?.find((recommendBrand: IBrandResponse) => {
                  return recommendBrand.id === record.id && record.popularweight >= 10000;
                }) ? (
                  <Tag color="gold">Recommending</Tag>
                ) : (
                  <Button
                    danger
                    key="list-loadmore-delete"
                    disabled={
                      !!(
                        record.id === 10 ||
                        record.id === 11 ||
                        recommendBrands?.find((recommendBrand: IBrandResponse) => {
                          return recommendBrand.id === record.id && record.popularweight >= 10000;
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

export default CollectionPage;
