import type { IBrandResponse } from '@/services/brand/types';
import { Input, Modal, Select, Space, Table, Tag, Tooltip, Typography } from 'antd';
import { BrandFilterEnum } from '@/services/brand/types';
import React, { useEffect, useState } from 'react';
import Image from '@/components/Image';

const { Option } = Select;
const { Search } = Input;

interface brandModalProps {
  tableProps: any;
  searchAllBrands: any;
  setBrandSearchType: any;
  clickedIndex: number;
  visible: boolean;
  onOk: any;
  onCancel: any;
}

const BrandModal: React.FC<brandModalProps> = ({
  clickedIndex,
  visible,
  onOk,
  onCancel,
  tableProps,
  searchAllBrands,
  setBrandSearchType,
}) => {
  const [selectedBrand, setSelectedBrand] = useState<IBrandResponse>();

  useEffect(() => {
    setSelectedBrand(undefined);
  }, [visible]);

  const columns = [
    {
      dataIndex: 'popularweight',
      title: 'Status',
      width: 50,
      align: 'center',
      render: (weight: number) => (weight > 10000 ? <Tag color="gold">Recommend</Tag> : null),
    },
    {
      dataIndex: 'id',
      title: 'ID',
      width: 20,
      align: 'center',
    },
    {
      dataIndex: 'imgurl',
      title: 'Cover',
      width: 44,
      align: 'center',
      render: (src: any) => <Image height={40} width={40} src={src} />,
    },
    {
      dataIndex: 'brandname',
      title: 'Name',
      width: 60,
      ellipsis: true,
      align: 'center',
      render: (text: any) => (
        <Typography.Paragraph style={{ margin: 0, width: 120 }} copyable={{ text }}>
          <Tooltip title={text}>{text.replace(/^(.{16}).*$/, '$1...')}</Tooltip>
        </Typography.Paragraph>
      ),
    },
    {
      dataIndex: 'ownername',
      title: 'Owner',
      width: 60,
      align: 'center',
      ellipsis: true,
      // render: (text: any) => (
      //   <Typography.Paragraph style={{ margin: 0, width: 120 }} copyable={{ text }}>
      //     <Tooltip title={text}>{text}</Tooltip>
      //   </Typography.Paragraph>
      // ),
    },
    {
      dataIndex: 'contractaddress',
      title: 'Contract Address',
      width: 54,
      align: 'center',
      render: (text: any) => (
        <Typography.Paragraph style={{ margin: 0 /* width: 120 */ }} copyable={{ text }}>
          <Tooltip title={text}>{text.replace(/^(.{6}).*(.{4})$/, '$1...$2')}</Tooltip>
        </Typography.Paragraph>
      ),
    },
    {
      dataIndex: 'owneraddress',
      title: 'Onwer Address',
      width: 54,
      align: 'center',
      render: (text: any) => (
        <Typography.Paragraph style={{ margin: 0 /* width: 120 */ }} copyable={{ text }}>
          <Tooltip title={text}>{text.replace(/^(.{6}).*(.{4})$/, '$1...$2')}</Tooltip>
        </Typography.Paragraph>
      ),
    },
  ];

  const rowSelection = {
    onChange: (_: React.Key[], selectedRows: IBrandResponse[]) => {
      setSelectedBrand(selectedRows[0]);
    },
    columnWidth: 14,
    getCheckboxProps: (record: IBrandResponse) => ({
      disabled: record.popularweight > 10000,
    }),
  };

  return (
    <Modal
      title={`Select No.${clickedIndex + 1} brand`}
      width={1100}
      destroyOnClose
      centered
      visible={visible}
      okButtonProps={{ disabled: !selectedBrand }}
      onOk={() => {
        onOk(selectedBrand);
      }}
      onCancel={onCancel}
    >
      <Space direction={'vertical'} style={{ width: '100%' }}>
        <Input.Group>
          <Select
            style={{ width: '20%' }}
            defaultValue="likestr"
            onChange={(value) => {
              setBrandSearchType(BrandFilterEnum[value]);
            }}
          >
            <Option value="likestr">Brand Name</Option>
            <Option value="creator">Owner Address</Option>
            <Option value="brandid">Brand ID</Option>
          </Select>
          <Search
            placeholder="input search text"
            allowClear
            onSearch={(value) => searchAllBrands({ current: 1, pageSize: 5 }, value || '')}
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

export default BrandModal;
