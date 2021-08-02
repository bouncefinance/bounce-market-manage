import type { ITopPool } from '@/services/pool/types';
import { poolSaleEnum } from '@/services/pool/types';
import { Modal, Table } from 'antd';
import React, { useState } from 'react';
import Image from '@/components/Image';

interface poolModalProps {
  data: ITopPool[] | undefined;
  loading: boolean;
  clickedIndex: number;
  clickedPoolId: number | undefined;
  visible: boolean;
  onOk: any;
  onCancel: any;
}

const PoolModal: React.FC<poolModalProps> = ({
  data,
  loading,
  clickedIndex,
  clickedPoolId,
  visible,
  onOk,
  onCancel,
}) => {
  const [selectedPool, setSelectedPool] = useState<ITopPool>();
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>();

  const columns = [
    {
      dataIndex: 'imgurl',
      title: 'Cover',
      align: 'center',
      width: 50,
      render: (url: any, record: ITopPool) =>
        record.category === 'video' ? (
          <video width={50} height={50} src={url} />
        ) : (
          <Image width={50} height={50} src={url} preview style={{ objectFit: 'contain' }} />
        ),
    },
    {
      dataIndex: 'pool_id',
      title: 'Pool ID',
      align: 'center',
    },
    {
      dataIndex: 'auctiontype',
      title: 'Type',
      align: 'center',
      render: (text: any) => poolSaleEnum[text],
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectedKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: ITopPool[]) => {
      setSelectedKeys(selectedRowKeys);
      setSelectedPool(selectedRows[0]);
    },
    columnWidth: 14,
    getCheckboxProps: (record: ITopPool) => ({
      disabled: record.pool_id === clickedPoolId, // Column configuration not to be checked
    }),
  };

  return (
    <Modal
      title={`Select No.${clickedIndex + 1} pool`}
      width={500}
      centered
      visible={visible}
      okButtonProps={{ disabled: !selectedPool }}
      onOk={() => {
        onOk(selectedPool);
        setSelectedKeys([]);
      }}
      onCancel={() => {
        onCancel();
        setSelectedPool(undefined);
        setSelectedKeys([]);
      }}
    >
      <Table
        loading={loading}
        size={'small'}
        rowSelection={{
          type: 'radio',
          ...rowSelection,
        }}
        rowKey={(record) => `${record.pool_id}_${record.auctiontype}`}
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    </Modal>
  );
};

export default PoolModal;
