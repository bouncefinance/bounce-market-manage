import { PageContainer } from '@ant-design/pro-layout';
import { Card, Table, Button, Tooltip, Switch, Input, Modal, message, Space, Select } from 'antd';
import React, { useState } from 'react';
import { useRequest } from 'umi';
import request from 'umi-request';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CopyOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import Image from '@/components/Image';
import { Apis } from '@/services';

const { Column } = Table;
const { Search } = Input;
const { confirm } = Modal;
const { Option } = Select;

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

const getPoolsListByFilter = (
  filterType: 'likestr' | 'creator' | 'tokenid' = 'likestr',
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

    case 'tokenid':
      filter = 3;
      data = {
        filter,
        tokenid: Number(searchText),
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

  return request.post(Apis.getpoolsbylikename, {
    data,
  });
};

const handleDeleteItem = async (contractaddress: string, tokenid: number, reload: () => void) => {
  const deleteItem = async (_contractaddress: string, _tokenid: number) => {
    const res = await request.post(Apis.delpoolitem, {
      data: {
        contractaddress: _contractaddress,
        tokenid: _tokenid,
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

const handleHideItem = async (
  contractaddress: string,
  tokenid: number,
  actionType: 'hide' | 'show',
  reload: () => void,
) => {
  const status = actionType === 'hide' ? 1 : 0;

  const hideItem = async (_contractaddress: string, _tokenid: number) => {
    const res = await request.post(Apis.updatepoolitem, {
      data: {
        contractaddress: _contractaddress,
        tokenid: _tokenid,
        status, // status: 1:to hide, 2:to show
      },
    });
    if (res.code === 1) {
      if (actionType === 'hide') {
        message.success('Hide successfully');
      } else {
        message.success('Show successfully');
      }
    } else if (actionType === 'hide') {
      message.error('Failed to hide');
    } else {
      message.error('Failed to show');
    }
  };

  confirm({
    // title: 'Delete',
    icon: <ExclamationCircleOutlined />,
    title: `Do you Want to ${actionType} this item?`,
    onOk() {
      hideItem(contractaddress, tokenid).then(() => {
        reload();
      });
    },
    onCancel() {},
  });
};

const NFT: React.FC = () => {
  const [itemSearchType, setItemSearchType] = useState<'likestr' | 'creator' | 'tokenid'>(
    'likestr',
  );

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

  return (
    <PageContainer>
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
                  <Image src={fileurl} style={{ objectFit: 'contain' }} width={64} height={64} />
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
              title="Creator Address"
              dataIndex="creator"
              key="creator"
              align={'center'}
              render={(creator) => {
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
                  checked={record.status === 1}
                  checkedChildren="Hide"
                  unCheckedChildren="Show"
                  onChange={(checked: boolean) => {
                    if (checked) {
                      handleHideItem(record.contractaddress, record.tokenid, 'hide', reloadItem);
                    } else {
                      handleHideItem(record.contractaddress, record.tokenid, 'show', reloadItem);
                    }
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

export default NFT;
