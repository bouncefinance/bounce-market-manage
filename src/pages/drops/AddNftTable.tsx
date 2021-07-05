import { Table, Image, Typography, Tooltip, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useRequest } from 'umi';
import request from 'umi-request';
import { Apis } from '@/services';
import { INftResponse } from '@/services/drops/types';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

const getPoolsByCreatorAddress = (
  filter: number = 2,
  creator: string = '0x26604A35B97D395a9711D839E89b44EFcc549B21',
  offset: number = 0,
  limit: number = 7,
) => {
  return request.post(Apis.getpoolsbylikename, {
    data: { filter, creator, offset, limit },
  });
};

const AddNftTable: React.FC<{
  selectedNftList: INftResponse[];
  setSelectedNftList: any;
  selectedRowKeys: number[];
  setSelectedRowKeys: any;
}> = ({ selectedNftList, setSelectedNftList, selectedRowKeys, setSelectedRowKeys }) => {
  useEffect(() => {
    console.log('selectedNftList: ', selectedNftList);
  }, [selectedNftList]);

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: INftResponse[]) => {
      setSelectedRowKeys(selectedRowKeys);
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record: INftResponse, selected: boolean) => {
      // console.log('record: ', record);
      // console.log('selected: ', selected);
      if (selected) {
        setSelectedNftList(selectedNftList.concat(record));
      } else {
        setSelectedNftList(
          selectedNftList.filter((nft) => {
            return nft.id !== record.id || nft.standard !== record.standard;
          }),
        );
      }
    },

    selectedRowKeys: selectedRowKeys,
  };

  const {
    tableProps: nftTableProps,
    run: searchNft,
    refresh: reloadNft,
  } = useRequest(
    ({ pageSize: limit, current: offset }, filter, creator) => {
      return getPoolsByCreatorAddress(filter, creator, (offset - 1) * limit, limit);
    },
    {
      paginated: true,
      // cacheKey: 'accounts',
      defaultParams: [{ pageSize: 5, current: 1 }],
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
      dataIndex: 'id',
      title: 'ID',
      width: 60,
    },
    {
      dataIndex: 'fileurl',
      title: 'Cover',
      render: (src: any) => (
        <Image height={60} style={{ objectFit: 'contain' }} preview={false} src={src} />
      ),
    },
    {
      dataIndex: 'itemname',
      title: 'Name',
      width: 100,
    },
    {
      dataIndex: 'creator',
      title: 'Artist Account',
      render: (text: any) => (
        <Typography.Paragraph style={{ margin: 0, width: 120 }} copyable={{ text }}>
          <Tooltip title={text}>{text.replace(/^(.{6}).*(.{4})$/, '$1...$2')}</Tooltip>
        </Typography.Paragraph>
      ),
    },
    {
      dataIndex: 'standard',
      title: 'Auction Type',
      render: (standard: any) => (
        <Typography.Paragraph style={{ margin: 0, width: 100 }}>
          {standard === 0 ? 'Fixed Swap' : 'English Auction'}
        </Typography.Paragraph>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      rowSelection={{
        type: 'checkbox',
        ...rowSelection,
      }}
      columns={columns}
      {...nftTableProps}
      size="small"
      style={{ width: 800 }}
    />
  );
};

export default AddNftTable;
