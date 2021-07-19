import type { ITopPool } from '@/services/pool/types';
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
      dataIndex: 'id',
      title: 'ID',
      width: 20,
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
      disabled: record.id === clickedPoolId, // Column configuration not to be checked
    }),
  };

  return (
    <Modal
      title={`Select No.${clickedIndex + 1} pool`}
      width={800}
      centered
      visible={visible}
      okButtonProps={{ disabled: !selectedPool }}
      onOk={() => {
        onOk(selectedPool);
        setSelectedKeys([]);
        // refresh();
      }}
      onCancel={onCancel}
    >
      <Table
        loading={loading}
        size={'small'}
        rowSelection={{
          type: 'radio',
          ...rowSelection,
        }}
        rowKey="id"
        columns={columns}
        dataSource={data}
      />
    </Modal>
  );
};

export default PoolModal;
