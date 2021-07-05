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
  Tabs,
  Select,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useRequest } from 'umi';
import request from 'umi-request';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const { Column } = Table;
const { Search } = Input;
const { confirm } = Modal;
const { TabPane } = Tabs;
const { Option } = Select;

import placeholderImg from '@/assets/images/placeholderImg.svg';
import { CopyOutlined, ExclamationCircleOutlined, StarFilled } from '@ant-design/icons';

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

const getPoolsListByFilter = function (
  filterType: 'likestr' | 'creator' | 'tokenid' = 'likestr',
  searchText: string = '',
  offset: number,
  limit: number = 7,
) {
  let filter, data;
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

    case 'tokenid':
      filter = 3;
      data = {
        filter,
        tokenid: searchText === '' ? 0 : parseInt(searchText),
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

  return request.post('/api/bouadmin/main/auth/getpoolsbylikename', {
    data,
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

const getBrandsListByFilter = (
  filterType: 'likestr' | 'creator' | 'brandid' = 'likestr',
  searchText: string = '',
  offset: number,
  limit: number = 7,
) => {
  let filter, data;
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
        brandid: parseInt(searchText),
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

  return request.post('/api/bouadmin/main/auth/getbrandsbylikename', {
    data,
  });
};

const handleDeleteBrand = async (id: number, reload: () => void) => {
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

// const handleHideBrand = async function (
//   tokenid: number,
//   actionType: 'hide' | 'show',
//   reload: () => void,
// ) {
//   const status = actionType === 'hide' ? 1 : 0;

//   const hideBrand = async (id: number, actionType: 'hide' | 'show') => {
//     const res = await request.post('/api/bouadmin/main/auth/updatebrandstatus', {
//       data: {
//         id,
//         status, // status: 1:to hide, 2:to show
//       },
//     });
//     if (res.code === 1) {
//       actionType === 'hide'
//         ? message.success('Hide successfully')
//         : message.success('Show successfully');
//     } else {
//       actionType === 'hide' ? message.error('Failed to hide') : message.error('Failed to show');
//     }
//   };

//   confirm({
//     // title: 'Delete',
//     icon: <ExclamationCircleOutlined />,
//     title: `Do you Want to ${actionType} this Brand?`,
//     onOk() {
//       hideBrand(tokenid, actionType).then(() => {
//         reload();
//       });
//     },
//     onCancel() {},
//   });
// };

const index: React.FC = () => {
  const [itemSearchType, setItemSearchType] = useState<'likestr' | 'creator' | 'tokenid'>(
    'likestr',
  );
  const [brandSearchType, setBrandSearchType] = useState<'likestr' | 'creator' | 'brandid'>(
    'likestr',
  );

  useEffect(() => {
    console.log('itemSearchType: ', itemSearchType);
  }, [itemSearchType]);

  useEffect(() => {
    console.log('brandSearchType: ', brandSearchType);
  }, [brandSearchType]);

  const {
    // data: itemData,
    // loading: itemLoading,
    // pagination: itemPagination,
    // params: itemParams,
    tableProps: itemTableProps,
    run: searchItem,
    refresh: reloadItem,
  } = useRequest(
    ({ pageSize: limit, current: offset }, searchText) => {
      return getPoolsListByFilter(itemSearchType, searchText, (offset - 1) * limit, limit);
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
      <Tabs defaultActiveKey="1">
        <TabPane tab="Item" key="1">
          <Space direction={'vertical'} style={{ width: '100%' }}>
            <Input.Group>
              <Select
                defaultValue="likestr"
                onChange={(value) => {
                  setItemSearchType(value);
                }}
              >
                <Option value="likestr">Item Name</Option>
                <Option value="creator">Creator Address</Option>
                <Option value="tokenid">Token ID</Option>
              </Select>
              <Search
                placeholder="input search text"
                allowClear
                onSearch={(value) => searchItem({ current: 1, pageSize: 7 }, value || '')}
                style={{ width: '75%' }}
                size="middle"
              />
            </Input.Group>
            <Card>
              <Table rowKey="id" {...itemTableProps}>
                <Column
                  title="Image"
                  dataIndex="fileurl"
                  key="fileurl"
                  width={110}
                  align={'center'}
                  render={(fileurl, record: INftItem) => {
                    return record?.category === 'image' ? (
                      <Image
                        src={fileurl}
                        style={{ objectFit: 'contain' }}
                        width={64}
                        height={64}
                        fallback={placeholderImg}
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

                <Column
                  title="Token ID"
                  dataIndex="tokenid"
                  key="tokenid"
                  width={110}
                  align={'center'}
                />

                <Column
                  title="Contract Address"
                  dataIndex="contractaddress"
                  key="contractaddress"
                  align={'center'}
                  render={(contractaddress, record) => {
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
                  title="Creator Address"
                  dataIndex="creator"
                  key="creator"
                  align={'center'}
                  render={(creator, record) => {
                    return (
                      <Space>
                        <Tooltip placement="top" title={<span>{creator}</span>}>
                          {`${creator.slice(0, 6)}...${creator.slice(-4)}`}
                        </Tooltip>
                        <Tooltip placement="top" title={'Copy'}>
                          <CopyToClipboard text={creator}>
                            <CopyOutlined />
                          </CopyToClipboard>
                        </Tooltip>
                      </Space>
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
                          ? handleHideItem(
                              record.contractaddress,
                              record.tokenid,
                              'hide',
                              reloadItem,
                            )
                          : handleHideItem(
                              record.contractaddress,
                              record.tokenid,
                              'show',
                              reloadItem,
                            );
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
        </TabPane>

        <TabPane tab="Brand" key="2">
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
                  render={(imgurl, record: IBrandInfo) => {
                    // console.log('record: ', record);
                    return (
                      <Image
                        src={imgurl}
                        style={{ objectFit: 'contain' }}
                        width={64}
                        height={64}
                        fallback={placeholderImg}
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
                  title="Creator Address"
                  dataIndex="owneraddress"
                  key="owneraddress"
                  align={'center'}
                  render={(owneraddress, record) => {
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
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};

export default index;
