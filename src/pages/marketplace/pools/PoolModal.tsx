import type { IPoolInfo, ITopPool } from '@/services/pool/types';
import { poolStateEnum } from '@/services/pool/types';
import { Input, Modal, Select, Space, Table, Tag, Tooltip, Typography } from 'antd';
import { PoolFilterEnum } from '@/services/pool/types';
import React, { useState } from 'react';
import Image from '@/components/Image';

const { Option } = Select;
const { Search } = Input;

interface poolModalProps {
  topPools: ITopPool[];
  tableProps: any;
  searchAllPools: any;
  setSearchType: any;
  clickedIndex: number;
  visible: boolean;
  onOk: any;
  onCancel: any;
}

const PoolModal: React.FC<poolModalProps> = ({
  topPools,
  tableProps,
  searchAllPools,
  setSearchType,
  clickedIndex,
  visible,
  onOk,
  onCancel,
}) => {
  console.log('topPools: ', topPools);
  const [selectedPool, setSelectedPool] = useState<IPoolInfo>();

  const columns = [
    {
      dataIndex: 'poolid',
      title: 'Pool ID',
      align: 'center',
      width: 70,
    },
    {
      dataIndex: 'fileurl',
      title: 'Cover',
      align: 'center',
      width: 20,
      render: (url: any, record: IPoolInfo) =>
        record.category === 'video' ? (
          <video width={30} height={30} src={url} />
        ) : (
          <Image width={30} height={30} src={url} />
        ),
    },
    {
      dataIndex: 'state',
      title: 'State',
      align: 'center',
      width: 100,
      render: (state: any, record: IPoolInfo) => (
        <Space>
          {state === poolStateEnum.closed ? (
            <Tag color="red">Closed</Tag>
          ) : (
            <Tag color="green">Live</Tag>
          )}

          {topPools.find(
            (topPool) => topPool.poolid === record.poolid && topPool.standard === record.pooltype,
          ) ? (
            <Tag color="gold">Recommend</Tag>
          ) : null}
        </Space>
      ),
    },
    {
      dataIndex: 'itemname',
      title: 'Name',
      align: 'center',
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
      align: 'center',
      width: 100,
    },
    {
      dataIndex: 'creator',
      title: 'Creator Address',
      align: 'center',
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
    getCheckboxProps: (record: IPoolInfo) => ({
      disabled:
        record.state === poolStateEnum.closed ||
        topPools.find(
          (topPool) =>
            topPool.poolid === record.poolid &&
            topPool.standard === record.pooltype &&
            topPool.poolweight > 0,
        ),
    }),
  };

  return (
    <Modal
      title={`Select No.${clickedIndex + 1} pool`}
      width={850}
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
          rowKey={(record: IPoolInfo) => `${record.poolid}_${record.pooltype}`}
          columns={columns}
          {...tableProps}
        />
      </Space>
    </Modal>
  );
};

export default PoolModal;
