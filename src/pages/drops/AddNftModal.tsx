import React from 'react';
import { Button, Modal, Space, Table, Tooltip, Typography, Image } from 'antd';
import { getPoolsByCreatorAddress } from '@/services/drops';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { EditFilled, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { IGetPoolsResponse } from '@/services/drops/types';
import { Link } from 'umi';

const AddNftModal: React.FC = () => {
  const columns: ProColumns<IGetPoolsResponse>[] = [
    {
      dataIndex: 'id',
      title: 'ID',
      width: 60,
    },
    {
      dataIndex: 'fileurl',
      title: 'Cover',
      render: (src: any) => <Image width={40} preview={false} src={src} />,
    },
    {
      dataIndex: 'itemname',
      title: 'Name',
      width: 100,
    },
    {
      dataIndex: 'creator',
      title: 'Artist Account',
      render: (text: any) => (
        <Typography.Paragraph style={{ margin: 0, width: 120 }} copyable={{ text }}>
          <Tooltip title={text}>{text.replace(/^(.{6}).*(.{4})$/, '$1...$2')}</Tooltip>
        </Typography.Paragraph>
      ),
    },

    {
      dataIndex: 'standard',
      title: 'Auction Type',
      render: (standard: any) => (
        <Typography.Paragraph style={{ margin: 0, width: 100 }}>
            {standard === 0 ? "Fixed Swap" : "English Auction"}
        </Typography.Paragraph>
      ),
    },
  ];

  return (
    <Modal
      title="Basic Modal"
      visible={false}
      onOk={() => {
        console.log('ok');
      }}
      onCancel={() => {
        console.log('cancel');
      }}
    >
      <ProTable
        rowKey="id"
        search={false}
        columns={columns}
        // params={{ state }}
        request={async ({ pageSize: limit, current: offset, ...rest }) => {
          const { data, total } = await getPoolsByCreatorAddress({
            offset,
            limit,
            ...rest,
          });
          return {
            success: true,
            total,
            data,
          };
        }}
        options={{
          search: {
            style: { width: 300 },
            name: 'accountaddress',
            placeholder: 'Input address',
          },
        }}
      ></ProTable>
    </Modal>
  );
};

export default AddNftModal;
