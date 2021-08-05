import { PageContainer } from '@ant-design/pro-layout';
import {
  Card,
  Table,
  Button,
  Tooltip,
  Switch,
  Input,
  Modal,
  message,
  Space,
  Select,
  Typography,
} from 'antd';
import React, { useState } from 'react';
import { useRequest } from 'umi';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Image from '@/components/Image';
import type { INftItem, NftDisplayState } from '@/services/nft/types';
import { NftDisplayEnum } from '@/services/nft/types';
import { deleteNft, hideNft } from '@/services/nft';
import type { PoolFilterType } from '@/services/pool/types';
import { PoolFilterEnum } from '@/services/pool/types';
import { getPoolsByFilter } from '@/services/pool';

const { Search } = Input;
const { confirm } = Modal;
const { Option } = Select;

const handleDeleteItem = async (contractaddress: string, tokenid: number, reload: () => void) => {
  confirm({
    // title: 'Delete',
    icon: <ExclamationCircleOutlined />,
    title: 'Are you sure you want to delete this item?',
    onOk() {
      deleteNft({ contractaddress, tokenid }).then((res) => {
        if (res.code === 1) {
          message.success('Success');
          reload();
        } else {
          message.error('Failed');
        }
      });
    },
    onCancel() {},
  });
};

const handleHideItem = async (
  contractaddress: string,
  tokenid: number,
  actionType: NftDisplayState,
  reload: () => void,
) => {
  confirm({
    // title: 'Delete',
    icon: <ExclamationCircleOutlined />,
    title: `Are you sure you want to ${actionType} this item?`,
    onOk() {
      hideNft({ contractaddress, tokenid, actionType }).then((res) => {
        if (res.code === 1) {
          if (actionType === NftDisplayEnum.hide) {
            message.success('Hide successfully');
          } else {
            message.success('Show successfully');
          }
          reload();
        } else if (actionType === NftDisplayEnum.hide) {
          message.error('Failed to hide');
        } else {
          message.error('Failed to show');
        }
      });
    },
  });
};

const NFT: React.FC = () => {
  const [itemSearchType, setItemSearchType] = useState<PoolFilterType>(PoolFilterEnum.likestr);

  const {
    tableProps: itemTableProps,
    run: searchItem,
    refresh: reloadItem,
  } = useRequest(
    ({ pageSize: limit, current: offset }, searchText) => {
      return getPoolsByFilter(itemSearchType, searchText, (offset - 1) * limit, limit);
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

  const columns = [
    {
      title: 'Image',
      dataIndex: 'fileurl',
      width: 110,
      align: 'center',
      render: (url: string, record: INftItem) =>
        record?.category === 'image' ? (
          <Image src={url} style={{ objectFit: 'contain' }} width={64} height={64} />
        ) : (
          <video src={url} width={70} height={70} controls={false} />
        ),
    },
    {
      title: 'Name',
      dataIndex: 'itemname',
      width: 110,
      align: 'center',
      render: (text: string) => (
        <Typography.Paragraph style={{ margin: 0 }}>
          {text.length > 14 ? (
            <Tooltip title={text}>{text.replace(/^(.{14}).*$/, '$1...')}</Tooltip>
          ) : (
            text
          )}
        </Typography.Paragraph>
      ),
    },
    {
      title: 'Token ID',
      dataIndex: 'tokenid',
      width: 110,
      align: 'center',
    },
    {
      title: 'Contract Address',
      dataIndex: 'token0',
      align: 'center',
      render: (text: any) =>
        text ? (
          <Typography.Paragraph style={{ margin: 0 }} copyable={{ text }}>
            <Tooltip title={text}>{text.replace(/^(.{6}).*(.{4})$/, '$1...$2')}</Tooltip>
          </Typography.Paragraph>
        ) : (
          '--'
        ),
    },
    {
      title: 'Creator Address',
      dataIndex: 'creator',
      align: 'center',
      render: (text: any) => (
        <Typography.Paragraph style={{ margin: 0 }} copyable={{ text }}>
          <Tooltip title={text}>{text.replace(/^(.{6}).*(.{4})$/, '$1...$2')}</Tooltip>
        </Typography.Paragraph>
      ),
    },
    {
      title: 'Hide Creation',
      align: 'center',
      render: (record: INftItem) => (
        <Switch
          checked={record.status === 1}
          checkedChildren="Hide"
          unCheckedChildren="Show"
          onChange={(checked: boolean) => {
            if (checked) {
              handleHideItem(record.token0, record.tokenid, NftDisplayEnum.hide, reloadItem);
            } else {
              handleHideItem(record.token0, record.tokenid, NftDisplayEnum.hide, reloadItem);
            }
          }}
        />
      ),
    },
    {
      title: 'Disable',
      align: 'center',
      width: 110,
      render: (record: INftItem) => (
        <Button
          danger
          key="list-loadmore-delete"
          onClick={() => {
            handleDeleteItem(record.token0, record.tokenid, reloadItem);
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <PageContainer>
      <Space direction={'vertical'} style={{ width: '100%' }}>
        <Input.Group>
          <Select
            defaultValue={PoolFilterEnum.likestr}
            onChange={(value) => {
              setItemSearchType(value);
            }}
          >
            <Option value={PoolFilterEnum.likestr}>Item Name</Option>
            <Option value={PoolFilterEnum.creator}>Creator Address</Option>
            <Option value={PoolFilterEnum.tokenid}>Token ID</Option>
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
          <Table rowKey="id" columns={columns} {...itemTableProps} />
        </Card>
      </Space>
    </PageContainer>
  );
};

export default NFT;
