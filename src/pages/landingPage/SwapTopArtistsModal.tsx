import type { ITopArtist } from '@/services/user/types';
import { Modal, Table, Tooltip, Typography } from 'antd';
import React, { useState } from 'react';
import Image from '@/components/Image';

interface topArtistsModalProps {
  data: ITopArtist[] | undefined;
  loading: boolean;
  clickedIndex: number | undefined;
  clickedArtistName: string | undefined;
  visible: boolean;
  onOk: any;
  onCancel: any;
}

const SwapTopArtistsModal: React.FC<topArtistsModalProps> = ({
  data,
  loading,
  clickedIndex,
  clickedArtistName,
  visible,
  onOk,
  onCancel,
}) => {
  const [selectedArtist, setSelectedArtist] = useState<ITopArtist>();
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>();

  const columns = [
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
    selectedRowKeys: selectedKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: ITopArtist[]) => {
      setSelectedKeys(selectedRowKeys);
      setSelectedArtist(selectedRows[0]);
    },
    columnWidth: 14,
    getCheckboxProps: (record: ITopArtist) => ({
      disabled: record.username === clickedArtistName, // Column configuration not to be checked
    }),
  };

  return (
    <Modal
      title={`Select No.${clickedIndex ? clickedIndex + 1 : '--'} artist`}
      width={800}
      centered
      visible={visible}
      okButtonProps={{ disabled: !selectedArtist }}
      onOk={() => {
        onOk(selectedArtist);
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

export default SwapTopArtistsModal;
