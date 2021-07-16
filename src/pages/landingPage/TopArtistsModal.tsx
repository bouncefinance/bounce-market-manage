import type { ITopArtist } from '@/services/user/types';
import { Input, Modal, Space, Table, Tooltip, Typography } from 'antd';
import React, { useState } from 'react';
import Image from '@/components/Image';
import { StarFilled } from '@ant-design/icons';

const { Search } = Input;

interface topArtistsModalProps {
  tableProps: any;
  searchAllUsers: any;
  // setBrandSearchType: any;
  clickedIndex: number | undefined;
  visible: boolean;
  onOk: any;
  onCancel: any;
}

const TopArtistsModal: React.FC<topArtistsModalProps> = ({
  clickedIndex,
  visible,
  onOk,
  onCancel,
  tableProps,
  searchAllUsers,
  // setBrandSearchType,
}) => {
  const [selectedArtist, setSelectedArtist] = useState<ITopArtist>();

  const columns = [
    {
      dataIndex: 'top_weight',
      title: 'Status',
      width: 16,
      render: (weight: number) =>
        weight > 0 ? <StarFilled style={{ color: '#f58220', fontSize: 20 }} /> : null,
    },
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
      dataIndex: 'username',
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
      dataIndex: 'accountaddress',
      title: 'Account Address',
      width: 54,
      render: (text: any) => (
        <Typography.Paragraph style={{ margin: 0 /* width: 120 */ }} copyable={{ text }}>
          <Tooltip title={text}>{text.replace(/^(.{6}).*(.{4})$/, '$1...$2')}</Tooltip>
        </Typography.Paragraph>
      ),
    },
  ];

  const rowSelection = {
    onChange: (_: React.Key[], selectedRows: ITopArtist[]) => {
      setSelectedArtist(selectedRows[0]);
    },
    columnWidth: 14,
    getCheckboxProps: (record: ITopArtist) => ({
      disabled: record.top_weight > 0,
    }),
  };

  return (
    <Modal
      title={`Select No.${clickedIndex ? clickedIndex + 1 : '--'} Artist`}
      width={800}
      destroyOnClose
      centered
      visible={visible}
      okButtonProps={{ disabled: !selectedArtist }}
      onOk={() => {
        onOk(selectedArtist);
      }}
      onCancel={onCancel}
    >
      <Space direction={'vertical'} style={{ width: '100%' }}>
        <Search
          placeholder="input address"
          allowClear
          onSearch={(value) => searchAllUsers({ current: 1, pageSize: 5 }, value || '')}
          style={{ width: '80%' }}
          size="middle"
        />
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

export default TopArtistsModal;
