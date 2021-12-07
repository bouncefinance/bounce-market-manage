import type { IUserPool } from '@/services/pool/types';
import { EPoolItemDisplayState, EPoolSaleState, EPoolSaleTYPE } from '@/services/pool/types';
import { Modal, Table, Tag, Tooltip, Typography } from 'antd';
import React from 'react';
import Image from '@/components/Image';

export interface IAddNftModalProps {
  value?: number[];
  onChange?: (value: IUserPool[]) => void;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  poolMap: Map<number, IUserPool>;
}

const AddNftModal: React.FC<IAddNftModalProps> = ({
  value,
  onChange,
  isVisible,
  setIsVisible,
  poolMap,
}) => {
  const columns = [
    {
      dataIndex: 'id',
      title: 'ID',
      width: 60,
    },
    {
      dataIndex: 'fileurl',
      title: 'Cover',
      width: 80,
      render: (src: any, record: IUserPool) =>
        record.category === 'video' ? (
          <video height={60} width={60} src={src} controls={false} preload="metadata" />
        ) : (
          <Image height={60} width={60} src={src} />
        ),
    },
    {
      dataIndex: 'itemname',
      title: 'Name',
      // width: 100,
    },
    {
      dataIndex: 'state',
      title: 'State',
      render: (_: any, item: IUserPool) => {
        return (
          <>
            {item.state === EPoolSaleState.LIVE ? (
              <Tag color={'blue'}>live</Tag>
            ) : (
              <Tag color={'red'}>closed</Tag>
            )}
            {item.status === EPoolItemDisplayState.ON_DISPLAY ? (
              <Tag color={'blue'}>on display</Tag>
            ) : (
              <Tag color={'red'}>hiden</Tag>
            )}
          </>
        );
      },
    },
    {
      dataIndex: 'creator',
      title: 'Artist Account',
      width: 122,
      render: (text: any) => (
        <Typography.Paragraph style={{ margin: 0, width: 120 }} copyable={{ text }}>
          <Tooltip title={text}>{text.replace(/^(.{6}).*(.{4})$/, '$1...$2')}</Tooltip>
        </Typography.Paragraph>
      ),
    },
    {
      dataIndex: 'pooltype',
      title: 'Auction Type',
      render: (pooltype: EPoolSaleTYPE) => (
        <Typography.Paragraph style={{ margin: 0, width: 100 }}>
          {pooltype === EPoolSaleTYPE.FIXED_SWAP && <span>Fixed Swap</span>}
          {pooltype === EPoolSaleTYPE.ENGLISH_AUCTION && <span>English Auction</span>}
          {pooltype === EPoolSaleTYPE.COUNTDOWN_FIXED_SWAP && <span>Countdown Fixed Swap</span>}
          {pooltype === EPoolSaleTYPE.COUNTDOWN_ENGLISH_AUCTION && (
            <span>Countdown English Auction</span>
          )}
        </Typography.Paragraph>
      ),
    },
  ];

  const rowSelection = {
    onChange: (_: React.Key[], selectedRows: IUserPool[]) => {
      onChange?.(selectedRows);
    },
    getCheckboxProps: (record: IUserPool) => ({
      disabled:
        record.state === EPoolSaleState.CLOSED || record.status === EPoolItemDisplayState.HIDEN,
    }),
    preserveSelectedRowKeys: true,
    hideSelectAll: true,
    selectedRowKeys: value,
  };

  return (
    <Modal
      title="Select NFTs"
      visible={isVisible}
      destroyOnClose
      width={800}
      onOk={() => {
        setIsVisible(false);
      }}
      onCancel={() => {
        setIsVisible(false);
      }}
    >
      <Table
        rowKey="id"
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        columns={columns}
        // {...nftTableProps}
        dataSource={[...poolMap.values()]}
        pagination={{ pageSize: 5, total: [...poolMap.keys()].length }}
        size="small"
        style={{ width: 800 }}
      />
    </Modal>
  );
};

export default AddNftModal;
