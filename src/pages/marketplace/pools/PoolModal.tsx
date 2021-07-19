import type { IPoolInfo } from '@/services/pool/types';
import { Input, Modal, Select, Space, Table, Tooltip, Typography } from 'antd';
import { PoolFilterEnum } from '@/services/pool/types';
import React, { useState } from 'react';
import Image from '@/components/Image';

const { Option } = Select;
const { Search } = Input;

interface poolModalProps {
  tableProps: any;
  searchAllPools: any;
  setSearchType: any;
  clickedIndex: number;
  visible: boolean;
  // oldPoolId: number;
  // oldPoolStandard: number;
  onOk: any;
  onCancel: any;
}

const PoolModal: React.FC<poolModalProps> = ({
  tableProps,
  searchAllPools,
  setSearchType,
  clickedIndex,
  visible,
  // oldPoolId,
  // oldPoolStandard,
  onOk,
  onCancel,
}) => {
  const [selectedPool, setSelectedPool] = useState<IPoolInfo>();

  const columns = [
    {
      dataIndex: 'poolid',
      title: 'Pool ID',
      width: 70,
    },
    {
      dataIndex: 'fileurl',
      title: 'Cover',
      width: 20,
      render: (url: any) => <Image width={30} height={30} src={url} />,
    },
    {
      dataIndex: 'itemname',
      title: 'Name',
      width: 200,
      render: (text: any) => (
        <Typography.Paragraph style={{ margin: 0 }}>
          {text.length > 20 ? (
            <Tooltip title={text}>{text.replace(/^(.{20}).*$/, '$1...')}</Tooltip>
          ) : (
            text
          )}
        </Typography.Paragraph>
      ),
    },
    {
      dataIndex: 'tokenid',
      title: 'Token ID',
      width: 100,
    },
    {
      dataIndex: 'creator',
      title: 'Creator Address',
      render: (text: any) => (
        <Typography.Paragraph style={{ margin: 0 }} copyable={{ text }}>
          {/* {text} */}
          <Tooltip title={text}>{text.replace(/^(.{6}).*(.{4})$/, '$1...$2')}</Tooltip>
        </Typography.Paragraph>
      ),
    },
  ];

  const rowSelection = {
    onChange: (select: React.Key[], selectedRows: IPoolInfo[]) => {
      setSelectedPool(selectedRows[0]);
    },
    columnWidth: 14,
    // getCheckboxProps: (record: IPoolResponse) => ({
      // disabled: record.popularweight > 10000,
    // }),
  };

  return (
    <Modal
      title={`Select No.${clickedIndex + 1} pool`}
      width={800}
      destroyOnClose
      centered
      visible={visible}
      okButtonProps={{ disabled: !selectedPool }}
      onOk={() => {
        onOk(selectedPool);
      }}
      onCancel={onCancel}
    >
      <Space direction={'vertical'} style={{ width: '100%' }}>
        <Input.Group>
          <Select
            style={{ width: '20%' }}
            defaultValue="likestr"
            onChange={(value) => {
              setSearchType(PoolFilterEnum[value]);
            }}
          >
            <Option value="likestr">Pool Name</Option>
            <Option value="creator">Owner Address</Option>
            <Option value="tokenid">Token ID</Option>
          </Select>
          <Search
            placeholder="input search text"
            allowClear
            onSearch={(value) => searchAllPools({ current: 1, pageSize: 5 }, value || '')}
            style={{ width: '80%' }}
            size="middle"
          />
        </Input.Group>
        <Table
          size={'small'}
          rowSelection={{
            type: 'radio',
            ...rowSelection,
          }}
          rowKey="id"
          columns={columns}
          {...tableProps}
        />
      </Space>
    </Modal>
  );
};

export default PoolModal;
