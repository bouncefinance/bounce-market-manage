import type { IBrandResponse } from '@/services/brand/types';
import { Modal, Table, Tooltip, Typography } from 'antd';
import React, { useState } from 'react';
import Image from '@/components/Image';

interface brandModalProps {
  data: IBrandResponse[] | undefined;
  loading: boolean;
  clickedIndex: number;
  clickedBrandId: number | undefined;
  visible: boolean;
  onOk: any;
  onCancel: any;
}

const BrandModal: React.FC<brandModalProps> = ({
  data,
  loading,
  clickedIndex,
  clickedBrandId,
  visible,
  onOk,
  onCancel,
}) => {
  const [selectedBrand, setSelectedBrand] = useState<IBrandResponse>();
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>();

  const columns = [
    // {
    //   dataIndex: 'popularweight',
    //   title: 'Status',
    //   width: 26,
    //   render: (weight: number) =>
    //     weight > 10000 ? <StarFilled style={{ color: '#f58220', fontSize: 20 }} /> : null,
    // },
    {
      dataIndex: 'id',
      title: 'ID',
      width: 20,
    },
    {
      dataIndex: 'imgurl',
      title: 'Cover',
      width: 44,
      render: (src: any) => <Image height={40} width={40} src={src} />,
    },
    {
      dataIndex: 'brandname',
      title: 'Name',
      width: 60,
      ellipsis: true,
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
      render: (text: any) => (
        <Typography.Paragraph style={{ margin: 0 /* width: 120 */ }} copyable={{ text }}>
          <Tooltip title={text}>{text.replace(/^(.{6}).*(.{4})$/, '$1...$2')}</Tooltip>
        </Typography.Paragraph>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectedKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: IBrandResponse[]) => {
      setSelectedKeys(selectedRowKeys);
      setSelectedBrand(selectedRows[0]);
    },
    columnWidth: 14,
    getCheckboxProps: (record: IBrandResponse) => ({
      disabled: record.id === clickedBrandId, // Column configuration not to be checked
    }),
  };

  return (
    <Modal
      title={`Select No.${clickedIndex + 1} brand`}
      width={800}
      centered
      visible={visible}
      okButtonProps={{ disabled: !selectedBrand }}
      onOk={() => {
        onOk(selectedBrand);
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
        dataSource={data?.filter((brand: IBrandResponse) => {
          return brand.popularweight >= 10000;
        })}
      />
    </Modal>
  );
};

export default BrandModal;
