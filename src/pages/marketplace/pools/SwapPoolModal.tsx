import type { IPoolInfo } from '@/services/pool/types';
import { poolSaleEnum } from '@/services/pool/types';
import { Modal, Table, Tooltip, Typography } from 'antd';
import React, { useState } from 'react';
import Image from '@/components/Image';

interface poolModalProps {
  data: IPoolInfo[] | undefined;
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
  const [selectedPool, setSelectedPool] = useState<IPoolInfo>();
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>();

  const columns = [
    {
      dataIndex: 'fileurl',
      title: 'fileurl',
      width: 60,
      render: (url: any) => <Image width={40} height={40} preview src={url} />,
    },
    {
      dataIndex: 'poolid',
      title: 'Pool ID',
    },
    {
      dataIndex: 'pooltype',
      title: 'Type',
      render: (text: any) => poolSaleEnum[text],
    },
    {
      dataIndex: 'creator',
      title: 'Creator Address',
      render: (text: any) => (
        <Typography.Paragraph style={{ margin: 0 }} copyable={{ text }}>
          <Tooltip title={text}>{text.replace(/^(.{6}).*(.{4})$/, '$1...$2')}</Tooltip>
        </Typography.Paragraph>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectedKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: IPoolInfo[]) => {
      setSelectedKeys(selectedRowKeys);
      setSelectedPool(selectedRows[0]);
    },
    columnWidth: 14,
    getCheckboxProps: (record: IPoolInfo) => ({
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
        rowKey={(record) => record.poolid! + record.pooltype!}
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    </Modal>
  );
};

export default PoolModal;
